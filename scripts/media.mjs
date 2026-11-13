// usage: node scripts/media.mjs <id> [--stills] [--video]   (neither flag = both)
// Needs a running target per the recipe (see scripts/capture/<id>.mjs) and ffmpeg on PATH.
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, existsSync, statSync, rmSync } from 'node:fs'
import { budget } from './media-budget.mjs'

if (existsSync('.env.capture')) {
  for (const l of readFileSync('.env.capture', 'utf8').split('\n')) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const [id, ...flags] = process.argv.slice(2)
if (!id) throw new Error('usage: node scripts/media.mjs <id> [--stills] [--video]')
const both = !flags.includes('--stills') && !flags.includes('--video')
const recipe = (await import(`./capture/${id}.mjs`)).default
const wide = recipe.frame === 'wide'
const viewport = wide ? { width: 1440, height: 900 } : { width: 390, height: 844 }
const scale = wide ? 1 : 2
const outDir = `public/media/${id}`
const tmp = `.media-tmp/${id}`
mkdirSync(outDir, { recursive: true })
mkdirSync(tmp, { recursive: true })

const ff = (...a) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...a])
// ffmpeg here has no libwebp, so ffmpeg scales to PNG and cwebp encodes it.
function webp(input, out, width, quality, seek = []) {
  const png = `${tmp}/frame.png`
  ff(...seek, '-i', input, '-frames:v', '1', '-vf', `scale=${width}:-2:flags=lanczos`, png)
  execFileSync('cwebp', ['-quiet', '-m', '6', '-q', String(quality), png, '-o', out])
}
const kb = (f) => (statSync(f).size / 1024).toFixed(1) + ' KB'

// Re-encode with a higher CRF/quality loss until the file fits its budget. Never ships over.
function fit(out, limit, build, start, step) {
  for (let q = start, i = 0; i < 10 && q > 0; q += step, i++) {
    build(q)
    if (statSync(out).size <= limit) return console.log('wrote', out, kb(out), 'q', q)
  }
  throw new Error(`${out} does not fit ${limit} bytes`)
}

const stillW = wide ? 1280 : 540
const vidW = wide ? 960 : 432
const browser = await chromium.launch({ args: recipe.launchArgs ?? [] })
const ctxOpts = (theme, extra = {}) => ({
  viewport, deviceScaleFactor: scale, locale: 'pt-BR', reducedMotion: 'no-preference',
  ...(recipe.context?.(theme) ?? {}), ...extra,
})

if (both || flags.includes('--stills')) {
  for (const theme of recipe.themes) {
    const ctx = await browser.newContext(ctxOpts(theme))
    const page = await ctx.newPage()
    await recipe.prepare?.(page, theme)
    await recipe.still(page, theme)
    await page.screenshot({ path: `${tmp}/${theme}.png` })
    await ctx.close()
    const out = `${outDir}/${theme}.webp`
    fit(out, budget.still[recipe.frame], (q) => webp(`${tmp}/${theme}.png`, out, stillW, q), 80, -5)
  }
}

if (both || flags.includes('--video')) {
  const theme = recipe.themes[0]
  const size = { width: viewport.width * scale, height: viewport.height * scale }
  // Login happens in a throwaway context so the recording starts on the first story beat.
  let storageState
  if (recipe.prepare) {
    const prep = await browser.newContext(ctxOpts(theme))
    await recipe.prepare(await prep.newPage(), theme)
    storageState = await prep.storageState()
    await prep.close()
  }
  const ctx = await browser.newContext(ctxOpts(theme, { recordVideo: { dir: tmp, size }, storageState }))
  const page = await ctx.newPage()
  await recipe.story(page, theme)
  const raw = await page.video().path()
  await ctx.close()
  const vf = `fps=24,scale=${vidW}:-2:flags=lanczos`
  const trim = ['-ss', '0.4', '-i', raw, '-t', String(budget.seconds - 0.1), '-an', '-vf', vf]
  fit(`${outDir}/demo.webm`, budget.webm, (q) =>
    ff(...trim, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(q), '-row-mt', '1', '-pix_fmt', 'yuv420p', `${outDir}/demo.webm`), 36, 2)
  fit(`${outDir}/demo.mp4`, budget.mp4, (q) =>
    ff(...trim, '-c:v', 'libx264', '-crf', String(q), '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${outDir}/demo.mp4`), 27, 2)
  fit(`${outDir}/poster.webp`, budget.poster, (q) => webp(`${outDir}/demo.mp4`, `${outDir}/poster.webp`, vidW, q, ['-ss', '1.5']), 80, -5)
}

await browser.close()
rmSync(tmp, { recursive: true, force: true })
execFileSync('node', ['scripts/media-check.mjs', id], { stdio: 'inherit' })
