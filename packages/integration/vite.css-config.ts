import { resolve } from "path"
import { defineConfig } from "vite"

/*
 * this config file takes care of building the css files
 *
 * it is meant to be run just after the react build, as it doesn't empty the dist/ folder
 * it uses the postcss config in postcss.config.mjs
 *
 * see vite.config.ts for the react files
 */
export default defineConfig({
  base: "",
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        "css-required-dsfr": resolve(__dirname, "src/styles/required-dsfr.css"),
        "css-homepage": resolve(__dirname, "src/styles/homepage.css"),
        "css-gaufre": resolve(__dirname, "src/styles/gaufre.css"),
        "css-homepage-full": resolve(__dirname, "src/styles/homepage-full.css"),
        "css-homepage-gaufre": resolve(__dirname, "src/styles/homepage-gaufre.css"),
      },
      output: {
        assetFileNames: (arg) => {
          if (arg.name?.startsWith("css-") && arg.name.endsWith(".css")) {
            return `css/${arg.name.substring(4)}`
          }
          return `css/assets/[name][extname]`
        },
      },
    },
  },
})
