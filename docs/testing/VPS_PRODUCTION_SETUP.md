# VPS Production Database Setup Guide

**Date:** 2025-12-01  
**Environment:** Remote VPS Server  
**Status:** Ready for Production Deployment

---

## Overview

This guide covers setting up the production MySQL database on your VPS where the backend is already deployed.

---

## Prerequisites

- ✅ VPS with backend deployed
- ✅ SSH access to VPS
- ✅ MySQL installed on VPS (or remote MySQL server)
- ✅ Backend application running on VPS

---

## Option 1: Database on Same VPS

If MySQL is on the same VPS as your backend:

### Step 1: SSH into VPS

```bash
ssh user@your-vps-ip
# or
ssh user@your-vps-domain
```

### Step 2: Setup MySQL Database

```bash
# On VPS, run MySQL setup
sudo mysql -u root -p

# Or if you have MySQL user access
mysql -u root -p
```

Then execute:
```sql
CREATE DATABASE IF NOT EXISTS ggnetworks_radius CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'ggnetworks'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON ggnetworks_radius.* TO 'ggnetworks'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Update Application Configuration

On VPS, update `application.yml` or use environment variables:

```bash
# Set environment variables
export DB_USERNAME=ggnetworks
export DB_PASSWORD=your_secure_password
export FLYWAY_ENABLED=true
```

Or update `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ggnetworks_radius?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: ${DB_USERNAME:ggnetworks}
    password: ${DB_PASSWORD:your_secure_password}
```

### Step 4: Run Flyway Migrations

```bash
# Navigate to backend directory on VPS
cd /path/to/backend

# Run migrations
mvn flyway:migrate

# Or if using Spring Boot, migrations run automatically on startup
```

---

## Option 2: Remote Database Server

If MySQL is on a separate server:

### Step 1: Setup Remote MySQL

On the MySQL server:
```sql
CREATE DATABASE ggnetworks_radius CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ggnetworks'@'%' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON ggnetworks_radius.* TO 'ggnetworks'@'%';
FLUSH PRIVILEGES;
```

**Note:** `'%'` allows connection from any host. For security, use specific IP:
```sql
CREATE USER 'ggnetworks'@'your-vps-ip' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON ggnetworks_radius.* TO 'ggnetworks'@'your-vps-ip';
```

### Step 2: Update Application Configuration

On VPS, update connection string:
```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql-server-ip:3306/ggnetworks_radius?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: ${DB_USERNAME:ggnetworks}
    password: ${DB_PASSWORD:your_secure_password}
```

### Step 3: Test Connection

```bash
# On VPS, test MySQL connection
mysql -h mysql-server-ip -u ggnetworks -p ggnetworks_radius
```

---

## Option 3: Using SSH Tunnel (Development/Testing)

For testing from local machine to VPS database:

```bash
# Create SSH tunnel
ssh -L 3306:localhost:3306 user@your-vps-ip

# In another terminal, connect as if local
mysql -h 127.0.0.1 -u ggnetworks -p ggnetworks_radius
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] MySQL server accessible from VPS
- [ ] Database user created with proper permissions
- [ ] Firewall rules configured (if remote database)
- [ ] SSL/TLS configured (for production)
- [ ] Backup strategy in place

### Deployment Steps

1. [ ] **SSH into VPS**
   ```bash
   ssh user@your-vps-ip
   ```

2. [ ] **Stop Backend Application** (if running)
   ```bash
   # If using systemd
   sudo systemctl stop ggwifi-backend
   
   # Or if running manually
   pkill -f ggwifi-backend
   ```

3. [ ] **Update Configuration**
   - Update `application.yml` with database credentials
   - Or set environment variables

4. [ ] **Run Flyway Migrations**
   ```bash
   cd /path/to/backend
   mvn flyway:migrate
   ```

5. [ ] **Verify Database Schema**
   ```bash
   mysql -u ggnetworks -p ggnetworks_radius -e "SHOW TABLES;"
   ```

6. [ ] **Start Backend Application**
   ```bash
   # If using systemd
   sudo systemctl start ggwifi-backend
   
   # Or manually
   java -jar backend.jar --spring.profiles.active=production
   ```

7. [ ] **Verify Application Startup**
   ```bash
   # Check logs
   tail -f /var/log/ggwifi-backend/application.log
   
   # Or if using systemd
   sudo journalctl -u ggwifi-backend -f
   ```

8. [ ] **Test API Endpoints**
   ```bash
   curl http://your-vps-ip:8080/api/v1/health
   ```

---

## Security Considerations

### 1. Database Credentials

**DO NOT** commit passwords to git. Use:
- Environment variables
- Secrets management (Vault, AWS Secrets Manager)
- Configuration files outside git

### 2. Network Security

- Use firewall rules to restrict database access
- Use specific IP addresses instead of `%`
- Enable SSL/TLS for database connections
- Use strong passwords

### 3. Backup Strategy

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u ggnetworks -p ggnetworks_radius > /backups/ggnetworks_radius_$DATE.sql

# Schedule with cron
# 0 2 * * * /path/to/backup-script.sh
```

---

## Troubleshooting

### Connection Refused

```bash
# Check MySQL service
sudo systemctl status mysql

# Check MySQL is listening
sudo netstat -tlnp | grep 3306

# Check firewall
sudo ufw status
```

### Permission Denied

```bash
# Verify user exists
mysql -u root -p -e "SELECT User, Host FROM mysql.user WHERE User='ggnetworks';"

# Verify privileges
mysql -u root -p -e "SHOW GRANTS FOR 'ggnetworks'@'localhost';"
```

### Migration Errors

```bash
# Check Flyway status
cd /path/to/backend
mvn flyway:info

# Check migration history
mysql -u ggnetworks -p ggnetworks_radius -e "SELECT * FROM flyway_schema_history;"
```

---

## Remote Setup Script

Create a script to run on VPS:

```bash
#!/bin/bash
# vps-setup-database.sh

DB_NAME="ggnetworks_radius"
DB_USER="ggnetworks"
DB_PASS="your_secure_password"

# Create database
mysql -u root -p <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

# Run migrations
cd /path/to/backend
mvn flyway:migrate
```

---

## Verification Commands

After setup, verify:

```bash
# 1. Database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'ggnetworks_radius';"

# 2. User can connect
mysql -u ggnetworks -p ggnetworks_radius -e "SELECT 1;"

# 3. Tables created
mysql -u ggnetworks -p ggnetworks_radius -e "SHOW TABLES;"

# 4. Application connects
curl http://localhost:8080/api/v1/health

# 5. Test CRUD operation
curl -X POST http://localhost:8080/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"testadmin","password":"testadmin123"}'
```

---

## Next Steps

1. ✅ SSH into VPS
2. ✅ Setup MySQL database
3. ✅ Run Flyway migrations
4. ✅ Update application configuration
5. ✅ Restart backend application
6. ✅ Verify everything works
7. ✅ Run production tests

---

**Status:** Ready for VPS deployment. All procedures documented.




