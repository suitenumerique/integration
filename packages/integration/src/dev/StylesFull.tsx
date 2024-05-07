import { ReactNode, useEffect } from "react"
import fullStyles from "../styles/homepage-full.css?inline"
import devStyles from "./dev.css?inline"

/**
 * wrap a component in StylesFull to apply the "homepage-full" styles
 *
 * this helps testing the html when we include the homepage+gaufre+dsfr css
 */
export const StylesFull = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (document.querySelector("#styles-full")) {
      return
    }
    const style = document.createElement("style")
    style.id = "styles-full"
    style.innerHTML = fullStyles + devStyles
    document.head.appendChild(style)
    return () => {
      document.querySelector("#styles-full")?.remove()
    }
  }, [])

  return children
}
