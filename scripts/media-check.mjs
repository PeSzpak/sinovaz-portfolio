// usage: node scripts/media-check.mjs [id ...]   exits 1 when a declared file is missing or over budget
import { readFileSync, statSync, existsSync, readdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { budget } from './media-budget.mjs'

const decl = JSON.parse(readFileSync(new URL('../src/media.json', import.meta.url)))
const root = new URL('../public/media/', import.meta.url).pathname
const ids = process.argv.length > 2 ? process.argv.slice(2) : Object.keys(decl)
const bad = []
const size = (f) => statSync(f).size
const kb = (n) => `${(n / 1024).toFixed(1)} KB`

function expect(f, limit, label) {
  if (!existsSync(f)) return bad.push(`${label}: missing ${f}`)
  const n = size(f)
  console.log(`${n <= limit ? 'ok  ' : 'FAIL'} ${label} ${kb(n)} / ${kb(limit)}`)
  if (n > limit) bad.push(`${label}: ${kb(n)} over ${kb(limit)}`)
}

for (const id of ids) {
  const m = decl[id]
  if (!m) { bad.push(`${id}: not declared in src/media.json`); continue }
  const dir = `${root}${id}/`
  for (const th of m.themes) expect(`${dir}${th}.webp`, budget.still[m.frame], `${id}/${th}.webp`)
  if (m.video) {
    expect(`${dir}poster.webp`, budget.poster, `${id}/poster.webp`)
    expect(`${dir}demo.webm`, budget.webm, `${id}/demo.webm`)
    expect(`${dir}demo.mp4`, budget.mp4, `${id}/demo.mp4`)
    for (const f of ['demo.webm', 'demo.mp4']) {
      if (!existsSync(dir + f)) continue
      let s
      try {
        s = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dir + f], { stdio: ['ignore', 'pipe', 'ignore'] }).toString())
      } catch {
        bad.push(`${id}/${f}: ffprobe cannot read it`)
        continue
      }
      console.log(`${s <= budget.seconds + 0.05 ? 'ok  ' : 'FAIL'} ${id}/${f} ${s.toFixed(1)} s / ${budget.seconds} s`)
      if (s > budget.seconds + 0.05) bad.push(`${id}/${f}: ${s.toFixed(1)} s`)
    }
  } else if (existsSync(dir + 'demo.webm') || existsSync(dir + 'demo.mp4')) bad.push(`${id}: video files exist but media.json has no video`)
}

const all = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? all(d + e.name + '/') : size(d + e.name)))
const total = existsSync(root) ? all(root).reduce((a, b) => a + b, 0) : 0
console.log(`${total <= budget.total ? 'ok  ' : 'FAIL'} public/media ${kb(total)} / ${kb(budget.total)}`)
if (total > budget.total) bad.push('public/media over budget')

if (bad.length) { console.error('\n' + bad.join('\n')); process.exit(1) }
