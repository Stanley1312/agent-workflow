import { expect, test } from '@playwright/test';

test.describe('profiles', () => {
  test('Flow 6: View profile, reviews, and ratings', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'My profile' }).click();
    await expect(page).toHaveURL(/\/profiles\//);

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/reviews/i)).toBeVisible();
    await expect(page.getByText(/listings/i)).toBeVisible();
    await expect(page.getByText(/rating summary|average/i)).toBeVisible();

    await page.getByRole('link', { name: 'Reviews' }).click();
    await expect(page.getByRole('link', { name: 'Reviews' })).toHaveAttribute('aria-current', 'page');

    const reviewHeading = page.getByRole('heading', { name: 'Leave a review' });
    if (await reviewHeading.isVisible()) {
      await page.getByLabel('Rating').fill('6');
      await page.getByLabel('Review').fill('');
      await page.getByRole('button', { name: 'Submit review' }).click();
      await expect(page.getByRole('alert')).toContainText(/required|invalid|range/i);

      await page.getByLabel('Rating').fill('5');
      await page.getByLabel('Review').fill('Helpful seller with accurate photos and communication.');
      await page.getByRole('button', { name: 'Submit review' }).click();
      await expect(page.getByText('Helpful seller with accurate photos and communication.')).toBeVisible();
      await expect(page.getByText(/average from|rating summary/i)).toBeVisible();
    } else {
      await expect(page.getByText(/no reviews yet/i)).toBeVisible();
    }

    await page.getByRole('link', { name: 'Listings' }).click();
    await expect(page.getByRole('link', { name: 'Listings' })).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
