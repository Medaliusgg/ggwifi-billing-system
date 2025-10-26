#!/bin/bash

# Comprehensive API Testing Script for GG-WIFI Backend
# This script will test all API endpoints in all modules

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:8080"
API_BASE="$BASE_URL/api"
ADMIN_USERNAME="admin"
ADMIN_PHONE="0676591880"
ADMIN_PASSWORD="admin123"

# Global variables
ADMIN_TOKEN=""
CUSTOMER_TOKEN=""

echo -e "${BLUE}🧪 Comprehensive API Testing Script${NC}"
echo "=================================="
echo -e "${YELLOW}📋 Testing Configuration:${NC}"
echo "Base URL: $BASE_URL"
echo "API Base: $API_BASE"
echo "Admin Username: $ADMIN_USERNAME"
echo "Admin Phone: $ADMIN_PHONE"
echo ""

# Function to make API calls
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local headers=$4
    
    if [ -n "$data" ]; then
        curl -s -X $method "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            $headers \
            -d "$data"
    else
        curl -s -X $method "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            $headers
    fi
}

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local headers=$5
    local expected_status=$6
    
    echo -e "${YELLOW}🧪 Testing: $name${NC}"
    echo "Method: $method"
    echo "Endpoint: $endpoint"
    
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi
    
    response=$(api_call $method $endpoint "$data" "$headers")
    status_code=$(echo "$response" | jq -r '.status // "unknown"' 2>/dev/null || echo "unknown")
    
    if [ "$status_code" = "$expected_status" ] || [ "$status_code" = "success" ] || [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "Response: $response"
    fi
    
    echo "---"
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}📦 Installing jq...${NC}"
    apt update && apt install -y jq
fi

# Check if backend is running
echo -e "${YELLOW}🔍 Checking if backend is running...${NC}"
if ! curl -f -s "$BASE_URL/actuator/health" > /dev/null; then
    echo -e "${RED}❌ Backend is not running${NC}"
    echo "Please start the backend first:"
    echo "java -jar target/ggnetworks-backend-1.0.0.jar"
    exit 1
fi

echo -e "${GREEN}✅ Backend is running${NC}"
echo ""

# Test 1: Health Check
echo -e "${BLUE}🏥 Testing Health Check${NC}"
test_endpoint "Health Check" "GET" "/actuator/health" "" "" "UP"

# Test 2: Admin Authentication
echo -e "${BLUE}🔐 Testing Admin Authentication${NC}"
admin_login_data='{"username":"'$ADMIN_USERNAME'","phoneNumber":"'$ADMIN_PHONE'","password":"'$ADMIN_PASSWORD'"}'
admin_response=$(api_call "POST" "/auth/admin-login" "$admin_login_data" "")
ADMIN_TOKEN=$(echo "$admin_response" | jq -r '.data.token // empty' 2>/dev/null)

if [ -n "$ADMIN_TOKEN" ]; then
    echo -e "${GREEN}✅ Admin login successful${NC}"
    echo "Token: ${ADMIN_TOKEN:0:20}..."
else
    echo -e "${RED}❌ Admin login failed${NC}"
    echo "Response: $admin_response"
fi

echo ""

# Test 3: User Management APIs
echo -e "${BLUE}👥 Testing User Management APIs${NC}"
if [ -n "$ADMIN_TOKEN" ]; then
    auth_header="-H \"Authorization: Bearer $ADMIN_TOKEN\""
    
    test_endpoint "Get All Users" "GET" "/admin/users" "" "$auth_header" "success"
    test_endpoint "Get User Statistics" "GET" "/admin/users/statistics" "" "$auth_header" "success"
    test_endpoint "Get Dashboard Stats" "GET" "/admin/dashboard/stats" "" "$auth_header" "success"
else
    echo -e "${RED}❌ Skipping user management tests - no admin token${NC}"
fi

echo ""

# Test 4: Package Management APIs
echo -e "${BLUE}📦 Testing Package Management APIs${NC}"
if [ -n "$ADMIN_TOKEN" ]; then
    test_endpoint "Get All Packages" "GET" "/packages" "" "$auth_header" "success"
    test_endpoint "Get Active Packages" "GET" "/packages/active" "" "" "success"
    
    # Test package creation
    package_data='{"name":"Test Package","description":"Test package for API testing","price":5000.00,"durationDays":30,"dataLimitGb":10,"speedMbps":5,"packageType":"STANDARD","packageCategory":"BASIC","targetAudience":"INDIVIDUAL","status":"ACTIVE"}'
    test_endpoint "Create Package" "POST" "/packages" "$package_data" "$auth_header" "success"
else
    echo -e "${RED}❌ Skipping package management tests - no admin token${NC}"
fi

echo ""

# Test 5: Customer Portal APIs
echo -e "${BLUE}🛒 Testing Customer Portal APIs${NC}"
test_endpoint "Get Customer Packages" "GET" "/customer-portal/packages" "" "" "success"

# Test payment initiation
payment_data='{"phoneNumber":"0676591880","packageId":1,"amount":5000.00}'
test_endpoint "Initiate Payment" "POST" "/customer-portal/payment/initiate" "$payment_data" "" "success"

echo ""

