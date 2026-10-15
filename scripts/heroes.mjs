import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch();
for (const [w, h] of [[983, 560], [1280, 650], [1440, 900], [1920, 1080], [768, 1024], [390, 844], [360, 640]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, locale: 'pt-BR' });
  await p.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const info = await p.evaluate(() => {
    const c = document.querySelector('[data-hero-content]').getBoundingClientRect();
    const hero = document.querySelector('#top > div').getBoundingClientRect();
    return { contentBottom: Math.round(c.bottom), heroH: Math.round(hero.height) };
  });
  await p.locator('#top').screenshot({ path: `${out}/hero-${w}x${h}.png` });
  console.log(w, h, JSON.stringify(info));
}
await b.close();
