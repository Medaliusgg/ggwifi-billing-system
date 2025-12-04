# Test Scenarios Documentation

## Token Refresh & Reconnect Scenarios

### Scenario 1: Automatic Token Refresh
**Description**: Token should automatically refresh before expiration

**Steps**:
1. User logs in successfully
2. Token is stored in localStorage
3. After 15 minutes, token refresh is triggered automatically
4. New token is stored and used for subsequent requests

**Expected Result**:
- ✅ Token refreshes silently in background
- ✅ No interruption to user experience
- ✅ New token stored in localStorage
- ✅ API calls continue to work

**Test File**: `src/hooks/__tests__/useTokenRefresh.test.js`

---

### Scenario 2: Token Refresh on API Call Failure
**Description**: When API call fails with 401, token should refresh and retry

**Steps**:
1. User makes API call with expired token
2. API returns 401 Unauthorized
3. Token refresh is triggered
4. Original request is retried with new token

**Expected Result**:
- ✅ Token refresh happens automatically
- ✅ Original request is retried
- ✅ User sees no error (seamless experience)

---

### Scenario 3: Token Refresh Failure - Max Retries
**Description**: If token refresh fails multiple times, user should be logged out

**Steps**:
1. Refresh token expires or becomes invalid
2. Token refresh is attempted
3. Refresh fails (401/403)
4. Retry up to 3 times
5. After max retries, logout user

**Expected Result**:
- ✅ Maximum 3 retry attempts
- ✅ User is logged out after max retries
- ✅ Redirected to login page
- ✅ Clear error message shown

**Test File**: `src/hooks/__tests__/useTokenRefresh.test.js`

---

### Scenario 4: Reconnect After Network Loss
**Description**: When network connection is lost and restored, session should reconnect

**Steps**:
1. User is logged in and using dashboard
2. Network connection is lost
3. Network connection is restored
4. System attempts to reconnect

**Expected Result**:
- ✅ Reconnect logic triggers on network restore
- ✅ Token is validated/refreshed if needed
- ✅ Dashboard data is refreshed
- ✅ User sees reconnection notification

---

### Scenario 5: Concurrent Token Refresh
**Description**: Multiple API calls failing simultaneously should trigger only one refresh

**Steps**:
1. Multiple API calls are made with expired token
2. All calls receive 401 responses
3. Only one token refresh should occur
4. All requests are retried with new token

**Expected Result**:
- ✅ Only one refresh request is made
- ✅ All failed requests are retried
- ✅ No duplicate refresh calls

---

### Scenario 6: Token Refresh During Active Session
**Description**: Token refresh should not interrupt active user actions

**Steps**:
1. User is actively using dashboard
2. Token refresh triggers in background
3. User continues interacting with UI
4. Refresh completes silently

**Expected Result**:
- ✅ No UI blocking or loading states
- ✅ User actions continue normally
- ✅ Refresh happens in background
- ✅ No visible indication of refresh (unless error)

---

## OTP Login Scenarios

### Scenario 7: New Customer Signup Flow
**Description**: New customer should be able to sign up via OTP

**Steps**:
1. Enter new phone number
2. Request OTP
3. Receive OTP via SMS
4. Verify OTP
5. Account is auto-created
6. Redirected to dashboard

**Expected Result**:
- ✅ OTP sent successfully
- ✅ Account created automatically
- ✅ Customer redirected to dashboard
- ✅ Dashboard shows empty state (new customer)

**Test File**: `e2e/customer-login.spec.js`

---

### Scenario 8: Existing Customer Login
**Description**: Existing customer should login with OTP

**Steps**:
1. Enter existing phone number
2. Request OTP
3. Verify OTP
4. Redirected to dashboard with data

**Expected Result**:
- ✅ OTP sent successfully
- ✅ Login successful
- ✅ Dashboard shows customer data
- ✅ Loyalty points and tier displayed

**Test File**: `e2e/customer-login.spec.js`, `src/components/customer/__tests__/CustomerLogin.test.jsx`

---

### Scenario 9: OTP Rate Limiting
**Description**: Too many OTP requests should be rate limited

**Steps**:
1. Request OTP 4 times within 10 minutes
2. 4th request should fail
3. Wait 10 minutes
4. Request should succeed again

**Expected Result**:
- ✅ First 3 requests succeed
- ✅ 4th request fails with rate limit error
- ✅ After cooldown, requests succeed again

**Test File**: `e2e/customer-login.spec.js`

---

### Scenario 10: Invalid OTP Handling
**Description**: Invalid OTP should show error and allow retry

**Steps**:
1. Request OTP
2. Enter wrong OTP code
3. Verify fails
4. Show error message
5. Allow resend or retry

**Expected Result**:
- ✅ Error message displayed
- ✅ OTP input remains available
- ✅ Resend button available after countdown
- ✅ User can retry verification

**Test File**: `e2e/customer-login.spec.js`, `src/components/customer/__tests__/CustomerLogin.test.jsx`

---

## Dashboard Scenarios

### Scenario 11: Dashboard Data Loading
**Description**: Dashboard should load all customer data correctly

**Steps**:
1. Login successfully
2. Navigate to dashboard
3. All data sections load

**Expected Result**:
- ✅ Customer info displayed
- ✅ Loyalty points and tier shown
- ✅ Active sessions listed
- ✅ Recent payments displayed
- ✅ Recent transactions shown
- ✅ Analytics cards populated

**Test File**: `src/components/customer/__tests__/CustomerDashboard.test.jsx`

---

### Scenario 12: Dashboard Empty States
**Description**: New customers should see appropriate empty states

**Steps**:
1. New customer logs in
2. Navigate to dashboard
3. Check empty states

**Expected Result**:
- ✅ Empty state messages for each section
- ✅ Helpful guidance text
- ✅ No errors or broken UI

**Test File**: `src/components/customer/__tests__/CustomerDashboard.test.jsx`

---

### Scenario 13: Dashboard Refresh
**Description**: Manual refresh should update all data

**Steps**:
1. View dashboard
2. Click refresh button
3. All data reloads

**Expected Result**:
- ✅ Loading indicators shown
- ✅ All queries refetch
- ✅ Data updates
- ✅ Success notification shown

---

## Integration Scenarios

### Scenario 14: End-to-End Login Flow
**Description**: Complete flow from landing page to dashboard

**Steps**:
1. Visit landing page
2. Click "Customer Portal"
3. Enter phone number
4. Request OTP
5. Verify OTP
6. View dashboard

**Expected Result**:
- ✅ All steps complete successfully
- ✅ No errors or broken states
- ✅ Smooth transitions
- ✅ All data loads correctly

**Test File**: `e2e/customer-login.spec.js`

---

### Scenario 15: Logout Flow
**Description**: User should be able to logout successfully

**Steps**:
1. User is logged in
2. Click logout button
3. Session cleared
4. Redirected to login

**Expected Result**:
- ✅ Session cleared from localStorage
- ✅ Tokens removed
- ✅ Redirected to login page
- ✅ Cannot access dashboard without login

**Test File**: `e2e/customer-login.spec.js`

---

## Running Tests

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### All Tests
```bash
npm test && npm run test:e2e
```

---

## Test Coverage Goals

- ✅ Unit Tests: > 80% coverage
- ✅ E2E Tests: All critical user flows
- ✅ Integration Tests: All API endpoints
- ✅ Manual Testing: Edge cases and UX validation






