# 🔍 Webhook Flow Debug - Complete Analysis

## 📋 Complete Flow: ZenoPay Webhook → Backend → Database → Frontend UI

---

## 1️⃣ **WEBHOOK RECEPTION (Backend)**

### Endpoint
```
POST /api/v1/customer-portal/webhook/zenopay
```

### Location
`backend/src/main/java/com/ggnetworks/controller/CustomerPortalController.java`
- Method: `handleZenoPayWebhook()`
- Line: 504-933

### Webhook Processing Steps

#### Step 1: Idempotency Check
```java
String webhookId = generateWebhookId(webhookData);
Optional<WebhookProcessing> existingWebhook = 
    webhookProcessingRepository.findByWebhookId(webhookId);
```
- **Purpose**: Prevent duplicate webhook processing
- **Storage**: `webhook_processing` table
- **If duplicate**: Returns already processed response

#### Step 2: Validation
```java
Map<String, Object> validationResult = validateWebhookData(webhookData);
```
- Validates: `order_id`, `payment_status`, `amount`, `msisdn`
- Rejects invalid webhooks

#### Step 3: Extract Data
```java
String orderId = (String) validationResult.get("order_id");
String paymentStatus = (String) validationResult.get("payment_status");
String amount = (String) validationResult.get("amount");
String phoneNumber = (String) validationResult.get("msisdn");
```

#### Step 4: Process Based on Status

**SUCCESS/COMPLETED/SUCCESSFUL:**
1. Extract package ID from `order_id` (format: `PKG_timestamp_phone_packageId`)
2. Get or create customer
3. Create invoice (status: PAID)
4. **Update/Create payment record:**
   ```java
   payment.setStatus(PaymentStatus.COMPLETED);
   payment.setConfirmedAt(LocalDateTime.now());
   payment.setProcessedAt(LocalDateTime.now());
   payment = paymentRepository.save(payment);
   ```
5. Generate voucher code
6. Create voucher entity
7. Send SMS with voucher code

**FAILED:**
1. Update payment record with FAILED status
2. Set failure reason
3. Send failure SMS

**PENDING:**
1. Update payment record with PENDING status

---

## 2️⃣ **DATABASE UPDATE**

### Payment Table Update
```java
// Location: CustomerPortalController.java, line 654-670
Payment payment = new Payment();
payment.setPaymentId(orderId);  // Links to order_id
payment.setStatus(PaymentStatus.COMPLETED);  // Status updated here
payment.setConfirmedAt(LocalDateTime.now());
payment.setProcessedAt(LocalDateTime.now());
payment = paymentRepository.save(payment);  // SAVED TO DATABASE
```

### Key Fields Updated:
- `status` → COMPLETED/FAILED/PENDING
- `confirmed_at` → Timestamp
- `processed_at` → Timestamp
- `gateway_transaction_id` → From webhook
- `gateway_reference` → From webhook

### Database Query (for status check)
```java
// Location: CustomerPortalController.java, line 384
Optional<Payment> paymentOpt = paymentRepository.findByPaymentId(orderId);
```
- **Query**: `SELECT * FROM payment WHERE payment_id = ?`
- **Returns**: Payment entity with updated status

---

## 3️⃣ **FRONTEND POLLING**

### API Endpoint (Frontend → Backend)
```
GET /api/v1/customer-portal/payment/status/{orderId}
```

### Frontend Service
**File**: `Frontend/customer_portal/src/services/apiService.js`
```javascript
async checkPaymentStatus(orderId) {
  const response = await this.makeRequest(
    `/customer-portal/payment/status/${orderId}`,
    { method: 'GET' }
  );
  return response;
}
```

### Polling Service
**File**: `Frontend/customer_portal/src/services/paymentService.js`
```javascript
async pollPaymentStatus(orderId, onStatusUpdate, maxAttempts = 30, interval = 2000) {
  // Polls every 2 seconds initially
  // After 5 seconds, switches to 500ms intervals
  const result = await this.checkPaymentStatus(orderId);
  const paymentStatus = result.payment_status || 'PENDING';
  onStatusUpdate({ status: paymentStatus, ... });
}
```

### Polling Strategy
1. **0-5 seconds**: Poll every 2 seconds
2. **After 5 seconds**: Poll every 500ms (aggressive)
3. **Max duration**: 60 seconds
4. **Stops when**: Status is COMPLETED, FAILED, or final state

---

## 4️⃣ **BACKEND STATUS ENDPOINT**

### Endpoint Handler
**File**: `backend/src/main/java/com/ggnetworks/controller/CustomerPortalController.java`
**Method**: `getPaymentStatus(@PathVariable String orderId)`
**Line**: 376-498

### Response Format
```json
{
  "status": "success",
  "payment_status": "COMPLETED",  // From database
  "order_id": "PKG_1234567890_3944_1",
  "voucher_code": "ABC123",
  "voucher_generated": true,
  "message": "Payment completed successfully. Voucher generated."
}
```

