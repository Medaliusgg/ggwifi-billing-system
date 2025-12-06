# Payment System Testing Guide

## Overview
This guide provides comprehensive testing procedures for the payment system, covering backend endpoints, webhook handling, and frontend-backend integration.

## Payment Flow Architecture

```
1. Frontend → POST /api/v1/customer-portal/payment
   ↓
2. Backend creates PENDING payment record
   ↓
3. Backend calls ZenoPay API
   ↓
4. ZenoPay sends USSD push to customer
   ↓
5. Customer completes payment on phone
   ↓
6. ZenoPay sends webhook → POST /api/v1/customer-portal/webhook/zenopay
   ↓
7. Backend processes webhook:
   - Updates payment status (COMPLETED/FAILED)
   - Creates customer (if new)
   - Creates invoice
   - Generates voucher
   - Creates RADIUS user
   - Awards loyalty points
   - Sends SMS
   ↓
8. Frontend polls → GET /api/v1/customer-portal/payment/status/{orderId}
   ↓
9. Frontend displays result to user
```

## Backend Testing

### 1. Test Payment Initialization

```bash
# Test payment initiation
curl -X POST http://localhost:8080/api/v1/customer-portal/payment \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "phoneNumber": "+255773404760",
    "packageId": "1",
    "amount": "5000"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Payment initiated successfully. Please complete the payment on your phone.",
  "order_id": "PKG_1234567890_4760_1",
  "payment_reference": "ZP_REF_123"
}
```

**Verification:**
- Check database: `SELECT * FROM payments WHERE payment_id = 'PKG_...'`
- Status should be `PENDING`
- `invoice_id` and `customer_id` should be NULL (for PENDING payments)

### 2. Test Payment Status Endpoint

```bash
# Test payment status check
curl -X GET http://localhost:8080/api/v1/customer-portal/payment/status/PKG_1234567890_4760_1
```

**Expected Response (PENDING):**
```json
{
  "status": "success",
  "payment_status": "PENDING",
  "order_id": "PKG_1234567890_4760_1",
  "message": "Payment is still being processed. Please complete the payment on your phone.",
  "voucher_code": null,
  "voucher_generated": false
}
```

**Expected Response (COMPLETED):**
```json
{
  "status": "success",
  "payment_status": "COMPLETED",
  "order_id": "PKG_1234567890_4760_1",
  "message": "Payment completed successfully. Voucher generated.",
  "voucher_code": "ABC123",
  "voucher_generated": true,
  "payment_id": 123,
  "amount": 5000,
  "currency": "TZS"
}
```

### 3. Test Webhook Handler (SUCCESS)

```bash
# Test successful payment webhook
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

**Expected Response:**
```json
{
  "status": "success",
  "message": "Payment processed successfully. Voucher generated and SMS sent.",
  "voucher_code": "ABC123",
  "payment_id": 123,
  "customer_id": 456,
  "sms_status": "success",
  "radius_user_created": true,
  "loyalty_points_awarded": 50
}
```

**Verification:**
- Check database:
  - `payments` table: status = `COMPLETED`, invoice_id and customer_id set
  - `vouchers` table: new voucher created with order_id
  - `customers` table: customer created (if new)
  - `invoices` table: invoice created and linked

### 4. Test Webhook Handler (FAILED)

```bash
# Test failed payment webhook
curl -X POST http://localhost:8080/api/v1/customer-portal/webhook/zenopay \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "PKG_1234567890_4760_1",
    "payment_status": "INSUFFICIENT_BALANCE",
    "amount": "5000",
    "msisdn": "+255773404760",
    "transid": "TXN123456",
    "payment_reference": "ZP_REF_123"
  }'
```

**Expected Response:**
```json
{
  "status": "failed",
  "payment_status": "INSUFFICIENT_BALANCE",
  "message": "Insufficient balance. Please top up your mobile money account and try again.",
  "failure_reason": "Insufficient balance in mobile money account",
  "sms_status": "skipped",
  "user_created": false
}
```

**Verification:**
- Check database:
  - `payments` table: status = `FAILED`, failure_reason set
  - No voucher created
  - No customer created (if didn't exist)

### 5. Test Webhook Handler (PENDING)

```bash
# Test pending payment webhook
curl -X POST http://localhost:8080/api/v1/customer-portal/webhook/zenopay \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "PKG_1234567890_4760_1",
    "payment_status": "PENDING",
    "amount": "5000",
    "msisdn": "+255773404760",
    "transid": "TXN123456",
    "payment_reference": "ZP_REF_123"
  }'
