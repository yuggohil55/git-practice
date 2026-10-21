import { test, expect } from '@playwright/test';
import path from 'path';
import { pathToFileURL } from 'url';

// This page uses data-testid (like Assetron), not data-test (like saucedemo)
test.use({ testIdAttribute: 'data-testid' });

// The address of our practice page on this computer
const LOGIN_PAGE = pathToFileURL(path.join(__dirname, '../demo-app/login.html')).href;

test.describe('Demo Login', { tag: ['@demo-login'] }, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_PAGE);
  });

  test(
    'DEMO-LOGIN-001: valid user can sign in',
    { tag: ['@p0', '@smoke', '@DEMO-LOGIN-001'] },
    async ({ page }) => {
      // Step 1: email
      await page.getByTestId('login-email-input').fill('qa@example.com');
      await page.getByTestId('login-next-button').click();

      // Step 2: password
      await page.getByTestId('login-password-input').fill('Password123');
      await page.getByTestId('login-submit-button').click();

      // Expected: dashboard opens with the user's email
      await expect(page.getByTestId('dashboard-title')).toBeVisible();
      await expect(page.getByTestId('dashboard-user')).toHaveText('qa@example.com');
    },
  );

  test(
    'DEMO-LOGIN-002: wrong password shows error',
    { tag: ['@p0', '@DEMO-LOGIN-002'] },
    async ({ page }) => {
      await page.getByTestId('login-email-input').fill('qa@example.com');
      await page.getByTestId('login-next-button').click();
      await page.getByTestId('login-password-input').fill('WrongPassword');
      await page.getByTestId('login-submit-button').click();

      // Expected: error shown, user NOT logged in
      await expect(page.getByTestId('login-password-error')).toHaveText('Incorrect email or password');
      await expect(page.getByTestId('dashboard-title')).toBeHidden();
    },
  );

  // ✍️ YOUR TURN: write DEMO-LOGIN-003, 004 and 005 here

  test(
    'DEMO-LOGIN-006: user can log out and returns to sign-in',
    { tag: ['@p1', '@DEMO-LOGIN-006'] },
    async ({ page }) => {
      // Precondition: user is signed in
      await page.getByTestId('login-email-input').fill('qa@example.com');
      await page.getByTestId('login-next-button').click();
      await page.getByTestId('login-password-input').fill('Password123');
      await page.getByTestId('login-submit-button').click();
      await expect(page.getByTestId('dashboard-title')).toBeVisible();

      // Step: log out
      await page.getByTestId('logout-button').click();

      // Expected: back on the email step, dashboard gone, email field cleared
      await expect(page.getByTestId('login-email-step')).toBeVisible();
      await expect(page.getByTestId('dashboard-title')).toBeHidden();
      await expect(page.getByTestId('login-email-input')).toHaveValue('');
    },
  );

});
