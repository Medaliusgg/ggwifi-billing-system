#!/bin/bash

# Script to verify VPS backend has latest code deployed
# Tests for CORS fix, payment handlers, and all improvements

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 VPS BACKEND DEPLOYMENT VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

VPS_URL="https://api.ggwifi.co.tz/api/v1"
ORIGIN="https://hotspot.ggwifi.co.tz"

echo "1️⃣  Testing Backend Availability..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$VPS_URL/customer-portal/packages")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ]; then
    echo "   ✅ Backend is responding (HTTP $HTTP_CODE)"
else
    echo "   ❌ Backend not responding (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

echo "2️⃣  Testing CORS Configuration..."
CORS_HEADER=$(curl -s -I -X OPTIONS "$VPS_URL/customer-portal/payment/status/test" \
  -H "Origin: $ORIGIN" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" 2>&1 | grep -i "access-control-allow-origin" | head -1)

if echo "$CORS_HEADER" | grep -q "hotspot.ggwifi.co.tz"; then
    echo "   ✅ CORS configured correctly"
    echo "   $CORS_HEADER"
else
    echo "   ⚠️  CORS may need update"
    echo "   Response: $CORS_HEADER"
fi
echo ""

echo "3️⃣  Testing Payment Status Endpoint..."
PAYMENT_RESPONSE=$(curl -s "$VPS_URL/customer-portal/payment/status/TEST_ORDER_123" 2>&1)
if echo "$PAYMENT_RESPONSE" | grep -q "order_id\|payment_status\|status"; then
    echo "   ✅ Payment status endpoint working"
    echo "   Response: $(echo "$PAYMENT_RESPONSE" | head -c 150)"
else
    echo "   ⚠️  Payment status endpoint may have issues"
    echo "   Response: $PAYMENT_RESPONSE"
fi
echo ""

echo "4️⃣  Testing CORS Headers Detail..."
CORS_DETAIL=$(curl -s -I -X OPTIONS "$VPS_URL/customer-portal/payment/status/test" \
  -H "Origin: $ORIGIN" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" 2>&1 | grep -i "access-control" | head -5)

echo "   CORS Headers:"
echo "$CORS_DETAIL" | while read line; do
    echo "   $line"
done
echo ""

echo "5️⃣  Testing Packages Endpoint..."
PACKAGES_RESPONSE=$(curl -s "$VPS_URL/customer-portal/packages" 2>&1 | head -c 200)
if echo "$PACKAGES_RESPONSE" | grep -q "packages\|count"; then
    echo "   ✅ Packages endpoint working"
else
    echo "   ⚠️  Packages endpoint may have issues"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 VERIFICATION SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Backend Status: $(if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ]; then echo "Running"; else echo "Not Running"; fi)"
echo "✅ CORS Status: $(if echo "$CORS_HEADER" | grep -q "hotspot.ggwifi.co.tz"; then echo "Configured"; else echo "Needs Update"; fi)"
echo ""
echo "📝 Note: If CORS is working, the latest code is likely deployed."
echo "   However, to ensure 100% latest code, SSH to VPS and:"
echo "   1. git pull origin main"
echo "   2. mvn clean package -DskipTests"
echo "   3. Restart backend service"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

