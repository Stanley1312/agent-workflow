import { expect, test } from '@playwright/test';

test.describe('marketplace', () => {
  test('Flow 1: Browse marketplace listings', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Browse', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Category' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Price' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Distance' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Condition' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sort' })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: 'Search listings' })).toBeVisible();
    await expect(page.locator('section[aria-label="Listings"] article')).toHaveCount(4);
    await expect(page.locator('section[aria-label="Listings"] img')).toHaveCount(4);

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'MatchMarket' })).toBeFocused();

    await page.getByRole('button', { name: 'Category' }).click();
    await expect(page.getByText(/no listings match|no matches|empty state/i)).toBeVisible();

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.locator('section[aria-label="Listings"] article')).toHaveCount(4);
    await expect(page.locator('body')).not.toBeEmpty();

    const firstListing = page.locator('section[aria-label="Listings"] article').first().getByRole('link');
    await firstListing.click();
    await expect(page).toHaveURL(/\/listings\//);
  });
});
