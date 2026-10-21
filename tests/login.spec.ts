import { test, expect } from '@playwright/test';

test.describe('Login', { tag: ['@login'] }, () => {

  // Runs before EACH test: open the login page
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test(
    'LOGIN-001: valid user can log in',
    { tag: ['@p0', '@smoke', '@LOGIN-001'] },
    async ({ page }) => {
      // Steps
      await page.getByTestId('username').fill('standard_user');
      await page.getByTestId('password').fill('secret_sauce');
      await page.getByTestId('login-button').click();

      // Expected: Products page opens
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.getByTestId('title')).toHaveText('Products');
    },
  );

  test(
    'LOGIN-002: wrong password shows error',
    { tag: ['@p0', '@LOGIN-002'] },
    async ({ page }) => {
      // Steps
      await page.getByTestId('username').fill('standard_user');
      await page.getByTestId('password').fill('wrong_password');
      await page.getByTestId('login-button').click();

      // Expected: error shown, still on login page
      await expect(page.getByTestId('error')).toContainText('Username and password do not match');
      await expect(page).not.toHaveURL(/inventory\.html/);
    },
  );
});
