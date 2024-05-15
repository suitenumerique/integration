import { ReactNode, useEffect } from "react"

export const DarkTheme = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    window.document.documentElement.setAttribute("data-fr-scheme", "dark")
    return () => {
      window.document.documentElement.removeAttribute("data-fr-scheme")
    }
  }, [])

  return children
}
