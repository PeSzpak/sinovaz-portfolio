// Runs against a throwaway `docker compose -p frp-demo` stack of Face Recognition Pro (never the owner's own stack or data).
// Faces are StyleGAN images from thispersondoesnotexist.com, i.e. nobody real. Set FACE_DIR to a directory holding
// ana-1..4.jpg, leo-1..4.jpg, clara-1..4.jpg and FACE_CAM to an .mjpeg of the Ana face for the fake camera.
import { readFileSync } from 'node:fs'

const base = process.env.FACE_URL ?? 'http://localhost:8080'
const dir = process.env.FACE_DIR
const cam = process.env.FACE_CAM
if (!dir || !cam) throw new Error('set FACE_DIR and FACE_CAM')

const PEOPLE = [
  { key: 'ana', name: 'Ana Prado', email: 'ana.prado@example.com', department: 'Design', position: 'Designer', faceAccess: true },
  { key: 'leo', name: 'Leo Martins', email: 'leo.martins@example.com', department: 'Engenharia', position: 'Desenvolvedor' },
  { key: 'clara', name: 'Clara Nunes', email: 'clara.nunes@example.com', department: 'Produto', position: 'Gerente de produto' },
]
const photo = (key, n) => new File([readFileSync(`${dir}/${key}-${n}.jpg`)], `${key}-${n}.jpg`, { type: 'image/jpeg' })

async function call(path, token, init = {}) {
  const res = await fetch(`${base}/api${path}`, { ...init, headers: { ...(token && { authorization: `Bearer ${token}` }), ...init.headers } })
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path}: ${res.status} ${await res.text()}`)
  return res.status === 204 ? null : res.json()
}
const json = (body) => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
const form = (field, files, extra = {}) => {
  const f = new FormData()
  files.forEach((file) => f.append(field, file))
  Object.entries(extra).forEach(([k, v]) => f.append(k, v))
  return { method: 'POST', body: f }
}

// Wipes people, enrolls the three fictional ones, grants Ana Face ID and logs a few recognitions for the dashboard and history.
async function seed() {
  const session = await call('/auth/login', null, json({ username: 'admin', password: 'admin123' }))
  const token = session.access_token
  for (const p of (await call('/persons?size=100', token)).items) await call(`/persons/${p.id}`, token, { method: 'DELETE' })
  for (const p of PEOPLE) {
    const person = await call('/persons', token, json({ name: p.name, email: p.email, department: p.department, position: p.position, external_id: null, notes: null }))
    const up = await call(`/persons/${person.id}/samples`, token, form('images', [1, 2, 3, 4].map((n) => photo(p.key, n))))
    if (!up.added?.length) console.warn('no sample accepted for', p.name, JSON.stringify(up).slice(0, 300))
    if (p.faceAccess) await call(`/persons/${person.id}/face-access`, token, { method: 'PUT' })
  }
  for (const [key, n] of [['leo', 1], ['clara', 2], ['ana', 3], ['leo', 4], ['clara', 1], ['ana', 2]])
    await call('/recognition/identify', token, form('image', [photo(key, n)], { source: 'upload', record: 'true' }))
  return session
}

export default {
  id: 'face',
  frame: 'wide',
  themes: ['default'],
  launchArgs: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-video-capture=${cam}`],
  context: () => ({ permissions: ['camera'] }),

  async prepare(page) {
    const session = await seed()
    await page.addInitScript((s) => localStorage.setItem('frp.session', s), JSON.stringify(session))
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.getByText('Visão geral').first().waitFor()
  },

  async still(page) {
    await page.goto(`${base}/recognize`, { waitUntil: 'networkidle' })
    await page.getByText('Ana Prado').first().waitFor({ timeout: 60000 })
    await page.waitForTimeout(1500)
  },

  async story(page) {
    await page.goto(`${base}/login`, { waitUntil: 'networkidle' })
    await page.evaluate(() => localStorage.removeItem('frp.session'))
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByText('Face ID', { exact: true }).first().click()
    // Capture returns nothing until the fake camera delivers a frame, and the button would then report an unknown face.
    await page.waitForFunction(() => document.querySelector('video')?.readyState >= 3)
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Escanear rosto' }).click()
    await page.getByText('Visão geral').first().waitFor({ timeout: 60000 })
    await page.waitForTimeout(2200)
    await page.getByRole('link', { name: 'Reconhecer' }).first().click()
    await page.getByText('Ana Prado').first().waitFor({ timeout: 60000 })
    await page.waitForTimeout(1500)
    await page.getByRole('button', { name: 'Capturar e registrar' }).click()
    await page.waitForTimeout(1800)
    await page.getByRole('link', { name: 'Histórico' }).click()
    await page.waitForTimeout(2800)
  },
}
