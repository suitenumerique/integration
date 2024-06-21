;(function () {
  const BUTTON_CLASS = "js-lasuite-gaufre-btn"
  const DIMENSIONS = { width: 304, height: 352, margin: 8 }

  let lastFocusedButton = null

  window.document.documentElement.classList.add("lasuite--gaufre-loaded")

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
    updatePopupStyle(popup, button)
  })

  const appendPopup = () => {
    if (document.querySelector(`#lasuite-gaufre-popup`)) {
      return Promise.resolve(document.querySelector(`#lasuite-gaufre-popup`))
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
    popup.style.cssText = "display: none !important"

    const { host, protocol, searchParams, origin } = new URL(scriptTag.src)
    const local = searchParams.get("type") === "local"
    const lang = ["en"].includes(searchParams.get("lang")) ? searchParams.get("lang") : null
    return fetch(
      `${protocol}//${host}/api/v1/${(!!lang && `${lang}/`) || ""}gaufre${(!!local && "/local") || ""}`,
    )
      .then((res) => res.text())
      .then((html) => {
        html = html.replace(/(src=|href=|url\()"\//g, `$1"${origin}/`)
        const parser = new DOMParser()
        const popupDocument = parser.parseFromString(html, "text/html")
        popup.innerHTML = popupDocument.body.innerHTML
        document.body.appendChild(popup)
        return popup
      })
  }

  const getPopupCoords = (button) => {
    const buttonCoords = button.getBoundingClientRect()

    const documentWidth = document.body.clientWidth
    const spaceLeft = buttonCoords.left + window.scrollX
    const spaceRight = documentWidth - buttonCoords.right + window.scrollX
    const hasHorizontalSpace = spaceLeft > DIMENSIONS.width || spaceRight > DIMENSIONS.width
    let modalMode = false

    // by default, the popup is displayed anchored to the right of the button (taking space on the left)
    let leftPos = buttonCoords.right - DIMENSIONS.width + document.documentElement.scrollLeft
    let isAnchoredToRight = true
    // if there is not enough space on the left, or if there is more space on the right,
    // we anchor it to the left of the button, taking space on the right
    if (spaceLeft < DIMENSIONS.width || spaceRight > spaceLeft) {
      leftPos = buttonCoords.left + document.documentElement.scrollLeft
      isAnchoredToRight = false
    }
    // if there is no space at all, we use a "modal" mode, taking all the screen space
    if (!hasHorizontalSpace) {
      modalMode = true
    }

    const spaceTop = buttonCoords.top
    const spaceBottom = window.innerHeight - buttonCoords.bottom
    const hasVerticalSpace = spaceTop > DIMENSIONS.height || spaceBottom > DIMENSIONS.height
    // by default, the popup is displayed anchored to the bottom of the button (taking space on the bottom)
    let topPos = buttonCoords.bottom + 8 + document.documentElement.scrollTop
    // if there is not enough space on the bottom, or if there is more space on the top,
    // we anchor it to the top of the button, taking space on the top
    if (spaceBottom < DIMENSIONS.height || spaceTop > spaceBottom) {
      topPos =
        buttonCoords.top -
        DIMENSIONS.height -
        DIMENSIONS.margin +
        document.documentElement.scrollTop
    }

    // if there is no space below or above the button, but there is space on the sides,
    // we show the popup next to the button
    if (!hasVerticalSpace && window.innerHeight > DIMENSIONS.height) {
      topPos = (window.innerHeight - DIMENSIONS.height) / 2
      leftPos = isAnchoredToRight
        ? leftPos - buttonCoords.width - DIMENSIONS.margin
        : leftPos + buttonCoords.width + DIMENSIONS.margin
    }

    // if there is no space at all, we use a "modal" mode, taking all the screen space
    if (!hasVerticalSpace && window.innerHeight <= DIMENSIONS.height) {
      modalMode = true
    }

    return {
      modalMode,
      top: !modalMode ? topPos : null,
      left: !modalMode ? leftPos : null,
    }
  }

  const defaultPopupStyle = `
    border: 0 !important;
    display: block !important;
    z-index: 100000;
    box-sizing: border-box !important;
  `

  const getPopupPositionStyle = (coords) => {
    if (coords.modalMode) {
      return `
        ${defaultPopupStyle}
        position: fixed !important;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        width: 100svw;
        height: 100%;
        height: 100svh;
        margin: auto;
      `
    }
    return `
        ${defaultPopupStyle}
        position: absolute !important;
        top: ${coords.top}px !important;
        left: ${coords.left}px !important;
        max-width: calc(100vw - 30px);
        width: ${DIMENSIONS.width}px;
        height: ${DIMENSIONS.height}px;
        margin: 0;
      `
  }

  const updatePopupStyle = (popup, button) => {
    const popupCoords = getPopupCoords(button)
    popup.style.cssText = getPopupPositionStyle(popupCoords)
    popup.classList[popupCoords.modalMode ? "add" : "remove"]("lasuite--gaufre-modal")
    window.document.documentElement.classList[popupCoords.modalMode ? "add" : "remove"](
      "lasuite--gaufre-modal-opened",
    )
  }

  const showPopup = (button) => {
    let popup = document.querySelector(`#lasuite-gaufre-popup`)
    const show = (el) => {
      updatePopupStyle(el, button)
      el.classList.add("lasuite--gaufre-opened")
      lastFocusedButton = button
      setTimeout(() => {
        el.querySelector(".js-lagaufre-keyboard-anchor").focus()
      }, 0)
    }
    if (popup) {
      show(popup)
    } else {
      appendPopup().then(show)
    }
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
    window.document.documentElement.classList.remove("lasuite--gaufre-modal-opened")
  }
})()
