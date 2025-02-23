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
    await page.emulateMedia({ deviceScaleFactor: 2 });
  });
});

test.describe('Hero component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('Renders properly', async ({ page }) => {
    const exploreLink = await page.$('a[href="/sounds"]');
    expect(exploreLink).not.toBeNull();
    expect(await exploreLink.getAttribute('href')).toEqual('/sounds');

    const tryFreeLink = await page.$('a[href="/sounds"]');
    expect(tryFreeLink).not.toBeNull();
    expect(await tryFreeLink.getAttribute('href')).toEqual('/sounds');
  });

  test('Button leads to correct URL and redirects to /sounds', async ({ page }) => {
    const exploreLink = await page.$('a[href="/sounds"]');
    await exploreLink.click();

    await expect(page).toHaveURL('/sounds');

    await page.goBack();

    const tryFreeLink = await page.$('a[href="/auth/signup"]');
    await tryFreeLink.click();

    await expect(page).toHaveURL('/auth/signup');
    
  });
});