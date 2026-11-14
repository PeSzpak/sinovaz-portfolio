// usage: node scripts/evidence-check.mjs   (needs `npm run preview` on :4173)
import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const url = 'http://localhost:4173'
const isVideo = (u) => /\/media\/.+\.(webm|mp4)(\?|$)/.test(u)
const browser = await chromium.launch()

async function open(opts) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR', ...opts })
  await ctx.addInitScript(() => localStorage.setItem('lang', 'pt'))
  const page = await ctx.newPage()
  const seen = new Set()
  page.on('request', (r) => isVideo(r.url()) && seen.add(r.url()))
  await page.goto(url, { waitUntil: 'networkidle' })
  return { ctx, page, seen }
}

{
  const { ctx, page, seen } = await open({})
  await page.waitForTimeout(1500)
  assert.equal(seen.size, 0, `video requested before scroll: ${[...seen]}`)
  await page.evaluate(() => document.querySelector('#casos article').scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(2500)
  assert.equal(seen.size, 1, `expected one video file after scrolling to the card, got ${seen.size}`)
  console.log('ok   no video bytes before scroll, one video file after:', [...seen][0].split('/media/')[1])
  await ctx.close()
}

{
  const { ctx, page, seen } = await open({ reducedMotion: 'reduce' })
  for (let y = 0; y < 12000; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(80)
  }
  await page.evaluate(() => document.querySelector('#casos article').scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(2000)
  assert.equal(seen.size, 0, `reduced motion fetched video: ${[...seen]}`)
  assert.equal(await page.locator('video').evaluateAll((vs) => vs.every((v) => v.paused)), true)
  console.log('ok   reduced motion: zero video requests after a full scroll, video paused')
  await ctx.close()
}

{
  const { ctx, page } = await open({})
  const group = page.getByRole('group', { name: 'Grão Raro' })
  const [still, demo] = [group.getByRole('button', { name: 'Tela' }), group.getByRole('button', { name: 'Demo' })]
  await still.focus()
  await page.keyboard.press('Enter')
  assert.equal(await still.getAttribute('aria-pressed'), 'true')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  assert.equal(await demo.getAttribute('aria-pressed'), 'true')
  assert.equal(await still.getAttribute('aria-pressed'), 'false')
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Space')
  assert.equal(await still.getAttribute('aria-pressed'), 'true')
  console.log('ok   switch works by keyboard (Enter, Tab, Shift+Tab, Space)')
  await ctx.close()
}

await browser.close()
