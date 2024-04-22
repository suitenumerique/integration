import { resolve } from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"

/*
 * this config file takes care of building the react components
 *
 * see vite.css-config.ts for the css files (vite doesn't handle css files very well in lib mode so we generate them differently)
 * see vite.html-config.ts for the html template files (they are generated from our react components)
 */
export const reactConfig = {
  plugins: [
    react({
      babel: {
        plugins: ["@babel/plugin-syntax-import-attributes"],
      },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "index",
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
}
export default defineConfig({
  ...reactConfig,
  plugins: [...reactConfig.plugins, dts({ rollupTypes: true })],
})
