# 🚀 Deployment Execution Plan

**Date:** 2025-01-27  
**Status:** Ready to Execute

---

## 📋 **DEPLOYMENT STEPS**

### **Step 1: Pre-Deployment Verification**

✅ **Completed:**
- [x] Backend built successfully
- [x] SMS credentials fixed
- [x] All enterprise features implemented
- [x] Database migrations ready
- [x] Deployment script created

### **Step 2: VPS Preparation**

**On VPS (api.ggwifi.co.tz):**

```bash
# 1. Install Redis (if not installed)
sudo apt-get update
sudo apt-get install redis-server -y
sudo systemctl start redis-server
sudo systemctl enable redis-server
redis-cli ping  # Should return: PONG

# 2. Check database migrations
mysql -u ggnetworks -p ggnetworks_radius -e "SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;"

# 3. Run missing migrations (if needed)
# Enable Flyway in application.yml or run manually
```

### **Step 3: Deploy Backend**

**From Local Machine:**

```bash
cd backend
./deploy-enterprise-features.sh
```

**OR Manual Deployment:**

```bash
# 1. Build (already done)
# mvn clean package -DskipTests

# 2. Upload to VPS
scp target/ggnetworks-backend-1.0.0.jar root@api.ggwifi.co.tz:/opt/ggnetworks/

# 3. SSH to VPS
ssh root@api.ggwifi.co.tz

# 4. Stop service
systemctl stop ggnetworks-backend

# 5. Backup
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
curl https://api.ggwifi.co.tz/api/v1/customer-portal/voucher/TEST123/session/status
```

### **Step 5: Run Database Migrations**

**On VPS:**

```bash
# Option 1: Enable Flyway (recommended)
# Edit /opt/ggnetworks/config/application-production.yml
# Set: spring.flyway.enabled: true
# Restart service

# Option 2: Run manually
mysql -u ggnetworks -p ggnetworks_radius < /path/to/V16__Create_device_fingerprints_table.sql
mysql -u ggnetworks -p ggnetworks_radius < /path/to/V17__Encrypt_router_passwords.sql
mysql -u ggnetworks -p ggnetworks_radius < /path/to/V18__Create_user_mfa_table.sql
mysql -u ggnetworks -p ggnetworks_radius < /path/to/V19__Create_voucher_batches_table.sql
mysql -u ggnetworks -p ggnetworks_radius < /path/to/V20__Create_support_tickets_table.sql
```

### **Step 6: Post-Deployment Testing**

```bash
# Test payment and SMS
cd backend
API_BASE_URL="https://api.ggwifi.co.tz/api/v1" ./test-payment-sms.sh

# Test all endpoints
API_BASE_URL="https://api.ggwifi.co.tz/api/v1" ./test-customer-portal-ahmed.sh
```

---

## ✅ **SUCCESS CRITERIA**

After deployment:
- [ ] Backend service running
- [ ] All endpoints responding (16/16)
- [ ] Session management endpoints working
- [ ] SMS sending successfully
- [ ] Redis connected
- [ ] Database migrations applied
- [ ] No errors in logs

---

**Ready to Execute:** ✅ YES

