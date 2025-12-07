#!/bin/bash

# Script to check if VPS backend has latest code deployed
# Tests for specific features that were added in recent updates

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 CHECKING VPS BACKEND VERSION & FEATURES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

VPS_URL="https://api.ggwifi.co.tz/api/v1"
ORIGIN="https://hotspot.ggwifi.co.tz"

echo "1️⃣  Testing CORS Headers (Latest Fix)..."
echo "   Testing OPTIONS request..."
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$VPS_URL/customer-portal/payment/status/test" \
  -H "Origin: $ORIGIN" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" 2>&1)

ALLOW_ORIGIN=$(echo "$CORS_RESPONSE" | grep -i "access-control-allow-origin" | head -1)
ALLOW_HEADERS=$(echo "$CORS_RESPONSE" | grep -i "access-control-allow-headers" | head -1)

echo "   Allow-Origin: $ALLOW_ORIGIN"
echo "   Allow-Headers: $ALLOW_HEADERS"

if echo "$ALLOW_ORIGIN" | grep -q "hotspot.ggwifi.co.tz"; then
    echo "   ✅ CORS origin configured correctly"
else
    echo "   ❌ CORS origin NOT configured - backend needs update!"
fi

if echo "$ALLOW_HEADERS" | grep -q "Content-Type\|*"; then
    echo "   ✅ CORS headers configured"
else
    echo "   ⚠️  CORS headers may need update"
fi
echo ""

echo "2️⃣  Testing Payment Status Endpoint (Latest Improvements)..."
PAYMENT_RESPONSE=$(curl -s "$VPS_URL/customer-portal/payment/status/TEST_ORDER_123" 2>&1)
echo "   Response: $(echo "$PAYMENT_RESPONSE" | head -c 200)"

# Check for specific fields that were added in recent updates
if echo "$PAYMENT_RESPONSE" | grep -q "voucher_generated\|timeout_warning\|minutes_pending"; then
    echo "   ✅ Payment status endpoint has latest improvements"
else
    echo "   ⚠️  Payment status endpoint may be using older code"
fi
echo ""

echo "3️⃣  Testing Webhook Endpoint (Latest Security)..."
WEBHOOK_RESPONSE=$(curl -s -X POST "$VPS_URL/customer-portal/webhook/zenopay" \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}' 2>&1 | head -c 200)

if echo "$WEBHOOK_RESPONSE" | grep -q "orderId\|status\|error"; then
    echo "   ✅ Webhook endpoint responding"
else
    echo "   ⚠️  Webhook endpoint may have issues"
fi
echo ""

echo "4️⃣  Testing GET Request with CORS..."
GET_RESPONSE=$(curl -s -H "Origin: $ORIGIN" "$VPS_URL/customer-portal/payment/status/TEST123" 2>&1 | head -c 200)
echo "   Response: $GET_RESPONSE"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 DEPLOYMENT CHECK SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "If CORS is NOT working correctly, you MUST deploy latest code:"
echo ""
echo "📋 DEPLOYMENT STEPS:"
echo ""
echo "1. SSH to VPS:"
echo "   ssh user@139.84.241.182"
echo ""
echo "2. Navigate to backend:"
echo "   cd /path/to/backend"
echo ""
echo "3. Pull latest code:"
echo "   git pull origin main"
echo ""
echo "4. Rebuild:"
echo "   mvn clean package -DskipTests"
echo ""
echo "5. Restart backend:"
echo "   sudo systemctl restart ggwifi-backend"
echo "   # OR"
echo "   pm2 restart ggwifi-backend"
echo ""
echo "6. Verify:"
echo "   curl https://api.ggwifi.co.tz/api/v1/customer-portal/packages"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

