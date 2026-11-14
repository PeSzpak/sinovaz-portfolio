// Runs against a LOCAL Supabase (fictional members Ana and Leo) and a TWS Score dev server pointed at it.
// Never point this at the real project. Start both first, see the commands below:
//   supabase local stack on :54321, then in the app repo:
//   VITE_SUPABASE_URL=http://127.0.0.1:54321 VITE_SUPABASE_PUBLISHABLE_KEY=$ANON VITE_GOOGLE_MAPS_KEY= npx vite --port 5174
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const base = process.env.TWS_URL ?? 'http://127.0.0.1:5174'
const api = process.env.TWS_API ?? 'http://127.0.0.1:54321'
const anon = process.env.TWS_ANON_KEY
const service = process.env.TWS_SERVICE_KEY
const dbContainer = process.env.TWS_DB_CONTAINER ?? 'supabase_db_tws-local'
const password = 'demo-pass-123'
const storageKey = `sb-${new URL(api).hostname.split('.')[0]}-auth-token`

if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/.test(api)) throw new Error('TWS_API must be a local Supabase')

const json = (url, key, body, method = 'POST') =>
  fetch(url, { method, headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json' }, body: body && JSON.stringify(body) }).then((r) => r.json())

async function userId(email) {
  const made = await json(`${api}/auth/v1/admin/users`, service, { email, password, email_confirm: true })
  if (made.id) return made.id
  const list = await json(`${api}/auth/v1/admin/users?per_page=200`, service, null, 'GET')
  return list.users.find((u) => u.email === email).id
}

// Seeds fresh data and returns the session of Ana, as supabase-js stores it.
async function seed() {
  const [ana, leo] = [await userId('ana.prado@example.com'), await userId('leo.martins@example.com')]
  execFileSync('docker', ['exec', '-i', dbContainer, 'psql', '-U', 'postgres', '-q', '-v', 'ON_ERROR_STOP=1', '-v', `ana=${ana}`, '-v', `leo=${leo}`],
    { input: readFileSync(new URL('./seed/tws.sql', import.meta.url)) })
  return json(`${api}/auth/v1/token?grant_type=password`, anon, { email: 'ana.prado@example.com', password })
}

export default {
  id: 'tws',
  frame: 'tall',
  themes: ['light', 'dark'],
  context: (theme) => ({ colorScheme: theme }),

  async prepare(page) {
    const session = await seed()
    await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [storageKey, JSON.stringify(session)])
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.getByText('Nossos lugares').waitFor()
  },

  async still(page) {
    await page.getByText('Café Aurora').click()
    await page.getByText('Nota do casal').waitFor()
    await page.waitForTimeout(2200)
  },

  async story(page) {
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.getByText('Padaria do Largo').waitFor()
    await page.waitForTimeout(2200)
    await page.getByText('Padaria do Largo').click()
    await page.getByText(/aparece quando você avaliar/).waitFor()
    await page.waitForTimeout(1800)
    await page.getByRole('button', { name: 'Avaliar' }).click()
    await page.getByLabel('5 corações').click()
    await page.waitForTimeout(250)
    for (const [label, n] of [['Comida/bebida', 5], ['Ambiente', 4], ['Atendimento', 5], ['Preço', 4]]) {
      await page.getByRole('radio', { name: `${label} ${n}` }).click()
      await page.waitForTimeout(250)
    }
    await page.getByPlaceholder('Algo pra lembrar?').fill('Folhado de amêndoas quente.')
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: 'Enviar avaliação' }).click()
    await page.getByText('Nota do casal').waitFor()
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
    await page.waitForTimeout(3200)
    await page.getByRole('link', { name: 'Mapa' }).click()
    await page.locator('.leaflet-marker-icon').first().waitFor()
    await page.waitForTimeout(2200)
  },
}
