# Payment Testing - Next Steps

## ✅ Payment System Fixes Complete

All payment system fixes have been applied and committed:
- ✅ Backend payment entity (nullable invoice/customer for PENDING)
- ✅ Webhook handler (all payment statuses supported)
- ✅ Payment status endpoint (all status codes handled)
- ✅ Frontend validation (location requirement removed)
- ✅ Frontend status mapping (all status codes supported)
- ✅ API service (cleaned up payment request)

## 🧪 Testing Options

### Option 1: Manual Backend Testing (Recommended)

**Step 1: Start Backend**
```bash
cd backend
mvn spring-boot:run
```

Wait for: `Started GgnetworksBackendApplication in X.XXX seconds`

**Step 2: Test Backend Endpoints**
```bash
# In another terminal
cd /home/medalius/Desktop/PROJECT\ 3./GG-WIFI\ WEB-APP
./test-payment-backend.sh
```

**Step 3: Verify Results**
- Check that payment initialization creates PENDING record
- Check that webhook handler processes SUCCESS correctly
- Check that payment status endpoint returns correct status
- Check database for payment, voucher, customer, invoice records

### Option 2: Frontend-Backend Integration Testing

**Step 1: Start Backend**
```bash
cd backend
mvn spring-boot:run
```

**Step 2: Start Frontend**
```bash
cd Frontend/customer_portal
npm run dev
```

**Step 3: Test Payment Flow**
1. Navigate to `http://localhost:3001`
2. Click "Packages" or "Buy Package"
3. Select a package
4. Fill customer details:
   - Full Name: Test User
   - Phone Number: +255773404760
5. Click "Proceed to Payment"
6. Verify payment initiation (check browser console)
7. Simulate webhook (use curl command below)
8. Verify frontend receives status update
9. Verify voucher code displayed

**Step 4: Simulate Webhook (for testing)**
```bash
# Get order_id from browser console or payment response
ORDER_ID="PKG_1234567890_4760_1"

curl -X POST http://localhost:8080/api/v1/customer-portal/webhook/zenopay \
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

### Option 3: Use Production Backend

If backend is deployed at `139.84.241.182:8080`:

**Step 1: Update Frontend Environment**
```bash
cd Frontend/customer_portal
echo "VITE_API_URL=http://139.84.241.182:8080/api/v1" > .env.local
```

**Step 2: Start Frontend**
```bash
npm run dev
```

**Step 3: Test Payment Flow**
- Same as Option 2, but using production backend
- Note: Webhooks will come from ZenoPay automatically

## 📋 Testing Checklist

### Backend Testing
- [ ] Payment initialization creates PENDING record
- [ ] Payment status endpoint returns correct status
- [ ] Webhook handler processes SUCCESS correctly
- [ ] Webhook handler processes FAILED correctly
- [ ] Webhook handler processes PENDING correctly
- [ ] Voucher generated on successful payment
- [ ] Customer created on successful payment
- [ ] Invoice created on successful payment
- [ ] RADIUS user created on successful payment
- [ ] Loyalty points awarded on successful payment
- [ ] SMS sent on successful payment

### Frontend Testing
- [ ] Payment form validation works
- [ ] Payment initiation succeeds
- [ ] Payment status polling works
- [ ] Frontend displays voucher code on success
- [ ] Frontend displays error on failure
- [ ] Frontend handles timeout correctly
- [ ] All payment status codes handled

### Integration Testing
- [ ] Complete payment flow works end-to-end
- [ ] Webhook updates payment status correctly
- [ ] Frontend receives status updates
- [ ] Voucher code displayed to user
- [ ] Error messages displayed correctly

## 🔍 Debugging

### Check Backend Logs
```bash
# If backend started with mvn spring-boot:run
# Logs will be in the terminal

# If backend is running as service
sudo journalctl -u ggnetworks-backend -f
```

### Check Database
```sql
-- Check payment record
SELECT * FROM payments WHERE payment_id = 'PKG_...' ORDER BY created_at DESC;

-- Check voucher record
SELECT * FROM vouchers WHERE order_id = 'PKG_...';

-- Check customer record
SELECT * FROM customers WHERE primary_phone_number = '+255773404760';
```

### Check Frontend Console
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls
- Verify API responses

## 🚀 Quick Test Commands

### Test Payment Initialization
```bash
curl -X POST http://localhost:8080/api/v1/customer-portal/payment \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "phoneNumber": "+255773404760",
    "packageId": "1",
    "amount": "5000"
  }'
```

### Test Payment Status
```bash
curl -X GET http://localhost:8080/api/v1/customer-portal/payment/status/PKG_1234567890_4760_1
```

### Test Webhook (SUCCESS)
```bash
curl -X POST http://localhost:8080/api/v1/customer-portal/webhook/zenopay \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "PKG_1234567890_4760_1",
    "payment_status": "SUCCESS",
    "amount": "5000",
    "msisdn": "+255773404760",
    "transid": "TXN123456",
    "payment_reference": "ZP_REF_123",
    "package_id": "1",
    "customer_name": "Test User"
  }'
```

## 📝 Notes

- Backend startup may take 30-60 seconds (database connection, Spring Boot initialization)
- Payment status polling runs every 2 seconds for up to 3 minutes
- Webhook URL must be publicly accessible for ZenoPay to send callbacks
- For local testing, use ngrok or similar to expose webhook endpoint

## 🎯 Success Criteria

Payment system is working correctly when:
1. ✅ Payment initialization creates PENDING record
2. ✅ Webhook updates payment to COMPLETED
3. ✅ Voucher is generated and displayed
4. ✅ Customer receives SMS with voucher code
5. ✅ Frontend shows success message with voucher code
6. ✅ All payment statuses are handled correctly

