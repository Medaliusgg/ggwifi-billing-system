# 🚀 Deploy ZenoPay Webhook Fixes - Step by Step

## ✅ What Was Fixed

1. **Webhook Authentication**: Added `x-api-key` header verification
2. **Order Status Check**: Fixed to use GET instead of POST
3. **Response Parsing**: Updated to match ZenoPay API format

---

## 📋 Deployment Steps

### Step 1: Build Backend

```bash
cd backend
./mvnw clean package -DskipTests
```

### Step 2: Deploy to VPS

```bash
# SSH to VPS
ssh user@api.ggwifi.co.tz

# Navigate to project directory
cd /path/to/ggwifi-billing-system

# Pull latest code
git pull origin main

# Build backend
cd backend
./mvnw clean package -DskipTests

# Stop current backend
sudo systemctl stop ggwifi-backend

# Backup current JAR
cp target/ggnetworks-backend.jar target/ggnetworks-backend.jar.backup

# Copy new JAR
cp target/ggnetworks-backend.jar /opt/ggwifi/backend/

# Start backend
sudo systemctl start ggwifi-backend

# Check status
sudo systemctl status ggwifi-backend
```

### Step 3: Verify Deployment

```bash
# Check backend is running
curl https://api.ggwifi.co.tz/api/v1/customer-portal/packages

# Check webhook endpoint (should return 401 without API key)
curl -X POST https://api.ggwifi.co.tz/api/v1/customer-portal/webhook/zenopay \
  -H "Content-Type: application/json" \
  -d '{"order_id":"test"}'
# Expected: 401 Unauthorized

# Check webhook with invalid API key (should return 401)
curl -X POST https://api.ggwifi.co.tz/api/v1/customer-portal/webhook/zenopay \
  -H "Content-Type: application/json" \
  -H "x-api-key: invalid-key" \
  -d '{"order_id":"test"}'
# Expected: 401 Unauthorized
```

---

## 🧪 Testing Checklist

### Test 1: Webhook Authentication

- [ ] Webhook without API key → 401 Unauthorized
- [ ] Webhook with invalid API key → 401 Unauthorized
- [ ] Webhook with correct API key → 200 OK (if valid payload)

### Test 2: Payment Flow

- [ ] Initiate payment with phone: 0658823944
- [ ] Complete payment on phone
- [ ] Verify webhook is received (check backend logs)
- [ ] Verify webhook authentication passes
- [ ] Verify database is updated
- [ ] Verify frontend detects status change
- [ ] Verify UI updates correctly

### Test 3: Insufficient Balance

- [ ] Initiate payment with insufficient balance account
- [ ] Enter PIN on phone
- [ ] Verify webhook with INSUFFICIENT_BALANCE status
- [ ] Verify frontend shows clear error message
- [ ] Verify UI is responsive

### Test 4: Order Status Check

- [ ] Test order status endpoint with GET method
- [ ] Verify response parsing works correctly
- [ ] Verify payment_status is extracted from data array

---

## 📊 Expected Results

### Backend Logs (Webhook Reception)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔔 ZENOPAY WEBHOOK RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 Timestamp: 2025-01-XX XX:XX:XX
🌐 Client IP: XXX.XXX.XXX.XXX
🔐 API Key Present: Yes
✅ Webhook authentication successful
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Database Verification

```sql
-- Check payment status
SELECT payment_id, status, confirmed_at, updated_at 
FROM payment 
WHERE payment_id = 'PKG_xxx';

-- Check webhook processing
SELECT webhook_id, order_id, payment_status, processed_at 
FROM webhook_processing 
WHERE order_id = 'PKG_xxx';
```

### Frontend Console

```
🔄 Polling attempt X/30 (Ys elapsed)
📊 Payment status update: COMPLETED
📊 Payment status update received: {status: 'COMPLETED', ...}
🛑 Stopping polling - payment successful after Ys
```

---

## 🐛 Troubleshooting

### Issue: Webhook returns 401

**Cause**: API key mismatch or missing
**Fix**: 
- Verify API key in backend config matches ZenoPay
- Check webhook is sending x-api-key header
- Verify API key in ZenoPayService matches

### Issue: Order status check fails

**Cause**: GET request not working or response format changed
**Fix**:
- Check ZenoPay API docs for current format
- Verify URL format: `GET /api/payments/order-status?order_id=xxx`
- Check response structure matches expected format

### Issue: Frontend not detecting status change

**Cause**: Polling not running or status mapping incorrect
**Fix**:
- Check frontend console for polling logs
- Verify status endpoint returns correct status
- Check status mapping in BuyPackage.jsx

---

## ✅ Success Criteria

- [ ] Webhook authentication works (rejects invalid keys)
- [ ] Webhook processing works (accepts valid keys)
- [ ] Database updates correctly
- [ ] Frontend detects status changes
- [ ] UI updates in real-time
- [ ] Payment flow works end-to-end
- [ ] Insufficient balance handled correctly

---

## 📝 Notes

- **Security**: Webhook authentication is now REQUIRED
- **API Compliance**: Order status check now matches ZenoPay API docs
- **Response Format**: Updated to handle ZenoPay response structure
- **Testing**: Test with real phone number (0658823944) for accurate results

