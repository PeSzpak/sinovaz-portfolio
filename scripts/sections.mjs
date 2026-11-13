import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +(process.argv[3] || 1440), height: 900 }, locale: process.argv[4] === 'en' ? 'en-US' : 'pt-BR' });
await p.goto('http://localhost:4173', { waitUntil: 'networkidle' });
for (const id of ['casos', 'trajetoria', 'metodo', 'arsenal', 'contato']) {
  await p.locator('#' + id).screenshot({ path: `${out}/s${process.argv[3] || ''}${process.argv[4] || ''}-${id}.png` });
}
await b.close();
