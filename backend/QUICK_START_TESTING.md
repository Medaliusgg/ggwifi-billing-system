# 🚀 Quick Start - Testing Customer Portal API

## ⚠️ **IMPORTANT: Backend Must Be Running First!**

---

## 📋 **STEP 1: Start the Backend**

### **Option A: Using Maven (Development)**
```bash
cd backend
mvn spring-boot:run
```

Wait for: `Started GgnetworksBackendApplication in X.XXX seconds`

### **Option B: Using JAR (Production)**
```bash
cd backend
java -jar target/ggnetworks-backend-*.jar
```

### **Option C: If Backend is Deployed on VPS**
```bash
# SSH to VPS and check service status
ssh user@vps
sudo systemctl status ggnetworks-backend

# If not running, start it:
sudo systemctl start ggnetworks-backend
```

---

## 📋 **STEP 2: Verify Backend is Running**

```bash
# Test if backend responds
curl http://localhost:8080/api/v1/customer-portal/test

# Should return:
# {"status":"success","message":"Customer Portal Controller is working!","timestamp":...}
```

---

## 📋 **STEP 3: Run the Test Script**

```bash
cd backend
./test-customer-portal-ahmed.sh
```

---

## 📋 **STEP 4: Check Results**

### **Expected Output:**
- ✅ All tests should show `✓ PASS (HTTP 200)`
- ✅ Voucher code should be generated
- ✅ Session token should be created
- ✅ SMS should be sent to **0742844024**

### **Check Phone 0742844024 for:**
1. Payment success SMS (with voucher code)
2. Payment failure SMS (if failed payment test runs)
3. Voucher notification SMS

---

## 🔧 **TROUBLESHOOTING**

### **Issue: Backend won't start**
```bash
# Check Java version
java -version  # Should be Java 11 or higher

# Check Maven
mvn -version

# Check database connection
mysql -u ggnetworks -p ggnetworks_radius -e "SELECT 1;"
```

### **Issue: Port 8080 already in use**
```bash
# Find process using port 8080
sudo lsof -i :8080
# OR
sudo netstat -tlnp | grep 8080

# Kill the process or change port in application.yml
```

### **Issue: Database connection error**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'ggnetworks_radius';"
```

---

## 📊 **ALTERNATIVE: Test Against Deployed Backend**

If backend is deployed on VPS, update the API URL:

```bash
# Set API base URL
export API_BASE_URL="https://api.ggwifi.co.tz/api/v1"

# Run tests
./test-customer-portal-ahmed.sh
```

---

## ✅ **SUCCESS CRITERIA**

All tests pass when:
- ✅ Backend is running and accessible
- ✅ Database is connected
- ✅ All 16 endpoints return HTTP 200
- ✅ Voucher is created successfully
- ✅ Session is created successfully
- ✅ SMS is sent to 0742844024

---

**Ready to test!** Start the backend first, then run the test script.

