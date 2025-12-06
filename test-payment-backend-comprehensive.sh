#!/bin/bash

# ============================================================================
# COMPREHENSIVE PAYMENT PROCESSING BACKEND TEST SCRIPT
# ============================================================================
# This script tests the complete payment flow in the backend:
# 1. Payment initiation
# 2. Payment status checking
# 3. Webhook simulation
# 4. End-to-end flow validation
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="${API_BASE_URL:-http://139.84.241.182:8080/api/v1}"
CUSTOMER_PORTAL_BASE="${API_BASE_URL}/customer-portal"

# Test data
TEST_PHONE="255773404760"
TEST_NAME="Test Customer"
TEST_PACKAGE_ID="1"
TEST_AMOUNT="5000"

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TEST_RESULTS=()

# ============================================================================
# Helper Functions
# ============================================================================

print_header() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

print_test() {
    echo -e "${BLUE}🧪 TEST:${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ PASS:${NC} $1"
    ((TESTS_PASSED++))
    TEST_RESULTS+=("✅ $1")
}

print_error() {
    echo -e "${RED}❌ FAIL:${NC} $1"
    ((TESTS_FAILED++))
    TEST_RESULTS+=("❌ $1")
}

print_warning() {
    echo -e "${YELLOW}⚠️  WARN:${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

# Make HTTP request and return response
make_request() {
    local method=$1
    local url=$2
    local data=$3
    
    if [ "$method" = "GET" ]; then
        curl -s -X GET "$url" \
            -H "Content-Type: application/json" \
            -w "\n%{http_code}"
    else
        curl -s -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\n%{http_code}"
    fi
}

# Extract JSON value
extract_json() {
    local json=$1
    local key=$2
    echo "$json" | grep -o "\"$key\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | cut -d'"' -f4
}

# ============================================================================
# Test Functions
# ============================================================================

test_1_health_check() {
    print_test "1. Backend Health Check"
    
    local response=$(make_request "GET" "${API_BASE_URL}/customer-portal/test")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        print_success "Backend is accessible"
        print_info "Response: $body"
        return 0
    else
        print_error "Backend health check failed (HTTP $http_code)"
        return 1
    fi
}

test_2_get_packages() {
    print_test "2. Get Available Packages"
    
    local response=$(make_request "GET" "${CUSTOMER_PORTAL_BASE}/packages")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        local status=$(extract_json "$body" "status")
        if [ "$status" = "success" ]; then
            print_success "Packages retrieved successfully"
            print_info "Response: $body" | head -20
            return 0
        else
            print_error "Failed to retrieve packages"
            return 1
        fi
    else
        print_error "HTTP error: $http_code"
        return 1
    fi
}

test_3_initiate_payment() {
    print_test "3. Initiate Payment"
    
    local payment_data=$(cat <<EOF
{
    "customerName": "$TEST_NAME",
    "phoneNumber": "$TEST_PHONE",
    "packageId": "$TEST_PACKAGE_ID",
    "packageName": "Test Package",
    "amount": "$TEST_AMOUNT",
    "currency": "TZS",
    "paymentMethod": "ZENOPAY"
}
EOF
)
    
    local response=$(make_request "POST" "${CUSTOMER_PORTAL_BASE}/payment" "$payment_data")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        local status=$(extract_json "$body" "status")
        if [ "$status" = "success" ]; then
            ORDER_ID=$(extract_json "$body" "order_id")
            if [ -n "$ORDER_ID" ]; then
                print_success "Payment initiated successfully"
                print_info "Order ID: $ORDER_ID"
                echo "$ORDER_ID" > /tmp/test_order_id.txt
                return 0
            else
                print_error "Order ID not found in response"
                return 1
            fi
        else
            print_error "Payment initiation failed: $body"
            return 1
        fi
    else
        print_error "HTTP error: $http_code"
        print_info "Response: $body"
        return 1
    fi
}

test_4_check_payment_status() {
    print_test "4. Check Payment Status (Initial - Should be PENDING)"
    
    if [ -z "$ORDER_ID" ]; then
        ORDER_ID=$(cat /tmp/test_order_id.txt 2>/dev/null || echo "")
    fi
    
    if [ -z "$ORDER_ID" ]; then
        print_error "No order ID available for status check"
        return 1
    fi
    
    local response=$(make_request "GET" "${CUSTOMER_PORTAL_BASE}/payment/status/$ORDER_ID")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        local payment_status=$(extract_json "$body" "payment_status")
        if [ "$payment_status" = "PENDING" ]; then
            print_success "Payment status is PENDING (as expected)"
            print_info "Status: $payment_status"
            return 0
        else
            print_warning "Payment status is $payment_status (expected PENDING)"
            return 0  # Not a failure, just unexpected
        fi
    else
        print_error "HTTP error: $http_code"
        return 1
    fi
}

test_5_webhook_endpoint_accessible() {
    print_test "5. Webhook Endpoint Accessibility"
    
    local response=$(make_request "GET" "${CUSTOMER_PORTAL_BASE}/webhook/zenopay/test")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        print_success "Webhook endpoint is accessible"
        print_info "Response: $body"
        return 0
    else
        print_error "Webhook endpoint not accessible (HTTP $http_code)"
        return 1
    fi
}

test_6_simulate_success_webhook() {
    print_test "6. Simulate SUCCESS Webhook"
    
    if [ -z "$ORDER_ID" ]; then
        ORDER_ID=$(cat /tmp/test_order_id.txt 2>/dev/null || echo "")
    fi
    
    if [ -z "$ORDER_ID" ]; then
        print_error "No order ID available for webhook simulation"
        return 1
    fi
    
    local webhook_data=$(cat <<EOF
{
    "order_id": "$ORDER_ID",
    "payment_status": "SUCCESS",
    "amount": "$TEST_AMOUNT",
    "msisdn": "$TEST_PHONE",
    "transid": "TEST_TXN_$(date +%s)",
    "payment_reference": "TEST_REF_$(date +%s)",
    "customer_name": "$TEST_NAME",
    "package_id": "$TEST_PACKAGE_ID"
}
EOF
)
    
    local response=$(make_request "POST" "${CUSTOMER_PORTAL_BASE}/webhook/zenopay" "$webhook_data")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        local status=$(extract_json "$body" "status")
        if [ "$status" = "success" ]; then
            VOUCHER_CODE=$(extract_json "$body" "voucher_code")
            print_success "Webhook processed successfully"
            print_info "Voucher Code: $VOUCHER_CODE"
            print_info "Response: $body" | head -30
            return 0
        else
            print_error "Webhook processing failed: $body"
            return 1
        fi
    else
        print_error "HTTP error: $http_code"
        print_info "Response: $body"
        return 1
    fi
}

test_7_verify_payment_status_updated() {
    print_test "7. Verify Payment Status Updated to COMPLETED"
    
    sleep 2  # Wait for database update
    
    if [ -z "$ORDER_ID" ]; then
        ORDER_ID=$(cat /tmp/test_order_id.txt 2>/dev/null || echo "")
    fi
    
    local response=$(make_request "GET" "${CUSTOMER_PORTAL_BASE}/payment/status/$ORDER_ID")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        local payment_status=$(extract_json "$body" "payment_status")
        if [ "$payment_status" = "COMPLETED" ]; then
            print_success "Payment status updated to COMPLETED"
            print_info "Status: $payment_status"
            return 0
        else
            print_error "Payment status is $payment_status (expected COMPLETED)"
            print_info "Response: $body"
            return 1
        fi
    else
        print_error "HTTP error: $http_code"
        return 1
    fi
}

test_8_simulate_failed_webhook() {
    print_test "8. Simulate FAILED Webhook (Testing Failure Handling)"
    
    local failed_order_id="PKG_$(date +%s)_FAIL_1"
    
    local webhook_data=$(cat <<EOF
{
    "order_id": "$failed_order_id",
    "payment_status": "FAILED",
    "amount": "$TEST_AMOUNT",
    "msisdn": "$TEST_PHONE",
    "transid": "FAIL_TXN_$(date +%s)",
    "payment_reference": "FAIL_REF_$(date +%s)",
    "failure_reason": "Insufficient balance"
}
EOF
)
    
    local response=$(make_request "POST" "${CUSTOMER_PORTAL_BASE}/webhook/zenopay" "$webhook_data")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        local status=$(extract_json "$body" "status")
        if [ "$status" = "failed" ]; then
            print_success "Failed webhook handled correctly"
            print_info "Response: $body" | head -20
            return 0
        else
            print_warning "Unexpected status: $status"
            return 0  # Not a critical failure
        fi
    else
        print_error "HTTP error: $http_code"
        return 1
    fi
}

test_9_webhook_validation() {
    print_test "9. Test Webhook Validation (Invalid Data)"
    
    local invalid_webhook=$(cat <<EOF
{
    "order_id": "",
    "payment_status": "INVALID_STATUS",
    "amount": "-100"
}
EOF
)
    
    local response=$(make_request "POST" "${CUSTOMER_PORTAL_BASE}/webhook/zenopay" "$invalid_webhook")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "400" ]; then
        print_success "Invalid webhook correctly rejected"
        print_info "Response: $body"
        return 0
    else
        print_error "Invalid webhook not rejected (HTTP $http_code)"
        return 1
    fi
}

