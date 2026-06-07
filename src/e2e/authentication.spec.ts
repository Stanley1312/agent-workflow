import { expect, test } from '@playwright/test';

test.describe('authentication', () => {
  test('Flow 2: Authenticate with credentials', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Post' }).click();
    await expect(page).toHaveURL(/\/signin\?callbackUrl=%2Flistings%2Fnew/);

    await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('alert')).toContainText(/required|invalid/i);
    await expect(page).toHaveURL(/\/signin/);

    await page.getByRole('link', { name: 'Create an account instead' }).click();
    await expect(page).toHaveURL(/\/signup\?callbackUrl=%2Flistings%2Fnew/);
    await expect(page.getByRole('heading', { name: 'Create your account', level: 1 })).toBeVisible();

    await page.getByLabel('Display name').fill('Wave Six Seller');
    await page.getByLabel('Email').fill('wave6-seller@example.com');
    await page.getByLabel('Password').fill('StrongPassword123!');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/$|\/listings\/new$/);
    await expect(page.getByRole('link', { name: 'My profile' })).toBeVisible();

    await page.getByRole('button', { name: /sign out|log out/i }).click();
    await expect(page.getByRole('link', { name: 'Post' })).toBeVisible();

    await page.getByRole('link', { name: 'Post' }).click();
    await expect(page).toHaveURL(/\/signin\?callbackUrl=%2Flistings%2Fnew/);
  });
});
