# Admin Portal Unit Testing Plan

**Date:** 2025-12-01  
**Status:** 🚀 Starting Implementation

---

## 🎯 Objectives

1. **Verify all modules are working correctly**
2. **Ensure all API endpoints match backend**
3. **Test all features and functionality**
4. **Identify and fix any API mismatches**
5. **Ensure production readiness**

---

## 📋 Testing Framework Setup

### Framework: Vitest + React Testing Library
- **Vitest**: Fast, Vite-native testing framework
- **React Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking
- **@testing-library/jest-dom**: DOM matchers

### Installation:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw @vitest/ui
```

---

## 🧪 Test Categories

### 1. API Client Tests
**Files to Test:**
- `src/api/client.js` - Axios configuration and interceptors
- `src/api/auth.js` - Authentication API calls
- `src/api/admin.js` - Admin API calls
- `src/api/dashboard.js` - Dashboard API calls
- `src/services/api.js` - Additional service APIs

**Test Coverage:**
- ✅ Request/response interceptors
- ✅ Token handling
- ✅ Error handling
- ✅ API endpoint correctness
- ✅ Request/response transformations

### 2. Component Tests
**Files to Test:**
- All components in `src/components/`
- Layout components
- Feature components
- UI components

**Test Coverage:**
- ✅ Component rendering
- ✅ User interactions
- ✅ Props handling
- ✅ State management
- ✅ Error boundaries

### 3. Page Tests
**Files to Test:**
- All pages in `src/pages/`
- Dashboard pages
- Management pages

**Test Coverage:**
- ✅ Page rendering
- ✅ Data fetching
- ✅ Form submissions
- ✅ Navigation
- ✅ Error handling

### 4. Service Tests
**Files to Test:**
- `src/services/api.js`
- All service modules

**Test Coverage:**
- ✅ Service functions
- ✅ API calls
- ✅ Data transformations
- ✅ Error handling

### 5. Utility Tests
**Files to Test:**
- `src/utils/constants.js`
- `src/utils/formatters.js`
- `src/utils/adminSeeder.js`

**Test Coverage:**
- ✅ Utility functions
- ✅ Constants
- ✅ Formatters
- ✅ Data transformations

### 6. Store Tests
**Files to Test:**
- `src/store/authStore.js`
- `src/store/uiStore.js`

**Test Coverage:**
- ✅ State management
- ✅ Actions
- ✅ Getters
- ✅ Persistence

---

## 🔍 API Endpoint Verification

### Backend Endpoints to Verify:

#### Authentication (`/api/v1/auth/`)
- [ ] `POST /auth/login` - Admin login
- [ ] `POST /auth/admin-login` - Admin login (alternative)
- [ ] `POST /auth/register` - User registration
- [ ] `POST /auth/refresh` - Token refresh
- [ ] `POST /auth/logout` - Logout
- [ ] `POST /auth/otp/generate` - Generate OTP
- [ ] `POST /auth/otp/validate` - Validate OTP
- [ ] `POST /auth/otp/resend` - Resend OTP

#### Dashboard (`/api/v1/dashboard`)
- [ ] `GET /dashboard` - Dashboard statistics
- [ ] `GET /admin/dashboard` - Admin dashboard

#### User Management (`/api/v1/admin/users`)
- [ ] `GET /admin/users` - List users
- [ ] `GET /admin/users/{id}` - Get user
- [ ] `POST /admin/users` - Create user
- [ ] `PUT /admin/users/{id}` - Update user
- [ ] `PUT /admin/users/{id}/status` - Update user status
- [ ] `DELETE /admin/users/{id}` - Delete user

#### Package Management (`/api/v1/admin/packages`)
- [ ] `GET /packages` - List packages
- [ ] `GET /admin/packages` - List packages (admin)
- [ ] `GET /admin/packages/{id}` - Get package
- [ ] `POST /admin/packages` - Create package
- [ ] `PUT /admin/packages/{id}` - Update package
- [ ] `DELETE /admin/packages/{id}` - Delete package

#### Voucher Management (`/api/v1/admin/vouchers`)
- [ ] `GET /admin/vouchers` - List vouchers
- [ ] `POST /admin/vouchers/generate` - Generate voucher
- [ ] `POST /admin/vouchers/generate-bulk` - Generate bulk vouchers
- [ ] `GET /admin/vouchers/statistics` - Voucher statistics
- [ ] `POST /admin/vouchers/cleanup` - Cleanup expired vouchers

#### Router Management (`/api/v1/admin/routers`)
- [ ] `GET /routers` - List routers
- [ ] `GET /admin/routers` - List routers (admin)
- [ ] `GET /admin/routers/{id}` - Get router
- [ ] `POST /admin/routers/add` - Add router
- [ ] `PUT /admin/routers/{id}` - Update router
- [ ] `DELETE /admin/routers/{id}` - Delete router
- [ ] `POST /admin/routers/{id}/test` - Test router connection
- [ ] `POST /admin/routers/{id}/configure` - Configure router
- [ ] `GET /admin/routers/{id}/config-script` - Get config script
- [ ] `GET /admin/mikrotik/routers/{id}/status` - Router status
- [ ] `GET /admin/mikrotik/routers/{id}/users` - Router users
- [ ] `POST /admin/mikrotik/routers/{id}/reboot` - Reboot router

#### Customer Management (`/api/v1/admin/customers`)
- [ ] `GET /customers` - List customers
- [ ] `GET /admin/customers` - List customers (admin)
- [ ] `GET /admin/customers/{id}` - Get customer
- [ ] `GET /admin/customers/{id}/profile` - Get customer profile
- [ ] `GET /admin/customers/search` - Search customer
- [ ] `PUT /admin/customers/{id}/status` - Update customer status

#### Payment Management (`/api/v1/admin/payments`)
- [ ] `GET /admin/payments` - List payments
- [ ] `GET /admin/payments/{id}` - Get payment
- [ ] `GET /admin/payments/statistics` - Payment statistics
- [ ] `POST /admin/payments/refund` - Process refund

#### Invoice Management (`/api/v1/admin/invoices`)
- [ ] `GET /admin/invoices` - List invoices
- [ ] `GET /admin/invoices/{id}` - Get invoice
- [ ] `POST /admin/invoices` - Create invoice
- [ ] `PUT /admin/invoices/{id}` - Update invoice

#### Reports & Analytics (`/api/v1/admin/reports-analytics`)
- [ ] `GET /admin/reports-analytics/reports` - List reports
- [ ] `GET /admin/reports-analytics/reports/statistics` - Report statistics
- [ ] `POST /admin/reports-analytics/reports` - Create report
- [ ] `GET /admin/reports-analytics/reports/generate/financial` - Financial report
- [ ] `GET /admin/reports-analytics/reports/generate/customer` - Customer report
- [ ] `GET /admin/reports-analytics/reports/generate/network` - Network report
- [ ] `GET /admin/reports-analytics/reports/generate/sales` - Sales report

#### Finance Management (`/api/v1/admin/finance`)
- [ ] `GET /admin/finance/budgets` - List budgets
- [ ] Additional finance endpoints

#### Marketing (`/api/v1/marketing`)
- [ ] `GET /marketing/campaigns` - List campaigns
- [ ] `POST /marketing/campaigns` - Create campaign
- [ ] Additional marketing endpoints

#### System (`/api/v1/system`)
- [ ] `GET /system/status` - System status
- [ ] `GET /system/config` - System config

---

## 📝 Test Implementation Order

### Phase 1: Setup & API Verification (Day 1)
1. ✅ Install testing dependencies
2. ✅ Configure Vitest
3. ✅ Set up MSW for API mocking
4. ✅ Create API endpoint verification tests
5. ✅ Document endpoint mismatches

### Phase 2: API Client Tests (Day 2)
1. ✅ Test `api/client.js`
2. ✅ Test `api/auth.js`
3. ✅ Test `api/admin.js`
4. ✅ Test `api/dashboard.js`
5. ✅ Test `services/api.js`

### Phase 3: Utility & Store Tests (Day 3)
1. ✅ Test utility functions
2. ✅ Test store modules
3. ✅ Test constants

### Phase 4: Component Tests (Day 4-5)
1. ✅ Test common components
2. ✅ Test feature components
3. ✅ Test UI components
4. ✅ Test layout components

### Phase 5: Page Tests (Day 6-7)
1. ✅ Test dashboard pages
2. ✅ Test management pages
3. ✅ Test all page components

### Phase 6: Integration & Fixes (Day 8)
1. ✅ Fix API endpoint mismatches
2. ✅ Fix any test failures
3. ✅ Generate test coverage report
4. ✅ Document findings

---

## 🎯 Success Criteria

- ✅ All API endpoints verified and matching backend
- ✅ 80%+ test coverage
- ✅ All critical paths tested
- ✅ All API clients tested
- ✅ All components tested
- ✅ All pages tested
- ✅ No API endpoint mismatches
- ✅ All tests passing

---

## 📊 Test Coverage Goals

| Category | Target Coverage |
|----------|----------------|
| API Clients | 100% |
| Components | 80% |
| Pages | 80% |
| Services | 90% |
| Utils | 100% |
| Stores | 90% |
| **Overall** | **85%+** |

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   cd Frontend/admin_portal
   npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw @vitest/ui
   ```

2. **Configure Vitest:**
   - Create `vitest.config.js`
   - Set up test environment
   - Configure coverage

3. **Start testing:**
   ```bash
   npm run test
   ```

---

**Status:** 🚀 Ready to begin implementation



