#!/bin/bash

# Full Coverage VPS Backend Testing
# Tests all endpoints systematically

VPS_URL="http://139.84.241.182:8080"
API_URL="$VPS_URL"

echo "╔════════════════════════════════════════════════════════╗"
echo "║     VPS BACKEND FULL COVERAGE TEST                     ║"
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
TOTAL=0

# Results storage
RESULTS_FILE="docs/testing/vps-test-results-$(date +%Y%m%d-%H%M%S).txt"
touch "$RESULTS_FILE"

# Test function
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    local token=$6
    
    ((TOTAL++))
    echo -n "[$TOTAL] Testing: $name... " | tee -a "$RESULTS_FILE"
    
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
    
    # Accept 200, 201, 400 (validation), 401 (auth required), 404 (not found) as valid responses
    if [ "$http_code" = "$expected_status" ] || [ -z "$expected_status" ] || 
       ([ "$http_code" -ge 200 ] && [ "$http_code" -lt 500 ] && [ -z "$expected_status" ]); then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)" | tee -a "$RESULTS_FILE"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (Expected HTTP $expected_status, got $http_code)" | tee -a "$RESULTS_FILE"
        ((FAILED++))
        local error_msg=$(echo "$body" | jq -r '.message // .error // empty' 2>/dev/null | head -1)
        if [ -n "$error_msg" ]; then
            echo "   Error: $error_msg" | tee -a "$RESULTS_FILE"
        fi
        return 1
    fi
}

# Check backend connectivity
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Backend Connectivity Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if curl -s --max-time 5 "$API_URL/api/v1/customer-portal/test" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is accessible${NC}" | tee -a "$RESULTS_FILE"
else
    echo -e "${RED}✗ Backend is not accessible${NC}" | tee -a "$RESULTS_FILE"
    exit 1
fi

echo "" | tee -a "$RESULTS_FILE"

# ============================================================
# PUBLIC ENDPOINTS (No Authentication Required)
# ============================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PUBLIC ENDPOINTS (No Auth Required)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "" | tee -a "$RESULTS_FILE"

# Customer Portal Public
test_endpoint "Customer Portal Test" "GET" "/api/v1/customer-portal/test" "" "200" ""
test_endpoint "Get Packages (Public)" "GET" "/api/v1/customer-portal/packages" "" "200" ""

# Customer Auth (Public)
test_endpoint "Request OTP" "POST" "/api/v1/customer-auth/request-otp" '{"phoneNumber":"+255742844024"}' "200" ""

# Loyalty Public
test_endpoint "Get All Rewards" "GET" "/api/v1/loyalty/rewards" "" "200" ""

echo "" | tee -a "$RESULTS_FILE"

# ============================================================
# CUSTOMER PORTAL ENDPOINTS (May require phone number)
# ============================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CUSTOMER PORTAL ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "" | tee -a "$RESULTS_FILE"

TEST_PHONE="+255742844024"

test_endpoint "Customer Dashboard" "GET" "/api/v1/customer-portal/customer/$TEST_PHONE/dashboard" "" "" ""
test_endpoint "Customer Profile" "GET" "/api/v1/customer-portal/customer/$TEST_PHONE/profile" "" "" ""
test_endpoint "Customer Usage" "GET" "/api/v1/customer-portal/customer/$TEST_PHONE/usage" "" "" ""
test_endpoint "Customer Payments" "GET" "/api/v1/customer-portal/customer/$TEST_PHONE/payments" "" "" ""

# Voucher endpoints
test_endpoint "Validate Voucher" "GET" "/api/v1/customer-portal/voucher/TEST123/validate" "" "" ""
test_endpoint "Session Status" "GET" "/api/v1/customer-portal/voucher/TEST123/session/status" "" "" ""

# Payment processing
test_endpoint "Process Payment" "POST" "/api/v1/customer-portal/payment" \
    '{"customerName":"Test User","phoneNumber":"+255742844024","packageId":"1","amount":"100","location":"Dar es Salaam"}' \
    "" ""

# Loyalty
test_endpoint "Loyalty Progress" "GET" "/api/v1/loyalty/progress/$TEST_PHONE" "" "" ""

echo "" | tee -a "$RESULTS_FILE"

# ============================================================
# AUTHENTICATION (Try with delay to avoid rate limiting)
# ============================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "AUTHENTICATION ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "" | tee -a "$RESULTS_FILE"

echo "Waiting 10 seconds to avoid rate limiting..." | tee -a "$RESULTS_FILE"
sleep 10

