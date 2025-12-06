#!/bin/bash

# Simple Payment Backend Test - Step by Step
# Tests payment flow without hanging

set -e

API_BASE="http://139.84.241.182:8080/api/v1/customer-portal"
TEST_PHONE="255773404760"
TEST_NAME="Test Customer"
TEST_PACKAGE_ID="1"
TEST_AMOUNT="5000"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 SIMPLE PAYMENT BACKEND TEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Health Check
echo "✅ Test 1: Health Check"
response=$(timeout 10 curl -s -X GET "${API_BASE}/test" -H "Content-Type: application/json")
echo "Response: $response"
echo ""

# Test 2: Get Packages
echo "✅ Test 2: Get Packages"
response=$(timeout 10 curl -s -X GET "${API_BASE}/packages" -H "Content-Type: application/json")
package_count=$(echo "$response" | grep -o '"count":[0-9]*' | cut -d':' -f2)
echo "Packages found: $package_count"
echo ""

# Test 3: Initiate Payment
echo "✅ Test 3: Initiate Payment"
payment_data="{
    \"customerName\": \"$TEST_NAME\",
    \"phoneNumber\": \"$TEST_PHONE\",
    \"packageId\": \"$TEST_PACKAGE_ID\",
    \"packageName\": \"Test Package\",
    \"amount\": \"$TEST_AMOUNT\",
    \"currency\": \"TZS\",
    \"paymentMethod\": \"ZENOPAY\"
}"

response=$(timeout 30 curl -s -X POST "${API_BASE}/payment" \
    -H "Content-Type: application/json" \
    -d "$payment_data")

echo "Response: $response"
echo ""

# Extract order ID
ORDER_ID=$(echo "$response" | grep -o '"order_id":"[^"]*"' | cut -d'"' -f4)
if [ -n "$ORDER_ID" ]; then
    echo "✅ Order ID extracted: $ORDER_ID"
    echo "$ORDER_ID" > /tmp/test_order_id.txt
else
    echo "❌ Failed to extract order ID"
    exit 1
fi
echo ""

# Test 4: Check Payment Status (should be PENDING)
echo "✅ Test 4: Check Payment Status (Initial)"
sleep 2
response=$(timeout 10 curl -s -X GET "${API_BASE}/payment/status/$ORDER_ID" -H "Content-Type: application/json")
status=$(echo "$response" | grep -o '"payment_status":"[^"]*"' | cut -d'"' -f4)
echo "Payment Status: $status"
echo "Full Response: $response"
echo ""

# Test 5: Webhook Endpoint Test
echo "✅ Test 5: Webhook Endpoint Accessibility"
response=$(timeout 10 curl -s -X GET "${API_BASE}/webhook/zenopay/test" -H "Content-Type: application/json")
echo "Response: $response"
echo ""

# Test 6: Simulate SUCCESS Webhook
echo "✅ Test 6: Simulate SUCCESS Webhook"
webhook_data="{
    \"order_id\": \"$ORDER_ID\",
    \"payment_status\": \"SUCCESS\",
    \"amount\": \"$TEST_AMOUNT\",
    \"msisdn\": \"$TEST_PHONE\",
    \"transid\": \"TEST_TXN_$(date +%s)\",
    \"payment_reference\": \"TEST_REF_$(date +%s)\",
    \"customer_name\": \"$TEST_NAME\",
    \"package_id\": \"$TEST_PACKAGE_ID\"
}"

response=$(timeout 30 curl -s -X POST "${API_BASE}/webhook/zenopay" \
    -H "Content-Type: application/json" \
    -d "$webhook_data")

echo "Webhook Response: $response"
voucher_code=$(echo "$response" | grep -o '"voucher_code":"[^"]*"' | cut -d'"' -f4)
if [ -n "$voucher_code" ]; then
    echo "✅ Voucher Code: $voucher_code"
else
    echo "⚠️  No voucher code in response"
fi
echo ""

# Test 7: Verify Payment Status Updated
echo "✅ Test 7: Verify Payment Status Updated"
sleep 3
response=$(timeout 10 curl -s -X GET "${API_BASE}/payment/status/$ORDER_ID" -H "Content-Type: application/json")
status=$(echo "$response" | grep -o '"payment_status":"[^"]*"' | cut -d'"' -f4)
echo "Payment Status: $status"
if [ "$status" = "COMPLETED" ]; then
    echo "✅ Payment status correctly updated to COMPLETED"
else
    echo "⚠️  Payment status is: $status (expected COMPLETED)"
fi
echo "Full Response: $response"
echo ""

# Test 8: Test Invalid Webhook
echo "✅ Test 8: Test Invalid Webhook (Validation)"
invalid_webhook="{
    \"order_id\": \"\",
    \"payment_status\": \"INVALID\"
}"

response=$(timeout 10 curl -s -w "\n%{http_code}" -X POST "${API_BASE}/webhook/zenopay" \
    -H "Content-Type: application/json" \
    -d "$invalid_webhook")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
echo "HTTP Code: $http_code"
echo "Response: $body"
if [ "$http_code" = "400" ]; then
    echo "✅ Invalid webhook correctly rejected"
else
    echo "⚠️  Expected HTTP 400, got $http_code"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TEST COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

