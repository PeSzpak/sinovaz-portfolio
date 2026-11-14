// Runs against a LOCAL Supabase (fictional admin Bruno and athlete Clara) and a production build of SgymZ made against it.
// Never point this at the real project. Build the app with NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 and the local anon key,
// start it with `next start -p 3100`, then run: node scripts/media.mjs sgymz
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const base = process.env.SGYMZ_URL ?? 'http://127.0.0.1:3100'
const api = process.env.SGYMZ_API ?? 'http://127.0.0.1:54321'
const service = process.env.SGYMZ_SERVICE_KEY
const dbContainer = process.env.SGYMZ_DB_CONTAINER ?? 'supabase_db_sgymz-local'
const password = 'demo-pass-123'
const storageTheme = { kitty: 'hellokitty', batman: 'batman' }

if (!/^https?:\/\/(127\.0\.0\.1|localhost)/.test(api)) throw new Error('SGYMZ_API must be a local Supabase')

const post = (path, body) =>
  fetch(`${api}${path}`, { method: 'POST', headers: { apikey: service, authorization: `Bearer ${service}`, 'content-type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.json())
const psql = (input, ...vars) =>
  execFileSync('docker', ['exec', '-i', dbContainer, 'psql', '-U', 'postgres', '-q', '-t', '-A', '-v', 'ON_ERROR_STOP=1', ...vars.flatMap((v) => ['-v', v])], { input }).toString().trim()

// The first sign-up becomes the admin, so Bruno is created first. Re-runs find the existing users.
async function userId(email) {
  const made = await post('/auth/v1/admin/users', { email, password, email_confirm: true })
  return made.id ?? psql(`select id from auth.users where email = '${email}'`)
}

async function login(page, path, email) {
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.getByRole('button', { name: /^Entrar/ }).click()
  await page.waitForURL(/dashboard/)
}

let adminCookies

export default {
  id: 'sgymz',
  frame: 'tall',
  themes: ['kitty', 'batman'],
  context: () => ({ colorScheme: 'light', timezoneId: 'America/Sao_Paulo' }),

  async prepare(page, theme) {
    const bruno = await userId('bruno.reis@example.com')
    const clara = await userId('clara.nunes@example.com')
    psql(readFileSync(new URL('./seed/sgymz.sql', import.meta.url)), `bruno=${bruno}`, `clara=${clara}`)
    // The profile gate applies users.theme_preference after load, so the database row carries the theme.
    psql(`update public.users set theme_preference = '${storageTheme[theme]}' where id = '${clara}'`)
    await page.addInitScript((t) => localStorage.setItem('preferred-theme', t), storageTheme[theme])
    await login(page, '/admin/login', 'bruno.reis@example.com')
    adminCookies = await page.context().cookies()
    await page.context().clearCookies()
    await login(page, '/login', 'clara.nunes@example.com')
    await page.getByText('Começar treino').waitFor()
  },

  async still(page) {
    await page.waitForTimeout(1200)
  },

  async story(page) {
    await page.goto(`${base}/dashboard`, { waitUntil: 'networkidle' })
    await page.getByText('Começar treino').waitFor()
    await page.waitForTimeout(2000)
    await page.getByRole('link', { name: /Começar treino/ }).click()
    const sets = page.getByRole('button', { name: 'Marcar série como feita' })
    await sets.first().waitFor()
    await page.waitForTimeout(700)
    await sets.nth(1).click()
    await page.getByText('Descansando').waitFor()
    await page.waitForTimeout(2000)
    await page.getByRole('button', { name: 'Pular' }).click()
    await page.getByRole('button', { name: /Finalizar/ }).first().click()
    await page.getByRole('button', { name: 'Puxado' }).click()
    await page.waitForTimeout(700)
    await page.getByRole('button', { name: 'Salvar treino' }).click()
    await page.getByText('Treino concluído!').waitFor()
    await page.waitForTimeout(2400)
    await page.goto(`${base}/perfil`, { waitUntil: 'networkidle' })
    await page.locator('button[aria-pressed]', { hasText: 'Batman' }).click()
    await page.waitForTimeout(1600)
    await page.context().clearCookies()
    await page.context().addCookies(adminCookies)
    await page.goto(`${base}/admin/dashboard`, { waitUntil: 'networkidle' })
    await page.getByText('Pedidos novos').waitFor()
    await page.waitForTimeout(2200)
  },
}
