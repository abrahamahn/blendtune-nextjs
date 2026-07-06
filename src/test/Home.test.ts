import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('Has Page Title', async ({ page }) => {
    await expect(page).toHaveTitle(/Blendtune/);
  });

  test('Mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });
});

test.describe('Hero component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('Renders properly', async ({ page }) => {
    const exploreLink = page.locator('a[href="/sounds"]').first();
    await expect(exploreLink).toHaveAttribute('href', '/sounds');

    const tryFreeLink = page.locator('a[href="/sounds"]').first();
    await expect(tryFreeLink).toHaveAttribute('href', '/sounds');
  });

  test('Button leads to correct URL and redirects to /sounds', async ({ page }) => {
    const exploreLink = page.locator('a[href="/sounds"]').first();
    await exploreLink.click();

    await expect(page).toHaveURL('/sounds');

    await page.goBack();

    const tryFreeLink = page.locator('a[href="/auth/signup"]').first();
    await tryFreeLink.click();

    await expect(page).toHaveURL('/auth/signup');
  });
});