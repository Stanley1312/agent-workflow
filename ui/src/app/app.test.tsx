import '@playwright/test';
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart UI - Navigation and Layout', () => {
  test('AC-1: should display hero section and 4-product grid on home page', async ({ page }) => {
    await page.goto('/');

    // Hero section should be visible
    await expect(page.locator('text=Crafting Time')).toBeVisible();
    await expect(page.locator('text=Explore Collection')).toBeVisible();

    // Product grid should show 4 products
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards).toHaveCount(4);
  });

  test('AC-2: should navigate to product detail when product card is clicked', async ({ page }) => {
    await page.goto('/');

    // Click the first product card
    await page.locator('[data-testid="product-card"]').first().click();

    // Should navigate to product detail page
    await expect(page).toHaveURL(/\/product\/.+/);
    await expect(page.locator('[data-testid="product-gallery"]')).toBeVisible();
  });

  test('AC-7: should navigate to home page when Collections is clicked in nav', async ({ page }) => {
    await page.goto('/');

    // Navigate to a product first
    await page.locator('[data-testid="product-card"]').first().click();
    await expect(page).toHaveURL(/\/product\/.+/);

    // Click Collections in nav
    await page.locator('nav >> text=Collections').click();

    // Should be back on home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Crafting Time')).toBeVisible();
  });
});

test.describe('Shopping Cart UI - Product Detail Page', () => {
  test('AC-3: should display hero image, thumbnails, product info, specs, and CTAs on product detail page', async ({ page }) => {
    await page.goto('/product/chronograph-elite');

    // Image gallery should be visible
    await expect(page.locator('[data-testid="hero-image"]')).toBeVisible();

    // Thumbnails should be visible
    const thumbnails = page.locator('[data-testid="thumbnail"]');
    await expect(thumbnails.first()).toBeVisible();

    // Product info should be visible
    await expect(page.locator('[data-testid="product-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();

    // Specs should be visible
    await expect(page.locator('[data-testid="product-specs"]')).toBeVisible();

    // CTAs should be visible
    await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();
    await expect(page.locator('button:has-text("Inquire Now")')).toBeVisible();
  });

  test('AC-4: should update hero image when thumbnail is clicked', async ({ page }) => {
    await page.goto('/product/chronograph-elite');

    // Get initial hero image src
    const initialHeroImage = page.locator('[data-testid="hero-image"]');
    const initialSrc = await initialHeroImage.getAttribute('src');

    // Click second thumbnail
    await page.locator('[data-testid="thumbnail"]').nth(1).click();

    // Hero image src should change
    const newSrc = await initialHeroImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
  });

  test('AC-5: should show "Added" feedback when Add to Cart is clicked', async ({ page }) => {
    await page.goto('/product/chronograph-elite');

    // Click Add to Cart
    await page.locator('button:has-text("Add to Cart")').click();

    // Button should show "Added" feedback
    await expect(page.locator('button:has-text("Added")')).toBeVisible();
  });

  test('AC-6: should show "Inquiry Sent" feedback when Inquire Now is clicked', async ({ page }) => {
    await page.goto('/product/chronograph-elite');

    // Click Inquire Now
    await page.locator('button:has-text("Inquire Now")').click();

    // Button should show "Inquiry Sent" feedback
    await expect(page.locator('button:has-text("Inquiry Sent")')).toBeVisible();
  });

  test('AC-8: should display "Product not found" message for invalid product ID', async ({ page }) => {
    await page.goto('/product/invalid-id');

    // Should show product not found message
    await expect(page.locator('text=Product not found')).toBeVisible();
  });
});

test.describe('Shopping Cart UI - Footer', () => {
  test('should display footer on home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should display footer on product detail page', async ({ page }) => {
    await page.goto('/product/chronograph-elite');
    await expect(page.locator('footer')).toBeVisible();
  });
});