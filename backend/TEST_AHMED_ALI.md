# 🧪 Customer Portal API Testing - AHMED ALI

**Test Data:**
- **Name:** AHMED ALI
- **Phone:** 0742844024
- **Phone (Formatted):** +255742844024

---

## 📋 **PREREQUISITES**

1. **Backend must be running:**
   ```bash
   cd backend
   mvn spring-boot:run
   # OR if deployed:
   # Backend should be running on http://localhost:8080
   ```

2. **Database must be accessible:**
   - MySQL running
   - Database `ggnetworks_radius` exists
   - All migrations applied

3. **Redis (optional but recommended):**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

---

## 🚀 **RUNNING THE TESTS**

### **Option 1: Automated Test Script**

```bash
cd backend
./test-customer-portal-ahmed.sh
```

### **Option 2: Manual Testing**

Use the following curl commands or Postman:

---

## 📝 **TEST CASES**

### **1. Test Endpoint**
```bash
curl -X GET http://localhost:8080/api/v1/customer-portal/test
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Customer Portal Controller is working!",
  "timestamp": 1234567890
}
```

---

### **2. Get Available Packages**
```bash
curl -X GET http://localhost:8080/api/v1/customer-portal/packages
```

**Expected Response:**
```json
{
  "status": "success",
  "packages": [...],
  "count": 5
}
```

---

### **3. Process Payment**
```bash
curl -X POST http://localhost:8080/api/v1/customer-portal/payment \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "AHMED ALI",
    "phoneNumber": "+255742844024",
    "packageId": "1",
    "amount": "5000"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Payment initiated successfully...",
  "order_id": "PKG_1234567890_4024",
  "payment_reference": "..."
}
```

**Note:** Save the `order_id` for webhook testing.

---

### **4. Payment Webhook (SUCCESS)**
```bash
curl -X POST http://localhost:8080/api/v1/customer-portal/webhook/zenopay \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "PKG_1234567890_4024",
    "payment_status": "SUCCESS",
    "amount": "5000",
    "msisdn": "+255742844024",
    "transaction_id": "TXN_1234567890",
    "timestamp": "2025-01-27T12:00:00Z"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Payment processed successfully...",
  "voucher_code": "VCH123456",
  "payment_id": 123,
  "customer_id": 456,
  "sms_status": "success"
}
```

