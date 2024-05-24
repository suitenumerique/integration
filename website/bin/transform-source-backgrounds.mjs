import fs from "fs"
import path from "path"
import { promisify } from "util"
import sharp from "sharp"
import svgGradient from "svg-gradient"
const readdir = promisify(fs.readdir)

const sourcesDir = path.join(import.meta.dirname, "..", "src", "assets", "backgrounds", "sources")
const outputDir = path.join(import.meta.dirname, "..", "src", "assets", "backgrounds")

async function resizeSourceBackgrounds() {
  try {
    console.log(`Resizing source background files…`)

    const gradient = await sharp(
      Buffer.from(
        svgGradient(`linear-gradient(135deg, rgba(0, 0, 145, 0.6) 0%, rgba(225, 0, 15, 0.6) 100%)`),
      ),
    )
      .resize(1920, 1200, { fit: "cover" })
      .toBuffer()

    const backgrounds = await readdir(sourcesDir)
    backgrounds.forEach((backgroundFile, i) => {
      const srcPath = path.join(sourcesDir, backgroundFile)
      const backgroundName = path.parse(backgroundFile).name
      const jpegPath = path.join(outputDir, `${backgroundName}.jpg`)
      const avifPath = path.join(outputDir, `${backgroundName}.avif`)

      const image = sharp(srcPath)
        .resize(1920, 1200, { fit: "cover" })
        .composite([{ input: gradient }])

      image.toFile(jpegPath).then(() => {
        console.log(`Resized ${getFilename(backgroundFile)} to ${getFilename(jpegPath)}`)
      })
      image.toFile(avifPath).then(() => {
        console.log(`Resized ${getFilename(backgroundFile)} to ${getFilename(avifPath)}`)
      })
    })
  } catch (error) {
    console.error("Error:", error)
  }
}

function getFilename(path) {
  return path.split("/").pop()
}

resizeSourceBackgrounds()
