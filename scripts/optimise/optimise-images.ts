import { OPTIMISE } from "../../config";
import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { watch } from "fs";
import sharp from "sharp";

const { quality, extensions, paths, enabled } = OPTIMISE.images;

if (!enabled) {
  process.exit(0);
}

const ENTRYPOINTS = paths.map((path) => `../..${path}`);

async function convertImage(imagePath: string) {
  try {
    const filename = imagePath.slice(0, imagePath.lastIndexOf("."));
    const webpPath = `${filename}.webp`;
    const avifPath = `${filename}.avif`;

    const webpStats = await stat(webpPath).catch(() => null);
    if (!webpStats) {
      await sharp(imagePath).webp({ quality }).toFile(webpPath);
      console.log(`WebP > ${filename.split("/").pop()}`);
    }

    const avifStats = await stat(avifPath).catch(() => null);
    if (!avifStats) {
      await sharp(imagePath).avif({ quality }).toFile(avifPath);
      console.log(`AVIF > ${filename.split("/").pop()}`);
    }
  } catch (error) {
    console.error(`Error converting ${imagePath}:`, error);
  }
}

async function processDirectory(directory: string) {
  try {
    const files = await readdir(directory, { recursive: true });
    for (const file of files) {
      const filePath = join(directory, file);
      const ext = extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        await convertImage(filePath);
      }
    }
  } catch (error) {
    console.error("Error processing directory:", error);
  }
}

// Process all entry points
for (const entrypoint of ENTRYPOINTS) {
  const publicPath = join(process.cwd(), entrypoint);
  processDirectory(publicPath);

  // Watch for changes in each directory
  console.log(`IMAGE OPTIM WATCHING > ${publicPath.split("/").pop()}`);
  watch(publicPath, { recursive: true }, async (eventType, filename) => {
    if (!filename) return;
    const filePath = join(publicPath, filename);
    const ext = extname(filename).toLowerCase();
    if (extensions.includes(ext)) {
      // console.log(`\nProcessing changed image: ${filename}`);
      await convertImage(filePath);
    }
  });
}
