# 🚀 Enterprise Features Deployment Guide

**Date:** 2025-01-27  
**Status:** Ready for Production Deployment

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### **1. Redis Installation & Configuration**

```bash
# Install Redis on VPS
sudo apt-get update
sudo apt-get install redis-server -y

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: bind 127.0.0.1 (or your server IP)
# Set: requirepass your-redis-password (optional but recommended)

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

### **2. Database Migrations**

```bash
# Navigate to backend directory
cd backend

# Run Flyway migrations (V16-V20)
# These will create:
# - device_fingerprints table
# - user_mfa table
# - voucher_batches table
# - support_tickets table
# - router password encryption columns

# Enable Flyway in application.yml first:
# spring.flyway.enabled: true

# Or run migrations manually:
mysql -u ggnetworks -p ggnetworks_radius < src/main/resources/db/migration/V16__Create_device_fingerprints_table.sql
mysql -u ggnetworks -p ggnetworks_radius < src/main/resources/db/migration/V17__Encrypt_router_passwords.sql
mysql -u ggnetworks -p ggnetworks_radius < src/main/resources/db/migration/V18__Create_user_mfa_table.sql
mysql -u ggnetworks -p ggnetworks_radius < src/main/resources/db/migration/V19__Create_voucher_batches_table.sql
mysql -u ggnetworks -p ggnetworks_radius < src/main/resources/db/migration/V20__Create_support_tickets_table.sql
```

### **3. Environment Variables**

Add to your VPS environment or `application.yml`:

```bash
# Encryption
export ENCRYPTION_SECRET_KEY="your-strong-secret-key-here-min-32-chars"

# Redis
export REDIS_HOST="localhost"
export REDIS_PORT="6379"
export REDIS_PASSWORD=""  # Optional, set if Redis has password

# Or add to application.yml:
encryption:
  secret-key: ${ENCRYPTION_SECRET_KEY:GGNetworks2024SecretKeyForRouterPasswordEncryption!}
```

### **4. Encrypt Existing Router Passwords**

```bash
# Create a migration script to encrypt existing passwords
# This should be run once after deployment

# Option 1: Via application (recommended)
# Create an admin endpoint to encrypt all router passwords

# Option 2: Manual SQL (if passwords are simple)
# Update routers table to mark passwords as encrypted
# Actual encryption should be done via EncryptionService
```

---

## 🔧 **BACKEND DEPLOYMENT**

### **Step 1: Build Backend**

```bash
cd backend
mvn clean package -DskipTests
```

### **Step 2: Update Configuration**

Ensure `application.yml` has:
- ✅ Redis enabled: `spring.data.redis.enabled: true`
- ✅ Encryption key configured
- ✅ Flyway enabled for new migrations

### **Step 3: Deploy to VPS**

```bash
# Copy JAR to VPS
scp target/ggnetworks-backend-1.0.0.jar user@vps:/opt/ggnetworks/

# SSH to VPS
ssh user@vps

# Stop existing service
sudo systemctl stop ggnetworks-backend

# Backup old JAR
mv /opt/ggnetworks/ggnetworks-backend.jar /opt/ggnetworks/ggnetworks-backend.jar.backup

# Copy new JAR
cp ggnetworks-backend-1.0.0.jar /opt/ggnetworks/ggnetworks-backend.jar

# Start service
sudo systemctl start ggnetworks-backend
sudo systemctl status ggnetworks-backend
```

---

## 🎨 **FRONTEND DEPLOYMENT**

### **Step 1: Install WebSocket Dependencies**

```bash
cd Frontend/admin_portal
npm install sockjs-client @stomp/stompjs
```

```bash
cd Frontend/customer_portal
# deviceFingerprint.js already created, no additional dependencies needed
```

### **Step 2: Update Customer Portal**

The `deviceFingerprint.js` utility is already integrated into `VoucherLogin.jsx`.

**Verify Integration:**
- ✅ Device fingerprint generated on voucher activation
- ✅ Fingerprint hash sent to backend
- ✅ Session token stored in localStorage
- ✅ Heartbeat started automatically

### **Step 3: Update Admin Portal**

**Add WebSocket Support:**
1. Import `useWebSocket` hook in Sessions page
2. Add `LiveSessionMonitor` component
3. Connect to WebSocket endpoint

**Example Integration:**
```javascript
// In Frontend/admin_portal/src/pages/Sessions.jsx
import LiveSessionMonitor from '../components/LiveSessionMonitor';

// Add to render:
<LiveSessionMonitor />
```

### **Step 4: Build & Deploy**

```bash
# Customer Portal
cd Frontend/customer_portal
npm run build
# Deploy dist/ to Cloudflare Pages

