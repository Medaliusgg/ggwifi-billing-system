import { test, expect } from '@playwright/test';

const TEST_PHONE = '+255742844024';
const API_BASE_URL = process.env.API_URL || 'http://localhost:8080/api/v1';

test.describe('Customer Portal - OTP Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display landing page with navigation', async ({ page }) => {
    await expect(page.locator('text=GG Wi-Fi')).toBeVisible();
    await expect(page.locator('button:has-text("Customer Portal")')).toBeVisible();
  });

  test('should navigate to customer portal login', async ({ page }) => {
    await page.click('button:has-text("Customer Portal")');
    await expect(page.locator('text=Access your customer portal')).toBeVisible();
    await expect(page.locator('input[placeholder*="Phone"]')).toBeVisible();
  });

  test('should request OTP successfully', async ({ page, request }) => {
    await page.click('button:has-text("Customer Portal")');
    
    // Mock OTP request
    await page.route(`${API_BASE_URL}/customer-auth/request-otp`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'OTP sent successfully'
        })
      });
    });

    await page.fill('input[placeholder*="Phone"]', TEST_PHONE);
    await page.click('button:has-text("Request OTP")');

    // Wait for OTP input to appear
    await expect(page.locator('text=Enter the code sent to')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('input[placeholder*="OTP"]')).toBeVisible();
  });

  test('should verify OTP and navigate to dashboard', async ({ page }) => {
    await page.click('button:has-text("Customer Portal")');
    
    // Mock OTP request
    await page.route(`${API_BASE_URL}/customer-auth/request-otp`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'success', message: 'OTP sent successfully' })
      });
    });

    await page.fill('input[placeholder*="Phone"]', TEST_PHONE);
    await page.click('button:has-text("Request OTP")');
    await expect(page.locator('input[placeholder*="OTP"]')).toBeVisible({ timeout: 5000 });

    // Mock OTP verification
    await page.route(`${API_BASE_URL}/customer-auth/verify-otp`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'Login successful',
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          account: {
            id: 1,
            phoneNumber: TEST_PHONE,
            fullName: 'Test User',
            isVerified: true
          }
        })
      });
    });

    // Mock dashboard data
    await page.route(`${API_BASE_URL}/customer-portal/customer/${TEST_PHONE}/dashboard`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          customer: {
            phoneNumber: TEST_PHONE,
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            status: 'ACTIVE'
          },
          statistics: {
            totalVouchers: 5,
            activeVouchers: 2,
            totalPayments: 10,
            successfulPayments: 9,
            activeSessionsCount: 1
          },
          vouchers: [],
          payments: [],
          transactions: [],
          activeSessions: []
        })
      });
    });

    // Mock loyalty status
    await page.route(`${API_BASE_URL}/loyalty/progress/${TEST_PHONE}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: {
            phoneNumber: TEST_PHONE,
            points: 1500,
            availablePoints: 1200,
            tier: 'GOLD',
            lifetimeSpend: 50000,
            totalRedemptions: 3
          }
        })
      });
    });

    await page.fill('input[placeholder*="OTP"]', '123456');
    await page.click('button:has-text("Verify")');

    // Should navigate to dashboard
    await expect(page.locator('text=GG Points')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=GOLD')).toBeVisible();
  });

  test('should display dashboard with analytics cards', async ({ page }) => {
    // Login first (using previous test logic)
    await page.click('button:has-text("Customer Portal")');
    
    await page.route(`${API_BASE_URL}/customer-auth/request-otp`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'success', message: 'OTP sent successfully' })
      });
    });

    await page.fill('input[placeholder*="Phone"]', TEST_PHONE);
    await page.click('button:has-text("Request OTP")');
    await expect(page.locator('input[placeholder*="OTP"]')).toBeVisible({ timeout: 5000 });

    await page.route(`${API_BASE_URL}/customer-auth/verify-otp`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          token: 'mock-token',
          refreshToken: 'mock-refresh',
          account: { id: 1, phoneNumber: TEST_PHONE, fullName: 'Test', isVerified: true }
        })
      });
    });

    await page.route(`${API_BASE_URL}/customer-portal/customer/${TEST_PHONE}/dashboard`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          customer: { phoneNumber: TEST_PHONE, firstName: 'Test', lastName: 'User' },
          statistics: { totalVouchers: 5, activeVouchers: 2 },
          vouchers: [],
          payments: [],
          transactions: [],
          activeSessions: []
        })
      });
    });

    await page.route(`${API_BASE_URL}/loyalty/progress/${TEST_PHONE}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: { points: 1500, tier: 'GOLD', availablePoints: 1200 }
        })
      });
    });

    await page.fill('input[placeholder*="OTP"]', '123456');
    await page.click('button:has-text("Verify")');

    // Check dashboard elements
    await expect(page.locator('text=GG Points')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Active Sessions')).toBeVisible();
    await expect(page.locator('text=Recent Payments')).toBeVisible();
    await expect(page.locator('text=Recent Transactions')).toBeVisible();
  });

  test('should handle OTP request errors', async ({ page }) => {
    await page.click('button:has-text("Customer Portal")');
    
    // Mock error response
    await page.route(`${API_BASE_URL}/customer-auth/request-otp`, async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'error',
          message: 'Too many OTP requests. Please try again in 10 minutes.'
        })
      });
    });

    await page.fill('input[placeholder*="Phone"]', TEST_PHONE);
    await page.click('button:has-text("Request OTP")');

    // Should show error message
    await expect(page.locator('text=Too many OTP requests')).toBeVisible({ timeout: 5000 });
  });

  test('should handle invalid OTP', async ({ page }) => {
    await page.click('button:has-text("Customer Portal")');
    
    await page.route(`${API_BASE_URL}/customer-auth/request-otp`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'success', message: 'OTP sent successfully' })
      });
    });

    await page.fill('input[placeholder*="Phone"]', TEST_PHONE);
    await page.click('button:has-text("Request OTP")');
    await expect(page.locator('input[placeholder*="OTP"]')).toBeVisible({ timeout: 5000 });

    // Mock invalid OTP response
    await page.route(`${API_BASE_URL}/customer-auth/verify-otp`, async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'error',
          message: 'Invalid or expired OTP'
        })
      });
    });

    await page.fill('input[placeholder*="OTP"]', '000000');
    await page.click('button:has-text("Verify")');

    // Should show error
    await expect(page.locator('text=Invalid or expired OTP')).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // First login (simplified)
    await page.click('button:has-text("Customer Portal")');
    
    await page.route(`${API_BASE_URL}/customer-auth/request-otp`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'success', message: 'OTP sent successfully' })
      });
    });

    await page.fill('input[placeholder*="Phone"]', TEST_PHONE);
    await page.click('button:has-text("Request OTP")');
    await expect(page.locator('input[placeholder*="OTP"]')).toBeVisible({ timeout: 5000 });

    await page.route(`${API_BASE_URL}/customer-auth/verify-otp`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          token: 'mock-token',
          refreshToken: 'mock-refresh',
          account: { id: 1, phoneNumber: TEST_PHONE, fullName: 'Test', isVerified: true }
        })
      });
    });

    await page.route(`${API_BASE_URL}/customer-portal/customer/${TEST_PHONE}/dashboard`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          customer: { phoneNumber: TEST_PHONE, firstName: 'Test' },
          statistics: {},
          vouchers: [],
          payments: [],
          transactions: [],
          activeSessions: []
        })
      });
    });

    await page.route(`${API_BASE_URL}/loyalty/progress/${TEST_PHONE}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: { points: 1500, tier: 'GOLD' }
        })
      });
    });

    await page.fill('input[placeholder*="OTP"]', '123456');
    await page.click('button:has-text("Verify")');
    await expect(page.locator('text=GG Points')).toBeVisible({ timeout: 10000 });

    // Click logout
    await page.click('button:has-text("Logout")');

    // Should return to login
    await expect(page.locator('text=Access your customer portal')).toBeVisible({ timeout: 5000 });
  });
});

