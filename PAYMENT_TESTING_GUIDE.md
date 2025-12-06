# Payment Callback Testing Guide

## Quick Start

### 1. Verify Backend is Running
```bash
# Check if backend is running
curl http://localhost:8080/api/v1/customer-portal/test

# Expected response:
# {"status":"success","message":"Customer Portal Controller is working!","timestamp":...}
```

### 2. Test Payment Status Endpoint
```bash
# Test with a sample order ID
curl http://localhost:8080/api/v1/customer-portal/payment/status/PKG_1234567890_1234_1

# Expected response for non-existent payment:
# {"status":"success","payment_status":"PENDING","message":"Payment is still being processed..."}
```

### 3. Test Webhook Handler
```bash
# Test successful payment webhook
curl -X POST http://localhost:8080/api/v1/customer-portal/webhook/zenopay \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "PKG_1234567890_1234_1",
    "payment_status": "SUCCESS",
    "amount": "5000",
    "msisdn": "+255773404760",
    "transid": "TXN123456",
    "package_id": "1"
  }'

# Test failed payment webhook
curl -X POST http://localhost:8080/api/v1/customer-portal/webhook/zenopay \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "PKG_1234567890_1234_1",
    "payment_status": "INSUFFICIENT_BALANCE",
    "amount": "5000",
    "msisdn": "+255773404760",
    "transid": "TXN123456"
  }'
```

## Frontend Testing

### 1. Start Frontend
```bash
cd Frontend/customer_portal
npm run dev
```

### 2. Test Payment Flow
1. Navigate to http://localhost:3001
2. Click "Buy Packages"
3. Select a package
4. Fill in customer details
5. Click "Proceed to Payment"
6. Monitor browser console for payment status updates
7. Check Network tab for polling requests

### 3. Test Different Scenarios

#### Successful Payment:
- Complete payment on phone
- Verify voucher code is displayed
- Check SMS is received

#### Insufficient Balance:
- Use phone with insufficient balance
- Verify error message appears
- Check suggestions are shown

#### Invalid PIN:
- Enter wrong PIN multiple times
- Verify error message appears
- Check PIN help is shown

#### Payment Cancellation:
- Cancel payment on phone
- Verify cancellation message appears
- Check retry option is available

#### Payment Timeout:
- Wait for payment to timeout
- Verify timeout message appears
- Check network troubleshooting suggestions

## Monitoring

### Backend Logs
```bash
# Watch backend logs
tail -f backend-dev.log | grep -E "(payment|webhook|Payment|voucher)"
```

### Key Log Messages to Look For:
- `🔔 Received ZenoPay webhook:` - Webhook received
- `✅ Processing webhook for order:` - Webhook processing
- `🎉 Payment successful!` - Payment success
- `❌ Payment failed!` - Payment failure
- `🎫 Generated voucher code:` - Voucher created
- `📱 SMS Result:` - SMS sending result

### Frontend Console
- `🔄 Starting payment status polling` - Polling started
- `📊 Payment status update:` - Status update received
- `✅ Payment polling completed` - Polling finished

## Troubleshooting

### Payment Status Not Updating:
1. Check backend logs for webhook receipt
2. Verify webhook URL is correct in ZenoPay config
3. Check database for payment record
4. Verify payment status endpoint is accessible

### Voucher Not Generated:
1. Check backend logs for voucher generation
2. Verify package ID is correct
3. Check voucher repository for created voucher
4. Verify order ID matches between payment and voucher

### Frontend Not Polling:
1. Check browser console for errors
2. Verify API endpoint is correct
3. Check network tab for failed requests
4. Verify order ID is set correctly

## Production Checklist

- [ ] Webhook URL configured in ZenoPay dashboard
- [ ] Webhook URL is publicly accessible
- [ ] Payment status endpoint is accessible
- [ ] Database connection is stable
- [ ] SMS service is configured
- [ ] Error logging is enabled
- [ ] Monitoring is set up

