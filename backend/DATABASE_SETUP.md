# 🗄️ GGWIFI Database Setup Guide

This guide will help you configure the MySQL database for both the GGWIFI backend and FreeRADIUS server to use the same database.

## 📋 Prerequisites

- MySQL Server 8.0+ installed and running
- MySQL client tools installed
- Root access to MySQL server
- FreeRADIUS server installed (optional, for RADIUS functionality)

## 🔧 Database Configuration

### Database Credentials
- **Database Name**: `ggwifi`
- **Username**: `root`
- **Password**: `kolombo@123%`
- **Host**: `localhost`
- **Port**: `3306`

### FreeRADIUS Credentials
- **Username**: `freeradius`
- **Password**: `freeradius_password`

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
cd backend
./setup-database.sh
```

This script will:
1. Test MySQL connection
2. Create the `ggwifi` database
3. Run backend schema migrations
4. Configure FreeRADIUS tables
5. Create FreeRADIUS user
6. Verify the setup

### Option 2: Manual Setup

#### Step 1: Create Database

```sql
CREATE DATABASE ggwifi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Step 2: Run Backend Migrations

```bash
cd backend
mysql -u root -p'kolombo@123%' ggwifi < src/main/resources/db/migration/V1__Create_initial_schema.sql
```

#### Step 3: Configure FreeRADIUS

```bash
mysql -u root -p'kolombo@123%' ggwifi < freeradius-mysql-config.sql
```

#### Step 4: Create FreeRADIUS User

```sql
CREATE USER 'freeradius'@'localhost' IDENTIFIED BY 'freeradius_password';
CREATE USER 'freeradius'@'%' IDENTIFIED BY 'freeradius_password';

GRANT SELECT, INSERT, UPDATE ON ggwifi.* TO 'freeradius'@'localhost';
GRANT SELECT, INSERT, UPDATE ON ggwifi.* TO 'freeradius'@'%';

FLUSH PRIVILEGES;
```

## 📁 Database Schema

### Backend Tables
- `users` - User accounts and authentication
- `packages` - Internet packages and plans
- `hotspot_vouchers` - WiFi hotspot vouchers
- `hotspot_sessions` - Active user sessions
- `payments` - Payment transactions
- `customer_profiles` - Customer information
- `locations` - Coverage areas
- `routers` - MikroTik router information
- `radius_users` - RADIUS authentication users

### FreeRADIUS Tables
- `radcheck` - User authentication credentials
- `radreply` - User reply attributes
- `radgroupcheck` - Group check attributes
- `radgroupreply` - Group reply attributes
- `radusergroup` - User group assignments
- `radacct` - Accounting records
- `radpostauth` - Post-authentication logging
- `nas` - Network Access Server information

## 🔗 FreeRADIUS Integration

### Configuration Files

Copy the FreeRADIUS configuration files to your FreeRADIUS installation:

```bash
# Copy SQL configuration
sudo cp freeradius-config/sql.conf /etc/freeradius/3.0/mods-available/sql

# Copy clients configuration
sudo cp freeradius-config/clients.conf /etc/freeradius/3.0/clients.conf

# Copy site configuration
sudo cp freeradius-config/sites-available/default /etc/freeradius/3.0/sites-available/default
```

### Enable SQL Module

```bash
sudo ln -s /etc/freeradius/3.0/mods-available/sql /etc/freeradius/3.0/mods-enabled/sql
```

### Restart FreeRADIUS

```bash
sudo systemctl restart freeradius
sudo systemctl enable freeradius
```

## 🧪 Testing

### Test Database Connection

```bash
mysql -u root -p'kolombo@123%' ggwifi -e "SHOW TABLES;"
```

### Test FreeRADIUS Authentication

```bash
# Test with a user from the database
radtest test_user test123 localhost 0 testing123

# Test with PPPoE user
radtest pppoe_test pppoe123 localhost 0 testing123
```

### Test Backend Connection

Start the Spring Boot application and check the logs for successful database connection.

## 🔍 Verification

### Check Database Tables

```sql
USE ggwifi;

-- Check backend tables
SHOW TABLES LIKE 'users';
SHOW TABLES LIKE 'packages';
SHOW TABLES LIKE 'radius_users';

-- Check FreeRADIUS tables
SHOW TABLES LIKE 'rad%';
SHOW TABLES LIKE 'nas';

-- Check sample data
SELECT * FROM radius_users LIMIT 5;
SELECT * FROM radcheck LIMIT 5;
SELECT * FROM nas;
```

### Check User Permissions

```sql
-- Check FreeRADIUS user permissions
SHOW GRANTS FOR 'freeradius'@'localhost';
SHOW GRANTS FOR 'freeradius'@'%';
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. MySQL Connection Failed
```bash
# Check MySQL service status
sudo systemctl status mysql

# Check MySQL configuration
mysql -u root -p -e "SELECT @@port, @@bind_address;"
```

#### 2. Permission Denied
```bash
# Reset MySQL root password if needed
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'kolombo@123%';"
```

#### 3. FreeRADIUS Not Starting
```bash
# Check FreeRADIUS configuration
sudo freeradius -X

# Check FreeRADIUS logs
sudo tail -f /var/log/freeradius/radius.log
```

#### 4. Authentication Failing
```bash
# Test RADIUS with verbose output
radtest test_user test123 localhost 0 testing123 -x

# Check FreeRADIUS debug mode
sudo freeradius -X -d /etc/freeradius/3.0/
```

### Log Files

- **MySQL Logs**: `/var/log/mysql/error.log`
- **FreeRADIUS Logs**: `/var/log/freeradius/radius.log`
- **Backend Logs**: `logs/ggnetworks-backend.log`

## 📊 Monitoring

### Database Monitoring

```sql
-- Check active connections
SHOW PROCESSLIST;

-- Check database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'ggwifi'
GROUP BY table_schema;

-- Check user statistics
SELECT 
    user_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN active = true THEN 1 END) as active_users
FROM radius_users
GROUP BY user_type;
```

### RADIUS Monitoring

```sql
-- Check active sessions
SELECT 
    username,
    nasipaddress,
    acctstarttime,
    acctsessiontime,
    acctinputoctets,
    acctoutputoctets
FROM radacct
WHERE acctstoptime IS NULL;

-- Check authentication attempts
SELECT 
    username,
    reply,
    authdate
FROM radpostauth
ORDER BY authdate DESC
LIMIT 10;
```

## 🔐 Security Considerations

### Database Security
1. Change default passwords
2. Use strong passwords
3. Limit user permissions
4. Enable SSL connections
5. Regular backups

### FreeRADIUS Security
1. Secure client secrets
2. Use strong NAS secrets
3. Monitor authentication logs
4. Regular security updates
5. Network access controls

## 📈 Performance Optimization

### Database Optimization
1. Proper indexing
2. Connection pooling
3. Query optimization
4. Regular maintenance
5. Monitoring slow queries

### FreeRADIUS Optimization
1. Connection pooling
2. Caching strategies
3. Load balancing
4. Resource monitoring
5. Performance tuning

## 🆘 Support

If you encounter issues:

1. Check the logs for error messages
2. Verify database connectivity
3. Test with sample users
4. Check FreeRADIUS configuration
5. Review network connectivity

For additional support, check the application logs and FreeRADIUS documentation.

---

**Database Setup Complete!** 🎉

Your GGWIFI system is now configured with a shared MySQL database for both the backend and FreeRADIUS authentication.
