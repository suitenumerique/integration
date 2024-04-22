import { resolve, basename, join, dirname } from "path"
import { defineConfig } from "vite"
import { renderToStaticMarkup } from "react-dom/server"
import { importSingleTs } from "import-single-ts"
import * as prettier from "prettier"
import { reactConfig } from "./vite.config"
import { ReactNode } from "react"

/*
 * this config file takes care of building the HTML files
 *
 * it is meant to be run just after the react build, as it doesn't empty the dist/ folder
 * it works by checking src/html.tsx and generate static HTML files from each exported component
 *
 * see vite.config.ts for the react files
 */
export default defineConfig({
  ...reactConfig,
  plugins: [...reactConfig.plugins, htmlFromComponents()],
  build: {
    ...reactConfig.build,
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/html.tsx"),
      name: "lasuite-empty-html-bundle",
      fileName: "lasuite-empty-html-bundle",
      formats: ["es"],
    },
  },
})

function htmlFromComponents() {
  const reactHtmlComponentRegex = /\.?html\.tsx$/
  return {
    name: "transform-file",
    async transform(_, id) {
      if (reactHtmlComponentRegex.test(id)) {
        const component = await importSingleTs(id)
        component.templates.forEach(async (template: { name: string; render: ReactNode }) => {
          const html = await prettier.format(renderToStaticMarkup(template.render), {
            parser: "html",
            printWidth: 100,
            tabWidth: 4,
            bracketSameLine: false,
            htmlWhitespaceSensitivity: "ignore",
          })
          this.emitFile({
            type: "asset",
            fileName: `html/${template.name}.html`,
            source: html,
          })
        })

        return {
          code: "",
          map: null,
        }
      }
    },
    // in the end, don't generate the js bundle, it's empty, we only want the html files
    generateBundle(_, bundle) {
      delete bundle["lasuite-empty-html-bundle.js"]
    },
  }
}
