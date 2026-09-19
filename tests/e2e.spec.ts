import { test, expect } from '@playwright/test';

test.describe('Souqna E-commerce App Tests', () => {
  test('Page loads properly with Arabic RTL layout and header elements', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/سوقنا/);

    const dirAttr = await page.getAttribute('html', 'dir');
    expect(dirAttr).toBe('rtl');

    await expect(page.locator('text=سوقنا').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /صفقات خاطفة/ })).toBeVisible();
    await expect(page.locator('text=Aboud Web')).toBeVisible();
  });

  test('Adding products to cart and applying coupon SOUQNA10', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click "إضافة للسلة" or "إضافة سريعة"
    const addButtons = page.locator('button:has-text("إضافة للسلة"), button:has-text("إضافة سريعة")');
    await addButtons.first().click();

    // Open cart drawer
    await page.click('button:has-text("السلة")');

    // Apply Coupon
    await page.fill('input[placeholder*="أدخل الكود"]', 'SOUQNA10');
    await page.click('button:has-text("تطبيق")');

    await expect(page.locator('text=تم تطبيق خصم 10% بنجاح!')).toBeVisible();
  });

  test('Full Checkout Flow with Syriatel Cash OTP simulation', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Add item
    const addButtons = page.locator('button:has-text("إضافة للسلة"), button:has-text("إضافة سريعة")');
    await addButtons.first().click();

    // Open cart
    await page.click('button:has-text("السلة")');

    // Proceed to checkout
    await page.click('button:has-text("الانتقال لإتمام الطلب")');

    // Fill delivery form
    await page.fill('input[placeholder="0987654321"]', '0988776655');
    await page.fill('textarea[placeholder*="المدينة / الحي"]', 'دمشق - المزة - الشارع العام قرب المدرسة');

    // Syriatel OTP flow
    await page.fill('input[placeholder="09xxxxxxxx"]', '0999888777');
    await page.click('button:has-text("طلب OTP")');

    await expect(page.locator('text=تم إرسال الرمز التجريبي')).toBeVisible();

    await page.fill('input[placeholder*="رمز التحقق OTP"]', '123456');

    // Submit order
    await page.click('button:has-text("تأكيد الطلب والدفع")');

    // Verify Tracking modal opens
    await expect(page.locator('text=تتبع حالة الشحنة والطلب')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=تم استلام الطلب')).toBeVisible();
  });
});
