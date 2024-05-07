import { ReactNode, useEffect } from "react"
import fullStyles from "../styles/homepage-full.css?inline"
import devStyles from "../styles/dev.css?inline"

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
