;(function () {
  const BUTTON_CLASS = "js-lasuite-gaufre-btn"
  let lastFocusedButton = null

  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      appendPopup()
    })
  }

  document.body.addEventListener("click", (event) => {
    if (!event.target.classList || !event.target.classList.contains(BUTTON_CLASS)) {
      const buttons = document.querySelectorAll(`.${BUTTON_CLASS}`)
      buttons.forEach((b) => b.classList.remove("lasuite--gaufre-opened"))
      hidePopup()
      return
    }

    const button = event.target
    button.classList.toggle("lasuite--gaufre-opened")
    if (button.classList.contains("lasuite--gaufre-opened")) {
      showPopup(button)
    } else {
      hidePopup()
    }
  })

  document.addEventListener("keyup", (event) => {
    if (event.key === "Escape" && document.activeElement.closest(".lagaufre")) {
      hidePopup()
    }
  })

  window.addEventListener("resize", () => {
    const popup = document.querySelector(`#lasuite-gaufre-popup.lasuite--gaufre-opened`)
    if (!popup) {
      return
    }
    const button = document.querySelector(`.${BUTTON_CLASS}.lasuite--gaufre-opened`)
    if (!button) {
      return
    }
    popup.style.cssText = getPopupPositionStyle(button)
  })

  const appendPopup = () => {
    if (document.querySelector(`#lasuite-gaufre-popup`)) {
      return
    }
    const scriptTag = document.querySelector(`#lasuite-gaufre-script`)
    if (!scriptTag) {
      console.log(
        "La Suite numérique: Gaufre script tag not found, make sure the script has id 'lasuite-gaufre-script'.",
      )
      return
    }
    const popup = document.createElement("div")
    popup.id = "lasuite-gaufre-popup"
    popup.width = "304"
    popup.height = "360"
    popup.style.cssText = "display: none !important"
    const { host, protocol, searchParams, origin } = new URL(scriptTag.src)
    const local = searchParams.get("type") === "local"
    const lang = ["en"].includes(searchParams.get("lang")) ? searchParams.get("lang") : null
    fetch(
      `${protocol}//${host}/api/v1/${(!!lang && `${lang}/`) || ""}gaufre${(!!local && "/local") || ""}`,
    )
      .then((res) => res.text())
      .then((html) => {
        html = html.replace(/(src=|href=|url\()"\//g, `$1"${origin}/`)
        const parser = new DOMParser()
        const popupDocument = parser.parseFromString(html, "text/html")
        popup.innerHTML = popupDocument.body.innerHTML
        document.body.appendChild(popup)
      })
  }

  const getPopupPositionStyle = (button) => {
    const buttonCoords = button.getBoundingClientRect()
    const isSmallScreen = window.innerWidth <= 400
    let leftPos = buttonCoords.right - 304 + document.documentElement.scrollLeft
    leftPos = leftPos < 5 ? 5 : leftPos
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
      left: ${leftPos}px;
      width: 304px;`
      }
      border: 0 !important;
      display: block !important;
      z-index: 100000;
    `
  }

  const showPopup = (button) => {
    const popup = document.querySelector(`#lasuite-gaufre-popup`)
    if (!popup) {
      appendPopup()
    }
    popup.style.cssText = getPopupPositionStyle(button)
    popup.classList.add("lasuite--gaufre-opened")
    lastFocusedButton = button
    setTimeout(() => {
      popup.querySelector(".js-lagaufre-keyboard-anchor").focus()
    }, 0)
  }

  const hidePopup = () => {
    const popup = document.querySelector(`#lasuite-gaufre-popup`)
    if (popup) {
      popup.style.cssText = "display: none !important"
      popup.classList.remove("lasuite--gaufre-opened")
    }
    if (lastFocusedButton) {
      lastFocusedButton.classList.remove("lasuite--gaufre-opened")
      lastFocusedButton.focus()
      lastFocusedButton = null
    }
  }
})()