### Status Mapping
```java
// PaymentStatus enum → String
String statusString = paymentStatus.name();  // COMPLETED, FAILED, PENDING, etc.
response.put("payment_status", statusString);
```

---

## 5️⃣ **FRONTEND UI UPDATE**

### Status Callback
**File**: `Frontend/customer_portal/src/components/BuyPackage.jsx`
**Line**: 509-610

```javascript
const stopPolling = await paymentService.pollPaymentStatus(
  result.order_id,
  (statusData) => {
    // statusData.status = "COMPLETED" (from backend)
    const normalizedStatus = statusData.status.toUpperCase();
    
    // Update UI state
    if (normalizedStatus === 'COMPLETED' || normalizedStatus === 'SUCCESS') {
      setPaymentStatus('success');
      setActualPaymentStep('completed');
      setVoucherCode(statusData.voucherCode);
    } else if (normalizedStatus === 'FAILED') {
      setPaymentStatus('failed');
      setActualPaymentStep('failed');
    } else if (normalizedStatus === 'PENDING') {
      setPaymentStatus('processing');
      // Update step based on elapsed time
      if (elapsedTime >= 10) {
        setActualPaymentStep('pin_entered');
      } else if (elapsedTime >= 5) {
        setActualPaymentStep('ussd_received');
      }
    }
  }
);
```

### UI Step Updates
**File**: `Frontend/customer_portal/src/components/BuyPackage.jsx`
**Line**: 1665-1672, 1836-1849

```javascript
// Status Title
{actualPaymentStep === 'completed' && '✅ Payment Completed!'}
{actualPaymentStep === 'failed' && '❌ Payment Failed'}
{actualPaymentStep === 'processing' && '🔄 Payment Processing...'}

// Step Description
{actualPaymentStep === 'completed' && 'Payment completed successfully! Your voucher code has been generated.'}
{actualPaymentStep === 'failed' && paymentMessage}
```

---

## 6️⃣ **COMPLETE FLOW DIAGRAM**

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER ENTERS PIN ON PHONE                                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. ZENOPAY SENDS WEBHOOK                                        │
│    POST /api/v1/customer-portal/webhook/zenopay                 │
│    Body: { order_id, payment_status: "SUCCESS", ... }          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. BACKEND PROCESSES WEBHOOK                                    │
│    - Idempotency check                                          │
│    - Validate webhook data                                       │
│    - Extract order_id, payment_status, amount, phone             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. UPDATE DATABASE                                              │
│    Payment payment = paymentRepository.findByPaymentId(orderId) │
│    payment.setStatus(PaymentStatus.COMPLETED)                   │
│    payment.setConfirmedAt(now())                                │
│    paymentRepository.save(payment)  ← DATABASE UPDATED          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. FRONTEND POLLS STATUS (every 500ms after 5s)                  │
│    GET /api/v1/customer-portal/payment/status/{orderId}         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. BACKEND QUERIES DATABASE                                      │
│    Optional<Payment> payment =                                  │
│        paymentRepository.findByPaymentId(orderId)               │
│    Returns: Payment with status = COMPLETED                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. BACKEND RETURNS STATUS                                       │
│    {                                                             │
│      "payment_status": "COMPLETED",                             │
│      "voucher_code": "ABC123",                                  │
│      "message": "Payment completed successfully..."              │
│    }                                                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. FRONTEND RECEIVES STATUS UPDATE                              │
│    onStatusUpdate({ status: "COMPLETED", ... })                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. UI UPDATES IMMEDIATELY                                       │
│    setPaymentStatus('success')                                   │
│    setActualPaymentStep('completed')                             │
│    setVoucherCode('ABC123')                                      │
│    UI shows: "✅ Payment Completed!"                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7️⃣ **KEY CONNECTION POINTS**

### Webhook → Database
- **Webhook receives**: `order_id`, `payment_status`
- **Database updates**: `payment` table where `payment_id = order_id`
- **Status field**: `payment.status` = COMPLETED/FAILED/PENDING

### Database → Frontend
- **Frontend polls**: `GET /payment/status/{orderId}`
- **Backend queries**: `paymentRepository.findByPaymentId(orderId)`
- **Returns**: Payment entity with updated status

### Frontend → UI
- **Status callback**: `onStatusUpdate(statusData)`
- **UI state updates**: `setPaymentStatus()`, `setActualPaymentStep()`
- **UI renders**: Based on `actualPaymentStep` state

---

## 8️⃣ **TIMING ANALYSIS**

### Webhook Processing Time
- **Webhook received**: ~0-2 seconds after user enters PIN
- **Database update**: ~50-200ms (immediate)
- **Total backend processing**: ~200-500ms

### Frontend Detection Time
- **Polling interval (0-5s)**: 2 seconds
- **Polling interval (after 5s)**: 500ms
- **Detection time**: 500ms - 2 seconds after webhook processed

