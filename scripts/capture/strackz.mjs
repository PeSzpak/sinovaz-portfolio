// Needs STRACKZ_EMAIL and STRACKZ_PASSWORD (demo user "Alex Demo", fictional data) in .env.capture.
const base = process.env.STRACKZ_URL ?? 'https://strackz.vercel.app'

async function dashboard(page) {
  await page.goto(`${base}/dashboard`, { waitUntil: 'networkidle' })
  await page.getByText('Orçamento 50/30/20').waitFor()
  await page.waitForTimeout(1500)
}

export default {
  id: 'strackz',
  frame: 'wide',
  themes: ['dark', 'light'],

  async prepare(page, theme) {
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme)
    await page.goto(`${base}/login`, { waitUntil: 'networkidle' })
    await page.getByText('Entrar com senha').click()
    await page.locator('input[type=email]').fill(process.env.STRACKZ_EMAIL)
    await page.locator('input[type=password]').fill(process.env.STRACKZ_PASSWORD)
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    await page.waitForURL(/dashboard/)
  },

  async still(page) {
    await dashboard(page)
  },

  async story(page) {
    await dashboard(page)
    await page.getByRole('link', { name: 'Transações' }).click()
    await page.getByText('Novembro 2026').first().waitFor()
    await page.waitForTimeout(2000)
    await page.getByRole('link', { name: 'Orçamento' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2200)
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await page.getByText('Orçamento 50/30/20').waitFor()
    await page.waitForTimeout(1200)
    await page.getByRole('button', { name: /Alternar entre tema/ }).click()
    await page.waitForTimeout(3000)
  },
}
