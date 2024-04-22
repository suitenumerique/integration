import { createContext, useContext, Fragment, type ReactNode } from "react"
import { get } from "../utils/get"
import frTranslations from "./fr.json" with { type: "json" }

type Translations = Record<string, any>
const TranslationsContext = createContext<Translations>(frTranslations)

function LaSuiteTranslationsProvider({
  translations,
  children,
}: {
  translations: Translations
  children: ReactNode
}) {
  return (
    <TranslationsContext.Provider value={translations}>{children}</TranslationsContext.Provider>
  )
}

function useTranslate() {
  const context = useContext(TranslationsContext)
  const translations = context || frTranslations
  return {
    t: function t<T = string>(id: string, params: Record<string, string | ReactNode> = {}): T {
      const translation = get(translations, id) as string
      if (!translation) {
        console.warn(`Translation for key "${id}" not found`)
        return id as T
      }
      if (params) {
        const componentKeys: string[] = []
        Object.keys(params).forEach((key) => {
          if (typeof params[key] !== "string") {
            componentKeys.push(key)
          }
        })
        if (!componentKeys.length) {
          // no component keys, just replace {key} with value
          return translation.replace(/{(\w+)}/g, (_, key) => params[key] as string) as T
        }
        // we have component keys: render react components
        const parts = translation.split(/{(.*?)}/)
        return (
          <>
            {parts.map((part, i) => {
              if (part in params) {
                return <Fragment key={i}>{params[part]}</Fragment>
              }
              return part
            })}
          </>
        ) as T
      }
      return translation as T
    },
  }
}

export { LaSuiteTranslationsProvider, useTranslate }
