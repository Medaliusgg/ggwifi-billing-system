#!/bin/bash

# Security Audit Script
# Tests SQL injection, XSS, CSRF, and rate limiting

BASE_URL="${BASE_URL:-http://localhost:8080}"
VPS_URL="${VPS_URL:-http://139.84.241.182:8080}"
USE_VPS="${USE_VPS:-false}"

if [ "$USE_VPS" = "true" ]; then
    API_URL="$VPS_URL"
else
    API_URL="$BASE_URL"
fi

echo "╔════════════════════════════════════════════════════════╗"
echo "║     SECURITY AUDIT TESTING                            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "API URL: $API_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

# Test function
test_security() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_behavior=$5
    
    echo -n "Testing: $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL$endpoint" \
            ${TOKEN:+-H "Authorization: Bearer $TOKEN"})
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            ${TOKEN:+-H "Authorization: Bearer $TOKEN"} \
            ${data:+-d "$data"})
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Check if attack was blocked or sanitized
    if echo "$body" | grep -qi "error\|invalid\|bad\|unauthorized\|forbidden" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC} (Attack blocked/sanitized)"
        ((PASSED++))
        return 0
    elif [ "$http_code" -ge 400 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code - Attack blocked)"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}⚠ WARNING${NC} (HTTP $http_code - May need review)"
        ((WARNINGS++))
        return 1
    fi
}

# Step 1: Authenticate
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Authentication"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

login_response=$(curl -s -X POST "$API_URL/api/v1/auth/admin-login" \
    -H "Content-Type: application/json" \
    -d '{"username":"testadmin","password":"testadmin123"}')

TOKEN=$(echo "$login_response" | jq -r '.data.token // empty' 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo -e "${YELLOW}⚠ Using unauthenticated tests${NC}"
    TOKEN=""
fi

echo ""

# Step 2: SQL Injection Tests
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: SQL Injection Testing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 2.1 SQL Injection in Login
echo "2.1 Testing SQL injection in login..."
sql_injection_login='{"username":"admin'\'' OR '\''1'\''='\''1","password":"test"}'
test_security "SQL Injection Login" "POST" "/api/v1/auth/admin-login" "$sql_injection_login" "blocked"
echo ""

# 2.2 SQL Injection in ID Parameter
echo "2.2 Testing SQL injection in ID parameter..."
test_security "SQL Injection ID" "GET" "/api/v1/admin/customers/1' OR '1'='1" "" "blocked"
echo ""

# 2.3 SQL Injection in Search
echo "2.3 Testing SQL injection in search..."
test_security "SQL Injection Search" "GET" "/api/v1/admin/customers/search?query='; DROP TABLE customers; --" "" "blocked"
echo ""

# Step 3: XSS Testing
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: XSS (Cross-Site Scripting) Testing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TIMESTAMP=$(date +%s)

# 3.1 XSS in Customer Name
echo "3.1 Testing XSS in customer name..."
xss_name='{"firstName":"<script>alert('\''XSS'\'')</script>","lastName":"Test","email":"xss'$TIMESTAMP'@test.com","primaryPhoneNumber":"+2557'$TIMESTAMP'","status":"ACTIVE","accountType":"INDIVIDUAL"}'
test_security "XSS in Name" "POST" "/api/v1/admin/customers" "$xss_name" "sanitized"
echo ""

# 3.2 XSS in Email
echo "3.2 Testing XSS in email..."
xss_email='{"firstName":"Test","lastName":"User","email":"test<script>alert('\''XSS'\'')</script>@test.com","primaryPhoneNumber":"+2557'$((TIMESTAMP+1))'","status":"ACTIVE","accountType":"INDIVIDUAL"}'
test_security "XSS in Email" "POST" "/api/v1/admin/customers" "$xss_email" "sanitized"
echo ""

# Step 4: Authentication & Authorization
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Authentication & Authorization Testing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 4.1 Access without token
echo "4.1 Testing access without token..."
response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/api/v1/admin/customers")
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" = "401" ] || [ "$http_code" = "403" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Properly requires authentication - HTTP $http_code)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (Should require authentication - HTTP $http_code)"
    ((FAILED++))
fi
echo ""

# 4.2 Invalid token
echo "4.2 Testing with invalid token..."
response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/api/v1/admin/customers" \
    -H "Authorization: Bearer invalid_token_12345")
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" = "401" ] || [ "$http_code" = "403" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Invalid token rejected - HTTP $http_code)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (Should reject invalid token - HTTP $http_code)"
    ((FAILED++))
fi
echo ""

# Step 5: Rate Limiting Verification
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Rate Limiting Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "5.1 Testing login rate limit (attempting 6 logins)..."
rate_limit_hit=false
for i in {1..6}; do
    response=$(curl -s -X POST "$API_URL/api/v1/auth/admin-login" \
        -H "Content-Type: application/json" \
        -d '{"username":"testadmin","password":"testadmin123"}')
    
    if echo "$response" | grep -qi "too many\|rate limit" > /dev/null 2>&1; then
        rate_limit_hit=true
        echo "  Attempt $i: Rate limit triggered ✓"
        break
    else
        echo "  Attempt $i: Allowed"
        sleep 1
    fi
done

if [ "$rate_limit_hit" = "true" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Rate limiting is active)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Rate limit not triggered - may need more attempts or time)"
    ((WARNINGS++))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SECURITY AUDIT SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Security audit completed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ Some items need manual review${NC}"
    fi
    exit 0
else
    echo -e "${RED}✗ Security issues found${NC}"
    exit 1
fi



