const { test, expect } = require('@playwright/test');

test.describe('Web Application Functionalities', () => {

    test.describe('Login Functionality', () => {

        test.beforeEach(async ({ page }) => {
            // Visit the login page before each test
            await page.goto('/login'); // Replace with your application's login page URL
        });

        test('should login successfully with valid credentials', async ({ page }) => {
            const username = 'testUser';
            const password = 'testPassword';

            const loginButton = page.locator('button[type="submit"]');
            await expect(loginButton).toBeVisible();

            await page.fill('input[name="username"]', username); // Replace with your username input selector
            await page.fill('input[name="password"]', password); // Replace with your password input selector
            await loginButton.click(); // Click the login button

            await expect(page).toHaveURL('/dashboard'); // Replace with the URL you expect after a successful login
            await expect(page.locator('text=Welcome, testUser')).toBeVisible(); // Replace with a message or element that confirms successful login
        });

        test('should display an error message for an invalid username', async ({ page }) => {
            const username = 'wrongUser';
            const password = 'testPassword';

            const loginButton = page.locator('button[type="submit"]');
            await expect(loginButton).toBeVisible();

            await page.fill('input[name="username"]', username);
            await page.fill('input[name="password"]', password);
            await loginButton.click();

            await expect(page.locator('.error-message')) // Replace with your error message selector
                .toBeVisible();
            await expect(page.locator('.error-message'))
                .toHaveText('Invalid credentials'); // Replace with the exact error message text
        });

        test('should display an error message for an invalid password', async ({ page }) => {
            const username = 'testUser';
            const password = 'wrongPassword';

            const loginButton = page.locator('button[type="submit"]');
            await expect(loginButton).toBeVisible();

            await page.fill('input[name="username"]', username);
            await page.fill('input[name="password"]', password);
            await loginButton.click();

            await expect(page.locator('.error-message'))
                .toBeVisible();
            await expect(page.locator('.error-message'))
                .toHaveText('Invalid credentials');
        });

        test('should disable login button if fields are empty', async ({ page }) => {
            const loginButton = page.locator('button[type="submit"]');
            await expect(loginButton).toBeDisabled();
        });
    });

    test.describe('User Registration Functionality', () => {

        test.beforeEach(async ({ page }) => {
            // Visit the registration page before each test
            await page.goto('/register'); // Replace with your application's registration page URL
        });

        test('should register a new user with valid details', async ({ page }) => {
            const username = 'newUser';
            const password = 'newPassword';
            const email = 'newuser@example.com';

            await page.fill('input[name="username"]', username);
            await page.fill('input[name="password"]', password);
            await page.fill('input[name="email"]', email);

            const registerButton = page.locator('button[type="submit"]');
            await expect(registerButton).toBeVisible();

            await registerButton.click();

            await expect(page).toHaveURL('/login');
            await expect(page.locator('text=Registration successful')).toBeVisible();
        });

        test('should display an error for existing username', async ({ page }) => {
            const username = 'existingUser';
            const password = 'newPassword';
            const email = 'existinguser@example.com';

            await page.fill('input[name="username"]', username);
            await page.fill('input[name="password"]', password);
            await page.fill('input[name="email"]', email);

            const registerButton = page.locator('button[type="submit"]');
            await expect(registerButton).toBeVisible();

            await registerButton.click();

            await expect(page.locator('.error-message'))
                .toBeVisible();
            await expect(page.locator('.error-message'))
                .toHaveText('Username already exists');
        });

        test('should display an error for invalid email format', async ({ page }) => {
            const username = 'newUser';
            const password = 'newPassword';
            const email = 'invalid-email';

            await page.fill('input[name="username"]', username);
            await page.fill('input[name="password"]', password);
            await page.fill('input[name="email"]', email);

            const registerButton = page.locator('button[type="submit"]');
            await expect(registerButton).toBeVisible();

            await registerButton.click();

            await expect(page.locator('.error-message'))
                .toBeVisible();
            await expect(page.locator('.error-message'))
                .toHaveText('Invalid email format');
        });
    });

    test.describe('Dashboard Functionality', () => {

        test.beforeEach(async ({ page }) => {
            // Simulate a logged-in state by navigating to the dashboard
            await page.goto('/dashboard'); // Replace with your application's dashboard URL
        });

        test('should display user-specific content on the dashboard', async ({ page }) => {
            await expect(page.locator('text=Welcome, testUser')).toBeVisible(); // Replace with a welcome message or specific user content
        });

        test('should log out successfully and redirect to login page', async ({ page }) => {
            const logoutButton = page.locator('button#logout'); // Replace with your logout button selector
            await expect(logoutButton).toBeVisible();

            await logoutButton.click();

            await expect(page).toHaveURL('/login'); // Replace with the URL you expect after logging out
        });

        test('should not allow access to dashboard when not logged in', async ({ page }) => {
            await page.goto('/dashboard'); // Replace with your application's dashboard URL

            await expect(page).toHaveURL('/login'); // Replace with the URL you expect for redirection when not logged in
            await expect(page.locator('text=Please log in')).toBeVisible(); // Replace with the appropriate message
        });
    });
});
