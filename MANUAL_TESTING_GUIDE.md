# Manual Testing Guide

## Test Phone Number
**Phone Number**: `0742844024` (or `+255742844024` in international format)

---

## Prerequisites

### 1. Start Backend Server
```bash
cd backend
./mvnw spring-boot:run
# Or
mvn spring-boot:run
```

Backend should be running on: `http://localhost:8080`

### 2. Start Customer Portal Frontend
```bash
cd Frontend/customer_portal
npm install  # If not already done
npm run dev
```

Frontend should be running on: `http://localhost:5173`

### 3. Verify Services
- ✅ MySQL Database running
- ✅ Redis running (for sessions)
- ✅ SMS Service configured (for OTP)
- ✅ Backend API accessible

---

## Testing Scenarios

### Scenario 1: New Customer Signup Flow

**Steps:**
1. Open browser: `http://localhost:5173`
2. Click **"Customer Portal"** button
3. Enter phone number: `0742844024` or `+255742844024`
4. Click **"Request OTP"**
5. Check SMS for 6-digit OTP code
6. Enter OTP code
7. Click **"Verify & Continue"**

**Expected Results:**
- ✅ OTP sent successfully (SMS received)
- ✅ Account auto-created if new customer
- ✅ Redirected to dashboard
- ✅ Dashboard shows customer information
- ✅ Loyalty points displayed (0 for new customers)
- ✅ Empty states for sessions, payments, transactions

---

### Scenario 2: Existing Customer Login

**Steps:**
1. Open browser: `http://localhost:5173`
2. Click **"Customer Portal"**
3. Enter phone number: `0742844024`
4. Request and verify OTP
5. View dashboard

**Expected Results:**
- ✅ Login successful
- ✅ Dashboard shows historical data:
  - GG Points (if any)
  - Loyalty Tier
  - Active Sessions (if any)
  - Recent Payments
  - Recent Transactions
  - Voucher & Rewards

---

### Scenario 3: Dashboard Features

**After Login, Test:**

1. **Loyalty Points Display**
   - Verify GG Points are shown
   - Check loyalty tier (Bronze/Silver/Gold/Platinum/Diamond)
   - Verify lifetime spend

2. **Active Sessions**
   - Check if active hotspot sessions are displayed
   - Verify session details (IP, uptime, status)

3. **Recent Payments**
   - Verify payment history is shown
   - Check payment amounts and status

4. **Recent Transactions**
   - Verify transaction history
   - Check transaction types and amounts

5. **Analytics Cards**
   - Data Usage card
   - Router Uptime card
   - Session Quality card

6. **Refresh Button**
   - Click refresh button
   - Verify data updates

7. **Logout**
   - Click logout button
   - Verify redirected to login
   - Verify session cleared

---

### Scenario 4: Token Refresh (Automatic)

**Steps:**
1. Login successfully
2. Wait 15 minutes (or check browser console)
3. Make an API call (refresh dashboard)
4. Verify token refreshed automatically
5. No interruption to user experience

**Expected Results:**
- ✅ Token refreshes silently in background
- ✅ No logout or error messages
- ✅ API calls continue to work

---

### Scenario 5: Error Handling

**Test Invalid OTP:**
1. Request OTP
2. Enter wrong OTP code (e.g., `000000`)
3. Click verify

**Expected:**
- ✅ Error message displayed
- ✅ Can retry or resend OTP

**Test Rate Limiting:**
1. Request OTP 4 times within 10 minutes
2. 4th request should fail

**Expected:**
- ✅ Rate limit error message
- ✅ Wait 10 minutes before next request

---

### Scenario 6: Network Reconnection

**Steps:**
1. Login successfully
2. Disable network (airplane mode)
3. Try to refresh dashboard
4. Re-enable network
5. Verify reconnection

**Expected:**
- ✅ Error handling for network loss
- ✅ Automatic reconnection when network restored
- ✅ Data refreshes after reconnection

---

## Testing Checklist

### Customer Portal - OTP Login
- [ ] Landing page displays correctly
- [ ] Customer Portal button works
- [ ] Phone number input accepts valid format
- [ ] OTP request sends SMS
- [ ] OTP verification works
- [ ] New customer account creation
- [ ] Existing customer login
- [ ] Error messages display correctly
- [ ] Resend OTP works (after countdown)