**Note:** 
- ✅ **SMS should be sent to 0742844024**
- ✅ **Voucher should be created**
- ✅ **Customer should be created (if doesn't exist)**
- ✅ **RADIUS user should be created**

**Save the `voucher_code` for subsequent tests.**

---

### **5. Validate Voucher**
```bash
curl -X GET http://localhost:8080/api/v1/customer-portal/voucher/VCH123456/validate
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Voucher is valid and ready to use",
  "data": {
    "voucherCode": "VCH123456",
    "status": "ACTIVE",
    "isUsed": false,
    "isActive": true,
    "package": {...}
  }
}
```

---

### **6. Activate Voucher**
```bash
curl -X POST http://localhost:8080/api/v1/customer-portal/voucher/VCH123456/activate \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+255742844024",
    "macAddress": "00:11:22:33:44:55",
    "ipAddress": "192.168.1.100",
    "deviceFingerprintHash": "abc123def456..."
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Voucher activated successfully...",
  "sessionId": 789,
  "sessionToken": "token_abc123...",
  "expiresAt": "2025-01-28T12:00:00",
  "remainingTimeSeconds": 86400,
  "heartbeatIntervalSeconds": 60
}
```

**Note:** Save the `sessionToken` for token reconnection test.

---

### **7. Get Session Status**
```bash
curl -X GET http://localhost:8080/api/v1/customer-portal/voucher/VCH123456/session/status
```

**Expected Response:**
```json
{
  "status": "success",
  "active": true,
  "connected": true,
  "expired": false,
  "remainingTimeSeconds": 86340,
  "elapsedTimeSeconds": 60,
  "sessionStatus": "ACTIVE",
  "macAddress": "00:11:22:33:44:55",
  "ipAddress": "192.168.1.100"
}
```

---

### **8. Record Heartbeat**
```bash
curl -X POST http://localhost:8080/api/v1/customer-portal/voucher/VCH123456/session/heartbeat \
  -H "Content-Type: application/json" \
  -d '{
    "macAddress": "00:11:22:33:44:55",
    "ipAddress": "192.168.1.100",
    "deviceFingerprintHash": "abc123def456..."
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Heartbeat recorded - session remains active"
}
```

---

### **9. Update MAC Address**
```bash
curl -X POST http://localhost:8080/api/v1/customer-portal/voucher/VCH123456/session/update-mac \
  -H "Content-Type: application/json" \
  -d '{
    "macAddress": "00:11:22:33:44:66"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "MAC address updated successfully"
}
```

---

### **10. Update IP Address**
```bash
curl -X POST http://localhost:8080/api/v1/customer-portal/voucher/VCH123456/session/update-ip \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "192.168.1.101"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "IP address updated successfully"
}
```

---

### **11. Reconnect Session**
```bash
curl -X POST http://localhost:8080/api/v1/customer-portal/voucher/VCH123456/session/reconnect \
  -H "Content-Type: application/json" \
  -d '{
    "macAddress": "00:11:22:33:44:66",
    "ipAddress": "192.168.1.101"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Session reconnected successfully...",
  "sessionToken": "token_abc123...",
  "persistentSession": true
}
```

---

### **12. Reconnect with Token**
```bash
curl -X POST http://localhost:8080/api/v1/customer-portal/session/reconnect-token \
  -H "Content-Type: application/json" \
  -d '{
    "sessionToken": "token_abc123...",
    "macAddress": "00:11:22:33:44:66",
    "ipAddress": "192.168.1.101",
    "deviceFingerprintHash": "abc123def456..."
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Session reconnected seamlessly using token..."
}
```

---

### **13. Get Customer Profile**
```bash
curl -X GET http://localhost:8080/api/v1/customer-portal/customer/+255742844024/profile
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Customer profile retrieved successfully",
  "data": {
    "phoneNumber": "+255742844024",
    "totalVouchers": 1,
    "usedVouchers": 0,
    "activeVouchers": 1,
    "vouchers": [...]
  }
}
```

---

### **14. Get Customer Dashboard**
```bash
curl -X GET http://localhost:8080/api/v1/customer-portal/customer/+255742844024/dashboard
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Dashboard retrieved successfully",
  "data": {
    "customer": {...},
    "totalVouchers": 1,
    "activeVouchers": 1,
    "totalPayments": 1,
    "successfulPayments": 1,
    "totalSpent": 5000,
    "recentVouchers": [...]
  }
}
```

---

### **15. Get Customer Usage History**
```bash
curl -X GET http://localhost:8080/api/v1/customer-portal/customer/+255742844024/usage
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Usage history retrieved successfully",
  "data": [...]
}
```

---

### **16. Get Customer Payment History**
```bash
curl -X GET http://localhost:8080/api/v1/customer-portal/customer/+255742844024/payments
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Payment history retrieved successfully",
  "data": [
    {
      "paymentId": 123,
      "amount": 5000,
      "status": "COMPLETED",
      "paymentMethod": "MOBILE_MONEY",
      "createdAt": "2025-01-27T12:00:00"
    }
  ]
}
```

---

### **17. Payment Webhook (FAILED)**
```bash
curl -X POST http://localhost:8080/api/v1/customer-portal/webhook/zenopay \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "PKG_FAILED_1234567890",
    "payment_status": "FAILED",
    "amount": "5000",
    "msisdn": "+255742844024",
    "transaction_id": "TXN_FAILED_1234567890",
    "timestamp": "2025-01-27T12:00:00Z"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Payment failure processed. SMS sent to customer (if customer exists)."
}
```

**Note:** 
- ✅ **SMS should be sent to 0742844024** (if customer exists)
- ✅ **No voucher should be created**
- ✅ **No customer should be created**

---

## 📱 **SMS VERIFICATION**

After running the tests, **check phone 0742844024** for:

1. **Payment Success SMS** (after successful payment webhook)
   - Should contain voucher code
   - Should contain package details
   - Should contain amount paid

2. **Payment Failure SMS** (after failed payment webhook)
   - Should notify about payment failure
   - Should encourage retry

3. **Voucher Notification SMS** (after successful payment)
   - Should contain voucher code
   - Should contain activation instructions

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] Backend is running
- [ ] Database is accessible
- [ ] All API endpoints respond correctly
- [ ] Payment processing works
- [ ] Voucher generation works
- [ ] Session management works
- [ ] Device fingerprinting works
- [ ] SMS notifications sent (check phone)
- [ ] Customer created in database
- [ ] RADIUS user created
- [ ] Session token stored correctly
- [ ] Heartbeat mechanism works
- [ ] Reconnection works

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Backend not responding (HTTP 000)**
```bash
# Check if backend is running
ps aux | grep java

# Start backend
cd backend
mvn spring-boot:run
```

### **Issue: Database connection error**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'ggnetworks_radius';"
```

### **Issue: SMS not sending**
- Check SMS service configuration in `application.yml`
- Verify NEXT SMS credentials
- Check SMS service logs

### **Issue: Voucher not created**
- Check payment webhook logs
- Verify voucher service is working
- Check database for voucher record

---

## 📊 **TEST RESULTS**

After running all tests, document results:

```
Date: 2025-01-27
Tester: [Your Name]
Environment: [Development/Staging/Production]

Test Results:
- Test Endpoint: [PASS/FAIL]
- Get Packages: [PASS/FAIL]
- Process Payment: [PASS/FAIL]
- Payment Webhook (Success): [PASS/FAIL]
- Validate Voucher: [PASS/FAIL]
- Activate Voucher: [PASS/FAIL]
- Session Status: [PASS/FAIL]
- Heartbeat: [PASS/FAIL]
- Update MAC: [PASS/FAIL]
- Update IP: [PASS/FAIL]
- Reconnect Session: [PASS/FAIL]
- Reconnect with Token: [PASS/FAIL]
- Customer Profile: [PASS/FAIL]
- Customer Dashboard: [PASS/FAIL]
- Customer Usage: [PASS/FAIL]
- Customer Payments: [PASS/FAIL]
- Payment Webhook (Failed): [PASS/FAIL]

SMS Verification:
- Payment Success SMS: [RECEIVED/NOT RECEIVED]
- Payment Failure SMS: [RECEIVED/NOT RECEIVED]
- Voucher Notification SMS: [RECEIVED/NOT RECEIVED]

Issues Found:
1. [Issue description]
2. [Issue description]
```

---

**Test Script:** `./test-customer-portal-ahmed.sh`  
**Test Data:** AHMED ALI, 0742844024  
**Status:** Ready for Testing

