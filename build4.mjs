import { writeFileSync } from "node:fs";
import { dotWord } from "./logo.mjs";
import { ditherField } from "./field.mjs";
const W = 1500, H = 500, forX = process.argv[2] === "x";
const field = ditherField(W, H, { pitch: 7, color: "#d8d0ee", opacity: 0.55, speed: 26 });
const logo = await dotWord("16labs", { pitch: 9, height: 200, color: "#f1ecff", accent: "#e6b64a" });
const lx = Math.round((W - logo.w) / 2), ly = Math.round((H - logo.h) / 2) - 22;
const xPath = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
const handle = forX
  ? `<g transform="translate(${W - 236} ${H - 52})" fill="#bfb8d6" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="19" letter-spacing="2"><g transform="translate(0 -18) scale(1.05)"><path d="${xPath}"/></g><text x="38" y="2">micheal_node</text></g>`
  : `<g transform="translate(${W / 2} ${H - 62})" fill="#9a93b0" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="19" letter-spacing="2"><g transform="translate(-112 -18) scale(1.05)"><path d="${xPath}"/></g><text x="-74" y="2">micheal_node</text></g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="16labs">
<defs>
  <clipPath id="frame"><rect width="${W}" height="${H}"${forX ? "" : ' rx="22"'}/></clipPath>
  <radialGradient id="bg" cx=".5" cy=".5" r=".8"><stop offset="0" stop-color="#0e0e14"/><stop offset="1" stop-color="#030304"/></radialGradient>
  <radialGradient id="fade" cx=".5" cy=".5" r=".72"><stop offset="0" stop-color="#fff" stop-opacity="${forX ? 0.9 : 0.5}"/><stop offset="1" stop-color="#fff"/></radialGradient>
  <mask id="fadeM"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
  <filter id="glow" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>
  ${field.defs}
</defs>
<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g mask="url(#fadeM)">${field.body}</g>
  ${forX ? "" : `<ellipse cx="${W / 2}" cy="${ly + logo.h / 2}" rx="${logo.w * 0.55}" ry="${logo.h * 0.8}" fill="#6a4fd8" opacity=".16" filter="url(#glow)"><animate attributeName="opacity" values=".10;.22;.10" dur="6s" repeatCount="indefinite"/></ellipse>
  <g transform="translate(${lx} ${ly})">${logo.inner}</g>`}
  ${handle}
</g>
</svg>`;
writeFileSync(forX ? "x-header.svg" : "banner.svg", svg);
console.log(forX ? "x" : "gh", "KB", Math.round(svg.length / 1024));
