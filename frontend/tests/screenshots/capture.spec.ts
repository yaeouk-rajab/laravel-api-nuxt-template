import { test, type Page } from '@playwright/test'

/**
 * Writes PNGs to ../docs/screenshots. Needs the same migrated and seeded
 * backend as the e2e specs (admin@example.test / password).
 */
const OUT = '../docs/screenshots'

// Pages hydrate after load; clicking earlier submits the form natively.
async function gotoHydrated(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'networkidle' })
}

test.use({ viewport: { width: 1100, height: 560 }, deviceScaleFactor: 1.5 })

test('capture the login flow', async ({ page }) => {
  await gotoHydrated(page, '/login')
  await page.screenshot({ path: `${OUT}/login.png` })

  await page.locator('input[name="email"]').fill('admin@example.test')
  await page.locator('input[name="password"]').fill('wrong-password')
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${OUT}/login-error.png` })

  await page.locator('input[name="password"]').fill('password')
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.waitForURL(/\/dashboard$/)
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: `${OUT}/dashboard.png` })
})