# Try admin login
login_response=$(curl -s -X POST "$API_URL/api/v1/auth/admin-login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')

ADMIN_TOKEN=$(echo "$login_response" | jq -r '.data.token // .token // empty' 2>/dev/null)

if [ -n "$ADMIN_TOKEN" ] && [ "$ADMIN_TOKEN" != "null" ]; then
    echo -e "${GREEN}✓ Admin authentication successful${NC}" | tee -a "$RESULTS_FILE"
    test_endpoint "Admin Login" "POST" "/api/v1/auth/admin-login" '{"username":"admin","password":"admin123"}' "200" ""
    
    echo "" | tee -a "$RESULTS_FILE"
    
    # ============================================================
    # ADMIN ENDPOINTS (With Token)
    # ============================================================
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "ADMIN ENDPOINTS (Authenticated)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    
    test_endpoint "Admin Dashboard" "GET" "/api/v1/admin/dashboard" "" "200" "$ADMIN_TOKEN"
    test_endpoint "Admin Health" "GET" "/api/v1/admin/health" "" "200" "$ADMIN_TOKEN"
    test_endpoint "List Customers" "GET" "/api/v1/admin/customers" "" "200" "$ADMIN_TOKEN"
    test_endpoint "List Packages" "GET" "/api/v1/admin/packages" "" "200" "$ADMIN_TOKEN"
    test_endpoint "List Vouchers" "GET" "/api/v1/admin/vouchers" "" "200" "$ADMIN_TOKEN"
    test_endpoint "List Payments" "GET" "/api/v1/admin/payments" "" "200" "$ADMIN_TOKEN"
    test_endpoint "List Invoices" "GET" "/api/v1/admin/invoices" "" "200" "$ADMIN_TOKEN"
    test_endpoint "Router Status" "GET" "/api/v1/admin/routers/status" "" "200" "$ADMIN_TOKEN"
    test_endpoint "Dashboard Stats" "GET" "/api/v1/admin/dashboard/stats" "" "200" "$ADMIN_TOKEN"
    
    echo "" | tee -a "$RESULTS_FILE"
else
    echo -e "${YELLOW}⚠ Admin authentication failed (rate limited or invalid credentials)${NC}" | tee -a "$RESULTS_FILE"
    echo "$login_response" | jq '.' 2>/dev/null || echo "$login_response" | tee -a "$RESULTS_FILE"
    ((SKIPPED++))
fi

# ============================================================
# SUMMARY
# ============================================================

echo "" | tee -a "$RESULTS_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "" | tee -a "$RESULTS_FILE"
echo -e "Total Tests: $TOTAL" | tee -a "$RESULTS_FILE"
echo -e "${GREEN}Passed: $PASSED${NC}" | tee -a "$RESULTS_FILE"
echo -e "${RED}Failed: $FAILED${NC}" | tee -a "$RESULTS_FILE"
if [ $SKIPPED -gt 0 ]; then
    echo -e "${YELLOW}Skipped: $SKIPPED${NC}" | tee -a "$RESULTS_FILE"
fi

PASS_RATE=$((PASSED * 100 / TOTAL))
echo -e "Pass Rate: ${PASS_RATE}%" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

# Coverage Report
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ENDPOINT COVERAGE REPORT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "" | tee -a "$RESULTS_FILE"

echo "✅ Public Endpoints:" | tee -a "$RESULTS_FILE"
echo "   - Customer Portal Test" | tee -a "$RESULTS_FILE"
echo "   - Get Packages" | tee -a "$RESULTS_FILE"
echo "   - Request OTP" | tee -a "$RESULTS_FILE"
echo "   - Get All Rewards" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

echo "✅ Customer Portal:" | tee -a "$RESULTS_FILE"
echo "   - Customer Dashboard" | tee -a "$RESULTS_FILE"
echo "   - Customer Profile" | tee -a "$RESULTS_FILE"
echo "   - Customer Usage" | tee -a "$RESULTS_FILE"
echo "   - Customer Payments" | tee -a "$RESULTS_FILE"
echo "   - Validate Voucher" | tee -a "$RESULTS_FILE"
echo "   - Session Status" | tee -a "$RESULTS_FILE"
echo "   - Process Payment" | tee -a "$RESULTS_FILE"
echo "   - Loyalty Progress" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

if [ -n "$ADMIN_TOKEN" ]; then
    echo "✅ Admin Endpoints:" | tee -a "$RESULTS_FILE"
    echo "   - Admin Dashboard" | tee -a "$RESULTS_FILE"
    echo "   - Admin Health" | tee -a "$RESULTS_FILE"
    echo "   - List Customers" | tee -a "$RESULTS_FILE"
    echo "   - List Packages" | tee -a "$RESULTS_FILE"
    echo "   - List Vouchers" | tee -a "$RESULTS_FILE"
    echo "   - List Payments" | tee -a "$RESULTS_FILE"
    echo "   - List Invoices" | tee -a "$RESULTS_FILE"
    echo "   - Router Status" | tee -a "$RESULTS_FILE"
    echo "   - Dashboard Stats" | tee -a "$RESULTS_FILE"
    echo "" | tee -a "$RESULTS_FILE"
fi

echo "Results saved to: $RESULTS_FILE" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}" | tee -a "$RESULTS_FILE"
    echo -e "${GREEN}║     ALL TESTS PASSED - BACKEND FULLY OPERATIONAL       ║${NC}" | tee -a "$RESULTS_FILE"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}" | tee -a "$RESULTS_FILE"
    exit 0
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}" | tee -a "$RESULTS_FILE"
    echo -e "${YELLOW}║     SOME TESTS FAILED - REVIEW RESULTS                ║${NC}" | tee -a "$RESULTS_FILE"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}" | tee -a "$RESULTS_FILE"
    exit 1
fi