# Admin Portal
cd Frontend/admin_portal
npm run build
# Deploy dist/ to Cloudflare Pages
```

---

## ✅ **POST-DEPLOYMENT VERIFICATION**

### **1. Test Redis Connection**

```bash
# On VPS
redis-cli ping
# Should return: PONG

# Check Redis is storing sessions
redis-cli
> KEYS voucher:session:*
> KEYS device:session:*
```

### **2. Test Device Fingerprinting**

1. Open customer portal
2. Activate a voucher
3. Check browser console for fingerprint generation
4. Verify fingerprint stored in database:
   ```sql
   SELECT * FROM device_fingerprints ORDER BY created_at DESC LIMIT 1;
   ```

### **3. Test WebSocket**

1. Open admin portal
2. Navigate to Sessions page
2. Check browser console for WebSocket connection
3. Should see "WebSocket connected" message

### **4. Test MFA**

1. Navigate to `/api/v1/mfa/setup/{userId}`
2. Should receive secret and QR code
3. Scan QR code with authenticator app
4. Verify with `/api/v1/mfa/verify/{userId}`

### **5. Test Voucher Batches**

1. Create batch: `POST /api/v1/admin/voucher-batches`
2. Generate vouchers: `POST /api/v1/admin/voucher-batches/{batchId}/generate`
3. Verify vouchers created in database

### **6. Test Support Tickets**

1. Create ticket: `POST /api/v1/support/tickets`
2. Assign ticket: `PUT /api/v1/support/tickets/{id}/assign`
3. Update status: `PUT /api/v1/support/tickets/{id}/status`

---

## 🔍 **MONITORING & TROUBLESHOOTING**

### **Check Redis Sessions**

```bash
redis-cli
> KEYS voucher:session:*
> GET voucher:session:VCH123456
> TTL voucher:session:VCH123456
```

### **Check Device Fingerprints**

```sql
SELECT 
    fingerprint_hash,
    voucher_code,
    phone_number,
    mac_changes_count,
    ip_changes_count,
    last_seen
FROM device_fingerprints
ORDER BY last_seen DESC
LIMIT 10;
```

### **Check RADIUS Accounting**

```sql
SELECT 
    username,
    acctstarttime,
    acctstoptime,
    acctinputoctets,
    acctoutputoctets,
    acctsessiontime
FROM radacct
WHERE user_type = 'HOTSPOT'
ORDER BY acctstarttime DESC
LIMIT 10;
```

### **Check Session Management**

```sql
SELECT 
    voucher_code,
    phone_number,
    session_status,
    expires_at,
    is_connected,
    persistent_session
FROM voucher_sessions
WHERE session_status = 'ACTIVE'
ORDER BY session_start_time DESC;
```

---

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **Issue 1: Redis Connection Failed**

**Solution:**
```bash
# Check Redis is running
sudo systemctl status redis-server

# Check Redis port
sudo netstat -tlnp | grep 6379

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

### **Issue 2: Device Fingerprint Not Working**

**Solution:**
- Check browser console for errors
- Verify `deviceFingerprint.js` is imported
- Check Web Crypto API is available
- Verify fingerprint hash is sent to backend

### **Issue 3: WebSocket Connection Failed**

**Solution:**
- Check WebSocket endpoint is accessible
- Verify CORS configuration
- Check firewall allows WebSocket connections
- Verify STOMP client library is installed

### **Issue 4: Router Password Encryption Errors**

**Solution:**
- Verify encryption key is set
- Check BouncyCastle library is in classpath
- Ensure passwords are encrypted on create/update
- Check decryption works for connections

---

## 📊 **PERFORMANCE METRICS**

### **Expected Performance:**

- **Redis Session Lookup:** < 100ms
- **Device Fingerprint Generation:** < 50ms
- **WebSocket Latency:** < 200ms
- **Session Activation:** < 2 seconds
- **Heartbeat Processing:** < 100ms

### **Monitoring:**

```bash
# Redis performance
redis-cli --latency

# Backend logs
sudo journalctl -u ggnetworks-backend -f

# Database queries
# Enable slow query log in MySQL
```

---

## ✅ **DEPLOYMENT CHECKLIST**

- [ ] Redis installed and running
- [ ] Database migrations executed (V16-V20)
- [ ] Environment variables configured
- [ ] Backend compiled successfully
- [ ] Backend deployed to VPS
- [ ] Frontend dependencies installed
- [ ] Frontend built successfully
- [ ] Frontend deployed to Cloudflare
- [ ] Redis connection tested
- [ ] Device fingerprinting tested
- [ ] WebSocket connection tested
- [ ] MFA setup tested
- [ ] Voucher batches tested
- [ ] Support tickets tested
- [ ] Router encryption verified

---

## 🎉 **DEPLOYMENT COMPLETE!**

Once all checklist items are verified, your enterprise-grade ISP platform is ready for production!

**Status:** ✅ Ready for Deployment
