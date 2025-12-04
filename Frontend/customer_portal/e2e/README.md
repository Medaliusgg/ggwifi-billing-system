# E2E Testing Guide

## Setup

### 1. Install Playwright
```bash
npm install -D @playwright/test
npx playwright install
```

### 2. Install Browser Binaries
```bash
npx playwright install chromium firefox webkit
```

## Running Tests

### Run all E2E tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test customer-login.spec.js
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
```

## Test Structure

- `customer-login.spec.js` - Tests for OTP login flow and dashboard navigation

## Configuration

Tests are configured in `playwright.config.js`:
- Base URL: `http://localhost:5173` (Vite dev server)
- API URL: `http://localhost:8080/api/v1` (Backend API)
- Auto-starts dev server if not running
- Screenshots on failure
- Trace on first retry

## Environment Variables

Set `API_URL` to override backend API URL:
```bash
API_URL=http://localhost:8080/api/v1 npm run test:e2e
```

## Test Coverage

Current tests cover:
- ✅ Landing page navigation
- ✅ OTP request flow
- ✅ OTP verification
- ✅ Dashboard display
- ✅ Error handling (invalid OTP, rate limiting)
- ✅ Logout flow

## Adding New Tests

1. Create new `.spec.js` file in `e2e/` directory
2. Import `test` and `expect` from `@playwright/test`
3. Use `test.describe` to group related tests
4. Use `page.route()` to mock API responses
5. Use `expect()` for assertions

Example:
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    // Your test code
  });
});
```

## Debugging

### View test report
```bash
npx playwright show-report
```

### Run with headed browser
```bash
npx playwright test --headed
```

### Slow down execution
```bash
npx playwright test --slow-mo=1000
```

## CI/CD Integration

Tests can be run in CI/CD pipelines. Playwright will automatically:
- Install browsers
- Run tests in parallel
- Generate HTML reports
- Take screenshots on failure






