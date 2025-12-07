#!/bin/bash

# Test Payment Flow with Real Phone Number
# Phone: 0658823944

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="${API_BASE_URL:-https://api.ggwifi.co.tz/api/v1}"
PHONE_NUMBER="0658823944"
CUSTOMER_NAME="Test Customer"
PACKAGE_ID="1"
AMOUNT="1000"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 REAL PAYMENT FLOW TEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Test Configuration:"
echo "   API URL: $API_BASE_URL"
echo "   Phone: $PHONE_NUMBER"
echo "   Customer: $CUSTOMER_NAME"
echo "   Package ID: $PACKAGE_ID"
echo "   Amount: $AMOUNT TZS"
echo ""
echo "⚠️  WARNING: This will initiate a REAL payment!"
echo "   Make sure you have:"
echo "   1. Mobile money account with sufficient balance"
echo "   2. Phone ready to receive USSD prompt"
echo "   3. PIN ready to enter"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Test cancelled"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 STEP 1: Initiating Payment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Format phone number
FORMATTED_PHONE="+255${PHONE_NUMBER#0}"

# Initiate payment
PAYMENT_RESPONSE=$(curl -s -X POST "$API_BASE_URL/customer-portal/payment" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"customerName\": \"$CUSTOMER_NAME\",
    \"phoneNumber\": \"$FORMATTED_PHONE\",
    \"packageId\": \"$PACKAGE_ID\",
    \"amount\": \"$AMOUNT\",
    \"currency\": \"TZS\",
    \"paymentMethod\": \"ZENOPAY\"
  }")

echo "📥 Payment Response:"
echo "$PAYMENT_RESPONSE" | jq '.' 2>/dev/null || echo "$PAYMENT_RESPONSE"
echo ""

# Extract order_id
ORDER_ID=$(echo "$PAYMENT_RESPONSE" | jq -r '.order_id // empty' 2>/dev/null)

if [ -z "$ORDER_ID" ] || [ "$ORDER_ID" = "null" ]; then
    echo "❌ Failed to get order_id from response"
    echo "Response: $PAYMENT_RESPONSE"
    exit 1
fi

echo "✅ Payment initiated successfully!"
echo "📦 Order ID: $ORDER_ID"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 STEP 2: Check Your Phone"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔔 You should receive a USSD prompt on your phone: $PHONE_NUMBER"
echo "   Please enter your mobile money PIN to complete the payment"
echo ""
echo "⏳ Waiting for payment completion..."
echo "   (Polling status every 2 seconds for 60 seconds)"
echo ""

# Poll payment status
MAX_ATTEMPTS=30
ATTEMPT=0
STATUS="PENDING"
START_TIME=$(date +%s)

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    ELAPSED=$(( $(date +%s) - START_TIME ))
    
    echo -n "🔄 Attempt $ATTEMPT/$MAX_ATTEMPTS (${ELAPSED}s elapsed): "
    
    # Check payment status
    STATUS_RESPONSE=$(curl -s -X GET "$API_BASE_URL/customer-portal/payment/status/$ORDER_ID" \
      -H "Accept: application/json")
    
    PAYMENT_STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.payment_status // "UNKNOWN"' 2>/dev/null)
    VOUCHER_CODE=$(echo "$STATUS_RESPONSE" | jq -r '.voucher_code // empty' 2>/dev/null)
    MESSAGE=$(echo "$STATUS_RESPONSE" | jq -r '.message // ""' 2>/dev/null)
    
    echo "Status: $PAYMENT_STATUS"
    
    # Check if payment is complete
    if [ "$PAYMENT_STATUS" = "COMPLETED" ] || [ "$PAYMENT_STATUS" = "SUCCESS" ] || [ "$PAYMENT_STATUS" = "SUCCESSFUL" ]; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ PAYMENT SUCCESSFUL!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "📦 Order ID: $ORDER_ID"
        echo "✅ Status: $PAYMENT_STATUS"
        if [ -n "$VOUCHER_CODE" ] && [ "$VOUCHER_CODE" != "null" ]; then
            echo "🎫 Voucher Code: $VOUCHER_CODE"
        fi
        echo "💬 Message: $MESSAGE"
        echo ""
        echo "⏱️  Total Time: ${ELAPSED} seconds"
        echo ""
        exit 0
    fi
    
    # Check if payment failed
    if [ "$PAYMENT_STATUS" = "FAILED" ] || [ "$PAYMENT_STATUS" = "CANCELLED" ] || [ "$PAYMENT_STATUS" = "EXPIRED" ]; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "❌ PAYMENT FAILED"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "📦 Order ID: $ORDER_ID"
        echo "❌ Status: $PAYMENT_STATUS"
        echo "💬 Message: $MESSAGE"
        echo ""
        exit 1
    fi
    
    # Wait before next poll
    if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
        if [ $ELAPSED -ge 5 ]; then
            sleep 0.5  # Poll every 500ms after 5 seconds
        else
            sleep 2    # Poll every 2 seconds initially
        fi
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏰ PAYMENT TIMEOUT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Order ID: $ORDER_ID"
echo "⏰ Status: TIMEOUT (60 seconds elapsed)"
echo "💬 The USSD prompt has expired. Please initiate a new payment."
echo ""
exit 1

