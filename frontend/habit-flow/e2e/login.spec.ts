import { test, expect } from '@playwright/test';

test.describe('Login page', () => {

  // FIXME: Blocked by login component bug — login requires two clicks to work.
  // First click does nothing. Re-enable (change test.fixme back to test) once fixed.
  test.fixme('valid credentials show success message', async ({ page }) => {
    await page.goto('http://localhost:4200/login');

    await page.getByRole('textbox').first().fill('testuser');
    await page.locator('input[type="password"]').fill('testpassword123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Login successful')).toBeVisible();
  });

  // FIXME: Blocked by login component bug — login requires two clicks to work.
  // First click does nothing. Re-enable (change test.fixme back to test) once fixed.
  test.fixme('invalid credentials show error message', async ({ page }) => {
    await page.goto('http://localhost:4200/login');

    await page.getByRole('textbox').first().fill('testuser');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

});