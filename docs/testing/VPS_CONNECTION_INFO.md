# VPS Connection Information

**Date:** 2025-12-01  
**VPS Details:** Production Server

---

## SSH Connection

```bash
ssh root@139.84.241.182
```

**Connection Details:**
- **User:** root
- **IP Address:** 139.84.241.182
- **Port:** 22 (default)

---

## Quick Connection Commands

### Connect to VPS
```bash
ssh root@139.84.241.182
```

### Upload Files to VPS
```bash
# Upload setup script
scp docs/testing/VPS_DATABASE_SETUP.sh root@139.84.241.182:/tmp/

# Upload test script
scp docs/testing/COMPLETE_PAYMENT_CRUD_TEST.sh root@139.84.241.182:/tmp/
```

### Test VPS Backend
```bash
# From local machine, test VPS API
curl http://139.84.241.182:8080/api/v1/health

# Or use the remote test script (update IP first)
bash docs/testing/VPS_REMOTE_TEST.sh
```

---

## VPS Setup Steps

### Step 1: Connect to VPS
```bash
ssh root@139.84.241.182
```

### Step 2: Upload Setup Script
```bash
# From local machine
scp docs/testing/VPS_DATABASE_SETUP.sh root@139.84.241.182:/tmp/
```

### Step 3: Run Database Setup
```bash
# On VPS
chmod +x /tmp/VPS_DATABASE_SETUP.sh
/tmp/VPS_DATABASE_SETUP.sh
```

### Step 4: Update Application Config
```bash
# On VPS, set environment variables or update application.yml
export DB_USERNAME=ggnetworks
export DB_PASSWORD=your_secure_password
```

### Step 5: Restart Backend
```bash
# On VPS
# If using systemd
sudo systemctl restart ggwifi-backend

# Or your restart method
```

### Step 6: Test from Local
```bash
# From local machine
curl http://139.84.241.182:8080/api/v1/health
```

---

## Important Notes

- **Security:** Use strong passwords for database
- **Backup:** Create database backup before setup
- **Firewall:** Ensure port 8080 is open for API access
- **SSL:** Consider enabling SSL/TLS for production

---

**VPS IP:** 139.84.241.182  
**Ready for deployment!**