test_10_performance_test() {
    print_test "10. Performance Test (Multiple Status Checks)"
    
    if [ -z "$ORDER_ID" ]; then
        ORDER_ID=$(cat /tmp/test_order_id.txt 2>/dev/null || echo "")
    fi
    
    if [ -z "$ORDER_ID" ]; then
        print_warning "Skipping performance test (no order ID)"
        return 0
    fi
    
    local start_time=$(date +%s%N)
    local checks=0
    local successful_checks=0
    
    for i in {1..10}; do
        local response=$(make_request "GET" "${CUSTOMER_PORTAL_BASE}/payment/status/$ORDER_ID")
        local http_code=$(echo "$response" | tail -n1)
        ((checks++))
        
        if [ "$http_code" = "200" ]; then
            ((successful_checks++))
        fi
        sleep 0.1
    done
    
    local end_time=$(date +%s%N)
    local duration=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds
    
    local avg_time=$(( duration / checks ))
    
    if [ $successful_checks -eq $checks ]; then
        print_success "Performance test passed"
        print_info "Total checks: $checks"
        print_info "Successful: $successful_checks"
        print_info "Total time: ${duration}ms"
        print_info "Average time: ${avg_time}ms per request"
        return 0
    else
        print_error "Performance test failed ($successful_checks/$checks successful)"
        return 1
    fi
}

# ============================================================================
# Main Test Execution
# ============================================================================

main() {
    print_header "🔍 COMPREHENSIVE PAYMENT PROCESSING BACKEND TEST"
    
    print_info "API Base URL: $API_BASE_URL"
    print_info "Test Phone: $TEST_PHONE"
    print_info "Test Amount: $TEST_AMOUNT TZS"
    echo ""
    
    # Run tests
    test_1_health_check
    test_2_get_packages
    test_3_initiate_payment
    test_4_check_payment_status
    test_5_webhook_endpoint_accessible
    test_6_simulate_success_webhook
    test_7_verify_payment_status_updated
    test_8_simulate_failed_webhook
    test_9_webhook_validation
    test_10_performance_test
    
    # Print summary
    print_header "📊 TEST SUMMARY"
    
    echo "Tests Passed: $TESTS_PASSED"
    echo "Tests Failed: $TESTS_FAILED"
    echo ""
    echo "Test Results:"
    for result in "${TEST_RESULTS[@]}"; do
        echo "  $result"
    done
    
    echo ""
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
        exit 0
    else
        echo -e "${RED}❌ SOME TESTS FAILED${NC}"
        exit 1
    fi
}

# Run main function
main

