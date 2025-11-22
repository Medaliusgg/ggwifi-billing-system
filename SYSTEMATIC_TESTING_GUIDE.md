# 🧪 SYSTEMATIC API ENDPOINT TESTING GUIDE

**Date:** 2025-11-18  
**System:** GG-WIFI Hotspot Billing System  
**Test Script:** `test-all-endpoints-systematic.sh`

---

## 📋 **OVERVIEW**

This guide describes the systematic approach to testing all API endpoints across all 16 modules of the GG-WIFI Hotspot Billing System.

---

## 🎯 **TESTING PHILOSOPHY**

### **Systematic Approach:**
1. **Dependency Order:** Tests modules in logical dependency order
2. **CRUD Sequence:** Tests Create → Read → Update → Delete operations
3. **Relationship Testing:** Tests relationships between modules
4. **Error Handling:** Tests error cases and edge cases
5. **Comprehensive Coverage:** Tests all endpoints in each module

---

## 📊 **TESTING PHASES**

### **Phase 1: Authentication & Setup** 🔐
**Dependencies:** None  
**Tests:**
- Admin Login
- Health Check
- Token Extraction

**Why First:** All other tests require authentication token

---

### **Phase 2: User Management** 👥
**Dependencies:** Authentication  
**Tests:**
- GET: List Users
- GET: Get User by ID
- POST: Create User
- GET: Dashboard Statistics

**Why Second:** Foundation for system access control

---

### **Phase 3: Customer Management** 👤
**Dependencies:** Authentication  
**Tests:**
- GET: List Customers
- GET: Customer Statistics
- GET: Active Customers
- POST: Create Customer
- GET: Get Customer by ID
- GET: Get Customer by Phone

**Why Third:** Customers are core entities for billing

---

### **Phase 4: Package Management** 📦
**Dependencies:** Authentication  
**Tests:**
- GET: List Packages
- GET: Get Package by ID
- GET: Search Packages
- GET: Filter Packages
- GET: Package Analytics

**Why Fourth:** Packages are required for vouchers and payments

---

### **Phase 5: Voucher Management** 🎫
**Dependencies:** Packages  
**Tests:**
- GET: List Vouchers
- GET: Voucher Statistics
- GET: Active Vouchers
- GET: Unused Vouchers
- GET: Active Sessions
- GET: Vouchers by Status
- GET: Vouchers by Package
- GET: Voucher Analytics

**Why Fifth:** Vouchers depend on packages

---

### **Phase 6: Payment Management** 💳
**Dependencies:** Customers, Packages  
**Tests:**
- GET: List Payments
- GET: Payment Statistics
- GET: Payments by Status
- GET: Payment Analytics
- GET: Reconcile Payments
- GET: Pending Reconciliations

**Why Sixth:** Payments depend on customers and packages

---

### **Phase 7: Transaction Management** 💰
**Dependencies:** Payments  
**Tests:**
- GET: List Transactions
- GET: Transaction Statistics
- GET: Transactions by Status
- GET: Reconcile Transactions

**Why Seventh:** Transactions depend on payments

---

### **Phase 8: Invoice Management** 📄
**Dependencies:** Customers, Transactions  
**Tests:**
- GET: List Invoices
- GET: Invoice Statistics
- GET: Paid Invoices
- GET: Unpaid Invoices
- GET: Invoice Template

**Why Eighth:** Invoices depend on customers and transactions

---

### **Phase 9: Router Management** 🌐
**Dependencies:** Authentication  
**Tests:**
- GET: List Routers
- GET: Router Statistics
- GET: Network Analytics

**Why Ninth:** Routers are independent infrastructure

---

### **Phase 10: FreeRADIUS Management** 🔒
**Dependencies:** Authentication  
**Tests:**
- GET: RADIUS Health Check
- GET: List RADIUS Users
- GET: Active Sessions
- GET: RADIUS Statistics
- GET: RADIUS Analytics
- GET: List NAS

**Why Tenth:** RADIUS is independent authentication system

---

### **Phase 11: Customer Portal** 🏪
**Dependencies:** Packages  
**Tests:**
- GET: List Packages (Public)
- GET: Customer Portal Test

**Why Eleventh:** Public-facing endpoints

---

### **Phase 12: Project Management** 📋
**Dependencies:** Authentication  
**Tests:**
- GET: List Projects
- GET: Project Statistics
- GET: Project Analytics

**Why Twelfth:** Projects are independent management feature

---

### **Phase 13: Reports & Analytics** 📊
**Dependencies:** All modules  
**Tests:**
- GET: List Reports
- GET: Report Statistics

**Why Thirteenth:** Reports depend on data from all modules

---

### **Phase 14: Notifications** 🔔
**Dependencies:** Authentication  
**Tests:**
- GET: List Notifications
- GET: Notification Statistics

**Why Fourteenth:** Notifications are independent feature

---

### **Phase 15: Alerts** ⚠️
**Dependencies:** Authentication  
**Tests:**
- GET: List Alert Rules
- GET: Alert Statistics

**Why Fifteenth:** Alerts are independent monitoring feature

---

### **Phase 16: Audit Log** 📝
**Dependencies:** Authentication  
**Tests:**
- GET: List Audit Logs
- GET: Audit Log Statistics
- GET: Security Dashboard
- GET: Security Events

**Why Sixteenth:** Audit logs track all system activity

---

## 🔧 **TEST EXECUTION**

### **Run the Test Script:**

```bash
cd backend
./test-all-endpoints-systematic.sh
```

### **Configuration:**

```bash
# Set environment variables (optional)
export BASE_URL="https://api.ggwifi.co.tz"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="Admin2024"

# Or edit script defaults
```

---

## 📈 **TEST FEATURES**

### **1. Comprehensive Logging:**
- All tests logged to timestamped file
- Color-coded output for easy reading
- Detailed error messages

### **2. Smart Test Flow:**
- Tests dependencies first
- Creates test data as needed
- Uses created IDs for related tests

### **3. Error Handling:**
- Continues testing even if one test fails
- Provides detailed error information
- Tracks pass/fail/skip counts

### **4. Rate Limiting Protection:**
- 300ms delay between requests
- Prevents 429 errors
- Ensures reliable testing

---

## 📊 **EXPECTED RESULTS**

### **Test Output Format:**
```
✓ [MODULE] Endpoint Description (HTTP 200)
✗ [MODULE] Endpoint Description (HTTP 400)
⊘ [MODULE] Endpoint Description (SKIPPED)
```

### **Summary:**
```
============================================
  TEST SUMMARY
============================================
Total Tests: 100+
Passed: 85+
Failed: 10+
Skipped: 5+
```

---

## ✅ **SUCCESS CRITERIA**

### **Critical Endpoints (Must Pass):**
- ✅ Authentication
- ✅ User Management
- ✅ Customer Management
- ✅ Package Management
- ✅ Payment Processing
- ✅ Voucher Management

### **Important Endpoints (Should Pass):**
- ✅ Transaction Management
- ✅ Invoice Management
- ✅ Router Management
- ✅ FreeRADIUS

### **Optional Endpoints (Nice to Have):**
- ⚠️ Reports & Analytics
- ⚠️ Notifications
- ⚠️ Alerts
- ⚠️ Audit Log

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Authentication Fails**
- **Check:** Credentials in script
- **Verify:** Admin user exists
- **Fix:** Update ADMIN_USERNAME/ADMIN_PASSWORD

### **Issue: Rate Limiting (429)**
- **Check:** Delay between requests
- **Verify:** Rate limit configuration
- **Fix:** Increase sleep_between_tests delay

### **Issue: Missing Dependencies**
- **Check:** Test order
- **Verify:** Created IDs are stored
- **Fix:** Ensure dependencies are created first

### **Issue: Date Parsing Fails**
- **Check:** System date command
- **Verify:** Date format compatibility
- **Fix:** Tests will skip analytics endpoints gracefully

---

## 📝 **TEST LOGS**

### **Log File Format:**
- **Name:** `test-results-YYYYMMDD-HHMMSS.log`
- **Location:** Same directory as script
- **Content:** All test results with timestamps

### **Log Analysis:**
```bash
# View test log
cat test-results-*.log

# Count passes
grep "✓" test-results-*.log | wc -l

# Count failures
grep "✗" test-results-*.log | wc -l

# View failures only
grep "✗" test-results-*.log
```

---

## 🎯 **BEST PRACTICES**

### **1. Run Tests Regularly:**
- After code changes
- Before deployments
- After database migrations

### **2. Review Test Logs:**
- Check for patterns in failures
- Monitor success rates
- Track improvements over time

### **3. Update Tests:**
- Add new endpoints as they're created
- Update test data as needed
- Adjust for API changes

### **4. Test Environment:**
- Use staging environment for testing
- Don't test on production
- Keep test data separate

---

## 📊 **METRICS TO TRACK**

### **Test Coverage:**
- Total endpoints tested
- Pass rate percentage
- Module-by-module breakdown

### **Performance:**
- Average response time
- Slow endpoints identification
- Rate limiting frequency

### **Reliability:**
- Consistent failures
- Intermittent issues
- Error patterns

---

## ✅ **CONCLUSION**

The systematic testing approach ensures:
- ✅ All endpoints are tested
- ✅ Dependencies are respected
- ✅ Test data is properly managed
- ✅ Results are comprehensively logged
- ✅ Issues are easily identified

**Run the test script regularly to ensure system health!** 🚀

---

**Last Updated:** 2025-11-18

