#!/bin/bash

# Admin Portal API Testing Script
# Tests all admin portal endpoints against VPS backend

set -e

VPS_URL="http://139.84.241.182:8080/api/v1"
TEST_PHONE="+255658823944"
TEST_RESULTS="admin_portal_test_results_$(date +%Y%m%d_%H%M%S).log"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Admin Portal API Testing"
echo "VPS URL: $VPS_URL"
echo "Test Results: $TEST_RESULTS"
echo "=========================================="
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    local requires_auth=${5:-true}
    
    local url="${VPS_URL}${endpoint}"
    local headers=()
    
    if [ "$requires_auth" = "true" ] && [ -n "$ADMIN_TOKEN" ]; then
        headers+=("-H" "Authorization: Bearer $ADMIN_TOKEN")
    fi
    
    headers+=("-H" "Content-Type: application/json")
    
    echo -n "Testing: $description ... "
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" "${headers[@]}" -d "$data" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" "${headers[@]}" 2>&1)
    fi
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}PASS${NC} (HTTP $http_code)"
        echo "[PASS] $description - HTTP $http_code" >> "$TEST_RESULTS"
        return 0
    elif [ "$http_code" -eq 401 ]; then
        echo -e "${YELLOW}SKIP${NC} (HTTP 401 - Auth required)"
        echo "[SKIP] $description - HTTP 401 (Auth required)" >> "$TEST_RESULTS"
        return 2
    else
        echo -e "${RED}FAIL${NC} (HTTP $http_code)"
        echo "[FAIL] $description - HTTP $http_code" >> "$TEST_RESULTS"
        echo "Response: $body" >> "$TEST_RESULTS"
        return 1
    fi
}

# Step 1: Admin Login
echo "=========================================="
echo "Step 1: Admin Login"
echo "=========================================="

LOGIN_RESPONSE=$(curl -s -X POST "${VPS_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "admin",
        "phoneNumber": "0742844024",
        "password": "admin123"
    }')

ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // empty')

if [ -z "$ADMIN_TOKEN" ] || [ "$ADMIN_TOKEN" = "null" ]; then
    echo -e "${RED}ERROR: Failed to get admin token${NC}"
    echo "$LOGIN_RESPONSE" | jq '.'
    exit 1
fi

echo -e "${GREEN}✓ Admin login successful${NC}"
echo "Token: ${ADMIN_TOKEN:0:50}..."
echo ""

# Step 2: Dashboard Tests
echo "=========================================="
echo "Step 2: Dashboard Tests"
echo "=========================================="

test_endpoint "GET" "/admin/dashboard" "" "Admin Dashboard" true
test_endpoint "GET" "/admin/dashboard/stats" "" "Dashboard Statistics" true
test_endpoint "GET" "/admin/health" "" "Admin Health Check" true

echo ""

# Step 3: Customer Management Tests
echo "=========================================="
echo "Step 3: Customer Management Tests"
echo "=========================================="

test_endpoint "GET" "/admin/customers" "" "List All Customers" true
test_endpoint "GET" "/admin/customers/phone/${TEST_PHONE}" "" "Get Customer by Phone" true
test_endpoint "GET" "/admin/customers/statistics" "" "Customer Statistics" true

echo ""

# Step 4: Package Management Tests
echo "=========================================="
echo "Step 4: Package Management Tests"
echo "=========================================="

test_endpoint "GET" "/admin/packages" "" "List All Packages" true

echo ""

# Step 5: Voucher Management Tests
echo "=========================================="
echo "Step 5: Voucher Management Tests"
echo "=========================================="

test_endpoint "GET" "/admin/vouchers" "" "List All Vouchers" true

echo ""

# Step 6: Payment Management Tests
echo "=========================================="
echo "Step 6: Payment Management Tests"
echo "=========================================="

test_endpoint "GET" "/admin/payments" "" "List All Payments" true
test_endpoint "GET" "/admin/payments/phone/${TEST_PHONE}" "" "Get Payments by Phone" true

echo ""

# Step 7: Invoice Management Tests
echo "=========================================="
echo "Step 7: Invoice Management Tests"
echo "=========================================="

test_endpoint "GET" "/admin/invoices" "" "List All Invoices" true
test_endpoint "GET" "/admin/invoices/statistics" "" "Invoice Statistics" true

echo ""

# Step 8: Session Management Tests
echo "=========================================="
echo "Step 8: Session Management Tests"
echo "=========================================="

test_endpoint "GET" "/sessions/active" "" "List Active Sessions" true
test_endpoint "GET" "/radius/statistics" "" "RADIUS Statistics" true

echo ""

# Step 9: Router Management Tests
echo "=========================================="
echo "Step 9: Router Management Tests"
echo "=========================================="

test_endpoint "GET" "/admin/routers" "" "List All Routers" true
test_endpoint "GET" "/admin/routers/status" "" "Router Status" true

echo ""

# Step 10: Loyalty Program Tests
echo "=========================================="
echo "Step 10: Loyalty Program Tests"
echo "=========================================="

test_endpoint "GET" "/loyalty/top-customers?limit=10" "" "Top Customers" true
test_endpoint "GET" "/loyalty/rewards" "" "List Rewards" true
test_endpoint "GET" "/loyalty/tiers" "" "List Tiers" true

echo ""

# Step 11: Transaction Management Tests
echo "=========================================="
echo "Step 11: Transaction Management Tests"
echo "=========================================="

test_endpoint "GET" "/admin/transactions" "" "List All Transactions" true
test_endpoint "GET" "/admin/transactions/statistics" "" "Transaction Statistics" true

echo ""

# Step 12: User Management Tests
echo "=========================================="
echo "Step 12: User Management Tests"
echo "=========================================="

test_endpoint "GET" "/admin/users" "" "List All Users" true

echo ""

# Step 13: Analytics & Reports Tests
echo "=========================================="
echo "Step 13: Analytics & Reports Tests"
echo "=========================================="

test_endpoint "GET" "/admin/reports-analytics/reports/statistics" "" "Report Statistics" true

echo ""

# Step 14: System Settings Tests
echo "=========================================="
echo "Step 14: System Settings Tests"
echo "=========================================="

test_endpoint "GET" "/system-settings" "" "Get System Settings" true

echo ""

# Step 15: Marketing Tests
echo "=========================================="
echo "Step 15: Marketing Tests"
echo "=========================================="

test_endpoint "GET" "/marketing/campaigns" "" "List Campaigns" true

echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo "Results saved to: $TEST_RESULTS"
echo ""
echo "PASS: $(grep -c "\[PASS\]" "$TEST_RESULTS" 2>/dev/null || echo 0)"
echo "FAIL: $(grep -c "\[FAIL\]" "$TEST_RESULTS" 2>/dev/null || echo 0)"
echo "SKIP: $(grep -c "\[SKIP\]" "$TEST_RESULTS" 2>/dev/null || echo 0)"
echo ""
echo "Full results: $TEST_RESULTS"

