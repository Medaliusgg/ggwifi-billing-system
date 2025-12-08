#!/bin/bash

# Payment Backend Testing Script
# Tests all payment endpoints independently

BASE_URL="http://localhost:8080/api/v1/customer-portal"
ORDER_ID="PKG_$(date +%s)_4760_1"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 PAYMENT BACKEND TESTING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Payment Initialization
echo "📋 Test 1: Payment Initialization"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X POST "$BASE_URL/payment" \
  -H "Content-Type: application/json" \
  -d "{
    \"customerName\": \"Test User\",
    \"phoneNumber\": \"+255773404760\",
    \"packageId\": \"1\",
    \"amount\": \"5000\"
  }" | jq '.'
echo ""
echo ""

# Wait for payment to be created
sleep 2

# Test 2: Payment Status Check (PENDING)
echo "📋 Test 2: Payment Status Check (PENDING)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET "$BASE_URL/payment/status/$ORDER_ID" | jq '.'
echo ""
echo ""

# Test 3: Webhook Handler (SUCCESS)
echo "📋 Test 3: Webhook Handler (SUCCESS)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X POST "$BASE_URL/webhook/zenopay" \
  -H "Content-Type: application/json" \
  -d "{
    \"order_id\": \"$ORDER_ID\",
    \"payment_status\": \"SUCCESS\",
    \"amount\": \"5000\",
    \"msisdn\": \"+255773404760\",
    \"transid\": \"TXN123456\",
    \"payment_reference\": \"ZP_REF_123\",
    \"package_id\": \"1\",
    \"customer_name\": \"Test User\"
  }" | jq '.'
echo ""
echo ""

# Test 4: Payment Status Check (COMPLETED)
echo "📋 Test 4: Payment Status Check (COMPLETED)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET "$BASE_URL/payment/status/$ORDER_ID" | jq '.'
echo ""
echo ""

# Test 5: Webhook Handler (FAILED - INSUFFICIENT_BALANCE)
echo "📋 Test 5: Webhook Handler (FAILED - INSUFFICIENT_BALANCE)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ORDER_ID_FAILED="PKG_$(date +%s)_4760_1"
curl -X POST "$BASE_URL/webhook/zenopay" \
  -H "Content-Type: application/json" \
  -d "{
    \"order_id\": \"$ORDER_ID_FAILED\",
    \"payment_status\": \"INSUFFICIENT_BALANCE\",
    \"amount\": \"5000\",
    \"msisdn\": \"+255773404760\",
    \"transid\": \"TXN123457\",
    \"payment_reference\": \"ZP_REF_124\"
  }" | jq '.'
echo ""
echo ""

# Test 6: Payment Status Check (FAILED)
echo "📋 Test 6: Payment Status Check (FAILED)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET "$BASE_URL/payment/status/$ORDER_ID_FAILED" | jq '.'
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ BACKEND TESTING COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"



