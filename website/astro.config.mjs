import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import starlight from "@astrojs/starlight"
import { rehypeHeadingIds } from "@astrojs/markdown-remark"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkTextr from "remark-textr"
import compressor from "astro-compressor"

// https://astro.build/config
export default defineConfig({
  compressHTML: false,
  devToolbar: {
    enabled: false,
  },
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://shiki.style/themes
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          // Wrap the heading text in a link.
          behavior: "wrap",
        },
      ],
    ],
    remarkPlugins: [
      [
        remarkTextr,
        {
          plugins: [frenchPunctuation],
          options: {
            locale: "fr",
          },
        },
      ],
    ],
  },
  integrations: [
    react(),
    starlight({
      title: "La Suite : intégrations",
      social: {
        github: "https://github.com/withastro/starlight",
      },
      defaultLocale: "root",
      locales: {
        root: {
          label: "Français",
          lang: "fr",
        },
      },
      sidebar: [
        {
          label: "Guide",
          autogenerate: {
            directory: "guides",
          },
        },
        {
          label: "Référence",
          autogenerate: {
            directory: "reference",
          },
        },
      ],
      customCss: ["./src/styles/global.css"],
      expressiveCode: {
        themes: ["github-dark", "github-light"],
      },
    }),
    compressor(),
  ],
})

// replace all occurences of " :", " !", " ?", " ; " with a non-breaking space
function frenchPunctuation(input) {
  return input.replace(/ (\?|\!|:|;)(\s|$)/gim, "\u202F$1$2")
}
