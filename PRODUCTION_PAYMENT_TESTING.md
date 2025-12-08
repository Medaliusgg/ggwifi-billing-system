# Production Payment Testing Guide

## ✅ Setup Complete

Frontend is now configured to use production backend at `http://139.84.241.182:8080/api/v1`

## 🧪 Testing Payment Flow

### Step 1: Access Frontend
Open your browser and navigate to:
- **Local:** http://localhost:3001 (or http://localhost:5173)
- **Production:** https://hotspot.ggwifi.co.tz

### Step 2: Test Payment Flow

1. **Navigate to Packages Page**
   - Click "Packages" or "Buy Package" button
   - You should see available internet packages

2. **Select a Package**
   - Click on any package card
   - Verify package details are displayed

3. **Fill Customer Details**
   - **Full Name:** Test User (or your name)
   - **Phone Number:** +255773404760 (or your test number)
   - Click "Proceed to Payment"

4. **Payment Initiation**
   - Frontend will call: `POST /api/v1/customer-portal/payment`
   - Check browser console (F12) for:
     - ✅ Payment initiation success
     - ✅ Order ID received
     - ✅ Polling started

5. **Monitor Payment Status**
   - Frontend polls: `GET /api/v1/customer-portal/payment/status/{orderId}`
   - Check browser console for polling updates
   - Status should show: "PENDING" → "PROCESSING" → "COMPLETED" or "FAILED"

### Step 3: Simulate Payment (For Testing)

Since ZenoPay requires actual mobile money payment, you can simulate the webhook:

**Get Order ID from Browser Console:**
- Look for: `order_id: "PKG_..."`

**Simulate Successful Payment:**
```bash
ORDER_ID="PKG_1234567890_4760_1"  # Replace with actual order ID

curl -X POST http://139.84.241.182:8080/api/v1/customer-portal/webhook/zenopay \
  -H "Content-Type: application/json" \
  -d "{
    \"order_id\": \"$ORDER_ID\",
    \"payment_status\": \"SUCCESS\",
    \"amount\": \"5000\",
    \"msisdn\": \"+255773404760\",
    \"transid\": \"TXN123456\",
    \"payment_reference\": \"ZP_REF_123\",
    \"package_id\": \"1\",
    \"customer_name\": \"Test User\"
  }"
```

**Expected Result:**
- Frontend should detect payment completion
- Voucher code should be displayed
- Success message shown

### Step 4: Verify Results

**Check Browser Console:**
- ✅ Payment status updates
- ✅ Voucher code received
- ✅ Success message displayed

**Check Backend Logs (if accessible):**
- Payment record created
- Voucher generated
- Customer created
- SMS sent

## 🔍 Debugging

### Check Frontend Console (F12)
- **Console Tab:** Look for errors or payment status updates
- **Network Tab:** Monitor API calls to backend
- **Application Tab:** Check localStorage for any stored data

### Check API Responses
In browser Network tab, check:
- `POST /api/v1/customer-portal/payment` - Should return order_id
- `GET /api/v1/customer-portal/payment/status/{orderId}` - Should return status

### Common Issues

**Issue: CORS Error**
- **Solution:** Backend CORS should allow frontend origin
- Check: `CorsConfig.java` includes frontend URL

**Issue: Payment Status Not Updating**
- **Solution:** Check webhook is being sent/received
- Verify: Backend logs show webhook processing

**Issue: Voucher Not Displayed**
- **Solution:** Check webhook includes all required fields
- Verify: Voucher was generated in database

## 📋 Testing Checklist

- [ ] Frontend loads correctly
- [ ] Packages are displayed
- [ ] Package selection works
- [ ] Customer form validation works
- [ ] Payment initiation succeeds
- [ ] Order ID is received
- [ ] Payment status polling works
- [ ] Webhook updates payment status
- [ ] Voucher code is displayed
- [ ] Success message shown
- [ ] Error handling works (test with failed payment)

## 🎯 Success Criteria

Payment system is working correctly when:
1. ✅ Payment initiation creates PENDING record
2. ✅ Frontend polls payment status correctly
3. ✅ Webhook updates payment to COMPLETED
4. ✅ Voucher code is generated and displayed
5. ✅ Success message shown to user
6. ✅ All payment statuses handled correctly

## 📝 Notes

- **Production Backend:** http://139.84.241.182:8080/api/v1
- **Frontend URL:** http://localhost:3001 (or http://localhost:5173)
- **Webhook URL:** Must be publicly accessible for ZenoPay
- **Testing:** Use curl to simulate webhooks for testing

## 🚀 Next Steps After Testing

1. Verify all payment statuses work
2. Test error scenarios (failed payments)
3. Test timeout scenarios
4. Verify SMS delivery
5. Test voucher activation
6. Performance testing



