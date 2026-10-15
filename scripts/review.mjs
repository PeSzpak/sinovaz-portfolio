import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch();
for (const [name, vp] of [['desk', { width: 1440, height: 900 }], ['mob', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp, locale: 'pt-BR' });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type()==='error' && errs.push(m.text()));
  await p.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  if (name === 'desk') await p.mouse.move(400, 200);
  await p.waitForTimeout(3000);
  await p.screenshot({ path: `${out}/${name}-hero.png` });
  await p.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, 'overflow', overflow, 'errors', errs);
}
await b.close();
