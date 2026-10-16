// Generates the PWA / favicon icon set from one SVG source.
// Run with: node scripts/generate-icons.mjs
// sharp ships with Next.js (used for image optimization), so no extra install.
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

// lucide "wallet" glyph (24x24 viewBox, stroke icon)
const WALLET = [
  "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
  "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
];

/**
 * @param {object} o
 * @param {number} o.radius   corner radius of the tile (0 = full bleed, for maskable icons)
 * @param {number} o.glyph    glyph size as a fraction of the canvas
 */
function svg({ radius, glyph }) {
  const size = 512;
  const scale = (size * glyph) / 24;
  const offset = (size - 24 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4f9bf5"/>
      <stop offset="1" stop-color="#1c5cab"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    ${WALLET.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
</svg>`;
}

const rounded = svg({ radius: 116, glyph: 0.56 });
// Maskable: full-bleed background, glyph kept inside the 80% safe zone.
const maskable = svg({ radius: 0, glyph: 0.42 });
// Apple applies its own corner mask, so the touch icon is full bleed too.
const apple = svg({ radius: 0, glyph: 0.5 });

mkdirSync("public/icons", { recursive: true });
const png = (src, size, out) => sharp(Buffer.from(src)).resize(size, size).png().toFile(out);

writeFileSync("src/app/icon.svg", rounded);
await Promise.all([
  png(rounded, 192, "public/icons/icon-192.png"),
  png(rounded, 512, "public/icons/icon-512.png"),
  png(maskable, 192, "public/icons/maskable-192.png"),
  png(maskable, 512, "public/icons/maskable-512.png"),
  png(apple, 180, "src/app/apple-icon.png"),
]);
console.log("icons written to public/icons and src/app");
