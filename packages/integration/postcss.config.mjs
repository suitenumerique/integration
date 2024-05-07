import purgecss from "@fullhuman/postcss-purgecss"
import prefixSelector from "postcss-prefix-selector"
import autoprefixer from "autoprefixer"

export default {
  plugins: [
    purgecss({
      content:
        process.env.NODE_ENV === "production"
          ? ["./src/html.tsx", "./src/components/**/*.tsx"]
          : ["./src/**/*.{js,jsx,ts,tsx,html}"],
      css: ["./src/**/*.css"],
      variables: true,
    }),
    autoprefixer(),
    prefixSelector({
      prefix: ":where(.lasuite)",
      transform: function (prefix, selector, prefixedSelector, filePath, rule) {
        if (filePath.includes("dev.css") || filePath.includes("raw-dsfr.css")) {
          return selector
        }
        if (selector.includes(".lasuite") || selector === "html" || selector === ":root") {
          return selector
        }
        if (selector === "body") {
          return `.lasuite`
        }
        return prefixedSelector
      },
    }),
  ],
}
