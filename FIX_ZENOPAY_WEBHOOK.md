# 🔧 Fix ZenoPay Webhook Integration

## Issues Found

### 1. ❌ **CRITICAL: Webhook Authentication Missing**
**Problem**: ZenoPay sends `x-api-key` in webhook request header, but we're NOT verifying it!
**Risk**: Anyone can send fake webhooks to our endpoint
**Fix**: Verify `x-api-key` header matches our API key

### 2. ⚠️ Order Status Check Method Wrong
**Problem**: Documentation says GET with query parameter, but we're using POST
**Current**: `POST /api/payments/order-status` with body
**Should be**: `GET /api/payments/order-status?order_id=xxx`
**Fix**: Change to GET request with query parameter

### 3. ⚠️ Webhook Payload Structure
**Problem**: Need to verify webhook payload matches ZenoPay format
**Expected**: `{"order_id":"xxx","payment_status":"COMPLETED","reference":"xxx","metadata":{...}}`
**Fix**: Update webhook validation to match official format

---

## Required Fixes

### Fix 1: Add Webhook Authentication

```java
@PostMapping("/webhook/zenopay")
public ResponseEntity<Map<String, Object>> handleZenoPayWebhook(
        @RequestBody Map<String, Object> webhookData,
        @RequestHeader(value = "x-api-key", required = false) String apiKey,
        HttpServletRequest request) {
    
    // Verify API key
    if (apiKey == null || !apiKey.equals(zenopayApiKey)) {
        System.out.println("❌ Webhook authentication failed: Invalid or missing API key");
        response.put("status", "unauthorized");
        response.put("message", "Invalid API key");
        return ResponseEntity.status(401).body(response);
    }
    
    // Continue with webhook processing...
}
```

### Fix 2: Fix Order Status Check

```java
public Map<String, Object> checkOrderStatus(String orderId) {
    // Change from POST to GET
    String url = zenopayBaseUrl + orderStatusEndpoint + "?order_id=" + orderId;
    
    HttpHeaders headers = new HttpHeaders();
    headers.set("x-api-key", zenopayApiKey);
    
    HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
    
    ResponseEntity<Map<String, Object>> apiResponse = restTemplate.exchange(
        url,
        HttpMethod.GET,  // Changed from POST
        requestEntity,
        Map.class
    );
}
```

### Fix 3: Update Webhook Payload Validation

```java
private Map<String, Object> validateWebhookData(Map<String, Object> webhookData) {
    // Expected fields from ZenoPay:
    // - order_id (required)
    // - payment_status (required) - COMPLETED, FAILED, etc.
    // - reference (optional)
    // - metadata (optional)
    
    if (!webhookData.containsKey("order_id")) {
        return Map.of("status", "invalid", "message", "Missing order_id");
    }
    
    if (!webhookData.containsKey("payment_status")) {
        return Map.of("status", "invalid", "message", "Missing payment_status");
    }
    
    // Extract and validate
    String orderId = (String) webhookData.get("order_id");
    String paymentStatus = (String) webhookData.get("payment_status");
    
    // ... rest of validation
}
```

---

## Implementation Steps

1. ✅ Add `@RequestHeader` for `x-api-key` in webhook handler
2. ✅ Verify API key matches configured key
3. ✅ Return 401 if authentication fails
4. ✅ Fix order status check to use GET instead of POST
5. ✅ Update webhook payload validation to match official format
6. ✅ Test webhook with proper authentication

---

## Security Impact

**Before**: ❌ Anyone can send fake webhooks
**After**: ✅ Only ZenoPay with correct API key can send webhooks

This is a **CRITICAL SECURITY FIX**!

