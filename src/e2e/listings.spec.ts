import { expect, test } from '@playwright/test';

test.describe('listings', () => {
  test('Flow 3: View listing detail', async ({ page }) => {
    await page.goto('/');

    const listingCard = page.locator('section[aria-label="Listings"] article').first();
    const listingTitle = await listingCard.getByRole('heading', { level: 3 }).textContent();
    const listingLink = listingCard.getByRole('link');
    await listingLink.click();

    await expect(page).toHaveURL(/\/listings\//);
    await expect(page.getByRole('heading', { level: 1 })).toContainText((listingTitle ?? '').trim());
    await expect(page.getByRole('img').first()).toBeVisible();
    await expect(page.getByText('Description')).toBeVisible();
    await expect(page.getByText('Seller')).toBeVisible();
    await expect(page.getByRole('link', { name: /owner|seller/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start a deal' })).toBeVisible();

    await page.getByRole('button', { name: /view image 1/i }).click();
    await expect(page.getByRole('button', { name: /view image 1/i })).toBeFocused();

    await page.getByRole('link', { name: /owner|seller/i }).click();
    await expect(page).toHaveURL(/\/profiles\//);

    await page.goBack();
    await expect(page).toHaveURL(/\/listings\//);
    await page.getByRole('link', { name: 'Back to browse' }).click();
    await expect(page).toHaveURL('/');
  });

  test('Flow 4: Create a listing', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Post' }).click();
    await expect(page).toHaveURL(/\/signin\?callbackUrl=%2Flistings%2Fnew/);

    await page.getByRole('link', { name: 'Create an account instead' }).click();
    await page.getByLabel('Display name').fill('Listing Creator');
    await page.getByLabel('Email').fill('listing-creator@example.com');
    await page.getByLabel('Password').fill('StrongPassword123!');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/listings\/new$/);
    await expect(page.getByRole('heading', { name: 'Create a listing', level: 1 })).toBeVisible();

    await page.getByRole('button', { name: 'Create listing' }).click();
    await expect(page.getByRole('alert')).toContainText(/required|invalid/i);

    await page.getByLabel('Title').fill('Wave 6 Market Lamp');
    await page.getByLabel('Price').fill('45');
    await page.getByLabel('Category').fill('Home');
    await page.getByLabel('Condition').fill('Like new');
    await page.getByLabel('Location').fill('Brooklyn, NY');
    await page.getByLabel('Description').fill('A compact lamp listed from the UI E2E flow.');
    await page.getByRole('button', { name: 'Create listing' }).click();

    await expect(page).toHaveURL(/\/listings\//);
    await expect(page.getByRole('heading', { name: 'Wave 6 Market Lamp', level: 1 })).toBeVisible();
    await expect(page.getByRole('img').first()).toBeVisible();

    await page.getByRole('link', { name: 'Back to browse' }).click();
    await expect(page.getByText('Wave 6 Market Lamp')).toBeVisible();
    await page.getByRole('link', { name: /seller/i }).click();
    await expect(page.getByText('Wave 6 Market Lamp')).toBeVisible();
  });

  test('Flow 5: Edit and delete own listing', async ({ page }) => {
    await page.goto('/signup');

    await page.getByLabel('Display name').fill('Owner Manager');
    await page.getByLabel('Email').fill('owner-manager@example.com');
    await page.getByLabel('Password').fill('StrongPassword123!');
    await page.getByRole('button', { name: 'Create account' }).click();

    await page.goto('/listings/new');
    await page.getByLabel('Title').fill('Owner Flow Listing');
    await page.getByLabel('Price').fill('55');
    await page.getByLabel('Category').fill('Electronics');
    await page.getByLabel('Condition').fill('Used');
    await page.getByLabel('Location').fill('Queens, NY');
    await page.getByLabel('Description').fill('Original owner flow listing description.');
    await page.getByRole('button', { name: 'Create listing' }).click();

    await expect(page).toHaveURL(/\/listings\//);
    await expect(page.getByRole('link', { name: 'Edit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();

    await page.getByRole('link', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/edit$/);

    await page.getByLabel('Title').fill('Owner Flow Listing Updated');
    await page.getByRole('button', { name: /save|update/i }).click();
    await expect(page).toHaveURL(/\/listings\//);
    await expect(page.getByRole('heading', { name: 'Owner Flow Listing Updated', level: 1 })).toBeVisible();

    await page.getByRole('link', { name: 'Edit' }).click();
    await page.getByLabel('Title').fill('');
    await page.getByRole('button', { name: /save|update/i }).click();
    await expect(page.getByRole('alert')).toContainText(/required|invalid/i);

    await page.goto('/');
    await page.locator('section[aria-label="Listings"] article').first().getByRole('link').click();
    await expect(page.getByRole('link', { name: 'Edit' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Delete' })).toHaveCount(0);

    await page.goto('/listings/new');
    await page.getByLabel('Title').fill('Delete Flow Listing');
    await page.getByLabel('Price').fill('65');
    await page.getByLabel('Category').fill('Furniture');
    await page.getByLabel('Condition').fill('Good');
    await page.getByLabel('Location').fill('Bronx, NY');
    await page.getByLabel('Description').fill('Listing that will be deleted in the owner flow.');
    await page.getByRole('button', { name: 'Create listing' }).click();

    await expect(page).toHaveURL(/\/listings\//);
    const listingUrl = page.url();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page).toHaveURL(/\/($|profiles\/|listings(?!\/new))/);
    await page.goto(listingUrl);
    await expect(page.getByText(/not found/i)).toBeVisible();
  });
});
