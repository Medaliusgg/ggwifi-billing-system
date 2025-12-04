# GG-WIFI Testing Guide

## Quick Start

### 1. Import Postman Collection
1. Open Postman
2. Click **Import** button
3. Select `GG-WIFI_API.postman_collection.json`
4. Collection will be imported with all endpoints pre-configured

### 2. Set Environment Variables
In Postman, set the following collection variables:
- `baseUrl`: `http://localhost:8080/api/v1` (or your production URL)
- `phoneNumber`: Your test phone number (e.g., `+255712345678`)
- `authToken`: Will be auto-set after OTP verification
- `refreshToken`: Will be auto-set after OTP verification

### 3. Test Customer Authentication Flow

#### Step 1: Request OTP
1. Run **"Request OTP"** request
2. Check your SMS for the 6-digit OTP code
3. Note: OTP expires in 2 minutes

#### Step 2: Verify OTP
1. Run **"Verify OTP"** request
2. Update `otpCode` in request body with the code from SMS
3. On success, `authToken` and `refreshToken` are automatically saved
4. You can now use authenticated endpoints

#### Step 3: Test Authenticated Endpoints
- **Get Customer Dashboard**: Should return customer data
- **Get Customer Profile**: Should return profile info
- **Get Loyalty Status**: Should return points and tier

### 4. Test Admin Loyalty Endpoints

**Note**: Admin endpoints require admin-level JWT token.

1. Login as admin through the admin portal
2. Copy the admin JWT token
3. Set `authToken` collection variable to admin token
4. Test admin endpoints:
   - Get Customer Snapshot
   - Get All Rewards
   - Create/Update/Delete Rewards
   - Manage Inventory
   - Approve/Reject Redemptions

---

## Manual Testing with cURL

### Request OTP
```bash
curl -X POST http://localhost:8080/api/v1/customer-auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+255712345678"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:8080/api/v1/customer-auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+255712345678",
    "otpCode": "123456",
    "deviceFingerprint": "test-fp-123"
  }'
```

### Get Dashboard (with token)
```bash
curl -X GET http://localhost:8080/api/v1/customer-portal/customer/+255712345678/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing Scenarios

### Scenario 1: New Customer Signup Flow
1. Request OTP with new phone number
2. Verify OTP (account auto-created)
3. Check dashboard shows empty state
4. Verify loyalty status shows 0 points

### Scenario 2: Existing Customer Login
1. Request OTP with existing phone number
2. Verify OTP
3. Check dashboard shows historical data
4. Verify loyalty points and tier are displayed

### Scenario 3: Token Refresh
1. Login successfully
2. Wait 15 minutes (or manually trigger refresh)
3. Token should auto-refresh
4. API calls should continue working

### Scenario 4: Rate Limiting
1. Request OTP 4 times within 10 minutes
2. 4th request should fail with rate limit error
3. Wait 10 minutes
4. Request should succeed again

### Scenario 5: Invalid OTP
1. Request OTP
2. Verify with wrong OTP code
3. Should receive error message
4. Try 3 times - account should lock after max attempts

---

## Expected Behaviors

### OTP Endpoints
- ✅ OTP sent via SMS within 5 seconds
- ✅ OTP expires after 2 minutes
- ✅ Maximum 3 OTP requests per 10 minutes
- ✅ Account locks after 5 failed login attempts

### Dashboard Endpoints
- ✅ Returns customer info, sessions, payments, transactions
- ✅ Empty states for new customers
- ✅ Real-time data for existing customers
- ✅ Auto-refreshes every 30 seconds

### Loyalty Endpoints
- ✅ Points calculated correctly based on package purchases
- ✅ Tier upgrades when points threshold reached
- ✅ Redemptions tracked and status updated
- ✅ Inventory decreases when rewards redeemed

---

## Common Issues & Solutions

### Issue: "OTP not received"
**Solution**: 
- Check SMS service configuration
- Verify phone number format (+255...)
- Check backend logs for SMS service errors

### Issue: "Invalid token"
**Solution**:
- Token may have expired (24 hours)
- Use refresh token to get new access token
- Re-login if refresh token expired

### Issue: "Rate limit exceeded"
**Solution**:
- Wait 10 minutes before next OTP request
- Use different phone number for testing
- Check backend rate limiting configuration

### Issue: "Customer not found"
**Solution**:
- Ensure customer exists in database
- Verify phone number format matches database
- Check customer status is ACTIVE

---

## Performance Benchmarks

Expected response times:
- OTP Request: < 2 seconds
- OTP Verify: < 1 second
- Dashboard Load: < 1.5 seconds
- Loyalty Status: < 1 second
- Admin Operations: < 2 seconds

---

## Next Steps

After manual testing:
1. ✅ Run E2E tests (Playwright/Cypress)
2. ✅ Run unit tests (Jest)
3. ✅ Load testing (if needed)
4. ✅ Security testing (penetration testing)
