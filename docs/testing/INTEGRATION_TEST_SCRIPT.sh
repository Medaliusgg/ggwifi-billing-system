#!/bin/bash

# Integration Testing Script
# Tests end-to-end user flows and cross-module interactions

BASE_URL="${BASE_URL:-http://localhost:8080}"
VPS_URL="${VPS_URL:-http://139.84.241.182:8080}"
USE_VPS="${USE_VPS:-false}"

if [ "$USE_VPS" = "true" ]; then
    API_URL="$VPS_URL"
else
    API_URL="$BASE_URL"
fi

echo "╔════════════════════════════════════════════════════════╗"
echo "║     INTEGRATION TESTING - E2E FLOWS                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "API URL: $API_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    
    echo -n "Testing: $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL$endpoint" \
            ${TOKEN:+-H "Authorization: Bearer $TOKEN"})
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            ${TOKEN:+-H "Authorization: Bearer $TOKEN"} \
            ${data:+-d "$data"})
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X PUT "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            ${TOKEN:+-H "Authorization: Bearer $TOKEN"} \
            ${data:+-d "$data"})
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        echo "$body" | jq -r '.status, .message // .data // empty' 2>/dev/null | head -2
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (Expected HTTP $expected_status, got $http_code)"
        ((FAILED++))
        echo "$body" | jq -r '.message // .error // empty' 2>/dev/null | head -1
        return 1
    fi
}

# Step 1: Authenticate
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Authentication"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

login_response=$(curl -s -X POST "$API_URL/api/v1/auth/admin-login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')

TOKEN=$(echo "$login_response" | jq -r '.data.token // empty' 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo -e "${RED}✗ Authentication failed${NC}"
    echo "$login_response" | jq '.' 2>/dev/null || echo "$login_response"
    exit 1
fi

echo -e "${GREEN}✓ Authenticated${NC}"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Step 2: Complete Customer Journey
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Complete Customer Journey"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TIMESTAMP=$(date +%s)
CUSTOMER_EMAIL="integration$TIMESTAMP@test.com"
CUSTOMER_PHONE="+2557$TIMESTAMP"

# 2.1 Create Customer
echo "2.1 Creating customer..."
customer_data="{\"firstName\":\"Integration\",\"lastName\":\"Test\",\"email\":\"$CUSTOMER_EMAIL\",\"primaryPhoneNumber\":\"$CUSTOMER_PHONE\",\"status\":\"ACTIVE\",\"accountType\":\"INDIVIDUAL\"}"
test_endpoint "Create Customer" "POST" "/api/v1/admin/customers" "$customer_data" "200"
CUSTOMER_ID=$(echo "$body" | jq -r '.data.id // empty' 2>/dev/null)
echo "Customer ID: $CUSTOMER_ID"
echo ""

# 2.2 List Packages
echo "2.2 Listing packages..."
test_endpoint "List Packages" "GET" "/api/v1/admin/packages" "" "200"
PACKAGE_ID=$(echo "$body" | jq -r '.data[0].id // empty' 2>/dev/null)
echo "Package ID: $PACKAGE_ID"
echo ""

# 2.3 Create Voucher
if [ -n "$PACKAGE_ID" ] && [ "$PACKAGE_ID" != "null" ]; then
    echo "2.3 Creating voucher..."
    voucher_code="INTEG$TIMESTAMP"
    voucher_data="{\"voucherCode\":\"$voucher_code\",\"packageId\":$PACKAGE_ID,\"amount\":1000,\"customerName\":\"Integration Test\",\"customerPhone\":\"$CUSTOMER_PHONE\",\"customerEmail\":\"$CUSTOMER_EMAIL\"}"
    test_endpoint "Create Voucher" "POST" "/api/v1/admin/vouchers" "$voucher_data" "200"
    VOUCHER_ID=$(echo "$body" | jq -r '.data.id // empty' 2>/dev/null)
    echo "Voucher ID: $VOUCHER_ID"
    echo ""
fi

# 2.4 Create Invoice
if [ -n "$CUSTOMER_ID" ] && [ "$CUSTOMER_ID" != "null" ] && [ -n "$PACKAGE_ID" ] && [ "$PACKAGE_ID" != "null" ]; then
    echo "2.4 Creating invoice..."
    invoice_data="{\"customerId\":$CUSTOMER_ID,\"packageId\":$PACKAGE_ID,\"amount\":1000,\"totalAmount\":1000,\"currency\":\"TZS\",\"status\":\"PENDING\",\"notes\":\"Integration test invoice\"}"
    test_endpoint "Create Invoice" "POST" "/api/v1/admin/invoices" "$invoice_data" "200"
    INVOICE_ID=$(echo "$body" | jq -r '.data.id // empty' 2>/dev/null)
    echo "Invoice ID: $INVOICE_ID"
    echo ""
fi

# 2.5 Create Payment
if [ -n "$INVOICE_ID" ] && [ "$INVOICE_ID" != "null" ]; then
    echo "2.5 Creating payment..."
    payment_data="{\"invoiceId\":$INVOICE_ID,\"amount\":1000,\"paymentMethod\":\"MOBILE_MONEY\",\"status\":\"COMPLETED\",\"notes\":\"Integration test payment\"}"
    test_endpoint "Create Payment" "POST" "/api/v1/admin/payments" "$payment_data" "200"
    PAYMENT_ID=$(echo "$body" | jq -r '.data.id // empty' 2>/dev/null)
    echo "Payment ID: $PAYMENT_ID"
    echo ""
fi

# Step 3: Verify Data Consistency
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Data Consistency Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$CUSTOMER_ID" ] && [ "$CUSTOMER_ID" != "null" ]; then
    echo "3.1 Verifying customer exists..."
    test_endpoint "Get Customer" "GET" "/api/v1/admin/customers/$CUSTOMER_ID" "" "200"
    echo ""
fi

if [ -n "$PAYMENT_ID" ] && [ "$PAYMENT_ID" != "null" ]; then
    echo "3.2 Verifying payment exists..."
    test_endpoint "Get Payment" "GET" "/api/v1/admin/payments/$PAYMENT_ID" "" "200"
    echo ""
fi

# Step 4: Dashboard Aggregation
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Dashboard Data Aggregation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Dashboard Statistics" "GET" "/api/v1/admin/dashboard" "" "200"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "INTEGRATION TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All integration tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi

