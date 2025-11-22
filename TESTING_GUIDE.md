# 🧪 COMPREHENSIVE MODULE TESTING GUIDE

**Date:** 2025-11-18  
**System:** GG-WIFI Hotspot Billing System

---

## 📋 **TESTING OVERVIEW**

This guide provides instructions for testing all 16 modules of the GG-WIFI Hotspot Billing System.

---

## 🚀 **QUICK START**

### **Option 1: Automated Testing Script**

Run the comprehensive testing script:

```bash
cd backend
./test-all-modules-comprehensive.sh
```

### **Option 2: Manual Testing with Postman**

Import the Postman collection (see below) and test each module individually.

---

## 📦 **MODULES TO TEST**

### **1. Authentication Module**
- **Endpoints:** 2
- **Tests:**
  - Admin Login
  - Health Check

### **2. User Management Module**
- **Endpoints:** 21
- **Tests:**
  - List Users
  - Get User by ID
  - Create User
  - Dashboard Statistics

### **3. Customer Management Module**
- **Endpoints:** 9
- **Tests:**
  - List Customers
  - Get Customer Statistics
  - Get Active Customers
  - Create Customer

### **4. Package Management Module**
- **Endpoints:** 9
- **Tests:**
  - List Packages
  - Package Analytics
  - Search Packages
  - Get Package by ID
  - Package Performance

### **5. Voucher Management Module**
- **Endpoints:** 16
- **Tests:**
  - List Vouchers
  - Voucher Statistics
  - Voucher Analytics
  - Get Active Vouchers
  - Get Unused Vouchers
  - Active Sessions
  - Get by Status

### **6. Payment Management Module**
- **Endpoints:** 8
- **Tests:**
  - List Payments
  - Payment Statistics
  - Payment Analytics
  - Reconcile Payments
  - Pending Reconciliations
  - Get by Status

### **7. Transaction Management Module**
- **Endpoints:** 8
- **Tests:**
  - List Transactions
  - Transaction Statistics
  - Reconcile Transactions
  - Pending Reconciliations
  - Get by Status

### **8. Invoice Management Module**
- **Endpoints:** 10
- **Tests:**
  - List Invoices
  - Invoice Statistics
  - Get Paid Invoices
  - Get Unpaid Invoices
  - Invoice Template
  - Get by Status

### **9. Router Management Module**
- **Endpoints:** 18
- **Tests:**
  - List Routers
  - Router Statistics
  - Network Analytics

### **10. FreeRADIUS Module**
- **Endpoints:** 12
- **Tests:**
  - RADIUS Health Check
  - List RADIUS Users
  - Get Active Sessions
  - RADIUS Statistics
  - RADIUS Analytics
  - List NAS

### **11. Customer Portal Module**
- **Endpoints:** 7
- **Tests:**
  - List Packages (Public)
  - Customer Portal Test

### **12. Project Management Module**
- **Endpoints:** 14
- **Tests:**
  - List Projects
  - Project Statistics
  - Project Analytics

### **13. Reports & Analytics Module**
- **Endpoints:** 10
- **Tests:**
  - List Reports
  - Report Statistics
  - Generate Financial Report
  - Generate Customer Report
  - Generate Network Report
  - Generate Sales Report

### **14. Notifications Module**
- **Endpoints:** 9
- **Tests:**
  - List Notifications
  - Notification Statistics

### **15. Alerts Module**
- **Endpoints:** 9
- **Tests:**
  - List Alert Rules
  - Alert Statistics

### **16. Audit Log Module**
- **Endpoints:** 5
- **Tests:**
  - List Audit Logs
  - Audit Log Statistics
  - Security Dashboard
  - Security Events

---

## 🔧 **CONFIGURATION**

### **Environment Variables**

```bash
export BASE_URL="https://api.ggwifi.co.tz"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="Admin2024"
```

### **Or Edit Script Directly**

```bash
BASE_URL="${BASE_URL:-https://api.ggwifi.co.tz}"
ADMIN_USERNAME="${ADMIN_USERNAME:-admin}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin2024}"
```

---

## 📊 **EXPECTED RESULTS**

### **Success Criteria:**
- ✅ All authentication tests pass
- ✅ All GET endpoints return HTTP 200
- ✅ All POST endpoints return HTTP 200 (or appropriate status)
- ✅ Response format is consistent: `{status, message, data}`
- ✅ No 403 Forbidden errors
- ✅ No 500 Internal Server errors

### **Test Output:**
```
============================================
  GG-WIFI COMPREHENSIVE MODULE TESTING
============================================

MODULE 1: AUTHENTICATION
✓ Admin login successful
✓ Health Check - PASSED

MODULE 2: USER MANAGEMENT
✓ List Users - PASSED
✓ Get User by ID - PASSED
...

============================================
  TEST SUMMARY
============================================
Total Tests: 168
Passed: 165
Failed: 3
```

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Authentication Fails**
- **Solution:** Check credentials in script
- **Verify:** Admin user exists in database

### **Issue: 403 Forbidden Errors**
- **Solution:** Token may be expired, re-run authentication
- **Verify:** User has proper permissions

### **Issue: 500 Internal Server Errors**
- **Solution:** Check backend logs
- **Verify:** Database connection is working

### **Issue: Connection Refused**
- **Solution:** Verify BASE_URL is correct
- **Verify:** Backend service is running

---

## 📝 **MANUAL TESTING CHECKLIST**

### **For Each Module:**
- [ ] Authentication works
- [ ] List endpoint returns data
- [ ] Get by ID endpoint works
- [ ] Create endpoint works (if applicable)
- [ ] Update endpoint works (if applicable)
- [ ] Delete endpoint works (if applicable)
- [ ] Statistics endpoint works
- [ ] Analytics endpoint works (if applicable)
- [ ] Search/Filter endpoints work (if applicable)

---

## 🎯 **TESTING PRIORITIES**

### **Critical (Test First):**
1. Authentication
2. Payment Processing
3. Voucher Management
4. Customer Portal

### **Important (Test Second):**
5. Customer Management
6. Package Management
7. Transaction Management
8. Invoice Management

### **Standard (Test Third):**
9. User Management
10. Router Management
11. FreeRADIUS
12. Project Management

### **Optional (Test Last):**
13. Reports & Analytics
14. Notifications
15. Alerts
16. Audit Log

---

## 📈 **PERFORMANCE TESTING**

### **Load Testing:**
```bash
# Test with multiple concurrent requests
for i in {1..10}; do
    ./test-all-modules-comprehensive.sh &
done
wait
```

### **Response Time Monitoring:**
- Most endpoints should respond in < 500ms
- Analytics endpoints may take 1-2 seconds
- Report generation may take 2-5 seconds

---

## ✅ **VALIDATION CHECKLIST**

After testing, verify:
- [ ] All critical modules tested
- [ ] All endpoints return expected status codes
- [ ] Response format is consistent
- [ ] Error handling works correctly
- [ ] Authentication/Authorization works
- [ ] Data is returned correctly
- [ ] No security vulnerabilities exposed

---

## 📞 **SUPPORT**

If you encounter issues:
1. Check backend logs: `journalctl -u ggnetworks-backend -f`
2. Verify database connection
3. Check API endpoint URLs
4. Verify authentication token

---

**Happy Testing!** 🚀

