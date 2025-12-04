#!/bin/bash

# Master Test Runner
# Runs Integration, Performance, and Security tests

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║     COMPREHENSIVE TEST SUITE                           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Configuration
BASE_URL="${BASE_URL:-http://localhost:8080}"
VPS_URL="${VPS_URL:-http://139.84.241.182:8080}"
USE_VPS="${USE_VPS:-false}"

if [ "$USE_VPS" = "true" ]; then
    API_URL="$VPS_URL"
    echo "Using VPS URL: $API_URL"
else
    API_URL="$BASE_URL"
    echo "Using Local URL: $API_URL"
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test results
INTEGRATION_PASSED=false
PERFORMANCE_PASSED=false
SECURITY_PASSED=false

# Check if backend is accessible
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Checking backend connectivity..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if curl -s --max-time 5 "$API_URL/api/v1/customer-portal/test" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is accessible${NC}"
else
    echo -e "${RED}✗ Backend is not accessible at $API_URL${NC}"
    echo -e "${YELLOW}⚠ Attempting to use VPS URL...${NC}"
    API_URL="$VPS_URL"
    USE_VPS="true"
    
    if curl -s --max-time 5 "$API_URL/api/v1/customer-portal/test" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ VPS backend is accessible${NC}"
    else
        echo -e "${RED}✗ Backend is not accessible. Please ensure backend is running.${NC}"
        exit 1
    fi
fi

echo ""

# Create results directory
RESULTS_DIR="docs/testing/test-results-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$RESULTS_DIR"

# 1. Integration Tests
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}1. RUNNING INTEGRATION TESTS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

export BASE_URL="$API_URL"
export USE_VPS="$USE_VPS"

if bash docs/testing/INTEGRATION_TEST_SCRIPT.sh > "$RESULTS_DIR/integration-test.log" 2>&1; then
    echo -e "${GREEN}✓ Integration tests PASSED${NC}"
    INTEGRATION_PASSED=true
else
    echo -e "${RED}✗ Integration tests FAILED${NC}"
    echo "Check logs: $RESULTS_DIR/integration-test.log"
fi

echo ""

# 2. Performance Tests
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}2. RUNNING PERFORMANCE TESTS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if bash docs/testing/PERFORMANCE_TEST_SCRIPT.sh > "$RESULTS_DIR/performance-test.log" 2>&1; then
    echo -e "${GREEN}✓ Performance tests PASSED${NC}"
    PERFORMANCE_PASSED=true
else
    echo -e "${RED}✗ Performance tests FAILED${NC}"
    echo "Check logs: $RESULTS_DIR/performance-test.log"
fi

echo ""

# 3. Security Tests
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}3. RUNNING SECURITY TESTS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if bash docs/testing/SECURITY_AUDIT_SCRIPT.sh > "$RESULTS_DIR/security-test.log" 2>&1; then
    echo -e "${GREEN}✓ Security tests PASSED${NC}"
    SECURITY_PASSED=true
else
    echo -e "${RED}✗ Security tests FAILED${NC}"
    echo "Check logs: $RESULTS_DIR/security-test.log"
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$INTEGRATION_PASSED" = true ]; then
    echo -e "${GREEN}✓ Integration Tests: PASSED${NC}"
else
    echo -e "${RED}✗ Integration Tests: FAILED${NC}"
fi

if [ "$PERFORMANCE_PASSED" = true ]; then
    echo -e "${GREEN}✓ Performance Tests: PASSED${NC}"
else
    echo -e "${RED}✗ Performance Tests: FAILED${NC}"
fi

if [ "$SECURITY_PASSED" = true ]; then
    echo -e "${GREEN}✓ Security Tests: PASSED${NC}"
else
    echo -e "${RED}✗ Security Tests: FAILED${NC}"
fi

echo ""
echo "Results saved to: $RESULTS_DIR"
echo ""

# Overall status
if [ "$INTEGRATION_PASSED" = true ] && [ "$PERFORMANCE_PASSED" = true ] && [ "$SECURITY_PASSED" = true ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     ALL TESTS PASSED - READY FOR PRODUCTION            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║     SOME TESTS FAILED - REVIEW LOGS                   ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi

