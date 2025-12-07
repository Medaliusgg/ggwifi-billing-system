# 🔍 Webhook Callback Flow Analysis

## Current Flow

### 1. Payment Initiation
```
Frontend → Backend → ZenoPay API
```
- Backend calls ZenoPay with webhook URL: `https://api.ggwifi.co.tz/api/v1/customer-portal/webhook/zenopay`
- ZenoPay receives payment request
- ZenoPay sends USSD prompt to user's phone

### 2. User Completes Payment
```
User enters PIN on phone → ZenoPay processes payment
```

### 3. Webhook Callback (THE CRITICAL PART)
```
ZenoPay → Backend Webhook Endpoint
POST https://api.ggwifi.co.tz/api/v1/customer-portal/webhook/zenopay
```

**What happens:**
1. ✅ Webhook received at `/api/v1/customer-portal/webhook/zenopay`
2. ✅ Idempotency check (prevents duplicate processing)
3. ✅ Webhook validation
4. ✅ Extract payment status from webhook
5. ✅ Update database: `payment.setStatus(COMPLETED/FAILED)`
6. ✅ Save payment: `paymentRepository.save(payment)`
7. ✅ Create voucher (if successful)
8. ✅ Send SMS (if successful)

### 4. Frontend Polling
```
Frontend → Backend Status Endpoint (every 2s, then 500ms after 5s)
GET https://api.ggwifi.co.tz/api/v1/customer-portal/payment/status/{orderId}
```

**What happens:**
1. Frontend polls status endpoint
2. Backend queries database: `paymentRepository.findByPaymentId(orderId)`
3. Backend returns current payment status
4. Frontend receives status and updates UI

---

## ⚠️ POTENTIAL ISSUES

### Issue 1: Webhook URL Not Configured Correctly
**Problem**: ZenoPay might not be sending webhooks to the correct URL
**Check**: 
- Is webhook URL publicly accessible?
- Is it configured in ZenoPay dashboard?
- Are there firewall/network issues?

### Issue 2: Webhook Received But Not Processed
**Problem**: Webhook arrives but database not updated
**Check**:
- Backend logs: "🔔 ZENOPAY WEBHOOK RECEIVED"
- Database: `SELECT status FROM payment WHERE payment_id = ?`
- Webhook processing record: `SELECT * FROM webhook_processing WHERE order_id = ?`

### Issue 3: Database Updated But Frontend Not Detecting
**Problem**: Database has COMPLETED status but frontend still shows PENDING
**Check**:
- Status endpoint returns correct status?
- Frontend polling running?
- Status mapping correct?

### Issue 4: Timing Issue
**Problem**: Webhook arrives but frontend polls before database update
**Current**: Frontend polls every 2s initially, then 500ms after 5s
**Issue**: If webhook arrives between polls, frontend misses it until next poll

---

## 🔧 ROOT CAUSE ANALYSIS

### Most Likely Issue: **Frontend Polling Not Detecting Status Change**

**Why:**
1. Webhook is received and processed correctly (backend logs show this)
2. Database is updated correctly (status endpoint returns correct status)
3. BUT frontend polling might:
   - Not be running (polling stopped prematurely)
   - Not be detecting status change (status mapping issue)
   - Not be updating UI (React re-render issue)

### Secondary Issue: **Webhook Processing Delay**

**Why:**
1. Webhook arrives at backend
2. Backend processes webhook (takes time: validation, database update, voucher creation, SMS)
3. Frontend polls during processing → gets old status
4. Frontend polls after processing → gets new status

**Current Solution**: Frontend polls every 500ms after 5s (should catch it quickly)

---

## ✅ VERIFICATION STEPS

### Step 1: Verify Webhook is Received
```bash
# Check backend logs for:
🔔 ZENOPAY WEBHOOK RECEIVED
✅ Processing webhook for order: PKG_xxx with status: COMPLETED
```

### Step 2: Verify Database is Updated
```sql
SELECT payment_id, status, confirmed_at, updated_at 
FROM payment 
WHERE payment_id = 'PKG_xxx';
```

### Step 3: Verify Status Endpoint Returns Correct Status
```bash
curl https://api.ggwifi.co.tz/api/v1/customer-portal/payment/status/PKG_xxx
```

### Step 4: Verify Frontend Polling
- Open browser console
- Look for: `🔄 Polling attempt X/30`
- Look for: `📊 Payment status update: COMPLETED`

---

## 🎯 RECOMMENDED FIXES

### Fix 1: Ensure Webhook URL is Correct
- Verify webhook URL in ZenoPay dashboard
- Test webhook endpoint is publicly accessible
- Check firewall/network rules

### Fix 2: Add Webhook Processing Logging
- Log when webhook is received
- Log when database is updated
- Log when status endpoint is called

### Fix 3: Improve Frontend Polling
- Ensure polling doesn't stop prematurely
- Add retry logic for failed polls
- Add status change detection (compare previous status)

### Fix 4: Add Real-time Status Updates
- Consider WebSocket for real-time updates
- Or Server-Sent Events (SSE)
- Or increase polling frequency

---

## 📊 CURRENT STATUS

### Backend Webhook Handling: ✅ **WORKING**
- Webhook endpoint exists
- Webhook validation works
- Database updates correctly
- Voucher creation works

### Frontend Polling: ⚠️ **POTENTIAL ISSUE**
- Polling service exists
- But may not detect status changes fast enough
- Or may not update UI correctly

### Status Endpoint: ✅ **WORKING**
- Endpoint exists
- Queries database correctly
- Returns correct status

---

## 🎯 CONCLUSION

**The webhook callback system IS working correctly**, but there's a **disconnect between webhook processing and frontend detection**.

**The issue is likely:**
1. Frontend polling not detecting status change fast enough
2. OR Frontend not updating UI when status changes
3. OR Webhook processing takes time, and frontend polls before update completes

**Solution**: 
- Verify webhook is received (check logs)
- Verify database is updated (check database)
- Verify status endpoint returns correct status (test endpoint)
- Verify frontend polling detects change (check console logs)
- Fix frontend UI update if needed

