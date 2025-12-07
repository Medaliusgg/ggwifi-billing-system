# 🧪 Payment Flow Test Instructions

## Test Phone Number: 0658823944

---

## ⚠️ IMPORTANT NOTES

1. **This is a REAL payment test** - It will charge your mobile money account
2. **Make sure you have sufficient balance** in your mobile money account
3. **Have your PIN ready** - You'll need to enter it on your phone
4. **Test during business hours** - ZenoPay may have processing delays

---

## 🧪 Test Methods

### Method 1: Using Test Script (Recommended)

```bash
# Make script executable (if not already)
chmod +x test-payment-real.sh

# Run the test
./test-payment-real.sh
```

**What it does**:
1. Initiates payment with phone number 0658823944
2. Waits for you to complete payment on your phone
3. Polls payment status every 2 seconds (then 500ms after 5s)
4. Shows results when payment completes or fails

### Method 2: Manual Testing via Frontend

1. **Open Customer Portal**: `https://hotspot.ggwifi.co.tz`
2. **Select a Package**: Choose any package
3. **Enter Details**:
   - Full Name: Test Customer
   - Phone Number: 0658823944
4. **Click "Proceed to Payment"**
5. **Watch for USSD Prompt**: Check your phone
6. **Enter PIN**: Complete payment on your phone
7. **Observe UI**: Should update within 2-5 seconds

### Method 3: Using cURL (Manual API Testing)

```bash
# Step 1: Initiate Payment
curl -X POST "https://api.ggwifi.co.tz/api/v1/customer-portal/payment" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "customerName": "Test Customer",
    "phoneNumber": "+255658823944",
    "packageId": "1",
    "amount": "1000",
    "currency": "TZS",
    "paymentMethod": "ZENOPAY"
  }'

# Response will include order_id, e.g.:
# {"status":"success","order_id":"PKG_1765055665321_3944_1",...}

# Step 2: Check Payment Status (replace ORDER_ID)
curl -X GET "https://api.ggwifi.co.tz/api/v1/customer-portal/payment/status/PKG_1765055665321_3944_1" \
  -H "Accept: application/json"

# Keep checking until status is COMPLETED or FAILED
```

---

## 📊 What to Monitor

### Backend Logs (VPS)
```bash
# SSH into VPS and watch logs
tail -f /path/to/logs/ggnetworks-backend.log

# Look for:
# - "🚀 Processing customer payment..."
# - "🔔 ZENOPAY WEBHOOK RECEIVED"
# - "✅ Processing webhook for order: PKG_xxx"
# - "🎉 Payment successful! Processing voucher creation..."
```

### Frontend Console (Browser)
```javascript
// Open browser DevTools (F12) and watch console
// Look for:
// - "🔄 Starting payment status polling"
// - "📊 Payment status update: PENDING"
// - "📊 Payment status update: COMPLETED"
// - "⚡ Payment likely in progress, increasing polling frequency"
```

### Network Tab (Browser)
- Watch for API calls to `/payment/status/{orderId}`
- Check response times
- Verify status changes from PENDING → COMPLETED

---

## ✅ Expected Flow

### Timeline:
1. **T+0s**: Payment initiated
2. **T+1-2s**: USSD prompt received on phone
3. **T+2-5s**: User enters PIN
4. **T+3-6s**: ZenoPay processes payment
5. **T+4-7s**: Webhook sent to backend
6. **T+4.1-7.5s**: Backend receives webhook
7. **T+4.2-7.8s**: Database updated
8. **T+5-9s**: Frontend polls and detects status
9. **T+5-9s**: UI updates to show success

### Expected Results:
- ✅ Payment status changes from PENDING → COMPLETED
- ✅ Voucher code generated and displayed
- ✅ UI shows "✅ Payment Completed!"
- ✅ SMS sent with voucher code (if SMS service configured)

---

## 🔍 Debugging

### If Payment Stays PENDING:
1. **Check phone**: Did you receive USSD prompt?
2. **Check PIN**: Did you enter correct PIN?
3. **Check balance**: Do you have sufficient balance?
4. **Check webhook**: Look for "🔔 ZENOPAY WEBHOOK RECEIVED" in backend logs
5. **Check database**: Query payment table for status

### If Webhook Not Received:
1. **Check webhook URL**: Verify it's `https://api.ggwifi.co.tz/api/v1/customer-portal/webhook/zenopay`
2. **Check ZenoPay dashboard**: See if webhook was sent
3. **Check VPS firewall**: Ensure port 8080/443 is open
4. **Check SSL**: Verify SSL certificate is valid

### If Frontend Not Updating:
1. **Check polling**: Console should show polling attempts
2. **Check API response**: Network tab should show status responses
3. **Check status mapping**: Verify COMPLETED status is handled
4. **Check UI state**: Verify `setPaymentStatus('success')` is called

---

## 📋 Test Checklist

- [ ] Payment initiated successfully
- [ ] USSD prompt received on phone
- [ ] PIN entered correctly
- [ ] Payment completed on phone
- [ ] Webhook received by backend (check logs)
- [ ] Database updated (check payment table)
- [ ] Frontend polling detects status change
- [ ] UI updates to show success
- [ ] Voucher code displayed
- [ ] SMS received (if configured)

---

## 🗄️ Database Verification

```sql
-- Check payment status
SELECT payment_id, status, confirmed_at, processed_at, amount
FROM payment
WHERE phone_number = '255658823944'
ORDER BY created_at DESC
LIMIT 1;

-- Check webhook processing
SELECT webhook_id, order_id, payment_status, processed_at
FROM webhook_processing
WHERE order_id LIKE 'PKG_%'
ORDER BY processed_at DESC
LIMIT 1;

-- Check voucher generated
SELECT voucher_code, order_id, status, created_at
FROM voucher
WHERE order_id LIKE 'PKG_%'
ORDER BY created_at DESC
LIMIT 1;
```

---

## 📞 Support

If payment fails or doesn't complete:
1. Check backend logs for errors
2. Check ZenoPay dashboard for transaction status
3. Verify webhook URL is accessible
4. Check database for payment record
5. Contact ZenoPay support if webhook not received

---

## ⚠️ Test Safely

- **Use small amounts** for testing (e.g., 1000 TZS)
- **Test during business hours** for faster processing
- **Have backup payment method** in case of issues
- **Monitor logs closely** to catch any errors
- **Test one payment at a time** to avoid confusion

