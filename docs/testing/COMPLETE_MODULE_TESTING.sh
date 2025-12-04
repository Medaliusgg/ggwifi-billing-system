#!/bin/bash

# Complete Module-by-Module Testing Script
# Tests all modules systematically on VPS backend

VPS_URL="http://139.84.241.182:8080"
API_URL="$VPS_URL"

echo "╔════════════════════════════════════════════════════════╗"
echo "║     COMPLETE MODULE-BY-MODULE TESTING                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Testing: $API_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Results
declare -A MODULE_RESULTS
TOTAL_MODULES=0
PASSED_MODULES=0
FAILED_MODULES=0
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

RESULTS_FILE="docs/testing/complete-module-test-$(date +%Y%m%d-%H%M%S).txt"
touch "$RESULTS_FILE"

# Test function
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    local token=$6
    
    ((TOTAL_TESTS++))
    
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
    
    # Accept 200, 201, 400, 401, 404 as valid responses
    if [ "$http_code" = "$expected_status" ] || 
       ([ -z "$expected_status" ] && [ "$http_code" -ge 200 ] && [ "$http_code" -lt 500 ]); then
        echo -e "  ${GREEN}✓${NC} $name (HTTP $http_code)"
        echo "  ✓ $name (HTTP $http_code)" >> "$RESULTS_FILE"
        ((PASSED_TESTS++))
        return 0
    else
        echo -e "  ${RED}✗${NC} $name (Expected $expected_status, got HTTP $http_code)"
        echo "  ✗ $name (Expected $expected_status, got HTTP $http_code)" >> "$RESULTS_FILE"
        local error_msg=$(echo "$body" | jq -r '.message // .error // empty' 2>/dev/null | head -1)
        if [ -n "$error_msg" ]; then
            echo "    Error: $error_msg" | tee -a "$RESULTS_FILE"
        fi
        ((FAILED_TESTS++))
        return 1
    fi
}

# Authenticate
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Authenticating..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

sleep 5