```

**Expected Response:**
```json
{
  "status": "pending",
  "payment_status": "PENDING",
  "message": "Payment is still pending. Please complete the payment on your phone."
}
```

## Payment Status Codes

### Backend PaymentStatus Enum
- `PENDING` - Payment initiated, waiting for customer action
- `PROCESSING` - Payment being processed
- `SUCCESSFUL` - Payment successful (legacy)
- `COMPLETED` - Payment completed successfully
- `FAILED` - Payment failed
- `CANCELLED` - Payment cancelled by user
- `EXPIRED` - Payment expired
- `REFUNDED` - Payment refunded

### Webhook Payment Statuses (from ZenoPay)
- `SUCCESS` - Payment successful
- `COMPLETED` - Payment completed
- `FAILED` - Payment failed
- `CANCELLED` - Payment cancelled
- `PENDING` - Payment pending
- `INSUFFICIENT_BALANCE` - Insufficient balance
- `INVALID_PIN` - Invalid PIN entered
- `USER_CANCELLED` - User cancelled payment
- `EXPIRED` - Payment expired
- `TIMEOUT` - Payment timed out
- `NETWORK_ERROR` - Network error
- `ERROR` - General error

## Frontend-Backend Integration Testing

### 1. Test Complete Payment Flow

1. **Start Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd Frontend/customer_portal
   npm run dev
   ```

3. **Test Payment Flow:**
   - Navigate to packages page
   - Select a package
   - Fill customer details (name, phone)
   - Click "Proceed to Payment"
   - Verify payment initiation
   - Check browser console for polling logs
   - Simulate webhook (use curl command above)
   - Verify frontend receives status update
   - Verify voucher code displayed

### 2. Test Payment Status Polling

**Frontend Polling Configuration:**
- Interval: 2 seconds
- Max attempts: 90 (3 minutes)
- Immediate first poll: Yes

**Test Scenarios:**
1. **Successful Payment:**
   - Initiate payment
   - Send SUCCESS webhook
   - Verify frontend stops polling
   - Verify voucher code displayed

2. **Failed Payment:**
   - Initiate payment
   - Send FAILED webhook
   - Verify frontend stops polling
   - Verify error message displayed

3. **Timeout:**
   - Initiate payment
   - Don't send webhook
   - Wait 3 minutes
   - Verify frontend stops polling
   - Verify timeout message displayed

## Database Verification

### Check Payment Record
```sql
SELECT 
  id, payment_id, amount, currency, status, 
  invoice_id, customer_id, phone_number,
  created_at, processed_at, confirmed_at,
  failure_reason
FROM payments 
WHERE payment_id = 'PKG_...'
ORDER BY created_at DESC;
```

### Check Voucher Record
```sql
SELECT 
  id, voucher_code, package_id, order_id,
  customer_phone, status, usage_status,
  created_at, expires_at
FROM vouchers 
WHERE order_id = 'PKG_...';
```

### Check Customer Record
```sql
SELECT 
  id, customer_id, first_name, last_name,
  primary_phone_number, email, status
FROM customers 
WHERE primary_phone_number = '+255773404760';
```

### Check Invoice Record
```sql
SELECT 
  id, invoice_number, customer_id, package_id,
  amount, status, payment_method, payment_reference
FROM invoices 
WHERE payment_reference = 'PKG_...';
```

## Common Issues and Solutions

### Issue 1: Payment Status Not Updating
**Symptoms:** Frontend shows "processing" indefinitely
**Solutions:**
- Check webhook URL is accessible
- Verify webhook is being sent by ZenoPay
- Check backend logs for webhook receipt
- Verify payment record exists in database
- Check CORS configuration

### Issue 2: Voucher Not Generated
**Symptoms:** Payment successful but no voucher
**Solutions:**
- Check webhook includes all required fields
- Verify package_id is correct
- Check voucher generation service logs
- Verify voucher table has record

### Issue 3: Payment Record Not Created
**Symptoms:** Status endpoint returns "PENDING" but no record
**Solutions:**
- Check payment initialization logs
- Verify database connection
- Check for constraint violations (invoice_id, customer_id)
- Verify Payment entity nullable settings

### Issue 4: CORS Errors
**Symptoms:** Frontend can't call backend APIs
**Solutions:**
- Check CorsConfig.java allows frontend origin
- Verify CorsFilter.java is active
- Check WebMvcCorsConfig.java
- Verify SecurityConfig.java allows OPTIONS requests

## Testing Checklist

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
- [ ] Frontend polling works correctly
- [ ] Frontend displays voucher code on success
- [ ] Frontend displays error on failure
- [ ] Frontend handles timeout correctly
- [ ] All payment status codes handled
- [ ] Database constraints satisfied
- [ ] CORS configuration correct

## Next Steps

1. Test backend endpoints independently
2. Test webhook handling with various statuses
3. Test frontend-backend integration
4. Test complete payment flow end-to-end
5. Test error scenarios
6. Test timeout scenarios
7. Verify database integrity
8. Verify SMS delivery
9. Verify voucher activation
10. Performance testing
