#!/bin/bash

# Comprehensive Test Runner for GG-WIFI
# Runs all tests: unit, E2E, and API tests

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}           GG-WIFI Comprehensive Test Suite${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

TEST_RESULTS_DIR="./test-results"
mkdir -p "$TEST_RESULTS_DIR"

# Test results tracking
UNIT_TESTS_PASSED=0
UNIT_TESTS_FAILED=0
E2E_TESTS_PASSED=0
E2E_TESTS_FAILED=0
API_TESTS_PASSED=0
API_TESTS_FAILED=0

# 1. Unit Tests
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}1. Running Unit Tests (Vitest)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cd Frontend/customer_portal

if npm test -- --run > "$TEST_RESULTS_DIR/unit-tests.log" 2>&1; then
  echo -e "${GREEN}✅ Unit tests passed${NC}"
  UNIT_TESTS_PASSED=$(grep -c "passed" "$TEST_RESULTS_DIR/unit-tests.log" || echo "0")
else
  echo -e "${RED}❌ Unit tests failed${NC}"
  UNIT_TESTS_FAILED=1
fi

cd ../..

# 2. E2E Tests (if Playwright is installed)
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}2. Running E2E Tests (Playwright)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cd Frontend/customer_portal

if command -v npx &> /dev/null && [ -f "node_modules/@playwright/test/package.json" ]; then
  if npx playwright test --reporter=html > "$TEST_RESULTS_DIR/e2e-tests.log" 2>&1; then
    echo -e "${GREEN}✅ E2E tests passed${NC}"
    E2E_TESTS_PASSED=1
  else
    echo -e "${YELLOW}⚠️  E2E tests need browser installation${NC}"
    echo -e "${YELLOW}   Run: npx playwright install${NC}"
    E2E_TESTS_FAILED=1
  fi
else
  echo -e "${YELLOW}⚠️  Playwright not installed. Skipping E2E tests.${NC}"
  echo -e "${YELLOW}   Install: npm install -D @playwright/test && npx playwright install${NC}"
fi

cd ../..

# 3. API Integration Tests
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}3. Running API Integration Tests${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if backend is running
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Backend is running${NC}"
  
  if [ -f "backend/src/test/resources/api-test.sh" ]; then
    chmod +x backend/src/test/resources/api-test.sh
    if bash backend/src/test/resources/api-test.sh > "$TEST_RESULTS_DIR/api-tests.log" 2>&1; then
      echo -e "${GREEN}✅ API tests passed${NC}"
      API_TESTS_PASSED=1
    else
      echo -e "${RED}❌ API tests failed (check logs)${NC}"
      API_TESTS_FAILED=1
    fi
  else
    echo -e "${YELLOW}⚠️  API test script not found${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Backend not running. Skipping API tests.${NC}"
  echo -e "${YELLOW}   Start backend: cd backend && ./mvnw spring-boot:run${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                    Test Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

if [ $UNIT_TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ Unit Tests: PASSED${NC}"
else
  echo -e "${RED}❌ Unit Tests: FAILED${NC}"
fi

if [ $E2E_TESTS_FAILED -eq 0 ] && [ $E2E_TESTS_PASSED -eq 1 ]; then
  echo -e "${GREEN}✅ E2E Tests: PASSED${NC}"
elif [ $E2E_TESTS_FAILED -eq 1 ]; then
  echo -e "${YELLOW}⚠️  E2E Tests: SKIPPED (browsers not installed)${NC}"
else
  echo -e "${YELLOW}⚠️  E2E Tests: SKIPPED (Playwright not installed)${NC}"
fi

if [ $API_TESTS_FAILED -eq 0 ] && [ $API_TESTS_PASSED -eq 1 ]; then
  echo -e "${GREEN}✅ API Tests: PASSED${NC}"
else
  echo -e "${YELLOW}⚠️  API Tests: SKIPPED (backend not running)${NC}"
fi

echo ""
echo -e "${BLUE}Test results saved to: ${TEST_RESULTS_DIR}/${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"