# Test 6: Router Management APIs
echo -e "${BLUE}🌐 Testing Router Management APIs${NC}"
if [ -n "$ADMIN_TOKEN" ]; then
    test_endpoint "Get All Routers" "GET" "/admin/routers" "" "$auth_header" "success"
    test_endpoint "Get Router Statistics" "GET" "/admin/routers/statistics" "" "$auth_header" "success"
else
    echo -e "${RED}❌ Skipping router management tests - no admin token${NC}"
fi

echo ""

# Test 7: FreeRADIUS APIs
echo -e "${BLUE}🔐 Testing FreeRADIUS APIs${NC}"
if [ -n "$ADMIN_TOKEN" ]; then
    test_endpoint "FreeRADIUS Health Check" "GET" "/freeradius/health" "" "$auth_header" "success"
    test_endpoint "Get RADIUS Statistics" "GET" "/freeradius/statistics" "" "$auth_header" "success"
else
    echo -e "${RED}❌ Skipping FreeRADIUS tests - no admin token${NC}"
fi

echo ""

# Test 8: Transaction APIs
echo -e "${BLUE}💰 Testing Transaction APIs${NC}"
if [ -n "$ADMIN_TOKEN" ]; then
    test_endpoint "Get All Transactions" "GET" "/transactions" "" "$auth_header" "success"
    test_endpoint "Get Transaction Statistics" "GET" "/transactions/statistics" "" "$auth_header" "success"
else
    echo -e "${RED}❌ Skipping transaction tests - no admin token${NC}"
fi

echo ""

# Test 9: Payment APIs
echo -e "${BLUE}💳 Testing Payment APIs${NC}"
if [ -n "$ADMIN_TOKEN" ]; then
    test_endpoint "Get All Payments" "GET" "/payments" "" "$auth_header" "success"
    test_endpoint "Get Payment Statistics" "GET" "/payments/statistics" "" "$auth_header" "success"
else
    echo -e "${RED}❌ Skipping payment tests - no admin token${NC}"
fi

echo ""

# Test 10: Voucher APIs
echo -e "${BLUE}🎫 Testing Voucher APIs${NC}"
if [ -n "$ADMIN_TOKEN" ]; then
    test_endpoint "Get All Vouchers" "GET" "/vouchers" "" "$auth_header" "success"
    test_endpoint "Get Voucher Statistics" "GET" "/vouchers/statistics" "" "$auth_header" "success"
else
    echo -e "${RED}❌ Skipping voucher tests - no admin token${NC}"
fi

echo ""

# Test 11: Customer APIs
echo -e "${BLUE}👤 Testing Customer APIs${NC}"
if [ -n "$ADMIN_TOKEN" ]; then
    test_endpoint "Get All Customers" "GET" "/customers" "" "$auth_header" "success"
    test_endpoint "Get Customer Statistics" "GET" "/customers/statistics" "" "$auth_header" "success"
else
    echo -e "${RED}❌ Skipping customer tests - no admin token${NC}"
fi

echo ""

# Test 12: Invoice APIs
echo -e "${BLUE}📄 Testing Invoice APIs${NC}"
if [ -n "$ADMIN_TOKEN" ]; then
    test_endpoint "Get All Invoices" "GET" "/invoices" "" "$auth_header" "success"
    test_endpoint "Get Invoice Statistics" "GET" "/invoices/statistics" "" "$auth_header" "success"
else
    echo -e "${RED}❌ Skipping invoice tests - no admin token${NC}"
fi

echo ""

# Test 13: Webhook Testing
echo -e "${BLUE}🔗 Testing Webhook Endpoint${NC}"
webhook_data='{"orderId":"TEST123","status":"SUCCESS","amount":5000.00,"phoneNumber":"0676591880","transactionId":"TXN123"}'
test_endpoint "ZenoPay Webhook" "POST" "/customer-portal/webhook" "$webhook_data" "" "success"

echo ""

# Test 14: Security Testing
echo -e "${BLUE}🔒 Testing Security${NC}"
echo -e "${YELLOW}🧪 Testing unauthorized access...${NC}"
unauthorized_response=$(api_call "GET" "/admin/users" "" "")
if echo "$unauthorized_response" | grep -q "unauthorized\|forbidden\|401\|403"; then
    echo -e "${GREEN}✅ Security test passed - unauthorized access blocked${NC}"
else
    echo -e "${RED}❌ Security test failed - unauthorized access allowed${NC}"
fi

echo ""

# Summary
echo -e "${BLUE}📊 Testing Summary${NC}"
echo "=================================="
echo -e "${GREEN}✅ Tests completed${NC}"
echo ""
echo -e "${BLUE}🔗 API Endpoints Tested:${NC}"
echo "• Health Check"
echo "• Admin Authentication"
echo "• User Management"
echo "• Package Management"
echo "• Customer Portal"
echo "• Router Management"
echo "• FreeRADIUS Integration"
echo "• Transaction Management"
echo "• Payment Processing"
echo "• Voucher System"
echo "• Customer Management"
echo "• Invoice System"
echo "• Webhook Processing"
echo "• Security Controls"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Review any failed tests"
echo "2. Check backend logs for errors"
echo "3. Configure production environment variables"
echo "4. Test with real third-party services"
echo "5. Deploy to production VPS"
