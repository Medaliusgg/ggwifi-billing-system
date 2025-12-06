# 🧪 Testing from Cloudflare Pages Deployment

## ✅ Ready to Test!

Your customer portal is deployed at: **https://hotspot.ggwifi.co.tz**

---

## 📋 Pre-Testing Checklist

### ✅ Frontend (Cloudflare Pages)
- ✅ Deployed and accessible
- ✅ Domain: `hotspot.ggwifi.co.tz`
- ✅ Backend API configured: `http://139.84.241.182:8080/api/v1`

### ⚠️ Backend Requirements

**Before testing, ensure:**

1. **Backend is running** on `http://139.84.241.182:8080`
2. **Database migration applied** - Run the SQL migration:
   ```sql
   -- File: backend/src/main/resources/db/migration/V999__create_webhook_processing_table.sql
   ```
3. **Security improvements deployed** - Latest code with:
   - Idempotency checks
   - Rate limiting
   - Webhook audit logging

---

## 🧪 How to Test

### Step 1: Access the Portal
1. Open browser: **https://hotspot.ggwifi.co.tz**
2. Navigate to "Buy Package" section
3. Select a package

### Step 2: Initiate Payment
1. Fill in:
   - **Full Name**: Your name
   - **Phone Number**: `0658823944` (or your test number)
2. Click "Proceed to Payment"
3. You'll see: "Payment initiated. Please complete on your phone."

### Step 3: Complete Payment on Phone
- You'll receive USSD prompt on your phone
- **Test Scenarios:**

#### ✅ SUCCESS Scenario
- Enter **correct PIN**
- Wait 30-120 seconds
- Expected: Payment completes, voucher displayed

#### 💳 INSUFFICIENT_BALANCE Scenario
- Use phone with **low balance**
- Enter PIN
- Expected: Error message "Insufficient balance. Please top up your mobile money account."

#### 🔐 WRONG_PIN Scenario
- Enter **incorrect PIN** 3 times
- Expected: Error message "Invalid PIN. Please try again with the correct PIN."

#### ⏰ TIMEOUT Scenario
- **Don't enter PIN**, wait 90 seconds
- Expected: 
  - 60s: Warning message appears
  - 90s: Timeout message
  - Status: TIMEOUT

---

## 📊 What to Monitor

### Frontend (Browser Console)
- Payment status updates
- Error messages
- Timeout warnings
- Voucher code display

### Backend Logs
```bash
# Watch backend logs for:
- Webhook received
- Idempotency check
- Rate limiting
- Payment processing
- Voucher generation
```

### Database
```sql
-- Check webhook processing audit log
SELECT * FROM webhook_processing ORDER BY processed_at DESC LIMIT 10;

-- Check payment status
SELECT payment_id, status, amount, created_at 
FROM payments 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🔍 Testing Different Scenarios

### Scenario 1: Successful Payment
1. Go to portal
2. Select package
3. Enter details (phone: 0658823944)
4. Click "Proceed to Payment"
5. **Enter correct PIN** on phone
6. Wait for webhook (30-120s)
7. ✅ Should see voucher code

### Scenario 2: Insufficient Balance
1. Use phone with **low balance** (< package amount)
2. Initiate payment
3. Enter PIN
4. ❌ Should see: "Insufficient balance" error

### Scenario 3: Wrong PIN
1. Initiate payment
2. Enter **wrong PIN** 3 times
3. ❌ Should see: "Invalid PIN" error

### Scenario 4: Timeout
1. Initiate payment
2. **Don't enter PIN**
3. Wait 60s → Warning appears
4. Wait 90s → Timeout message
5. ⏰ Status: TIMEOUT

---

## 🐛 Troubleshooting

### Issue: Payment stuck on "Processing..."
**Solution:**
- Check backend is running
- Check webhook endpoint is accessible
- Check browser console for errors
- Verify CORS is configured

### Issue: No webhook received
**Solution:**
- Check ZenoPay webhook URL is correct
- Check backend logs for webhook attempts
- Verify network connectivity
- Check firewall rules

### Issue: Database errors
**Solution:**
- Run migration: `V999__create_webhook_processing_table.sql`
- Check database connection
- Verify table exists: `SHOW TABLES LIKE 'webhook_processing';`

### Issue: Rate limiting errors
**Solution:**
- Wait 1 minute (20 requests/minute limit)
- Check IP address in logs
- Verify rate limiting is working correctly

---

## 📈 Expected Behavior

### Payment Flow Timeline

```
0s    → Payment initiated
       → Status: PENDING
       → Frontend starts polling

30s   → Info message: "If you've entered PIN, processing..."

60s   → Warning: "Payment taking longer than expected"

90s   → Timeout warning: "Payment timeout approaching"
       → Frontend stops polling

30-120s → Webhook arrives (if payment completed)
       → Status: COMPLETED or FAILED
       → Voucher generated (if success)
```

### Status Messages

| Status | Message | Action |
|--------|---------|--------|
| PENDING | "Payment is still being processed..." | Wait |
| COMPLETED | "Payment completed. Voucher generated." | Show voucher |
| FAILED | "Payment failed. [reason]" | Show error |
| TIMEOUT | "Payment timed out. Please try again." | Retry option |

---

## ✅ Success Criteria

### Payment Success
- ✅ Payment status changes to COMPLETED
- ✅ Voucher code displayed
- ✅ SMS sent (if configured)
- ✅ Webhook processed successfully
- ✅ Audit log entry created

### Payment Failure
- ✅ Clear error message displayed
- ✅ Status changes to FAILED
- ✅ Reason provided (insufficient balance, wrong PIN, etc.)
- ✅ Webhook processed and logged
- ✅ No voucher generated

### Timeout
- ✅ Warning at 60 seconds
- ✅ Timeout at 90 seconds
- ✅ Frontend stops polling
- ✅ Clear timeout message
- ✅ Option to retry

---

## 🚀 Ready to Test!

**Go to:** https://hotspot.ggwifi.co.tz

**Test Phone:** 0658823944 (or your test number)

**Start Testing:** Select a package and proceed to payment!

---

*Last Updated: 2025-12-06*  
*Frontend: Cloudflare Pages*  
*Backend: http://139.84.241.182:8080*

