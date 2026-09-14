// The website's dither, in SVG: one fixed grid, dot size stepping with a noise field that flows.
// Three dot sizes on the same lattice, each revealed by a smooth band of the same drifting noise.
export function ditherField(W, H, { pitch = 7, color = "#cfc6e8", opacity = 0.7, speed = 28 } = {}) {
  const layer = (id, r) => `<pattern id="${id}" width="${pitch}" height="${pitch}" patternUnits="userSpaceOnUse"><circle cx="${pitch / 2}" cy="${pitch / 2}" r="${r}" fill="${color}"/></pattern>`;
  const noise = (id, mul, off) => `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.0026 0.0040" numOctaves="2" seed="3" result="t"/>
    <feColorMatrix in="t" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${mul} 0 0 0 ${off}"/>
  </filter>`;
  // luminanceToAlpha of fractal noise sits around 0.3–0.7; stretch so bands differ per layer
  const defs = `${layer("dA", pitch * 0.085)}${layer("dB", pitch * 0.21)}${layer("dC", pitch * 0.33)}
  ${noise("nB", 3.2, -1.15)}${noise("nC", 4.5, -2.55)}
  <mask id="mB"><g><rect x="-${W}" y="-${H}" width="${W * 3}" height="${H * 3}" fill="#fff" filter="url(#nB)"/><animateTransform attributeName="transform" type="translate" values="0 0;${W * 0.6} ${H * 0.35};0 0" dur="${speed}s" repeatCount="indefinite"/></g></mask>
  <mask id="mC"><g><rect x="-${W}" y="-${H}" width="${W * 3}" height="${H * 3}" fill="#fff" filter="url(#nC)"/><animateTransform attributeName="transform" type="translate" values="0 0;${W * 0.6} ${H * 0.35};0 0" dur="${speed}s" repeatCount="indefinite"/></g></mask>`;
  const body = `<g opacity="${opacity}">
    <rect width="${W}" height="${H}" fill="url(#dA)"/>
    <rect width="${W}" height="${H}" fill="url(#dB)" mask="url(#mB)"/>
    <rect width="${W}" height="${H}" fill="url(#dC)" mask="url(#mC)"/>
  </g>`;
  return { defs, body };
}
