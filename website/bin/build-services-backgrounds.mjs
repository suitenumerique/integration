import fs from "fs"
import path from "path"
import { promisify } from "util"
const readdir = promisify(fs.readdir)
const copyFile = promisify(fs.copyFile)

import services from "../src/data/services.json" with { type: "json" }

const args = process.argv.slice(2)
const weekOffset = args[0] && !isNaN(args[0]) ? args[0] * 1 : Math.floor(new Date().getDate() / 7)

const backgroundsDir = path.join(import.meta.dirname, "..", "src", "assets", "backgrounds")
const outputDir = path.join(import.meta.dirname, "..", "public", "api", "backgrounds", "v1")

let backgrounds = await readdir(backgroundsDir)
backgrounds = backgrounds.filter((bg) => bg.endsWith(".jpg")).map((bg) => bg.replace(".jpg", ""))

async function buildStaticBackgrounds() {
  try {
    console.log(`Building backgrounds with offset ${weekOffset}…`)
    services.forEach(async (service, i) => {
      ;[".avif", ".jpg"].forEach(async (ext) => {
        let src = backgrounds[weekOffset + i]
        // if we want, we can check the service id and force a specific src here
        if (service.id === "france-transfert") {
          src = "shutterstock_1867822423"
        }
        const srcPath = path.join(backgroundsDir, `${src}${ext}`)
        const destPath = path.join(outputDir, `${service.id}${ext}`)
        await copyFile(srcPath, destPath)
        console.log(`Copied ${getFilename(srcPath)} to ${getFilename(destPath)}`)
        if (i === 0) {
          await copyFile(srcPath, path.join(outputDir, `default${ext}`))
          console.log(`Copied ${getFilename(srcPath)} to default${ext}`)
        }
      })
    })
    console.log("Backgrounds have been successfully built.")
  } catch (error) {
    console.error("Error building static backgrounds:", error)
  }
}

function getFilename(path) {
  return path.split("/").pop()
}

buildStaticBackgrounds()
