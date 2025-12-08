#!/bin/bash

# Test ZenoPay Webhook Integration
# This script tests:
# 1. Payment initiation includes webhook_url
# 2. Webhook endpoint is accessible
# 3. x-api-key verification works
# 4. Payment status endpoint works

set -e

API_BASE="https://api.ggwifi.co.tz/api/v1"
# For local testing, use: API_BASE="http://localhost:8080/api/v1"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 ZENOPAY WEBHOOK INTEGRATION TEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if backend is accessible
echo "1️⃣  Testing Backend Accessibility..."
if curl -s -f "${API_BASE}/customer-portal/test" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is accessible${NC}"
else
    echo -e "${RED}❌ Backend is not accessible${NC}"
    echo "   Check if backend is running and accessible at: ${API_BASE}"
    exit 1
fi
echo ""

# Test 2: Check webhook endpoint accessibility
echo "2️⃣  Testing Webhook Endpoint Accessibility..."
WEBHOOK_RESPONSE=$(curl -s -X GET "${API_BASE}/customer-portal/webhook/test" 2>&1)
if echo "$WEBHOOK_RESPONSE" | grep -q "accessible\|success"; then
    echo -e "${GREEN}✅ Webhook endpoint is accessible${NC}"
    echo "   Response: $WEBHOOK_RESPONSE"
else
    echo -e "${YELLOW}⚠️  Webhook endpoint test endpoint not found (this is OK)${NC}"
fi
echo ""

# Test 3: Test webhook endpoint with x-api-key (simulate ZenoPay webhook)
echo "3️⃣  Testing Webhook Endpoint with x-api-key..."
echo "   Simulating ZenoPay webhook call..."

# Get API key from environment or use default (you should set this)
ZENOPAY_API_KEY="${ZENOPAY_API_KEY:-gUHLes8c3nVYCa7XEK8CWi-eBBNf04OCJ3JqJIU63NVj52MgevdOjFsL1tr26zgXZDvI3J6e5AjJAOflNS_EIw}"

# Create test webhook payload
TEST_ORDER_ID="TEST_$(date +%s)_3944"
WEBHOOK_PAYLOAD=$(cat <<EOF
{
  "order_id": "${TEST_ORDER_ID}",
  "payment_status": "COMPLETED",
  "transid": "TEST_TRANS_$(date +%s)",
  "amount": "2000",
  "msisdn": "255658823944",
  "payment_reference": "TEST_REF_$(date +%s)"
}
EOF
)

echo "   Webhook Payload:"
echo "$WEBHOOK_PAYLOAD" | jq '.' 2>/dev/null || echo "$WEBHOOK_PAYLOAD"
echo ""

# Test webhook with valid API key
echo "   Testing with valid x-api-key..."
WEBHOOK_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${ZENOPAY_API_KEY}" \
  -d "$WEBHOOK_PAYLOAD" \
  "${API_BASE}/customer-portal/webhook/zenopay" 2>&1)

HTTP_CODE=$(echo "$WEBHOOK_RESPONSE" | tail -n1)
BODY=$(echo "$WEBHOOK_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Webhook accepted with valid x-api-key (HTTP $HTTP_CODE)${NC}"
    echo "   Response: $BODY" | head -c 200
    echo ""
else
    echo -e "${RED}❌ Webhook rejected (HTTP $HTTP_CODE)${NC}"
    echo "   Response: $BODY"
fi
echo ""

# Test webhook with invalid API key
echo "   Testing with invalid x-api-key..."
INVALID_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: INVALID_KEY_12345" \
  -d "$WEBHOOK_PAYLOAD" \
  "${API_BASE}/customer-portal/webhook/zenopay" 2>&1)

INVALID_HTTP_CODE=$(echo "$INVALID_RESPONSE" | tail -n1)
INVALID_BODY=$(echo "$INVALID_RESPONSE" | sed '$d')

if [ "$INVALID_HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Webhook correctly rejected invalid x-api-key (HTTP 401)${NC}"
else
    echo -e "${YELLOW}⚠️  Expected HTTP 401 for invalid key, got HTTP $INVALID_HTTP_CODE${NC}"
fi
echo ""

# Test webhook without API key
echo "   Testing without x-api-key..."
NO_KEY_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$WEBHOOK_PAYLOAD" \
  "${API_BASE}/customer-portal/webhook/zenopay" 2>&1)

NO_KEY_HTTP_CODE=$(echo "$NO_KEY_RESPONSE" | tail -n1)
NO_KEY_BODY=$(echo "$NO_KEY_RESPONSE" | sed '$d')

if [ "$NO_KEY_HTTP_CODE" = "401" ] || [ "$NO_KEY_HTTP_CODE" = "400" ]; then
    echo -e "${GREEN}✅ Webhook correctly rejected without x-api-key (HTTP $NO_KEY_HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  Expected HTTP 401/400 for missing key, got HTTP $NO_KEY_HTTP_CODE${NC}"
fi
echo ""

# Test 4: Check payment status endpoint
echo "4️⃣  Testing Payment Status Endpoint..."
STATUS_RESPONSE=$(curl -s "${API_BASE}/customer-portal/payment/status/${TEST_ORDER_ID}")
if echo "$STATUS_RESPONSE" | grep -q "payment_status\|order_id"; then
    echo -e "${GREEN}✅ Payment status endpoint works${NC}"
    echo "   Response: $STATUS_RESPONSE" | head -c 200
    echo ""
else
    echo -e "${YELLOW}⚠️  Payment status endpoint response unexpected${NC}"
    echo "   Response: $STATUS_RESPONSE"
fi
echo ""

# Test 5: Verify webhook_url is included in payment request (check logs)
echo "5️⃣  Testing Payment Initiation (Check Backend Logs for webhook_url)..."
echo "   Initiating test payment..."
echo "   Phone: 255658823944"
echo "   Amount: 2000 TZS"
echo ""

PAYMENT_PAYLOAD=$(cat <<EOF
{
  "customerName": "Test User",
  "phoneNumber": "0658823944",
  "packageId": "1",
  "amount": "2000"
}
EOF
)

PAYMENT_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$PAYMENT_PAYLOAD" \
  "${API_BASE}/customer-portal/payment" 2>&1)

if echo "$PAYMENT_RESPONSE" | grep -q "order_id\|status"; then
    echo -e "${GREEN}✅ Payment initiation successful${NC}"
    ORDER_ID=$(echo "$PAYMENT_RESPONSE" | grep -o '"order_id":"[^"]*"' | cut -d'"' -f4 || echo "")
    if [ -n "$ORDER_ID" ]; then
        echo "   Order ID: $ORDER_ID"
        echo ""
        echo "   📋 Check backend logs to verify:"
        echo "      ✅ 'Webhook URL included in request: https://api.ggwifi.co.tz/...'"
        echo "      ✅ 'ZenoPay Order Created Successfully'"
    fi
else
    echo -e "${YELLOW}⚠️  Payment initiation response unexpected${NC}"
    echo "   Response: $PAYMENT_RESPONSE"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TEST COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo "   1. Check backend logs for webhook_url inclusion"
echo "   2. Monitor webhook endpoint for incoming ZenoPay webhooks"
echo "   3. Test with real payment using phone: 0658823944"
echo ""
echo "🔍 To monitor backend logs:"
echo "   ssh root@139.84.241.182 'journalctl -u ggnetworks-backend -f'"
echo ""


