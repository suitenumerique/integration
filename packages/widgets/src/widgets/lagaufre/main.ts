import styles from "./styles.css?inline";
import { createShadowWidget } from "../../shared/shadow-dom";
import { installHook } from "../../shared/script";
import { listenEvent, triggerEvent } from "../../shared/events";
import { trapFocus, trapEscape } from "../../shared/focus";

const widgetName = "lagaufre";

type Service = {
  name: string;
  url: string;
  maturity?: string;
  logo?: string;
};

type Organization = {
  name: string;
  type: string;
  siret: string;
};

type ServicesResponse = {
  organization?: Organization;
  services: Service[];
  error?: unknown;
};

type GaufreWidgetArgs = {
  api?: string;
  position?: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  data?: ServicesResponse;
  fontFamily?: string;
  background?: string;
  headerLogo?: string;
  headerUrl?: string;
  open?: boolean;
  label?: string;
  closeLabel?: string;
  headerLabel?: string;
  loadingText?: string;
  newWindowLabelSuffix?: string;
  showFooter?: boolean;
  dialogElement?: HTMLElement;
};

let loaded = false;

// Initialize widget (load data and prepare shadow DOM)
listenEvent(widgetName, "init", null, false, async (args: GaufreWidgetArgs) => {
  if (!args.api && !args.data) {
    console.error("Missing API URL");
    return;
  }

  if (loaded) {
    triggerEvent(widgetName, "destroy");
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  const listeners: (() => void)[] = [];
  let isVisible = false;

  // https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
  /* prettier-ignore */
  const htmlContent =
    `<div id="wrapper" role="dialog" aria-modal="true" tabindex="-1">` +
        ((args.headerLogo && args.headerUrl) ? (
          `<div id="header">` +
            `<a href="${args.headerUrl}" target="_blank">` +
              `<img src="${args.headerLogo}" id="header-logo">` +
            `</a>` +
            `<button type="button" id="close">&times;</button>` +
          `</div>`
        ) : "") +
        `<div id="content">` +
            `<div id="loading">Loading...</div>` +
            `<ul role="list" id="services-grid" style="display: none;"></ul>` +
            `<div id="error" style="display: none;"></div>` +
        `</div>` +
        (args.showFooter ? `<div id="footer">` +
            `<button id="ok-button">OK</button>` +
        `</div>` : "") +
    `</div>`;

  // Create shadow DOM widget
  const shadowContainer = createShadowWidget(widgetName, htmlContent, styles);
  const shadowRoot = shadowContainer.shadowRoot!;

  const wrapper = shadowRoot.querySelector<HTMLDivElement>("#wrapper")!;
  const loadingDiv = shadowRoot.querySelector<HTMLDivElement>("#loading")!;
  const servicesGrid = shadowRoot.querySelector<HTMLDivElement>("#services-grid")!;
  const errorDiv = shadowRoot.querySelector<HTMLDivElement>("#error")!;
  const closeBtn = shadowRoot.querySelector<HTMLButtonElement>("#close");
  const okBtn = shadowRoot.querySelector<HTMLButtonElement>("#ok-button")!;
  const headerLogo = shadowRoot.querySelector<HTMLImageElement>("#header-logo");

  // Configure dynamic properties
  const configure = (newArgs: GaufreWidgetArgs) => {
    // Positioning parameters
    if (newArgs.position) {
      wrapper.style.position = newArgs.position;
    }

    if (
      newArgs.top != undefined ||
      newArgs.bottom != undefined ||
      newArgs.left != undefined ||
      newArgs.right != undefined
    ) {
      const applyPos = (prop: "top" | "bottom" | "left" | "right") => {
        wrapper.style[prop] = typeof newArgs[prop] === "number" ? `${newArgs[prop]}px` : "unset";
      };
      (["top", "bottom", "left", "right"] as const).forEach(applyPos);
    }

    // Apply font family (inherit from parent or use provided)
    if (newArgs.fontFamily) {
      wrapper.style.fontFamily = newArgs.fontFamily;
    }

    // Apply background gradient if requested
    if (newArgs.background) {
      wrapper.style.background = newArgs.background;
    }

    // Apply texts
    const label = newArgs.label || "Services";
    const closeLabel = newArgs.closeLabel || "Close";
    loadingDiv.textContent = newArgs.loadingText || "Loading...";
    wrapper.setAttribute("aria-label", label);
    if (closeBtn) {
      closeBtn.setAttribute("aria-label", closeLabel);
    }

    if (headerLogo) {
      headerLogo.alt = (newArgs.headerLabel || "About LaSuite") + (newArgs.newWindowLabelSuffix || "");
    }
  };

  configure(args);

  // Initially hide the widget
  wrapper.style.display = "none";

  const showError = (message: string) => {
    loadingDiv.style.display = "none";
    servicesGrid.style.display = "none";
    errorDiv.style.display = "block";
    errorDiv.textContent = message;
  };

  const renderServices = (data: ServicesResponse) => {
    // Clear previous content
    servicesGrid.innerHTML = "";

    data.services.forEach((service) => {
      if (!service.logo) return;
      if (service.maturity == "stable") delete service.maturity;

      const serviceCard = document.createElement("li");
      serviceCard.className = `service-card`;

      /* prettier-ignore */
      serviceCard.innerHTML =
        `<a target="_blank">` +
            `<img alt="" class="service-logo" onerror="this.style.display='none'">` +
            `<div class="service-info">` +
                `<div class="service-name"></div>` +
            `</div>` +
        `</a>`;

      const anchor = serviceCard.querySelector<HTMLAnchorElement>("a")!;
      const img = serviceCard.querySelector<HTMLImageElement>("img")!;
      const serviceName = serviceCard.querySelector<HTMLDivElement>(".service-name")!;

      if (service.maturity) {
        const maturityBadge = document.createElement("div");
        maturityBadge.className = "maturity-badge";
        maturityBadge.textContent = service.maturity;
        anchor.insertBefore(maturityBadge, img.nextSibling);
      }

      anchor.setAttribute(
        "aria-label",
        service.name + (service.maturity ? ` (${service.maturity})` : "") + (args.newWindowLabelSuffix || ""),
      );
      anchor.href = service.url;
      img.src = service.logo;
      serviceName.textContent = service.name;

      servicesGrid.appendChild(serviceCard);
    });

    loadingDiv.style.display = "none";
    errorDiv.style.display = "none";
    servicesGrid.style.display = "grid";
  };

  // Load data
  if (args.data) {
    renderServices(args.data);
  } else {
    // Fetch services from API
    try {
      const response = await fetch(args.api!, {
        method: "GET",
      });

      const data = (await response.json()) as ServicesResponse;

      if (data.error) {
        showError(`Error: ${JSON.stringify(data.error)}`);
      } else if (data.services && data.services.length > 0) {
        renderServices(data);
      } else {
        showError("No services found");
      }
    } catch (error) {
      showError(`Failed to load services: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (args.dialogElement) {
      return;
    }
    if (!shadowContainer.contains(event.target as Node)) {
      triggerEvent(widgetName, "close");
    }
  };

  let untrapFocus: (() => void) | null = null;
  let untrapEscape: (() => void) | null = null;

  // Open widget (show the prepared shadow DOM)
  listeners.push(
    listenEvent(widgetName, "open", null, false, () => {
      wrapper.style.display = "block";

      // Add click outside listener after a short delay to prevent immediate closing or double-clicks.
      setTimeout(() => {
        isVisible = true;
        document.addEventListener("click", handleClickOutside);
        wrapper.focus();
      }, 200);

      untrapFocus = trapFocus(shadowRoot, wrapper, "a,button");

      if (!args.dialogElement) {
        untrapEscape = trapEscape(() => {
          triggerEvent(widgetName, "close");
        });
      }

      triggerEvent(widgetName, "opened");
    }),
  );

  // Close widget (hide the shadow DOM)
  listeners.push(
    listenEvent(widgetName, "close", null, false, () => {
      if (untrapFocus) {
        untrapFocus();
      }
      if (untrapEscape) {
        untrapEscape();
      }

      if (!isVisible) {
        return; // Already closed
      }

      wrapper.style.display = "none";
      isVisible = false;

      // Remove click outside listener
      document.removeEventListener("click", handleClickOutside);

      triggerEvent(widgetName, "closed");
    }),
  );

  // Toggle widget visibility
  listeners.push(
    listenEvent(widgetName, "toggle", null, false, () => {
      if (isVisible) {
        triggerEvent(widgetName, "close");
      } else {
        triggerEvent(widgetName, "open");
      }
    }),
  );

  listeners.push(listenEvent(widgetName, "configure", null, false, configure));

  // Close button click handlers
  if (okBtn) {
    okBtn.addEventListener("click", () => {
      triggerEvent(widgetName, "close");
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      triggerEvent(widgetName, "close");
    });
  }

  // Add to DOM but keep hidden
  if (args.dialogElement) {
    args.dialogElement.appendChild(shadowContainer);
  } else {
    wrapper.className = "wrapper-dialog";
    document.body.appendChild(shadowContainer);
  }

  listenEvent(widgetName, "destroy", null, true, () => {
    triggerEvent(widgetName, "close");
    loaded = false;
    shadowContainer.remove();
    // Unlisten all events
    listeners.forEach((listener) => listener());
  });
  loaded = true;

  triggerEvent(widgetName, "initialized");

  if (args.open) {
    triggerEvent(widgetName, "open");
  }
});

installHook(widgetName);
