# Backend Deployment Instructions

## Issues Found in Test Results

The test script revealed several endpoints returning 404/405 errors. These need to be fixed by deploying the updated backend code to the VPS.

### Failed Endpoints:
1. **Customer CREATE** - 405 Method Not Allowed (new endpoint not deployed)
2. **Voucher Sessions** - 404 Not Found (new endpoint not deployed)
3. **FreeRADIUS endpoints** - 404 Not Found (path mapping issue fixed)
4. **Customer Portal endpoints** - 404 Not Found (path mapping issue fixed)

---

## Step-by-Step Deployment Guide

### 1. Build the Backend Locally

```bash
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP/backend"
mvn clean package -DskipTests
```

This creates: `target/ggnetworks-backend-1.0.0.jar`

### 2. Commit and Push Changes to Git

```bash
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"
git add .
git commit -m "Add missing CRUD endpoints and fix controller mappings"
git push origin main
```

### 3. Deploy to VPS

**SSH into your VPS:**
```bash
ssh root@your-vps-ip
```

**On the VPS, run these commands:**

```bash
# Navigate to your backend directory
cd /opt/ggwifi-src/ggwifi-billing-system/backend

# Pull latest changes
git pull origin main

# Build the backend
mvn clean package -DskipTests

# Stop the backend service
sudo systemctl stop ggnetworks-backend.service

# Backup current JAR
sudo cp /opt/ggnetworks/ggnetworks-backend.jar /opt/ggnetworks/ggnetworks-backend.jar.backup

# Copy new JAR
sudo cp target/ggnetworks-backend-1.0.0.jar /opt/ggnetworks/ggnetworks-backend.jar

# Start the backend service
sudo systemctl start ggnetworks-backend.service

# Check service status
sudo systemctl status ggnetworks-backend.service

# View logs to ensure it started correctly
sudo journalctl -u ggnetworks-backend.service -f --lines=50
```

### 4. Verify Deployment

Wait 30-60 seconds for the backend to start, then test:

```bash
# Test authentication
curl -k -X POST "https://api.ggwifi.co.tz/api/v1/auth/admin-login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin2024"}'

# Test new customer endpoint
curl -k -X POST "https://api.ggwifi.co.tz/api/v1/admin/customers" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","primaryPhoneNumber":"0741234567","status":"ACTIVE"}'

# Test voucher sessions endpoint
curl -k -X GET "https://api.ggwifi.co.tz/api/v1/admin/vouchers/sessions/active" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test FreeRADIUS health
curl -k -X GET "https://api.ggwifi.co.tz/api/v1/radius/health"

# Test customer portal
curl -k -X GET "https://api.ggwifi.co.tz/api/v1/customer-portal/packages"
```

### 5. Re-run Test Script

After deployment, run the test script again:

```bash
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP/backend"
./test-all-modules.sh
```

---

## Changes Made in This Update

### 1. Customer Controller
- ✅ Added `POST /api/v1/admin/customers` - Create customer
- ✅ Added `PUT /api/v1/admin/customers/{id}` - Update customer
- ✅ Added `DELETE /api/v1/admin/customers/{id}` - Delete customer

### 2. Voucher Controller
- ✅ Added `POST /api/v1/admin/vouchers` - Create voucher
- ✅ Added `GET /api/v1/admin/vouchers/sessions/active` - Get active voucher sessions

### 3. Controller Path Fixes
- ✅ Fixed `FreeRadiusController` mapping from `/radius` to `/api/v1/radius`
- ✅ Fixed `CustomerPortalController` mapping from `/customer-portal` to `/api/v1/customer-portal`

---

## Troubleshooting

### If backend fails to start:

1. **Check logs:**
   ```bash
   sudo journalctl -u ggnetworks-backend.service -n 100
   ```

2. **Check Java version:**
   ```bash
   java -version  # Should be Java 21
   ```

3. **Check database connection:**
   ```bash
   mysql -u ggnetworks -p -e "USE ggnetworks_radius; SHOW TABLES;"
   ```

4. **Check port availability:**
   ```bash
   sudo netstat -tlnp | grep 8080
   ```

### If endpoints still return 404:

1. **Verify JAR was updated:**
   ```bash
   ls -lh /opt/ggnetworks/ggnetworks-backend.jar
   ```

2. **Check service is running:**
   ```bash
   sudo systemctl status ggnetworks-backend.service
   ```

3. **Restart service:**
   ```bash
   sudo systemctl restart ggnetworks-backend.service
   ```

---

## Expected Test Results After Deployment

After successful deployment, you should see:
- ✅ Customer CREATE: 200 OK
- ✅ Voucher sessions: 200 OK
- ✅ FreeRADIUS endpoints: 200 OK
- ✅ Customer Portal endpoints: 200 OK

**Expected Success Rate: 95%+ (31+ tests passing)**

---

## Quick Deployment Script

You can also create a deployment script on the VPS:

```bash
#!/bin/bash
# /opt/ggwifi-src/deploy-backend.sh

cd /opt/ggwifi-src/ggwifi-billing-system/backend
git pull origin main
mvn clean package -DskipTests
sudo systemctl stop ggnetworks-backend.service
sudo cp target/ggnetworks-backend-1.0.0.jar /opt/ggnetworks/ggnetworks-backend.jar
sudo systemctl start ggnetworks-backend.service
sudo systemctl status ggnetworks-backend.service
```

Make it executable:
```bash
chmod +x /opt/ggwifi-src/deploy-backend.sh
```

Then deploy with:
```bash
/opt/ggwifi-src/deploy-backend.sh
```

