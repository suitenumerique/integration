import { useEffect } from "react"
import * as Prism from "prismjs"
import "prismjs/components/prism-jsx"
import "@/styles/prism.css"

export default function Code({ children, language, fixedHeight = false }) {
  useEffect(() => {
    Prism.highlightAll()
  }, [children, language])
  return (
    <div className={fixedHeight ? "language-fixedheight react-code" : "react-code"}>
      <pre>
        <code className={`language-${language}`}>{children}</code>
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(children)
        }}
      >
        Copier
      </button>
    </div>
  )
}
