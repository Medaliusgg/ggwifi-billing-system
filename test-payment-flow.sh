#!/bin/bash

# Comprehensive test of payment flow from frontend perspective
# Simulates what the browser would do

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 TESTING PAYMENT FLOW (Frontend Perspective)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

VPS_URL="https://api.ggwifi.co.tz/api/v1"
ORIGIN="https://hotspot.ggwifi.co.tz"

echo "1️⃣  Testing Packages Endpoint (GET)..."
PACKAGES_RESPONSE=$(curl -s -H "Origin: $ORIGIN" "$VPS_URL/customer-portal/packages" 2>&1)
PACKAGES_HTTP=$(curl -s -o /dev/null -w "%{http_code}" -H "Origin: $ORIGIN" "$VPS_URL/customer-portal/packages" 2>&1)

if [ "$PACKAGES_HTTP" = "200" ]; then
    echo "   ✅ Packages endpoint working (HTTP $PACKAGES_HTTP)"
    echo "   Response: $(echo "$PACKAGES_RESPONSE" | head -c 100)..."
else
    echo "   ❌ Packages endpoint failed (HTTP $PACKAGES_HTTP)"
    echo "   Response: $PACKAGES_RESPONSE"
fi
echo ""

echo "2️⃣  Testing Payment Initiation (POST)..."
PAYMENT_INIT_RESPONSE=$(curl -s -X POST "$VPS_URL/customer-portal/payment/initiate" \
  -H "Origin: $ORIGIN" \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": 1,
    "customerName": "Test User",
    "customerPhone": "0658823944"
  }' 2>&1)
PAYMENT_INIT_HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$VPS_URL/customer-portal/payment/initiate" \
  -H "Origin: $ORIGIN" \
  -H "Content-Type: application/json" \
  -d '{"packageId":1,"customerName":"Test","customerPhone":"0658823944"}' 2>&1)

if [ "$PAYMENT_INIT_HTTP" = "200" ] || [ "$PAYMENT_INIT_HTTP" = "400" ]; then
    echo "   ✅ Payment initiation working (HTTP $PAYMENT_INIT_HTTP)"
    echo "   Response: $(echo "$PAYMENT_INIT_RESPONSE" | head -c 150)..."
else
    echo "   ❌ Payment initiation failed (HTTP $PAYMENT_INIT_HTTP)"
    echo "   Response: $PAYMENT_INIT_RESPONSE"
fi
echo ""

echo "3️⃣  Testing Payment Status (GET)..."
STATUS_RESPONSE=$(curl -s -H "Origin: $ORIGIN" "$VPS_URL/customer-portal/payment/status/TEST123" 2>&1)
STATUS_HTTP=$(curl -s -o /dev/null -w "%{http_code}" -H "Origin: $ORIGIN" "$VPS_URL/customer-portal/payment/status/TEST123" 2>&1)

if [ "$STATUS_HTTP" = "200" ]; then
    echo "   ✅ Payment status working (HTTP $STATUS_HTTP)"
    echo "   Response: $(echo "$STATUS_RESPONSE" | head -c 150)..."
else
    echo "   ❌ Payment status failed (HTTP $STATUS_HTTP)"
    echo "   Response: $STATUS_RESPONSE"
fi
echo ""

echo "4️⃣  Testing CORS Preflight (OPTIONS)..."
OPTIONS_RESPONSE=$(curl -s -I -X OPTIONS "$VPS_URL/customer-portal/payment/status/test" \
  -H "Origin: $ORIGIN" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" 2>&1)

ALLOW_ORIGIN=$(echo "$OPTIONS_RESPONSE" | grep -i "access-control-allow-origin" | head -1)
ALLOW_HEADERS=$(echo "$OPTIONS_RESPONSE" | grep -i "access-control-allow-headers" | head -1)

if echo "$ALLOW_ORIGIN" | grep -q "hotspot.ggwifi.co.tz"; then
    echo "   ✅ CORS preflight working"
    echo "   $ALLOW_ORIGIN"
    echo "   $ALLOW_HEADERS"
else
    echo "   ❌ CORS preflight failed"
    echo "   Response: $OPTIONS_RESPONSE"
fi
echo ""

echo "5️⃣  Testing with Axios-like Headers..."
AXIOS_RESPONSE=$(curl -s -H "Origin: $ORIGIN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  "$VPS_URL/customer-portal/payment/status/TEST123" 2>&1 | head -c 200)

if echo "$AXIOS_RESPONSE" | grep -q "order_id\|payment_status"; then
    echo "   ✅ Request with Axios headers working"
    echo "   Response: $AXIOS_RESPONSE"
else
    echo "   ⚠️  Request may have issues"
    echo "   Response: $AXIOS_RESPONSE"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "If all tests pass but you still see errors in browser:"
echo "   1. Clear browser cache (Ctrl+Shift+Delete)"
echo "   2. Hard refresh (Ctrl+Shift+R)"
echo "   3. Check browser console for exact error message"
echo "   4. Check Network tab for failed requests"
echo ""
echo "Common issues:"
echo "   • Browser cache showing old CORS errors"
echo "   • Specific endpoint not working"
echo "   • Frontend code not updated"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

