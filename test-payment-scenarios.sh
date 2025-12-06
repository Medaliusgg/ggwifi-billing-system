#!/bin/bash

# ============================================================================
# PAYMENT SCENARIOS TEST
# ============================================================================
# Tests different payment scenarios to see how the system responds:
# 1. Success scenario
# 2. Insufficient balance
# 3. Wrong PIN
# 4. Payment timeout
# ============================================================================

set -e

API_BASE="http://139.84.241.182:8080/api/v1/customer-portal"
TEST_PHONE="0658823944"
TEST_NAME="Scenario Test Customer"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 PAYMENT SCENARIOS TEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script will test how the system responds to different payment scenarios"
echo ""

# Function to initiate payment
initiate_payment() {
    local package_id=$1
    local amount=$2
    local scenario=$3
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}📋 Scenario: $scenario${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    payment_data="{
        \"customerName\": \"$TEST_NAME\",
        \"phoneNumber\": \"$TEST_PHONE\",
        \"packageId\": \"$package_id\",
        \"packageName\": \"Test Package\",
        \"amount\": \"$amount\",
        \"currency\": \"TZS\",
        \"paymentMethod\": \"ZENOPAY\"
    }"
    
    response=$(curl -s -X POST "${API_BASE}/payment" \
        -H "Content-Type: application/json" \
        -d "$payment_data")
    
    echo "Payment Initiation Response:"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
    echo ""
    
    ORDER_ID=$(echo "$response" | grep -o '"order_id":"[^"]*"' | cut -d'"' -f4)
    if [ -z "$ORDER_ID" ]; then
        echo -e "${RED}❌ Failed to get order ID${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Order ID: $ORDER_ID${NC}"
    echo "$ORDER_ID" > /tmp/scenario_order_id.txt
    echo ""
    
    return 0
}

# Function to monitor payment status
monitor_status() {
    local order_id=$1
    local max_wait=$2  # seconds
    local scenario_name=$3
    
    echo -e "${YELLOW}⏳ Monitoring payment status (max ${max_wait}s)...${NC}"
    echo ""
    echo "📱 Instructions:"
    case "$scenario_name" in
        "SUCCESS")
            echo "   ✅ Enter your PIN correctly to complete payment"
            ;;
        "INSUFFICIENT_BALANCE")
            echo "   💳 Use a phone number with insufficient balance"
            echo "   Expected: System should detect INSUFFICIENT_BALANCE status"
            ;;
        "WRONG_PIN")
            echo "   🔐 Enter wrong PIN 3 times"
            echo "   Expected: System should detect INVALID_PIN status"
            ;;
        "TIMEOUT")
            echo "   ⏰ Do NOT enter PIN - let it timeout"
            echo "   Expected: System should timeout after 90 seconds"
            ;;
    esac
    echo ""
    
    local elapsed=0
    local last_status=""
    
    while [ $elapsed -lt $max_wait ]; do
        response=$(curl -s -X GET "${API_BASE}/payment/status/$order_id" -H "Content-Type: application/json")
        status=$(echo "$response" | grep -o '"payment_status":"[^"]*"' | cut -d'"' -f4)
        voucher=$(echo "$response" | grep -o '"voucher_code":"[^"]*"' | cut -d'"' -f4)
        message=$(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        timeout_warning=$(echo "$response" | grep -o '"timeout_warning":[^,}]*' | cut -d':' -f2)
        
        if [ "$status" != "$last_status" ] || [ $elapsed -eq 0 ]; then
            time_str=$(date '+%H:%M:%S')
            echo "[$time_str] Status: $status"
            if [ -n "$message" ]; then
                echo "   Message: $message"
            fi
            if [ "$timeout_warning" = "true" ]; then
                echo -e "   ${YELLOW}⚠️  Timeout Warning: Payment taking longer than expected${NC}"
            fi
            if [ -n "$voucher" ]; then
                echo -e "   ${GREEN}✅ Voucher: $voucher${NC}"
            fi
            echo ""
            last_status="$status"
        fi
        
        # Check final states
        if [ "$status" = "COMPLETED" ] || [ "$status" = "SUCCESS" ] || [ "$status" = "SUCCESSFUL" ]; then
            echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${GREEN}✅ PAYMENT SUCCESSFUL!${NC}"
            echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo ""
            echo "Full Response:"
            echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
            return 0
        fi
        
        if [ "$status" = "FAILED" ] || [ "$status" = "INSUFFICIENT_BALANCE" ] || [ "$status" = "INVALID_PIN" ] || [ "$status" = "CANCELLED" ]; then
            echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${RED}❌ PAYMENT FAILED: $status${NC}"
            echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo ""
            echo "Full Response:"
            echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
            return 1
        fi
        
        if [ "$status" = "EXPIRED" ] || [ "$status" = "TIMEOUT" ]; then
            echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${YELLOW}⏰ PAYMENT TIMEOUT/EXPIRED${NC}"
            echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo ""
            echo "Full Response:"
            echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
            return 1
        fi
        
        sleep 5
        elapsed=$((elapsed + 5))
    done
    
    echo ""
    echo -e "${YELLOW}⏰ Monitoring timeout reached${NC}"
    echo "Final Status: $status"
    return 1
}

# Test scenarios
echo "Select test scenario:"
echo "1. SUCCESS - Normal payment flow"
echo "2. INSUFFICIENT_BALANCE - Test with insufficient balance"
echo "3. WRONG_PIN - Test with wrong PIN"
echo "4. TIMEOUT - Test payment timeout"
echo "5. Test all scenarios"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        initiate_payment "1" "2000" "SUCCESS"
        monitor_status "$ORDER_ID" 120 "SUCCESS"
        ;;
    2)
        echo ""
        echo -e "${YELLOW}⚠️  For this test, use a phone number with insufficient balance${NC}"
        read -p "Press Enter to continue..."
        initiate_payment "1" "2000" "INSUFFICIENT_BALANCE"
        monitor_status "$ORDER_ID" 120 "INSUFFICIENT_BALANCE"
        ;;
    3)
        echo ""
        echo -e "${YELLOW}⚠️  For this test, enter wrong PIN 3 times${NC}"
        read -p "Press Enter to continue..."
        initiate_payment "1" "2000" "WRONG_PIN"
        monitor_status "$ORDER_ID" 120 "WRONG_PIN"
        ;;
    4)
        echo ""
        echo -e "${YELLOW}⚠️  For this test, DO NOT enter PIN - let it timeout${NC}"
        read -p "Press Enter to continue..."
        initiate_payment "1" "2000" "TIMEOUT"
        monitor_status "$ORDER_ID" 120 "TIMEOUT"
        ;;
    5)
        echo ""
        echo "Testing all scenarios..."
        echo ""
        # This would require multiple payments - simplified for now
        echo "Please test each scenario individually for best results"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TEST COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

