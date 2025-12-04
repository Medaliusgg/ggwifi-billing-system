#!/bin/bash

# Performance Testing Script
# Tests response times, concurrent users, and system performance

BASE_URL="${BASE_URL:-http://localhost:8080}"
VPS_URL="${VPS_URL:-http://139.84.241.182:8080}"
USE_VPS="${USE_VPS:-false}"

if [ "$USE_VPS" = "true" ]; then
    API_URL="$VPS_URL"
else
    API_URL="$BASE_URL"
fi

echo "╔════════════════════════════════════════════════════════╗"
echo "║     PERFORMANCE TESTING                                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "API URL: $API_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Performance targets (milliseconds)
TARGET_AUTH=500
TARGET_GET=500
TARGET_POST=1000
TARGET_DASHBOARD=2000

PASSED=0
FAILED=0

# Measure response time
measure_time() {
    local endpoint=$1
    local method=$2
    local data=$3
    local token=$4
    
    local start_time=$(date +%s%N)
    
    if [ "$method" = "GET" ]; then
        curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL$endpoint" \
            ${token:+-H "Authorization: Bearer $token"} > /dev/null 2>&1
    elif [ "$method" = "POST" ]; then
        curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            ${token:+-H "Authorization: Bearer $token"} \
            ${data:+-d "$data"} > /dev/null 2>&1
    fi
    
    local end_time=$(date +%s%N)
    local duration=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds
    
    echo $duration
}

# Test response time
test_performance() {
    local name=$1
    local endpoint=$2
    local method=$3
    local data=$4
    local target=$5
    local token=$6
    
    echo -n "Testing: $name... "
    
    # Run 5 times and average
    total=0
    for i in {1..5}; do
        time=$(measure_time "$endpoint" "$method" "$data" "$token")
        total=$((total + time))
        sleep 0.5
    done
    
    avg=$((total / 5))
    
    if [ $avg -le $target ]; then
        echo -e "${GREEN}✓ PASSED${NC} (${avg}ms, target: ${target}ms)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (${avg}ms, target: ${target}ms)"
        ((FAILED++))
        return 1
    fi
}

# Step 1: Authenticate
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Authentication Performance"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

login_data='{"username":"testadmin","password":"testadmin123"}'
test_performance "Admin Login" "/api/v1/auth/admin-login" "POST" "$login_data" "$TARGET_AUTH" ""

# Get token for authenticated tests
login_response=$(curl -s -X POST "$API_URL/api/v1/auth/admin-login" \
    -H "Content-Type: application/json" \
    -d "$login_data")
TOKEN=$(echo "$login_response" | jq -r '.data.token // empty' 2>/dev/null)

echo ""

# Step 2: GET Endpoint Performance
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: GET Endpoint Performance"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    test_performance "List Customers" "/api/v1/admin/customers" "GET" "" "$TARGET_GET" "$TOKEN"
    test_performance "List Packages" "/api/v1/admin/packages" "GET" "" "$TARGET_GET" "$TOKEN"
    test_performance "List Payments" "/api/v1/admin/payments" "GET" "" "$TARGET_GET" "$TOKEN"
    test_performance "List Vouchers" "/api/v1/admin/vouchers" "GET" "" "$TARGET_GET" "$TOKEN"
    test_performance "List Routers" "/api/v1/admin/routers" "GET" "" "$TARGET_GET" "$TOKEN"
else
    echo -e "${YELLOW}⚠ Skipping authenticated tests (no token)${NC}"
fi

echo ""

# Step 3: POST Endpoint Performance
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: POST Endpoint Performance"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    TIMESTAMP=$(date +%s)
    
    # Test package creation
    package_data="{\"packageName\":\"Perf Test $TIMESTAMP\",\"packageType\":\"HOTSPOT\",\"packageCategory\":\"RESIDENTIAL\",\"speedMbps\":100,\"price\":50000,\"dataLimitGB\":100,\"validityDays\":30,\"status\":\"ACTIVE\",\"targetAudience\":\"INDIVIDUAL\",\"billingCycle\":\"MONTHLY\",\"speedTier\":\"STANDARD\",\"offerType\":\"REGULAR\"}"
    test_performance "Create Package" "/api/v1/admin/packages" "POST" "$package_data" "$TARGET_POST" "$TOKEN"
    
    # Test customer creation
    customer_data="{\"firstName\":\"Perf\",\"lastName\":\"Test\",\"email\":\"perf$TIMESTAMP@test.com\",\"primaryPhoneNumber\":\"+2557$TIMESTAMP\",\"status\":\"ACTIVE\",\"accountType\":\"INDIVIDUAL\"}"
    test_performance "Create Customer" "/api/v1/admin/customers" "POST" "$customer_data" "$TARGET_POST" "$TOKEN"
fi

echo ""

# Step 4: Dashboard Performance
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Dashboard Performance"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    test_performance "Dashboard Statistics" "/api/v1/admin/dashboard" "GET" "" "$TARGET_DASHBOARD" "$TOKEN"
fi

echo ""

# Step 5: Concurrent Request Test
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Concurrent Request Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "Testing 10 concurrent GET requests..."
    start_time=$(date +%s%N)
    
    for i in {1..10}; do
        curl -s -o /dev/null -X GET "$API_URL/api/v1/admin/customers" \
            -H "Authorization: Bearer $TOKEN" &
    done
    wait
    
    end_time=$(date +%s%N)
    duration=$(( (end_time - start_time) / 1000000 ))
    
    echo "10 concurrent requests completed in ${duration}ms"
    
    if [ $duration -lt 5000 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Concurrent requests handled well)"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ WARNING${NC} (Concurrent requests took ${duration}ms)"
        ((WARNINGS++))
    fi
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PERFORMANCE TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Performance tests completed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some performance targets not met${NC}"
    exit 1
fi



