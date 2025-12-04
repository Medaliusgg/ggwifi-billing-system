# ✅ Deployment Checklist - Enterprise Features

**Date:** 2025-01-27  
**Status:** Ready for Deployment

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### **Backend Build**
- [x] Backend builds successfully (`mvn clean package -DskipTests`)
- [x] JAR file created: `target/ggnetworks-backend-1.0.0.jar`
- [x] All dependencies included
- [x] No compilation errors

### **Database Migrations**
- [x] V15: voucher_sessions table
- [x] V16: device_fingerprints table
- [x] V17: router password encryption
- [x] V18: user_mfa table
- [x] V19: voucher_batches table
- [x] V20: support_tickets table

### **Configuration**
- [x] Redis configuration in `application.yml`
- [x] Encryption key configured
- [x] SMS API configuration present
- [x] Database connection configured
- [x] Flyway enabled (or ready to enable)

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Prepare VPS**

```bash
# SSH to VPS
ssh root@api.ggwifi.co.tz

# Install Redis (if not installed)
sudo apt-get update
sudo apt-get install redis-server -y
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify Redis
redis-cli ping
# Should return: PONG
```

### **Step 2: Run Database Migrations**

```bash
# On VPS, connect to database
mysql -u ggnetworks -p ggnetworks_radius

# Check existing migrations
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 10;

# If migrations not run, enable Flyway in application.yml:
# spring.flyway.enabled: true
# Then restart service - Flyway will run migrations automatically

# OR run manually:
mysql -u ggnetworks -p ggnetworks_radius < /path/to/V16__Create_device_fingerprints_table.sql
mysql -u ggnetworks -p ggnetworks_radius < /path/to/V17__Encrypt_router_passwords.sql
mysql -u ggnetworks -p ggnetworks_radius < /path/to/V18__Create_user_mfa_table.sql
mysql -u ggnetworks -p ggnetworks_radius < /path/to/V19__Create_voucher_batches_table.sql
mysql -u ggnetworks -p ggnetworks_radius < /path/to/V20__Create_support_tickets_table.sql
```

### **Step 3: Deploy Backend**

```bash
# From local machine
cd backend
./deploy-enterprise-features.sh

# OR manually:
# 1. Build
mvn clean package -DskipTests

# 2. Upload to VPS
scp target/ggnetworks-backend-1.0.0.jar root@api.ggwifi.co.tz:/opt/ggnetworks/

# 3. SSH to VPS
ssh root@api.ggwifi.co.tz

# 4. Stop service
systemctl stop ggnetworks-backend

# 5. Backup old JAR
cp /opt/ggnetworks/ggnetworks-backend.jar /opt/ggnetworks/backup/ggnetworks-backend-$(date +%Y%m%d-%H%M%S).jar

# 6. Replace JAR
mv /opt/ggnetworks/ggnetworks-backend-1.0.0.jar /opt/ggnetworks/ggnetworks-backend.jar

# 7. Start service
systemctl start ggnetworks-backend
systemctl status ggnetworks-backend
```

### **Step 4: Verify Deployment**

```bash
# Test endpoints
curl https://api.ggwifi.co.tz/api/v1/customer-portal/test
curl https://api.ggwifi.co.tz/api/v1/customer-portal/packages

# Test new session endpoints
curl https://api.ggwifi.co.tz/api/v1/customer-portal/voucher/TEST123/session/status
```

---

## 🔧 **POST-DEPLOYMENT VERIFICATION**

### **1. Check Service Status**
```bash
systemctl status ggnetworks-backend
journalctl -u ggnetworks-backend -n 100 --no-pager
```

### **2. Check Redis**
```bash
redis-cli ping
redis-cli KEYS voucher:session:*
```

### **3. Check Database Migrations**
```sql
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;
SELECT COUNT(*) FROM device_fingerprints;
SELECT COUNT(*) FROM voucher_sessions;
SELECT COUNT(*) FROM user_mfa;
SELECT COUNT(*) FROM voucher_batches;
SELECT COUNT(*) FROM support_tickets;
```

### **4. Test All Endpoints**
```bash
cd backend
API_BASE_URL="https://api.ggwifi.co.tz/api/v1" ./test-customer-portal-ahmed.sh
```

---

## ⚠️ **KNOWN ISSUES TO FIX**

### **1. SMS API Authorization (403 FORBIDDEN)**
**Issue:** SMS API returning 403 FORBIDDEN  
**Location:** `application.yml` lines 223-225  
**Fix:**
- Verify SMS API credentials
- Check API base URL: `https://messaging-service.co.tz`
- Update credentials if needed:
  ```yaml
  sms:
    api:
      base-url: ${SMS_API_BASE_URL:https://messaging-service.co.tz}
      username: ${SMS_API_USERNAME:your-username}
      password: ${SMS_API_PASSWORD:your-password}
  ```

### **2. RADIUS User Creation**
**Issue:** RADIUS user creation may need configuration  
**Fix:**
- Verify FreeRADIUS database connection
- Check RADIUS service is running
- Verify RADIUS credentials in `application.yml`

---

## 📊 **DEPLOYMENT STATUS**

- [x] Backend built successfully
- [ ] Redis installed on VPS
- [ ] Database migrations run
- [ ] Backend deployed to VPS
- [ ] Service started successfully
- [ ] All endpoints verified
- [ ] SMS API configured correctly
- [ ] Redis connection verified
- [ ] Session management working
- [ ] Device fingerprinting working

---

## 🧪 **TESTING AFTER DEPLOYMENT**

Run comprehensive tests:
```bash
cd backend
API_BASE_URL="https://api.ggwifi.co.tz/api/v1" ./test-customer-portal-ahmed.sh
```

**Expected Results:**
- ✅ All 16 endpoints should pass
- ✅ Voucher activation should work
- ✅ Session management should work
- ✅ SMS should be sent (after fixing SMS API)

---

**Deployment Script:** `./deploy-enterprise-features.sh`  
**Status:** Ready for Deployment

