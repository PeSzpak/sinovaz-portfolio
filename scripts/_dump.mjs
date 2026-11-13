import { chromium } from 'playwright';
const [out] = process.argv.slice(2);
const b = await chromium.launch();
for (const lang of ['pt', 'en']) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: lang === 'pt' ? 'pt-BR' : 'en-US' });
  await c.addInitScript((l) => localStorage.setItem('lang', l), lang);
  const p = await c.newPage();
  await p.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  const txt = await p.locator('#casos').innerText();
  const { writeFileSync } = await import('node:fs');
  writeFileSync(`${out}-${lang}.txt`, txt);
}
await b.close();
