import styles from "./styles.css?inline";
import chevronDownwardSvg from "./chevron_downward.svg?raw";
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
  position?: string | (() => Record<string, number | string>);
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
  viewMoreLabel?: string;
  viewLessLabel?: string;
  loadingText?: string;
  newWindowLabelSuffix?: string;
  dialogElement?: HTMLElement;
  buttonElement?: HTMLElement;
  showMoreLimit?: number;
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

  const viewMoreLabel = args.viewMoreLabel || "More apps";
  const viewLessLabel = args.viewLessLabel || "Fewer apps";
  const showMoreLimit = args.showMoreLimit || 6;
  // https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
  /* prettier-ignore */
  const htmlContent =
    `<div id="wrapper" role="dialog" aria-modal="true" tabindex="-1">` +
        `<div id="header">` +
          (args.headerLogo ? (
            args.headerUrl ? (
              `<a href="${args.headerUrl}" target="_blank">` +
                `<img src="${args.headerLogo}" id="header-logo">` +
              `</a>`
            ) : (
              `<img src="${args.headerLogo}" id="header-logo">`
            )
          ) : "") +
          `<button type="button" id="close">&times;</button>` +
        `</div>` +
        `<div id="content">` +
            `<div id="loading">Loading...</div>` +
            `<div id="main-apps">` +
                `<ul role="list" id="services-grid" style="display: none;"></ul>` +
            `</div>` +
            `<div id="more-apps" style="display: none;">` +
                `<div id="show-more-container">` +
                    `<button type="button" id="show-more-button">` +
                        `<span id="show-more-chevron" aria-hidden="true">${chevronDownwardSvg}</span>` +
                        `<span id="show-more-text">${viewMoreLabel}</span>` +
                    `</button>` +
                `</div>` +
                `<ul role="list" id="more-services-grid"></ul>` +
            `</div>` +
            `<div id="error" style="display: none;"></div>` +
        `</div>` +
        `<div id="footer">` +
            `<button id="ok-button">OK</button>` +
        `</div>` +
    `</div>`;

  // Create shadow DOM widget
  const shadowContainer = createShadowWidget(widgetName, htmlContent, styles);
  const shadowRoot = shadowContainer.shadowRoot!;

  const wrapper = shadowRoot.querySelector<HTMLDivElement>("#wrapper")!;
  const loadingDiv = shadowRoot.querySelector<HTMLDivElement>("#loading")!;
  const servicesGrid = shadowRoot.querySelector<HTMLDivElement>("#services-grid")!;
  const moreAppsSection = shadowRoot.querySelector<HTMLDivElement>("#more-apps")!;
  const moreServicesGrid = shadowRoot.querySelector<HTMLDivElement>("#more-services-grid")!;
  const showMoreBtn = shadowRoot.querySelector<HTMLButtonElement>("#show-more-button")!;
  const showMoreChevron = shadowRoot.querySelector<HTMLSpanElement>("#show-more-chevron")!;
  const showMoreText = shadowRoot.querySelector<HTMLSpanElement>("#show-more-text")!;
  const errorDiv = shadowRoot.querySelector<HTMLDivElement>("#error")!;
  const closeBtn = shadowRoot.querySelector<HTMLButtonElement>("#close");
  const okBtn = shadowRoot.querySelector<HTMLButtonElement>("#ok-button")!;
  const headerLogo = shadowRoot.querySelector<HTMLImageElement>("#header-logo");

  // Configure dynamic properties
  const configure = (newArgs: GaufreWidgetArgs) => {
    const directions = ["top", "bottom", "left", "right"] as const;

    const applyPos = (obj: Record<string, number | string>) => {
      directions.forEach((prop) => {
        wrapper.style[prop] = typeof obj[prop] === "number" ? `${obj[prop]}px` : "unset";
      });
    };

    if (!directions.every((d) => newArgs[d] === undefined)) {
      applyPos(newArgs as Record<string, number | string>);
    }

    // Positioning parameters
    if (newArgs.position) {
      if (typeof newArgs.position === "function") {
        const pos = newArgs.position();
        wrapper.style.position = pos.position as string;
        applyPos(pos);
      } else {
        wrapper.style.position = newArgs.position;
      }
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
    loadingDiv.textContent = newArgs.loadingText || "Loading…";
    wrapper.setAttribute("aria-label", label);
    if (closeBtn) {
      closeBtn.setAttribute("aria-label", closeLabel);
    }

    if (headerLogo) {
      headerLogo.alt = (newArgs.headerLabel || "About LaSuite") + (newArgs.newWindowLabelSuffix || "");
    }
  };

  configure(args);

  listeners.push(
    listenEvent("", "resize", window, false, () => {
      configure(args);
      // Re-render services on resize to handle mobile/desktop switch
      if (args.data) {
        renderServices(args.data);
      }
    }),
  );

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
    moreServicesGrid.innerHTML = "";
    const maxInitialServices = showMoreLimit;
    const hasMoreServices = data.services.length > maxInitialServices;
    

    const createServiceCard = (service: Service) => {
      if (!service.logo) return null;
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

      return serviceCard;
    };

    // Render initial services (first 6)
    const initialServices = data.services.slice(0, maxInitialServices);
    initialServices.forEach((service) => {
      const serviceCard = createServiceCard(service);
      if (serviceCard) {
        servicesGrid.appendChild(serviceCard);
      }
    });

    // Handle additional services if any
    if (hasMoreServices) {
      const additionalServices = data.services.slice(maxInitialServices);
      
      // Render additional services in the more services grid
      additionalServices.forEach((service) => {
        const serviceCard = createServiceCard(service);
        if (serviceCard) {
          moreServicesGrid.appendChild(serviceCard);
        }
      });

      // Show the more apps section
      moreAppsSection.style.display = "flex";
      moreServicesGrid.classList.add("hidden");
      showMoreChevron.classList.remove("opened");

      // Update button text and handle click
      const updateButton = () => {
        moreServicesGrid.classList.toggle("hidden");
        showMoreChevron.classList.toggle("opened");
        const isOpened = showMoreChevron.classList.contains("opened");
        showMoreText.textContent = !isOpened ? viewLessLabel : viewMoreLabel;
      };

      showMoreBtn.addEventListener("click", () => {
        updateButton();
      });
    } else {
      // Hide the more apps section if no additional services
      moreAppsSection.style.display = "none";
    }

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
      wrapper.style.display = "flex";

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

      if (args.buttonElement) {
        args.buttonElement.setAttribute("aria-expanded", "true");
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

      // Return the focus to the button that opened the widget if any
      if (args.buttonElement) {
        args.buttonElement.focus();
        args.buttonElement.setAttribute("aria-expanded", "false");
      }

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

  if (args.buttonElement) {
    listeners.push(
      listenEvent("", "click", args.buttonElement, false, () => {
        triggerEvent(widgetName, "toggle");
      }),
    );
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
