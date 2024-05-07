import { ReactNode, useEffect } from "react"
import dsfrStyles from "../styles/raw-dsfr.css?inline"
import homepageStyles from "../styles/homepage-gaufre.css?inline"
import devStyles from "../styles/dev.css?inline"

export const StylesStandalone = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (document.querySelector("#styles-standalone")) {
      return
    }
    const style = document.createElement("style")
    style.id = "styles-standalone"
    style.innerHTML = dsfrStyles + homepageStyles + devStyles
    document.head.appendChild(style)
    return () => {
      document.querySelector("#styles-standalone")?.remove()
    }
  }, [])

  return children
}
