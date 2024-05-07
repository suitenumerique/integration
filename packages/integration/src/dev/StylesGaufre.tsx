import { ReactNode, useEffect } from "react"
import gaufreStyles from "../styles/gaufre.css?inline"
import devStyles from "./dev.css?inline"

/**
 * wrap a component in StylesGaufre to apply the "gaufre" styles
 *
 * this helps testing the html when we include the gaufre css
 */
export const StylesGaufre = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (document.querySelector("#styles-gaufre")) {
      return
    }
    const style = document.createElement("style")
    style.id = "styles-gaufre"
    style.innerHTML = gaufreStyles + devStyles
    document.head.appendChild(style)
    return () => {
      document.querySelector("#styles-gaufre")?.remove()
    }
  }, [])

  return children
}
