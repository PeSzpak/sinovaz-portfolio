import { chromium } from 'playwright';
const targets = [
  ['strackz', 'https://strackz.sinovaz.com'],
  ['rickmorty', 'https://rick-and-morty-api-alpha-ten.vercel.app'],
];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
for (const [n, u] of targets) {
  await p.goto(u, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `public/shots/${n}.jpg`, type: 'jpeg', quality: 80 });
  console.log('ok', n);
}
await b.close();
