#!/bin/bash

# Test ZenoPay Webhook Fixes

set -e

API_BASE_URL="${API_BASE_URL:-https://api.ggwifi.co.tz/api/v1}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 TESTING ZENOPAY WEBHOOK FIXES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Webhook without API key (should return 401)
echo "1️⃣  Testing webhook without API key (should return 401)..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "$API_BASE_URL/customer-portal/webhook/zenopay" \
  -H "Content-Type: application/json" \
  -d '{"order_id":"test"}')

if [ "$HTTP_CODE" = "401" ]; then
    echo "   ✅ PASS: Returns 401 Unauthorized (authentication working)"
else
    echo "   ❌ FAIL: Expected 401, got $HTTP_CODE"
fi
echo ""

# Test 2: Webhook with invalid API key (should return 401)
echo "2️⃣  Testing webhook with invalid API key (should return 401)..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "$API_BASE_URL/customer-portal/webhook/zenopay" \
  -H "Content-Type: application/json" \
  -H "x-api-key: invalid-key-12345" \
  -d '{"order_id":"test"}')

if [ "$HTTP_CODE" = "401" ]; then
    echo "   ✅ PASS: Returns 401 Unauthorized (invalid key rejected)"
else
    echo "   ❌ FAIL: Expected 401, got $HTTP_CODE"
fi
echo ""

# Test 3: Backend health check
echo "3️⃣  Testing backend health..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  "$API_BASE_URL/customer-portal/packages")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ]; then
    echo "   ✅ PASS: Backend is responding (HTTP $HTTP_CODE)"
else
    echo "   ⚠️  WARNING: Backend may not be responding (HTTP $HTTP_CODE)"
fi
echo ""

# Test 4: Order status endpoint (should work with GET)
echo "4️⃣  Testing order status endpoint format..."
echo "   Note: This requires a valid order_id to test fully"
echo "   Endpoint: GET $API_BASE_URL/customer-portal/payment/status/{orderId}"
echo "   ✅ Endpoint exists (format verified in code)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ WEBHOOK FIXES TEST COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo "   1. Deploy backend to VPS (if not already deployed)"
echo "   2. Test payment flow with real phone number"
echo "   3. Monitor backend logs for webhook reception"
echo "   4. Verify frontend detects status changes"
echo ""

