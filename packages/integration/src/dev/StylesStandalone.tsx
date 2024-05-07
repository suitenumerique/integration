import { ReactNode, useEffect } from "react"
import dsfrStyles from "../styles/raw-dsfr.css?inline"
import homepageStyles from "../styles/homepage-gaufre.css?inline"
import gaufreStyles from "../styles/gaufre.css?inline"
import devStyles from "./dev.css?inline"

/**
 * wrap a component in StylesStandalone to apply the "raw-dsfr" and "homepage-gaufre" styles
 *
 * this helps testing the html when we include the homepage+gaufre css in an app already using the DSFR
 */
export const StylesStandalone = ({
  children,
  type = "homepage",
}: {
  children: ReactNode
  type?: "homepage" | "gaufre"
}) => {
  useEffect(() => {
    if (document.querySelector("#styles-standalone")) {
      return
    }
    const style = document.createElement("style")
    style.id = "styles-standalone"
    style.innerHTML =
      type === "homepage"
        ? dsfrStyles + homepageStyles + devStyles
        : dsfrStyles + gaufreStyles + devStyles
    document.head.appendChild(style)
    return () => {
      document.querySelector("#styles-standalone")?.remove()
    }
  }, [])

  return children
}
