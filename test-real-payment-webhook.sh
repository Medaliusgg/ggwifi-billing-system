#!/bin/bash

# ============================================================================
# REAL PAYMENT WEBHOOK TEST
# ============================================================================
# This script initiates a REAL payment and monitors for the actual webhook
# from ZenoPay. Use this to test the complete payment flow with real data.
# ============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
API_BASE="http://139.84.241.182:8080/api/v1/customer-portal"
REAL_PHONE="0658823944"  # User's real phone number
TEST_NAME="Real Test Customer"
TEST_PACKAGE_ID="1"  # Universal Daily package
TEST_AMOUNT="2000"   # 2000 TZS for daily package

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔴 REAL PAYMENT WEBHOOK TEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}⚠️  WARNING: This will initiate a REAL payment!${NC}"
echo ""
echo "📋 Test Configuration:"
echo "   Phone Number: $REAL_PHONE"
echo "   Package ID: $TEST_PACKAGE_ID"
echo "   Amount: $TEST_AMOUNT TZS"
echo "   API: $API_BASE"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

# Step 1: Get available packages
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 1: Getting Available Packages"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
response=$(curl -s -X GET "${API_BASE}/packages" -H "Content-Type: application/json")
package_name=$(echo "$response" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Package found: $package_name"
echo ""

# Step 2: Initiate REAL Payment
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💳 Step 2: Initiating REAL Payment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📱 You should receive a USSD prompt on your phone: $REAL_PHONE${NC}"
echo ""

payment_data="{
    \"customerName\": \"$TEST_NAME\",
    \"phoneNumber\": \"$REAL_PHONE\",
    \"packageId\": \"$TEST_PACKAGE_ID\",
    \"packageName\": \"$package_name\",
    \"amount\": \"$TEST_AMOUNT\",
    \"currency\": \"TZS\",
    \"paymentMethod\": \"ZENOPAY\"
}"

response=$(curl -s -X POST "${API_BASE}/payment" \
    -H "Content-Type: application/json" \
    -d "$payment_data")

echo "Payment Initiation Response:"
echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
echo ""

# Extract order ID
ORDER_ID=$(echo "$response" | grep -o '"order_id":"[^"]*"' | cut -d'"' -f4)
if [ -z "$ORDER_ID" ]; then
    echo -e "${RED}❌ Failed to extract order ID${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Payment Initiated Successfully${NC}"
echo -e "${BLUE}📋 Order ID: $ORDER_ID${NC}"
echo "$ORDER_ID" > /tmp/real_payment_order_id.txt
echo ""

# Step 3: Monitor Payment Status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏳ Step 3: Monitoring Payment Status (Waiting for Webhook)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📱 INSTRUCTIONS:${NC}"
echo "   1. Check your phone ($REAL_PHONE) for the USSD prompt"
echo "   2. Enter your PIN to complete the payment"
echo "   3. The webhook will arrive automatically (usually 30-120 seconds)"
echo ""
echo -e "${BLUE}🔄 Polling payment status every 5 seconds...${NC}"
echo "   (Press Ctrl+C to stop monitoring)"
echo ""

# Poll for status updates
MAX_ATTEMPTS=60  # 5 minutes total
ATTEMPT=0
LAST_STATUS=""

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    CURRENT_TIME=$(date '+%H:%M:%S')
    
    response=$(curl -s -X GET "${API_BASE}/payment/status/$ORDER_ID" -H "Content-Type: application/json")
    status=$(echo "$response" | grep -o '"payment_status":"[^"]*"' | cut -d'"' -f4)
    voucher_code=$(echo "$response" | grep -o '"voucher_code":"[^"]*"' | cut -d'"' -f4)
    
    # Only print if status changed
    if [ "$status" != "$LAST_STATUS" ]; then
        echo ""
        echo "[$CURRENT_TIME] Status Update: $status"
        if [ -n "$voucher_code" ]; then
            echo -e "${GREEN}   ✅ Voucher Code: $voucher_code${NC}"
        fi
        LAST_STATUS="$status"
    else
        # Show progress every 10 seconds
        if [ $((ATTEMPT % 2)) -eq 0 ]; then
            echo -n "."
        fi
    fi
    
    # Check if payment completed
    if [ "$status" = "COMPLETED" ] || [ "$status" = "SUCCESS" ] || [ "$status" = "SUCCESSFUL" ]; then
        echo ""
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}✅ PAYMENT COMPLETED!${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo "Full Response:"
        echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
        echo ""
        break
    fi
    
    # Check if payment failed
    if [ "$status" = "FAILED" ] || [ "$status" = "CANCELLED" ]; then
        echo ""
        echo ""
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}❌ PAYMENT FAILED${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo "Full Response:"
        echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
        echo ""
        break
    fi
    
    sleep 5
done

if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
    echo ""
    echo ""
    echo -e "${YELLOW}⏰ Timeout: Payment still pending after 5 minutes${NC}"
    echo "   The webhook may still arrive. Check backend logs for webhook activity."
    echo ""
fi

# Step 4: Final Status Check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Step 4: Final Payment Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
final_response=$(curl -s -X GET "${API_BASE}/payment/status/$ORDER_ID" -H "Content-Type: application/json")
echo ""
echo "Final Status Response:"
echo "$final_response" | python3 -m json.tool 2>/dev/null || echo "$final_response"
echo ""

# Step 5: Webhook Information
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔔 Step 5: Webhook Information"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Webhook Endpoint: ${API_BASE}/webhook/zenopay"
echo "Order ID: $ORDER_ID"
echo ""
echo -e "${BLUE}ℹ️  To check webhook logs on the backend server:${NC}"
echo "   tail -f /path/to/backend/logs/application.log | grep -i webhook"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TEST COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