### Total Time to UI Update
- **Best case**: ~700ms (webhook + processing + 500ms poll)
- **Worst case**: ~2.5 seconds (webhook + processing + 2s poll)
- **Average**: ~1-1.5 seconds

---

## 9️⃣ **DEBUGGING CHECKLIST**

### Backend Webhook
- [ ] Check webhook endpoint is accessible: `/api/v1/customer-portal/webhook/zenopay`
- [ ] Verify webhook is received (check logs: "🔔 ZENOPAY WEBHOOK RECEIVED")
- [ ] Check idempotency (webhook_processing table)
- [ ] Verify payment status update in database
- [ ] Check payment record: `SELECT * FROM payment WHERE payment_id = ?`

### Frontend Polling
- [ ] Check polling starts: Console log "🔄 Starting payment status polling"
- [ ] Verify API calls: Network tab shows GET `/payment/status/{orderId}`
- [ ] Check status updates: Console log "📊 Payment status update: COMPLETED"
- [ ] Verify callback fires: Console log "📊 Payment status update received"

### UI Updates
- [ ] Check state updates: `setPaymentStatus('success')`
- [ ] Verify step updates: `setActualPaymentStep('completed')`
- [ ] Check UI renders: Status title changes to "✅ Payment Completed!"
- [ ] Verify voucher code: `setVoucherCode()` updates

---

## 🔟 **COMMON ISSUES & FIXES**

### Issue 1: Webhook Not Received
**Symptoms**: Payment completes but status stays PENDING
**Debug**:
- Check webhook URL in ZenoPay dashboard
- Verify webhook endpoint is accessible
- Check backend logs for webhook reception
- Verify CORS allows webhook requests

### Issue 2: Database Not Updated
**Symptoms**: Webhook received but status not updated
**Debug**:
- Check payment record exists: `SELECT * FROM payment WHERE payment_id = ?`
- Verify status field: `SELECT status FROM payment WHERE payment_id = ?`
- Check webhook processing: `SELECT * FROM webhook_processing WHERE order_id = ?`
- Verify transaction committed

### Issue 3: Frontend Not Detecting Status
**Symptoms**: Database updated but UI not updating
**Debug**:
- Check polling is active: Console logs show polling attempts
- Verify API response: Network tab shows correct status
- Check status mapping: `normalizedStatus === 'COMPLETED'`
- Verify callback fires: Console log "📊 Payment status update received"

### Issue 4: UI Not Updating
**Symptoms**: Status detected but UI stuck
**Debug**:
- Check state updates: `setPaymentStatus('success')` called
- Verify step updates: `setActualPaymentStep('completed')` called
- Check React re-render: Component should re-render on state change
- Verify UI conditions: `actualPaymentStep === 'completed'` evaluates true

---

## 📊 **MONITORING & LOGS**

### Backend Logs to Watch
```
🔔 ZENOPAY WEBHOOK RECEIVED
✅ Processing webhook for order: PKG_xxx with status: SUCCESS
🎉 Payment successful! Processing voucher creation...
✅ Payment record saved with status: COMPLETED
🔍 Checking payment status for order: PKG_xxx
✅ Payment status retrieved: COMPLETED for order: PKG_xxx
```

### Frontend Logs to Watch
```
🔄 Starting payment status polling for order: PKG_xxx
🔄 Polling attempt 1/30 (0s elapsed)
📊 Payment status update: PENDING (attempt 1, 0s elapsed)
📊 Payment status update: COMPLETED (attempt 5, 8s elapsed)
📤 Sending status update with elapsedSeconds: 8s
📊 Payment status update received: {status: 'COMPLETED', ...}
✅ Payment polling completed with status: COMPLETED after 8s
```

---

## ✅ **VERIFICATION COMMANDS**

### Check Payment in Database
```sql
SELECT payment_id, status, confirmed_at, processed_at 
FROM payment 
WHERE payment_id = 'PKG_1765055665321_3944_1';
```

### Check Webhook Processing
```sql
SELECT webhook_id, order_id, payment_status, processed_at 
FROM webhook_processing 
WHERE order_id = 'PKG_1765055665321_3944_1';
```

### Check Voucher Generated
```sql
SELECT voucher_code, order_id, status 
FROM voucher 
WHERE order_id = 'PKG_1765055665321_3944_1';
```

---

## 🎯 **SUMMARY**

**Webhook Flow:**
1. ZenoPay → Backend webhook endpoint
2. Backend → Updates payment status in database
3. Frontend → Polls status endpoint every 500ms (after 5s)
4. Backend → Returns updated status from database
5. Frontend → Updates UI state based on status
6. UI → Renders updated status immediately

**Key Connection:**
- **order_id** links webhook → payment record → frontend polling
- **payment.status** field is the source of truth
- **Polling frequency** ensures fast detection (500ms after 5s)
- **Status callback** triggers UI updates immediately

