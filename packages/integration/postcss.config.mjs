import purgecss from "@fullhuman/postcss-purgecss"
import autoprefixer from "autoprefixer"

export default {
  plugins: [
    purgecss({
      content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
      css: ["./src/**/*.css"],
      variables: true,
    }),
    autoprefixer(),
  ],
}
