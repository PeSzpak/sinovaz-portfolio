import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 650 } });
await p.goto('http://localhost:4173', { waitUntil: 'networkidle' });
await p.mouse.wheel(0, 300); await p.waitForTimeout(1200);
await p.screenshot({ path: process.argv[2] });
await b.close();
