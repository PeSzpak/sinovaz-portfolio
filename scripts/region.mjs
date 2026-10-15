import { chromium } from 'playwright';
// usage: region.mjs out.png width fromSelector toSelector
const [out, w, from, to] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.goto('http://localhost:4173', { waitUntil: 'networkidle' });
const r = await p.evaluate(([f, t]) => {
  const a = document.querySelector(f).getBoundingClientRect(), z = document.querySelector(t).getBoundingClientRect();
  return { y: a.top + scrollY, h: z.bottom - a.top };
}, [from, to]);
await p.screenshot({ path: out, fullPage: true, clip: { x: 0, y: r.y, width: +w, height: r.h } });
await b.close();
