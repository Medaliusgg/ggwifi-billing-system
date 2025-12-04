# VPS Deployment - Complete Guide

**Date:** 2025-12-01  
**VPS:** root@139.84.241.182  
**Status:** Ready to Deploy

---

## 🚀 Quick Start

### Option 1: Automated (Recommended)

```bash
# From local machine
bash docs/testing/VPS_QUICK_DEPLOY.sh
```

This will:
1. Test SSH connection
2. Upload setup script to VPS
3. Provide instructions

### Option 2: Manual

```bash
# 1. Upload script
scp docs/testing/VPS_DATABASE_SETUP.sh root@139.84.241.182:/tmp/

# 2. SSH into VPS
ssh root@139.84.241.182

# 3. Run setup
chmod +x /tmp/VPS_DATABASE_SETUP.sh
/tmp/VPS_DATABASE_SETUP.sh
```

---

## 📋 Complete Deployment Steps

### Step 1: Connect to VPS

```bash
ssh root@139.84.241.182
```

### Step 2: Setup MySQL Database

**On VPS, run:**
```bash
# If script uploaded
/tmp/VPS_DATABASE_SETUP.sh

# Or manual setup
mysql -u root -p
```

**SQL Commands:**
```sql
CREATE DATABASE ggnetworks_radius CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ggnetworks'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON ggnetworks_radius.* TO 'ggnetworks'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Update Application Configuration

**On VPS, set environment variables:**
```bash
# Add to ~/.bashrc or create .env file
export DB_USERNAME=ggnetworks
export DB_PASSWORD=your_secure_password
export FLYWAY_ENABLED=true
```

**Or update application.yml:**
```bash
nano /path/to/backend/src/main/resources/application.yml
```

### Step 4: Run Flyway Migrations

**On VPS:**
```bash
cd /path/to/backend
mvn flyway:migrate
```

### Step 5: Restart Backend

**On VPS:**
```bash
# If using systemd
sudo systemctl restart ggwifi-backend
sudo systemctl status ggwifi-backend

# Or your restart method
```

### Step 6: Verify Deployment

**From local machine:**
```bash
# Test health endpoint
curl http://139.84.241.182:8080/api/v1/health

# Test authentication
curl -X POST http://139.84.241.182:8080/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"testadmin","password":"testadmin123"}'

# Or use test script
bash docs/testing/VPS_REMOTE_TEST.sh
```

---

## 🔍 Verification Checklist

- [ ] SSH connection works
- [ ] MySQL database created
- [ ] Database user created
- [ ] Flyway migrations completed
- [ ] Application configuration updated
- [ ] Backend restarted
- [ ] Health endpoint responding
- [ ] API endpoints working
- [ ] Database operations working

---

## 🛠️ Troubleshooting

### SSH Connection Issues

```bash
# Test connection
ssh -v root@139.84.241.182

# Check if port 22 is open
telnet 139.84.241.182 22
```

### Database Connection Issues

```bash
# On VPS, test MySQL
mysql -u ggnetworks -p ggnetworks_radius

# Check MySQL service
sudo systemctl status mysql
```

### Application Issues

```bash
# On VPS, check logs
tail -f /var/log/ggwifi-backend/application.log

# Check if application is running
ps aux | grep java
```

---

## 📊 VPS Information

- **IP Address:** 139.84.241.182
- **User:** root
- **SSH Command:** `ssh root@139.84.241.182`
- **API URL:** `http://139.84.241.182:8080/api/v1`

---

## ✅ Success Criteria

After deployment, verify:

1. ✅ Database accessible
2. ✅ All tables created
3. ✅ Application running
4. ✅ API endpoints responding
5. ✅ CRUD operations working
6. ✅ Authentication working

---

**VPS:** root@139.84.241.182  
**Status:** Ready to deploy! 🚀