### Customer Dashboard
- [ ] Customer information displays
- [ ] GG Points shown correctly
- [ ] Loyalty tier displayed
- [ ] Active sessions list (if any)
- [ ] Recent payments table
- [ ] Recent transactions table
- [ ] Voucher & Rewards section
- [ ] Analytics cards display
- [ ] Refresh button works
- [ ] Logout works
- [ ] Empty states show correctly (for new customers)

### Token Management
- [ ] Token stored in localStorage
- [ ] Refresh token stored
- [ ] Automatic token refresh (after 15 min)
- [ ] Token refresh on API failure (401)
- [ ] Logout on max refresh failures

### Responsive Design
- [ ] Mobile view (375px width)
- [ ] Tablet view (768px width)
- [ ] Desktop view (1024px+ width)
- [ ] All elements visible and clickable
- [ ] No horizontal scrolling

---

## API Testing with Postman

### Import Collection
1. Open Postman
2. Import `GG-WIFI_API.postman_collection.json`
3. Set collection variables:
   - `baseUrl`: `http://localhost:8080/api/v1`
   - `phoneNumber`: `+255742844024`

### Test Endpoints

**1. Request OTP**
```
POST {{baseUrl}}/customer-auth/request-otp
Body: { "phoneNumber": "{{phoneNumber}}" }
```

**2. Verify OTP**
```
POST {{baseUrl}}/customer-auth/verify-otp
Body: {
  "phoneNumber": "{{phoneNumber}}",
  "otpCode": "123456",
  "deviceFingerprint": "test-fp"
}
```

**3. Get Dashboard**
```
GET {{baseUrl}}/customer-portal/customer/{{phoneNumber}}/dashboard
Headers: Authorization: Bearer {{authToken}}
```

**4. Get Loyalty Status**
```
GET {{baseUrl}}/loyalty/progress/{{phoneNumber}}
Headers: Authorization: Bearer {{authToken}}
```

---

## Browser Console Checks

Open browser DevTools (F12) and check:

1. **Network Tab**
   - API calls succeed (200 status)
   - No CORS errors
   - Token included in Authorization header

2. **Console Tab**
   - No JavaScript errors
   - Token refresh logs (if enabled)
   - API call logs

3. **Application Tab**
   - `authToken` in localStorage
   - `customerRefreshToken` in localStorage
   - `customerSession` in localStorage

---

## Common Issues & Solutions

### Issue: OTP not received
**Solution:**
- Check SMS service configuration in backend
- Verify phone number format (+255...)
- Check backend logs for SMS errors
- Verify SMS API credentials

### Issue: Token expired
**Solution:**
- Token expires after 24 hours
- Use refresh token to get new token
- Re-login if refresh token expired

### Issue: Dashboard not loading
**Solution:**
- Check backend is running
- Verify API endpoints are accessible
- Check browser console for errors
- Verify customer exists in database

### Issue: CORS errors
**Solution:**
- Check backend CORS configuration
- Verify frontend URL in allowed origins
- Check browser console for specific CORS error

---

## Performance Benchmarks

Expected response times:
- OTP Request: < 2 seconds
- OTP Verify: < 1 second
- Dashboard Load: < 1.5 seconds
- Loyalty Status: < 1 second
- Token Refresh: < 500ms

---

## Next Steps After Manual Testing

1. ✅ Document any bugs found
2. ✅ Test on different browsers (Chrome, Firefox, Safari)
3. ✅ Test on mobile devices
4. ✅ Verify all edge cases
5. ✅ Test with multiple phone numbers
6. ✅ Load testing (if needed)

---

## Test Data

**Test Phone Number**: `0742844024` / `+255742844024`

**Expected Test Results:**
- New customer: 0 points, Bronze tier
- After purchase: Points earned based on package
- Tier upgrade: When points threshold reached

---

## Support

If you encounter issues:
1. Check backend logs: `backend/logs/application.log`
2. Check browser console for errors
3. Verify all services are running
4. Check database for customer data
5. Review API documentation: `API_DOCUMENTATION.md`






