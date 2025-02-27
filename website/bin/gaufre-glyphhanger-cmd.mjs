import path from "path"
import { execSync } from "child_process"
import pc from "picocolors"
import services from "../src/data/services.json" with { type: "json" }

const glyphhangerIsInstalled = `glyphhanger --version`

try {
  execSync(glyphhangerIsInstalled, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] })
} catch (error) {
  console.log(pc.yellow("Warning: it seems glyphhanger is not installed."))
  console.log("Please see https://github.com/zachleat/glyphhanger for installation instructions.\n")
}

const enabledServices = services.filter((service) => service.enabled)

const originalFontPath = path.join(
  import.meta.dirname,
  "..",
  "public",
  "fonts",
  "Marianne-Regular.woff2",
)
const outputDir = path.join(import.meta.dirname, "..", "public", "fonts")

const whitelist = [...enabledServices.map(({ name }) => name.replace(/ /g, "")), " ✕beta"].join("")

console.log(`Run this command to generate the new subsetted gaufre font:`)
console.log(`
glyphhanger --formats=woff2 \\
  --subset="${originalFontPath}" \\
  --whitelist="${Array.from(whitelist).join("")}" \\
  --output="${outputDir}"`)

console.log(
  pc.yellow(`
Warning: after running the glyphhanger command, don't forget to:
  - update the unicode-range of the subsetted font-family in the GaufrePage.astro component. The new unicode-range is outputed in the console when running glyphhanger.
  - rename the newly generated \`Marianne-Regular-subset.woff2\` file to add a cachebusting number, that is superior to the one in the previous filename already existing in the folder.
  - update the subsetted font-face src url in the GaufrePage.astro component to use the newly named filename.
  - delete the previously existing subsetted font file in the \`public/fonts\` directory.
  - commit and push the changes.`),
)
