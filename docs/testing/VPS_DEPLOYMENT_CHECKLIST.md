# VPS Deployment Checklist

**Date:** 2025-12-01  
**Environment:** Remote VPS Server  
**Purpose:** Production Database Setup on VPS

---

## Pre-Deployment Checklist

### Server Access
- [ ] SSH access to VPS confirmed
- [ ] VPS IP address or domain name noted
- [ ] SSH key or password available
- [ ] Backend application location known

### Database Server
- [ ] MySQL installed on VPS (or remote MySQL server accessible)
- [ ] MySQL root password available
- [ ] Firewall rules configured (if remote database)
- [ ] Network connectivity verified

### Application
- [ ] Backend application deployed on VPS
- [ ] Application configuration file location known
- [ ] Application restart method known (systemd/service/manual)

---

## Deployment Steps

### Step 1: Connect to VPS

```bash
# SSH into VPS
ssh user@your-vps-ip
# or
ssh user@your-vps-domain
```

**Check:**
- [ ] Successfully connected
- [ ] Can navigate to backend directory
- [ ] Can access MySQL

---

### Step 2: Setup MySQL Database

**Option A: Using Setup Script**

```bash
# Upload setup script to VPS
scp docs/testing/VPS_DATABASE_SETUP.sh user@vps-ip:/tmp/

# SSH into VPS
ssh user@vps-ip

# Make executable and run
chmod +x /tmp/VPS_DATABASE_SETUP.sh
/tmp/VPS_DATABASE_SETUP.sh
```

**Option B: Manual Setup**

```bash
# On VPS, connect to MySQL
sudo mysql -u root -p

# Execute SQL
CREATE DATABASE ggnetworks_radius CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ggnetworks'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON ggnetworks_radius.* TO 'ggnetworks'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Check:**
- [ ] Database created
- [ ] User created
- [ ] Privileges granted
- [ ] Connection test successful

---

### Step 3: Update Application Configuration

**Option A: Environment Variables (Recommended)**

```bash
# On VPS, add to ~/.bashrc or /etc/environment
export DB_USERNAME=ggnetworks
export DB_PASSWORD=your_secure_password
export FLYWAY_ENABLED=true

# Or create .env file in backend directory
cd /path/to/backend
cat > .env <<EOF
DB_USERNAME=ggnetworks
DB_PASSWORD=your_secure_password
FLYWAY_ENABLED=true
EOF
```

**Option B: Update application.yml**

```bash
# On VPS, edit application.yml
nano /path/to/backend/src/main/resources/application.yml

# Update database section:
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ggnetworks_radius?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: ${DB_USERNAME:ggnetworks}
    password: ${DB_PASSWORD:your_secure_password}
```

**Check:**
- [ ] Configuration updated
- [ ] Credentials correct
- [ ] No sensitive data in git

---

### Step 4: Run Flyway Migrations

```bash
# On VPS, navigate to backend
cd /path/to/backend

# Run migrations
mvn flyway:migrate

# Or if using Spring Boot, migrations run on startup
```

**Check:**
- [ ] Migrations completed
- [ ] No errors in output
- [ ] Tables created (verify with `SHOW TABLES;`)

---

### Step 5: Verify Database Schema

```bash
# On VPS, verify tables
mysql -u ggnetworks -p ggnetworks_radius -e "SHOW TABLES;"

# Check Flyway history
mysql -u ggnetworks -p ggnetworks_radius -e "SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;"
```

**Check:**
- [ ] All expected tables exist
- [ ] Flyway history shows migrations
- [ ] No missing tables

---

### Step 6: Restart Backend Application

**If using systemd:**
```bash
sudo systemctl restart ggwifi-backend
sudo systemctl status ggwifi-backend
```

**If using service script:**
```bash
sudo service ggwifi-backend restart
sudo service ggwifi-backend status
```

**If running manually:**
```bash
# Stop existing process
pkill -f ggwifi-backend

# Start application
cd /path/to/backend
java -jar target/ggwifi-backend.jar --spring.profiles.active=production
```

**Check:**
- [ ] Application started successfully
- [ ] No database connection errors
- [ ] Application logs show successful startup

---

### Step 7: Verify Application

```bash
# Test health endpoint
curl http://localhost:8080/api/v1/health

# Test API endpoint
curl http://localhost:8080/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"testadmin","password":"testadmin123"}'
```

**Check:**
- [ ] Health endpoint responds
- [ ] API endpoints working
- [ ] Database operations successful

---

## Post-Deployment Verification

### Database Verification

```bash
# On VPS
mysql -u ggnetworks -p ggnetworks_radius

# Check tables
SHOW TABLES;

# Check sample data
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM packages;
SELECT COUNT(*) FROM vouchers;

# Check Flyway status
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC;
```

### Application Verification

```bash
# Check application logs
tail -f /var/log/ggwifi-backend/application.log
# or
sudo journalctl -u ggwifi-backend -f

# Test CRUD operations
# (Use the test scripts from local machine pointing to VPS)
```

### Remote Testing

From local machine:
```bash
# Test VPS API
curl http://your-vps-ip:8080/api/v1/health

# Test authentication
curl -X POST http://your-vps-ip:8080/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"testadmin","password":"testadmin123"}'
```

---

## Security Checklist

- [ ] Database password is strong and secure
- [ ] Database user has minimal required privileges
- [ ] Firewall rules configured correctly
- [ ] SSL/TLS enabled for database (production)
- [ ] Application credentials not in git
- [ ] Backup strategy in place
- [ ] Logs don't contain sensitive information

---

## Backup Strategy

### Database Backup

```bash
# Create backup script on VPS
cat > /usr/local/bin/backup-database.sh <<'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/ggnetworks"
mkdir -p $BACKUP_DIR
mysqldump -u ggnetworks -p'your_password' ggnetworks_radius > $BACKUP_DIR/ggnetworks_radius_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-database.sh

# Schedule daily backup
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-database.sh") | crontab -
```

---

## Troubleshooting

### Connection Issues

```bash
# Check MySQL service
sudo systemctl status mysql

# Check MySQL is listening
sudo netstat -tlnp | grep 3306

# Test connection
mysql -u ggnetworks -p ggnetworks_radius
```

### Application Issues

```bash
# Check application logs
tail -f /var/log/ggwifi-backend/application.log

# Check systemd status
sudo systemctl status ggwifi-backend

# Check Java process
ps aux | grep java
```

### Migration Issues

```bash
# Check Flyway status
cd /path/to/backend
mvn flyway:info

# Check migration history
mysql -u ggnetworks -p ggnetworks_radius -e "SELECT * FROM flyway_schema_history;"
```

---

## Rollback Plan

If something goes wrong:

1. **Stop Application**
   ```bash
   sudo systemctl stop ggwifi-backend
   ```

2. **Restore Database** (if backup exists)
   ```bash
   mysql -u ggnetworks -p ggnetworks_radius < backup_file.sql
   ```

3. **Revert Configuration**
   ```bash
   # Restore previous application.yml
   # Or remove environment variables
   ```

4. **Restart Application**
   ```bash
   sudo systemctl start ggwifi-backend
   ```

---

## Success Criteria

- [ ] Database created and accessible
- [ ] All Flyway migrations completed
- [ ] Application connects to database
- [ ] API endpoints responding
- [ ] CRUD operations working
- [ ] No errors in logs
- [ ] Backup strategy in place

---

**Status:** Ready for VPS deployment. Follow checklist step by step.




