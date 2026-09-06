/**
 * Generates the site favicon / app icons from the Turn2Law logo mark.
 *
 * Source: public/turn2law-logo.png (full lockup: mark + wordmark)
 * The script isolates the "N + rising arrow" mark on the left, squares it up
 * with even padding, and emits the Next.js app-icon file conventions:
 *
 *   app/favicon.ico     -> 16 + 32 + 48px, multi-image ICO (legacy + browser tabs)
 *   app/icon.png        -> 512px transparent PNG (modern browsers, high DPI)
 *   app/apple-icon.png  -> 180px opaque PNG (iOS home screen, no alpha support)
 *
 * Run: node scripts/generate-favicon.js
 */

const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "public", "turn2law-logo.png");
const APP_DIR = path.join(ROOT, "app");

// The mark sits in the left quarter of the lockup; ignore the wordmark entirely.
const MARK_SEARCH_WIDTH_RATIO = 0.26;
// Fraction of the canvas the mark occupies. Leaves a small safe margin so the
// glyph is not clipped by the circular masks some platforms apply.
const MARK_FILL_RATIO = 0.82;

/** Finds the bounding box of the dark mark within the left region of the lockup. */
async function findMarkBounds(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const searchWidth = Math.floor(width * MARK_SEARCH_WIDTH_RATIO);

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < searchWidth; x++) {
      const i = (y * width + x) * channels;
      const alpha = data[i + 3];
      const luma = (data[i] + data[i + 1] + data[i + 2]) / 3;

      // Opaque and dark == part of the mark.
      if (alpha > 40 && luma < 128) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) {
    throw new Error(`No mark pixels found in ${file}`);
  }

  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/**
 * Renders the mark centred on a transparent square canvas of the given size,
 * with the black strokes recoloured to the brand ink.
 */
async function renderSquare(bounds, size) {
  const target = Math.round(size * MARK_FILL_RATIO);
  const scale = target / Math.max(bounds.width, bounds.height);

  const mark = await sharp(SOURCE)
    .extract(bounds)
    .resize({
      width: Math.max(1, Math.round(bounds.width * scale)),
      height: Math.max(1, Math.round(bounds.height * scale)),
      fit: "fill",
      kernel: "lanczos3",
    })
    .png()
    .toBuffer();

  // The lockup is dark-on-white with no alpha around the strokes, so rebuild the
  // alpha channel from luminance: white -> transparent, black -> opaque ink.
  const { data, info } = await sharp(mark)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = info.width * info.height;
  const out = Buffer.alloc(px * 4);

  for (let p = 0; p < px; p++) {
    const i = p * info.channels;
    const luma = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const alpha = Math.round(((255 - luma) / 255) * (data[i + 3] / 255) * 255);

    out[p * 4] = 0x11; // --ink #111111
    out[p * 4 + 1] = 0x11;
    out[p * 4 + 2] = 0x11;
    out[p * 4 + 3] = alpha;
  }

  const inked = await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: inked, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Packs PNG buffers into a single multi-image .ico container. */
function buildIco(images) {
  const HEADER = 6;
  const ENTRY = 16;

  const header = Buffer.alloc(HEADER);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = HEADER + ENTRY * images.length;
  const entries = [];

  for (const { size, buffer } of images) {
    const entry = Buffer.alloc(ENTRY);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 == 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette colours
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((i) => i.buffer)]);
}

async function main() {
  const bounds = await findMarkBounds(SOURCE);
  console.log("mark bounds:", bounds);

  // app/icon.png - modern browsers pick this for tabs, bookmarks, PWA install.
  const icon512 = await renderSquare(bounds, 512);
  fs.writeFileSync(path.join(APP_DIR, "icon.png"), icon512);

  // app/favicon.ico - multi-resolution for legacy browsers and Windows shortcuts.
  const icoSizes = [16, 32, 48];
  const icoImages = [];
  for (const size of icoSizes) {
    icoImages.push({ size, buffer: await renderSquare(bounds, size) });
  }
  fs.writeFileSync(path.join(APP_DIR, "favicon.ico"), buildIco(icoImages));

  // app/apple-icon.png - iOS ignores alpha, so flatten onto the page background.
  const appleIcon = await sharp(await renderSquare(bounds, 180))
    .flatten({ background: "#FFFFFF" })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(APP_DIR, "apple-icon.png"), appleIcon);

  console.log("wrote app/icon.png, app/favicon.ico, app/apple-icon.png");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
