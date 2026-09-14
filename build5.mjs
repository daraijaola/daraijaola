import { writeFileSync } from "node:fs";
import { dotWord } from "./logo.mjs";
import { ditherField } from "./field.mjs";
const W = 1500, H = 500;
const field = ditherField(W, H, { pitch: 7, color: "#d8d0ee", opacity: 0.95, speed: 24 });
const logo = await dotWord("16labs", { pitch: 8, height: 150, color: "#f1ecff", accent: "#e6b64a" });
const lx = 110, ly = Math.round((H - logo.h) / 2) - 8;
const xPath = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="16labs">
<defs>
  <clipPath id="frame"><rect width="${W}" height="${H}" rx="22"/></clipPath>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#fff" stop-opacity="0"/><stop offset=".78" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff"/></linearGradient>
  <linearGradient id="edgeY" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".2" stop-color="#fff"/><stop offset=".8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient>
  <mask id="edgeM"><rect width="${W}" height="${H}" fill="url(#edge)"/></mask>
  <mask id="edgeMY"><rect width="${W}" height="${H}" fill="url(#edgeY)"/></mask>
  ${field.defs}
</defs>
<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="#050506"/>
  <g mask="url(#edgeM)"><g mask="url(#edgeMY)">${field.body}</g></g>
  <g transform="translate(${lx} ${ly})">${logo.inner}</g>
  <g transform="translate(${lx + 4} ${H - 74})" fill="#8f889f" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="17" letter-spacing="2"><g transform="translate(0 -16) scale(0.95)"><path d="${xPath}"/></g><text x="34" y="1">micheal_node</text></g>
</g>
</svg>`;
writeFileSync("banner.svg", svg);
// X: static, plain uniform grid on black, handle bottom-right
let dots = ""; for (let y = 3.5; y < H; y += 7) for (let x = 3.5; x < W; x += 7) dots += `<circle cx="${x}" cy="${y}" r="1.1"/>`;
const xsvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#050506"/><g fill="#d8d0ee" opacity=".55">${dots}</g>
<g transform="translate(${W - 236} ${H - 52})" fill="#bfb8d6" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="19" letter-spacing="2"><g transform="translate(0 -18) scale(1.05)"><path d="${xPath}"/></g><text x="38" y="2">micheal_node</text></g></svg>`;
writeFileSync("x-header.svg", xsvg);
console.log("ok", Math.round(svg.length / 1024), "KB");
