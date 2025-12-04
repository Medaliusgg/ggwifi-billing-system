#!/bin/bash

# Comprehensive VPS Backend Testing
# Tests all endpoints and functionality on deployed backend

VPS_URL="http://139.84.241.182:8080"
API_URL="$VPS_URL"

echo "╔════════════════════════════════════════════════════════╗"
echo "║     VPS BACKEND COMPREHENSIVE TESTING                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Testing: $API_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0
SKIPPED=0

# Test function
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    local token=$6
    
    echo -n "Testing: $name... "
    
    local response
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL$endpoint" \
            ${token:+-H "Authorization: Bearer $token"})
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            ${token:+-H "Authorization: Bearer $token"} \
            ${data:+-d "$data"})
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X PUT "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            ${token:+-H "Authorization: Bearer $token"} \
            ${data:+-d "$data"})
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL$endpoint" \
            ${token:+-H "Authorization: Bearer $token"})
    fi
    
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_status" ] || [ -z "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (Expected HTTP $expected_status, got $http_code)"
        ((FAILED++))
        echo "$body" | jq -r '.message // .error // empty' 2>/dev/null | head -1
        return 1
    fi
}

# Check backend connectivity
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Backend Connectivity Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if curl -s --max-time 5 "$API_URL/api/v1/customer-portal/test" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is accessible${NC}"
else
    echo -e "${RED}✗ Backend is not accessible${NC}"
    exit 1
fi

echo ""

