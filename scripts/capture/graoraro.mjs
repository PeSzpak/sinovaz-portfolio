const base = process.env.GRAORARO_URL ?? 'https://grao-raro.sinovaz.com'
const slug = 'geisha-esmeralda-panama'

// Read-only: the story stops on the payment step, so no order or Asaas charge is created.
export default {
  id: 'graoraro',
  frame: 'wide',
  themes: ['default'],

  async still(page) {
    await page.goto(`${base}/produto/${slug}`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Pôr na sacola' }).waitFor()
    await page.waitForTimeout(800)
  },

  async story(page) {
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1600)
    await page.locator(`a[href="/produto/${slug}"]`).first().click()
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => window.scrollTo(0, 0))
    const add = page.getByRole('button', { name: 'Pôr na sacola' })
    await add.waitFor()
    await page.waitForTimeout(1500)
    await add.click()
    const pay = page.getByRole('link', { name: /Ir para o pagamento/ }).or(page.getByRole('button', { name: /Ir para o pagamento/ }))
    await pay.waitFor()
    await page.waitForTimeout(900)
    await pay.click()
    await page.waitForURL(/checkout/)
    await page.getByLabel('Nome completo').pressSequentially('Ana Prado', { delay: 30 })
    await page.getByLabel('E-mail').fill('ana.prado@example.com')
    await page.getByLabel('Celular').fill('41999990000')
    await page.getByLabel('CPF').fill('52998224725')
    await page.getByLabel('CEP').fill('80010000')
    await page.getByLabel('Número').fill('120')
    await page.getByRole('checkbox').check()
    await page.waitForTimeout(900)
    await page.getByRole('button', { name: 'Continuar' }).click()
    for (const tab of await page.getByRole('tab').all()) {
      await tab.click()
      await page.waitForTimeout(900)
    }
    await page.goto(`${base}/docs`, { waitUntil: 'networkidle' })
    await page.locator('.opblock').first().waitFor({ timeout: 15000 })
    await page.waitForTimeout(2200)
  },
}