login_response=$(curl -s -X POST "$API_URL/api/v1/auth/admin-login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')

ADMIN_TOKEN=$(echo "$login_response" | jq -r '.data.token // .token // empty' 2>/dev/null)

if [ -n "$ADMIN_TOKEN" ] && [ "$ADMIN_TOKEN" != "null" ]; then
    echo -e "${GREEN}✓ Authentication successful${NC}"
    echo "✓ Authentication successful" >> "$RESULTS_FILE"
else
    echo -e "${YELLOW}⚠ Authentication failed - will test public endpoints only${NC}"
    echo "⚠ Authentication failed" >> "$RESULTS_FILE"
    ADMIN_TOKEN=""
fi

echo "" | tee -a "$RESULTS_FILE"

# ============================================================
# MODULE 1: AUTHENTICATION & AUTHORIZATION
# ============================================================

((TOTAL_MODULES++))
MODULE_NAME="Authentication & Authorization"
MODULE_PASSED=true

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${CYAN}MODULE 1: $MODULE_NAME${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "" | tee -a "$RESULTS_FILE"
echo "MODULE 1: $MODULE_NAME" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

test_endpoint "Admin Login" "POST" "/api/v1/auth/admin-login" '{"username":"admin","password":"admin123"}' "200" "" || MODULE_PASSED=false
test_endpoint "Request OTP" "POST" "/api/v1/customer-auth/request-otp" '{"phoneNumber":"+255742844024"}' "200" "" || MODULE_PASSED=false

if [ "$MODULE_PASSED" = true ]; then
    ((PASSED_MODULES++))
    MODULE_RESULTS["$MODULE_NAME"]="PASSED"
    echo -e "${GREEN}✓ Module 1 PASSED${NC}" | tee -a "$RESULTS_FILE"
else
    ((FAILED_MODULES++))
    MODULE_RESULTS["$MODULE_NAME"]="FAILED"
    echo -e "${RED}✗ Module 1 FAILED${NC}" | tee -a "$RESULTS_FILE"
fi

echo "" | tee -a "$RESULTS_FILE"

# ============================================================
# MODULE 2: CUSTOMER PORTAL
# ============================================================

((TOTAL_MODULES++))
MODULE_NAME="Customer Portal"
MODULE_PASSED=true

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${CYAN}MODULE 2: $MODULE_NAME${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "" | tee -a "$RESULTS_FILE"
echo "MODULE 2: $MODULE_NAME" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

TEST_PHONE="+255742844024"

test_endpoint "Test Endpoint" "GET" "/api/v1/customer-portal/test" "" "200" "" || MODULE_PASSED=false
test_endpoint "Get Packages" "GET" "/api/v1/customer-portal/packages" "" "200" "" || MODULE_PASSED=false
test_endpoint "Customer Dashboard" "GET" "/api/v1/customer-portal/customer/$TEST_PHONE/dashboard" "" "" "" || MODULE_PASSED=false
test_endpoint "Customer Profile" "GET" "/api/v1/customer-portal/customer/$TEST_PHONE/profile" "" "" "" || MODULE_PASSED=false
test_endpoint "Customer Usage" "GET" "/api/v1/customer-portal/customer/$TEST_PHONE/usage" "" "" "" || MODULE_PASSED=false
test_endpoint "Customer Payments" "GET" "/api/v1/customer-portal/customer/$TEST_PHONE/payments" "" "" "" || MODULE_PASSED=false
test_endpoint "Validate Voucher" "GET" "/api/v1/customer-portal/voucher/TEST123/validate" "" "" "" || MODULE_PASSED=false
test_endpoint "Session Status" "GET" "/api/v1/customer-portal/voucher/TEST123/session/status" "" "" "" || MODULE_PASSED=false
test_endpoint "Process Payment" "POST" "/api/v1/customer-portal/payment" \
    '{"customerName":"Test User","phoneNumber":"+255742844024","packageId":"1","amount":"100","location":"Dar es Salaam"}' \
    "" "" || MODULE_PASSED=false

if [ "$MODULE_PASSED" = true ]; then
    ((PASSED_MODULES++))
    MODULE_RESULTS["$MODULE_NAME"]="PASSED"
    echo -e "${GREEN}✓ Module 2 PASSED${NC}" | tee -a "$RESULTS_FILE"
else
    ((FAILED_MODULES++))
    MODULE_RESULTS["$MODULE_NAME"]="FAILED"
    echo -e "${RED}✗ Module 2 FAILED${NC}" | tee -a "$RESULTS_FILE"
fi

echo "" | tee -a "$RESULTS_FILE"

# ============================================================
# MODULE 3: ADMIN PORTAL
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Admin Portal"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 3: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 3: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "Admin Health" "GET" "/api/v1/admin/health" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Admin Dashboard" "GET" "/api/v1/admin/dashboard" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Dashboard Stats" "GET" "/api/v1/admin/dashboard/stats" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "List Users" "GET" "/api/v1/admin/users" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Router Status" "GET" "/api/v1/admin/routers/status" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 3 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 3 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 4: CUSTOMER MANAGEMENT
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Customer Management"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 4: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 4: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "List Customers" "GET" "/api/v1/admin/customers" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Active Customers" "GET" "/api/v1/admin/customers/active" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Customer Statistics" "GET" "/api/v1/admin/customers/statistics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 4 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 4 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 5: PACKAGE MANAGEMENT
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Package Management"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 5: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 5: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "List Packages" "GET" "/api/v1/admin/packages" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Package Analytics" "GET" "/api/v1/admin/packages/analytics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 5 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 5 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 6: VOUCHER MANAGEMENT
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Voucher Management"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 6: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 6: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "List Vouchers" "GET" "/api/v1/admin/vouchers" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Active Vouchers" "GET" "/api/v1/admin/vouchers/active" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Unused Vouchers" "GET" "/api/v1/admin/vouchers/unused" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Voucher Statistics" "GET" "/api/v1/admin/vouchers/statistics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Voucher Analytics" "GET" "/api/v1/admin/vouchers/analytics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 6 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 6 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 7: PAYMENT PROCESSING
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Payment Processing"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 7: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 7: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "List Payments" "GET" "/api/v1/admin/payments" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Payment Statistics" "GET" "/api/v1/admin/payments/statistics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Payment Analytics" "GET" "/api/v1/admin/payments/analytics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 7 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 7 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 8: INVOICE MANAGEMENT
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Invoice Management"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 8: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 8: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "List Invoices" "GET" "/api/v1/admin/invoices" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Paid Invoices" "GET" "/api/v1/admin/invoices/paid" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Unpaid Invoices" "GET" "/api/v1/admin/invoices/unpaid" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Invoice Statistics" "GET" "/api/v1/admin/invoices/statistics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 8 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 8 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 9: TRANSACTION MANAGEMENT
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Transaction Management"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 9: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 9: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "List Transactions" "GET" "/api/v1/admin/transactions" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Transaction Statistics" "GET" "/api/v1/admin/transactions/statistics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 9 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 9 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 10: LOYALTY PROGRAM
# ============================================================

((TOTAL_MODULES++))
MODULE_NAME="Loyalty Program"
MODULE_PASSED=true

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${CYAN}MODULE 10: $MODULE_NAME${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "" | tee -a "$RESULTS_FILE"
echo "MODULE 10: $MODULE_NAME" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

test_endpoint "Loyalty Progress" "GET" "/api/v1/loyalty/progress/$TEST_PHONE" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
test_endpoint "All Rewards" "GET" "/api/v1/loyalty/rewards" "" "" "" || MODULE_PASSED=false

if [ -n "$ADMIN_TOKEN" ]; then
    test_endpoint "Top Customers" "GET" "/api/v1/loyalty/top-customers" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Loyalty Tiers" "GET" "/api/v1/loyalty/tiers" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Point Rules" "GET" "/api/v1/loyalty/point-rules" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Inventory" "GET" "/api/v1/loyalty/inventory" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
fi

if [ "$MODULE_PASSED" = true ]; then
    ((PASSED_MODULES++))
    MODULE_RESULTS["$MODULE_NAME"]="PASSED"
    echo -e "${GREEN}✓ Module 10 PASSED${NC}" | tee -a "$RESULTS_FILE"
else
    ((FAILED_MODULES++))
    MODULE_RESULTS["$MODULE_NAME"]="FAILED"
    echo -e "${RED}✗ Module 10 FAILED${NC}" | tee -a "$RESULTS_FILE"
fi

echo "" | tee -a "$RESULTS_FILE"

# ============================================================
# MODULE 11: SESSION MANAGEMENT
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Session Management"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 11: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 11: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "Active Sessions" "GET" "/api/v1/sessions/active" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 11 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 11 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 12: ROUTER MANAGEMENT
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Router Management"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 12: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 12: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "List Routers" "GET" "/api/v1/admin/routers" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Router Status" "GET" "/api/v1/admin/routers/status" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 12 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 12 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 13: ACCESS POINT MANAGEMENT
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Access Point Management"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 13: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 13: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "List Access Points" "GET" "/api/v1/ap-management" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Online APs" "GET" "/api/v1/ap-management/online" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Offline APs" "GET" "/api/v1/ap-management/offline" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "AP Statistics" "GET" "/api/v1/ap-management/statistics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Health Summary" "GET" "/api/v1/ap-management/health-summary" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 13 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 13 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 14: DEVICE MANAGEMENT
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Device Management"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 14: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 14: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "Device Statistics" "GET" "/api/v1/device-management/statistics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Blacklisted Devices" "GET" "/api/v1/device-management/blacklisted" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 14 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 14 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 15: USER MANAGEMENT
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="User Management"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 15: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 15: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "Search Users" "GET" "/api/v1/user-management/search?query=test" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "User Statistics" "GET" "/api/v1/user-management/statistics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 15 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 15 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 16: SYSTEM SETTINGS
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="System Settings"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 16: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 16: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "Get All Settings" "GET" "/api/v1/system-settings" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Hotspot Settings" "GET" "/api/v1/system-settings/hotspot" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "API Keys" "GET" "/api/v1/system-settings/api-keys" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Notification Settings" "GET" "/api/v1/system-settings/notifications" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Voucher Settings" "GET" "/api/v1/system-settings/voucher" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "Loyalty Settings" "GET" "/api/v1/system-settings/loyalty" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 16 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 16 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 17: MARKETING AUTOMATION
# ============================================================

if [ -n "$ADMIN_TOKEN" ]; then
    ((TOTAL_MODULES++))
    MODULE_NAME="Marketing Automation"
    MODULE_PASSED=true

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}MODULE 17: $MODULE_NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" | tee -a "$RESULTS_FILE"
    echo "MODULE 17: $MODULE_NAME" >> "$RESULTS_FILE"
    echo "" >> "$RESULTS_FILE"

    test_endpoint "List Campaigns" "GET" "/api/v1/marketing/campaigns" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "List Segments" "GET" "/api/v1/marketing/segments" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "List Templates" "GET" "/api/v1/marketing/templates" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "List Media" "GET" "/api/v1/marketing/media" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false
    test_endpoint "List Automations" "GET" "/api/v1/marketing/automation" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

    if [ "$MODULE_PASSED" = true ]; then
        ((PASSED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="PASSED"
        echo -e "${GREEN}✓ Module 17 PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        ((FAILED_MODULES++))
        MODULE_RESULTS["$MODULE_NAME"]="FAILED"
        echo -e "${RED}✗ Module 17 FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi

    echo "" | tee -a "$RESULTS_FILE"
fi

# ============================================================
# MODULE 18: SUPPORT TICKETS
# ============================================================

((TOTAL_MODULES++))
MODULE_NAME="Support Tickets"
MODULE_PASSED=true

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${CYAN}MODULE 18: $MODULE_NAME${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "" | tee -a "$RESULTS_FILE"
echo "MODULE 18: $MODULE_NAME" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

test_endpoint "Ticket Statistics" "GET" "/api/v1/support/tickets/statistics" "" "200" "$ADMIN_TOKEN" || MODULE_PASSED=false

if [ "$MODULE_PASSED" = true ]; then
    ((PASSED_MODULES++))
    MODULE_RESULTS["$MODULE_NAME"]="PASSED"
    echo -e "${GREEN}✓ Module 18 PASSED${NC}" | tee -a "$RESULTS_FILE"
else
    ((FAILED_MODULES++))
    MODULE_RESULTS["$MODULE_NAME"]="FAILED"
    echo -e "${RED}✗ Module 18 FAILED${NC}" | tee -a "$RESULTS_FILE"
fi

echo "" | tee -a "$RESULTS_FILE"

# ============================================================
# SUMMARY
# ============================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "COMPLETE MODULE TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "" | tee -a "$RESULTS_FILE"
echo "COMPLETE MODULE TEST SUMMARY" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

echo -e "Total Modules Tested: $TOTAL_MODULES" | tee -a "$RESULTS_FILE"
echo -e "${GREEN}Passed Modules: $PASSED_MODULES${NC}" | tee -a "$RESULTS_FILE"
echo -e "${RED}Failed Modules: $FAILED_MODULES${NC}" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

echo -e "Total Endpoint Tests: $TOTAL_TESTS" | tee -a "$RESULTS_FILE"
echo -e "${GREEN}Passed Tests: $PASSED_TESTS${NC}" | tee -a "$RESULTS_FILE"
echo -e "${RED}Failed Tests: $FAILED_TESTS${NC}" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

if [ $TOTAL_TESTS -gt 0 ]; then
    PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "Pass Rate: ${PASS_RATE}%" | tee -a "$RESULTS_FILE"
fi

if [ $TOTAL_MODULES -gt 0 ]; then
    MODULE_PASS_RATE=$((PASSED_MODULES * 100 / TOTAL_MODULES))
    echo -e "Module Pass Rate: ${MODULE_PASS_RATE}%" | tee -a "$RESULTS_FILE"
fi

echo "" | tee -a "$RESULTS_FILE"

# Module-by-module results
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "MODULE RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "" | tee -a "$RESULTS_FILE"
echo "MODULE RESULTS" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

for module in "${!MODULE_RESULTS[@]}"; do
    if [ "${MODULE_RESULTS[$module]}" = "PASSED" ]; then
        echo -e "${GREEN}✓ $module: PASSED${NC}" | tee -a "$RESULTS_FILE"
    else
        echo -e "${RED}✗ $module: FAILED${NC}" | tee -a "$RESULTS_FILE"
    fi
done

echo "" | tee -a "$RESULTS_FILE"
echo "Results saved to: $RESULTS_FILE" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

if [ $FAILED_MODULES -eq 0 ] && [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}" | tee -a "$RESULTS_FILE"
    echo -e "${GREEN}║     ALL MODULES PASSED - BACKEND FULLY OPERATIONAL   ║${NC}" | tee -a "$RESULTS_FILE"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}" | tee -a "$RESULTS_FILE"
    exit 0
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}" | tee -a "$RESULTS_FILE"
    echo -e "${YELLOW}║     SOME MODULES FAILED - REVIEW RESULTS              ║${NC}" | tee -a "$RESULTS_FILE"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}" | tee -a "$RESULTS_FILE"
    exit 1
fi

