#!/bin/bash

# Quick script to initiate a real payment
API_BASE="http://139.84.241.182:8080/api/v1/customer-portal"
REAL_PHONE="0658823944"
TEST_NAME="Real Test Customer"
TEST_PACKAGE_ID="1"
TEST_AMOUNT="2000"

echo "🔴 Initiating REAL Payment..."
echo "Phone: $REAL_PHONE"
echo "Amount: $TEST_AMOUNT TZS"
echo ""

payment_data="{
    \"customerName\": \"$TEST_NAME\",
    \"phoneNumber\": \"$REAL_PHONE\",
    \"packageId\": \"$TEST_PACKAGE_ID\",
    \"packageName\": \"Universal Daily\",
    \"amount\": \"$TEST_AMOUNT\",
    \"currency\": \"TZS\",
    \"paymentMethod\": \"ZENOPAY\"
}"

response=$(curl -s -X POST "${API_BASE}/payment" \
    -H "Content-Type: application/json" \
    -d "$payment_data")

echo "Response:"
echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
echo ""

# Extract order ID
ORDER_ID=$(echo "$response" | grep -o '"order_id":"[^"]*"' | cut -d'"' -f4)
if [ -n "$ORDER_ID" ]; then
    echo "✅ Order ID: $ORDER_ID"
    echo "$ORDER_ID" > /tmp/real_payment_order_id.txt
    echo ""
    echo "📱 Check your phone ($REAL_PHONE) for the USSD prompt!"
    echo "   Enter your PIN to complete the payment."
    echo ""
    echo "🔄 To monitor status, run:"
    echo "   ./monitor-payment-status.sh"
else
    echo "❌ Failed to get order ID"
    exit 1
fi