# Step 1: Authentication
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. AUTHENTICATION ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Admin Login
echo "1.1 Admin Login..."
login_response=$(curl -s -X POST "$API_URL/api/v1/auth/admin-login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')

ADMIN_TOKEN=$(echo "$login_response" | jq -r '.data.token // .token // empty' 2>/dev/null)

if [ -n "$ADMIN_TOKEN" ] && [ "$ADMIN_TOKEN" != "null" ]; then
    echo -e "${GREEN}✓ Admin authentication successful${NC}"
    test_endpoint "Admin Login" "POST" "/api/v1/auth/admin-login" '{"username":"admin","password":"admin123"}' "200" ""
else
    echo -e "${RED}✗ Admin authentication failed${NC}"
    echo "$login_response" | jq '.' 2>/dev/null || echo "$login_response"
    exit 1
fi

echo ""

# Customer Auth - Request OTP
echo "1.2 Customer OTP Request..."
test_endpoint "Request OTP" "POST" "/api/v1/customer-auth/request-otp" '{"phoneNumber":"+255742844024"}' "200" ""

echo ""

# Step 2: Customer Portal Endpoints
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. CUSTOMER PORTAL ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_endpoint "Test Endpoint" "GET" "/api/v1/customer-portal/test" "" "200" ""
test_endpoint "Get Packages" "GET" "/api/v1/customer-portal/packages" "" "200" ""

# Get customer dashboard (requires phone number)
echo "2.3 Customer Dashboard..."
test_endpoint "Customer Dashboard" "GET" "/api/v1/customer-portal/customer/+255742844024/dashboard" "" "200" ""

# Get customer profile
echo "2.4 Customer Profile..."
test_endpoint "Customer Profile" "GET" "/api/v1/customer-portal/customer/+255742844024/profile" "" "200" ""

# Get customer usage
echo "2.5 Customer Usage..."
test_endpoint "Customer Usage" "GET" "/api/v1/customer-portal/customer/+255742844024/usage" "" "200" ""

# Get customer payments
echo "2.6 Customer Payments..."
test_endpoint "Customer Payments" "GET" "/api/v1/customer-portal/customer/+255742844024/payments" "" "200" ""

echo ""

# Step 3: Voucher Endpoints
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. VOUCHER ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Note: Using a test voucher code - adjust if needed
VOUCHER_CODE="TEST123"
echo "3.1 Validate Voucher..."
test_endpoint "Validate Voucher" "GET" "/api/v1/customer-portal/voucher/$VOUCHER_CODE/validate" "" "200" ""

echo "3.2 Session Status..."
test_endpoint "Session Status" "GET" "/api/v1/customer-portal/voucher/$VOUCHER_CODE/session/status" "" "200" ""

echo ""

# Step 4: Admin Endpoints (with token)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. ADMIN ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${YELLOW}⚠ Skipping admin endpoints - no token${NC}"
    ((SKIPPED++))
else
    echo "4.1 Dashboard Statistics..."
    test_endpoint "Dashboard Stats" "GET" "/api/v1/admin/dashboard" "" "200" "$ADMIN_TOKEN"
    
    echo "4.2 Get Customers..."
    test_endpoint "List Customers" "GET" "/api/v1/admin/customers" "" "200" "$ADMIN_TOKEN"
    
    echo "4.3 Get Packages..."
    test_endpoint "List Packages" "GET" "/api/v1/admin/packages" "" "200" "$ADMIN_TOKEN"
    
    echo "4.4 Get Vouchers..."
    test_endpoint "List Vouchers" "GET" "/api/v1/admin/vouchers" "" "200" "$ADMIN_TOKEN"
    
    echo "4.5 Get Payments..."
    test_endpoint "List Payments" "GET" "/api/v1/admin/payments" "" "200" "$ADMIN_TOKEN"
    
    echo "4.6 Get Invoices..."
    test_endpoint "List Invoices" "GET" "/api/v1/admin/invoices" "" "200" "$ADMIN_TOKEN"
    
    echo "4.7 Router Status..."
    test_endpoint "Router Status" "GET" "/api/v1/admin/routers/status" "" "200" "$ADMIN_TOKEN"
fi

echo ""

# Step 5: Payment Endpoints
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. PAYMENT ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "5.1 Process Payment..."
PAYMENT_DATA='{"customerName":"Test User","phoneNumber":"+255742844024","packageId":"1","amount":"100","location":"Dar es Salaam"}'
test_endpoint "Process Payment" "POST" "/api/v1/customer-portal/payment" "$PAYMENT_DATA" "200" ""

echo ""

# Step 6: Loyalty Endpoints
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. LOYALTY ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "6.1 Loyalty Progress..."
test_endpoint "Loyalty Progress" "GET" "/api/v1/loyalty/progress/+255742844024" "" "200" ""

echo "6.2 All Rewards..."
test_endpoint "All Rewards" "GET" "/api/v1/loyalty/rewards" "" "200" ""

echo ""

# Step 7: Health & Status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. HEALTH & STATUS ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -n "$ADMIN_TOKEN" ]; then
    echo "7.1 Admin Health..."
    test_endpoint "Admin Health" "GET" "/api/v1/admin/health" "" "200" "$ADMIN_TOKEN"
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
if [ $SKIPPED -gt 0 ]; then
    echo -e "${YELLOW}Skipped: $SKIPPED${NC}"
fi
echo ""

# Coverage Report
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ENDPOINT COVERAGE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✅ Authentication:"
echo "   - Admin Login"
echo "   - Customer OTP Request"
echo ""

echo "✅ Customer Portal:"
echo "   - Test Endpoint"
echo "   - Get Packages"
echo "   - Customer Dashboard"
echo "   - Customer Profile"
echo "   - Customer Usage"
echo "   - Customer Payments"
echo ""

echo "✅ Vouchers:"
echo "   - Validate Voucher"
echo "   - Session Status"
echo ""

if [ -n "$ADMIN_TOKEN" ]; then
    echo "✅ Admin:"
    echo "   - Dashboard Statistics"
    echo "   - List Customers"
    echo "   - List Packages"
    echo "   - List Vouchers"
    echo "   - List Payments"
    echo "   - List Invoices"
    echo "   - Router Status"
    echo "   - Admin Health"
    echo ""
fi

echo "✅ Payments:"
echo "   - Process Payment"
echo ""

echo "✅ Loyalty:"
echo "   - Loyalty Progress"
echo "   - All Rewards"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     ALL TESTS PASSED - BACKEND FULLY OPERATIONAL       ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║     SOME TESTS FAILED - REVIEW RESULTS                ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi

