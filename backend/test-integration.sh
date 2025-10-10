#!/bin/bash

# GGNetworks Integration Test Script
# Tests FreeRADIUS, MikroTik, and SMS marketing integration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
BACKEND_URL="http://localhost:8080/api/v1"
RADIUS_HOST="localhost"
RADIUS_SECRET="testing123"
DB_HOST="localhost"
DB_USER="ggnetworks"
DB_PASS="ggnetworks_password"
DB_NAME="ggnetworks"
RADIUS_DB_NAME="radius"

TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_status "Running test: $test_name"
    
    if eval "$test_command"; then
        print_success "✓ $test_name passed"
        ((TESTS_PASSED++))
    else
        print_error "✗ $test_name failed"
        ((TESTS_FAILED++))
    fi
    echo ""
}

echo "=== GGNetworks Integration Test Suite ==="
echo ""

# 1. Backend Service Tests
echo "=== 1. Backend Service Tests ==="
run_test "Backend Service Status" "systemctl is-active --quiet ggnetworks-backend"
run_test "Backend API Health Check" "curl -s -f $BACKEND_URL/health | grep -q 'status'"
run_test "Backend Port Availability" "nc -z localhost 8080"

# 2. Database Tests
echo "=== 2. Database Tests ==="
run_test "Database Connection" "mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME -e 'SELECT 1'"
run_test "FreeRADIUS Tables (radcheck in radius)" "mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $RADIUS_DB_NAME -e 'SHOW TABLES LIKE \"radcheck\"' | grep -q radcheck"
run_test "User Tables" "mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME -e 'SHOW TABLES LIKE \"users\"' | grep -q users"

# 3. FreeRADIUS Tests
echo "=== 3. FreeRADIUS Tests ==="
run_test "FreeRADIUS Service Status" "systemctl is-active --quiet freeradius"
run_test "FreeRADIUS Configuration" "freeradius -C"
run_test "RADIUS Authentication Port" "nc -z $RADIUS_HOST 1812"
run_test "RADIUS Accounting Port" "nc -z $RADIUS_HOST 1813"
run_test "RADIUS Hotspot Authentication" "radtest voucher_GG12345678 GG12345678 $RADIUS_HOST 0 $RADIUS_SECRET | grep -q 'Access-Accept'"
run_test "RADIUS PPPoE Authentication" "radtest 0712345678 5678ABCD $RADIUS_HOST 0 $RADIUS_SECRET | grep -q 'Access-Accept'"

# 4. Backend API Tests
echo "=== 4. Backend API Tests ==="
run_test "FreeRADIUS Integration Status" "curl -s -f $BACKEND_URL/radius/status | grep -q 'status'"
run_test "Voucher Generation" "curl -s -f -X POST $BACKEND_URL/vouchers/generate -H 'Content-Type: application/json' -d '{\"packageId\": 1, \"assignedTo\": \"test@example.com\"}' | grep -q 'voucherCode'"
run_test "Authentication Test" "curl -s -f -X POST $BACKEND_URL/radius/test-auth -H 'Content-Type: application/json' -d '{\"username\": \"voucher_GG12345678\", \"password\": \"GG12345678\"}' | grep -q 'authenticated'"

# 5. SMS Marketing Tests
echo "=== 5. SMS Marketing Tests ==="
run_test "SMS Configuration File" "test -f /etc/ggnetworks/sms/config.json"
run_test "SMS Service Script" "test -x /usr/local/bin/ggnetworks-sms.sh"
run_test "SMS Monitoring Script" "test -x /usr/local/bin/monitor-sms.sh"
run_test "Phone Number Collection" "mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME -e 'SELECT COUNT(*) FROM users WHERE phone_number IS NOT NULL'"

# 6. Network Tests
echo "=== 6. Network Tests ==="
run_test "MySQL Port" "nc -z localhost 3306"
run_test "Backend Port" "nc -z localhost 8080"
run_test "RADIUS Ports" "nc -z localhost 1812 && nc -z localhost 1813"

# Results
echo "=== Integration Test Results ==="
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $TESTS_FAILED"
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    print_success "All integration tests passed! 🎉"
    echo ""
    echo "=== Next Steps ==="
    echo "1. Configure MikroTik routers using mikrotik-radius-config.rsc"
    echo "2. Update SMS API credentials in /etc/ggnetworks/sms/config.json"
    echo "3. Test real-world scenarios with actual devices"
    echo "4. Monitor system performance and logs"
else
    print_error "Some tests failed. Please review the errors above."
    echo ""
    echo "=== Troubleshooting ==="
    echo "1. Check service status: systemctl status <service-name>"
    echo "2. Review logs: journalctl -u <service-name>"
    echo "3. Verify configuration files"
    echo "4. Check network connectivity"
fi

echo ""
echo "Test completed at: $(date)"
