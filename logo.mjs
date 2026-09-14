import sharp from "/home/user/.capy/work/render/node_modules/sharp/lib/index.js";
import { writeFileSync } from "node:fs";
// Rasterise the word, then sample it onto the dither grid: one dot per cell, radius from ink coverage.
export async function dotWord(word, { pitch = 6, height = 96, weight = 800, color = "#e9dcff", accent = "#e6b64a" } = {}) {
  const fs = height, W = Math.round(fs * 0.62 * word.length + 20), H = Math.round(fs * 1.15);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#000"/><text x="6" y="${Math.round(fs * 0.93)}" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="${weight}" font-size="${fs}" letter-spacing="3" fill="#fff">${word}</text></svg>`;
  const { data, info } = await sharp(Buffer.from(svg)).greyscale().raw().toBuffer({ resolveWithObject: true });
  const at = (x, y) => (x < 0 || y < 0 || x >= info.width || y >= info.height) ? 0 : data[y * info.width + x] / 255;
  let dots = [], maxX = 0, maxY = 0, minX = 1e9, minY = 1e9;
  for (let gy = 0; gy * pitch < H; gy++) for (let gx = 0; gx * pitch < W; gx++) {
    const cx = gx * pitch + pitch / 2, cy = gy * pitch + pitch / 2;
    let c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) c += at(Math.round(cx + dx * pitch / 3), Math.round(cy + dy * pitch / 3));
    c /= 9; if (c < 0.2) continue;
    dots.push({ x: cx, y: cy, c });
    minX = Math.min(minX, cx); minY = Math.min(minY, cy); maxX = Math.max(maxX, cx); maxY = Math.max(maxY, cy);
  }
  const w = maxX - minX + pitch, h = maxY - minY + pitch;
  const seed = (x, y) => Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
  const body = dots.map(d => {
    const x = (d.x - minX + pitch / 2).toFixed(1), y = (d.y - minY + pitch / 2).toFixed(1);
    const r = (pitch * 0.5 * (0.45 + 0.55 * d.c)).toFixed(2);
    const s = seed(d.x, d.y);
    // the shimmer: a slow wave left→right plus a per-dot flicker, like the noise passing through the field
    const begin = ((d.x - minX) / w * 2.4 + s * 0.8).toFixed(2), dur = (2.2 + s * 2.6).toFixed(2);
    const gold = s > 0.965 ? ` fill="${accent}"` : "";
    return `<circle cx="${x}" cy="${y}" r="${r}"${gold}><animate attributeName="opacity" values="1;0.35;1;0.7;1" dur="${dur}s" begin="-${begin}s" repeatCount="indefinite"/><animate attributeName="r" values="${r};${(r * 0.55).toFixed(2)};${r}" dur="${(dur * 1.7).toFixed(2)}s" begin="-${begin}s" repeatCount="indefinite"/></circle>`;
  }).join("");
  return { w, h, count: dots.length, inner: `<g fill="${color}">${body}</g>` };
}
if (process.argv[1].endsWith("logo.mjs")) {
  const d = await dotWord("16labs", { pitch: 7, height: 150 });
  const pad = 40;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${d.w + pad * 2}" height="${d.h + pad * 2}" viewBox="0 0 ${d.w + pad * 2} ${d.h + pad * 2}"><rect width="100%" height="100%" rx="24" fill="#1b1438"/><g transform="translate(${pad} ${pad})">${d.inner}</g></svg>`;
  writeFileSync("logo-16labs.svg", svg);
  console.log("dots", d.count, d.w, d.h);
}
