;(function () {
  const BUTTON_CLASS = "js-lasuite-gaufre-btn"
  let lastFocusedButton = null

  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      appendIframe()
    })
  }

  document.body.addEventListener("click", (event) => {
    if (!event.target.classList || !event.target.classList.contains(BUTTON_CLASS)) {
      const buttons = document.querySelectorAll(`.${BUTTON_CLASS}`)
      buttons.forEach((b) => b.classList.remove("lasuite--opened"))
      hideIframe()
      return
    }

    const button = event.target
    button.classList.toggle("lasuite--opened")
    if (button.classList.contains("lasuite--opened")) {
      showIframe(button)
    } else {
      hideIframe()
    }
  })

  document.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      hideIframe()
    }
  })

  window.addEventListener("message", (event) => {
    if (event.data === "lasuite-close-services-iframe") {
      hideIframe()
    }
  })

  window.addEventListener("resize", () => {
    const iframe = document.querySelector(`#lasuite-gaufre-iframe.lasuite--opened`)
    if (!iframe) {
      return
    }
    const button = document.querySelector(`.${BUTTON_CLASS}.lasuite--opened`)
    if (!button) {
      return
    }
    iframe.style.cssText = getIframePositionStyle(button)
  })

  const appendIframe = () => {
    if (document.querySelector(`#lasuite-gaufre-iframe`)) {
      return
    }
    const scriptTag = document.querySelector(`#lasuite-gaufre-script`)
    if (!scriptTag) {
      console.log(
        "La Suite numérique: Gaufre script tag not found, please check out the documentation",
      )
      return
    }
    const iframe = document.createElement("iframe")
    iframe.title = "Services de La Suite numérique"
    iframe.id = "lasuite-gaufre-iframe"
    iframe.width = "304"
    iframe.height = "360"
    iframe.style.cssText = "display: none !important"
    const { host, protocol, searchParams } = new URL(scriptTag.src)
    const local = searchParams.get("type") === "local"
    const lang = ["en"].includes(searchParams.get("lang")) ? searchParams.get("lang") : null
    iframe.src = `${protocol}//${host}/api/v1/${(!!lang && `${lang}/`) || ""}gaufre${(!!local && "/local") || ""}`
    document.body.appendChild(iframe)
  }

  const getIframePositionStyle = (button) => {
    const buttonCoords = button.getBoundingClientRect()
    const isSmallScreen = window.innerWidth <= 400
    return `
      position: absolute !important;
      top: ${buttonCoords.top + buttonCoords.height + 8}px;
      ${
        isSmallScreen
          ? `
        left: 5px;
        right: 5px;
        margin: 0 auto;
      `
          : `
      left: ${buttonCoords.right - 304 + document.documentElement.scrollLeft}px;`
      }
      border: 0 !important;
      display: block !important;
      z-index: 100000;
    `
  }

  const showIframe = (button) => {
    const iframe = document.querySelector(`#lasuite-gaufre-iframe`)
    if (!iframe) {
      appendIframe()
    }
    iframe.style.cssText = getIframePositionStyle(button)
    iframe.classList.add("lasuite--opened")
    lastFocusedButton = button
    setTimeout(() => {
      iframe.focus()
    }, 0)
  }

  const hideIframe = () => {
    const iframe = document.querySelector(`#lasuite-gaufre-iframe`)
    if (iframe) {
      iframe.style.cssText = "display: none !important"
      iframe.classList.remove("lasuite--opened")
    }
    if (lastFocusedButton) {
      lastFocusedButton.classList.remove("lasuite--opened")
      lastFocusedButton.focus()
      lastFocusedButton = null
    }
  }
})()
