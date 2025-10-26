# 🚀 GGWiFi Backend Deployment Readiness Checklist
# Production Deployment to Vultr VPS Ubuntu Server

## 📋 **Pre-Deployment Checklist**

### ✅ **Testing Requirements**
- [ ] **Unit Testing**: All 14 modules tested twice (28 tests)
- [ ] **Integration Testing**: Module relationships verified (5 integration tests)
- [ ] **System Testing**: End-to-end functionality verified (5 system tests)
- [ ] **Requirements Verification**: System specification compliance (10 requirement tests)
- [ ] **Overall Success Rate**: ≥90% test pass rate
- [ ] **All Unit Tests**: 100% pass rate required

### ✅ **System Requirements Verification**
- [ ] **Customer Management**: Phone number as unique identifier
- [ ] **Payment Processing**: Mobile money integration (ZenoPay)
- [ ] **Voucher Management**: Automatic generation and validation
- [ ] **Router Management**: Multi-router MikroTik support
- [ ] **Multi-Location**: Location-based operations
- [ ] **FreeRADIUS Integration**: Authentication and accounting
- [ ] **SMS Integration**: Next SMS gateway integration
- [ ] **Analytics & Reporting**: Business intelligence ready
- [ ] **Admin Management**: Role-based access control
- [ ] **System Security**: JWT authentication and API security

### ✅ **Database Requirements**
- [ ] **MySQL Database**: `ggnetworks_radius` database created
- [ ] **FreeRADIUS Tables**: `nas`, `radacct`, `radcheck`, `radreply` tables
- [ ] **Spring Boot Tables**: All entity tables created
- [ ] **Database User**: `ggnetworks` user with proper permissions
- [ ] **Data Integrity**: Foreign key relationships verified

### ✅ **Application Requirements**
- [ ] **Spring Boot Application**: JAR file built successfully
- [ ] **Dependencies**: All Maven dependencies resolved
- [ ] **Configuration**: Application properties configured
- [ ] **Port Configuration**: Application runs on port 8080
- [ ] **CORS Configuration**: Cross-origin requests enabled

---

## 🖥️ **Vultr VPS Ubuntu Server Deployment Guide**

### **Step 1: Server Preparation**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Java 21 (required for Spring Boot)
sudo apt install openjdk-21-jdk -y

# Install MySQL Server
sudo apt install mysql-server -y

# Install Nginx (for reverse proxy)
sudo apt install nginx -y

# Install Git (for code deployment)
sudo apt install git -y

# Install Node.js (for testing)
sudo apt install nodejs npm -y

# Install curl (for API testing)
sudo apt install curl -y
```

### **Step 2: Database Setup**

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
-- Create database
CREATE DATABASE ggnetworks_radius;

-- Create user
CREATE USER 'ggnetworks'@'localhost' IDENTIFIED BY 'ggnetworks123';

-- Grant privileges
GRANT ALL PRIVILEGES ON ggnetworks_radius.* TO 'ggnetworks'@'localhost';
FLUSH PRIVILEGES;

-- Create FreeRADIUS tables
USE ggnetworks_radius;

CREATE TABLE nas (
    id int(10) unsigned NOT NULL auto_increment,
    nasname varchar(128) NOT NULL,
    shortname varchar(32) NOT NULL,
    type varchar(30) DEFAULT 'other',
    ports int(5),
    secret varchar(60) NOT NULL DEFAULT 'secret',
    server varchar(64),
    community varchar(50),
    description varchar(200) DEFAULT 'RADIUS Client',
    PRIMARY KEY (id),
    KEY nasname (nasname)
);

CREATE TABLE radacct (
    radacctid bigint(21) NOT NULL auto_increment,
    acctsessionid varchar(64) NOT NULL DEFAULT '',
    acctuniqueid varchar(32) NOT NULL DEFAULT '',
    username varchar(64) NOT NULL DEFAULT '',
    realm varchar(64) DEFAULT '',
    nasipaddress varchar(15) NOT NULL DEFAULT '',
    nasportid varchar(15) DEFAULT NULL,
    nasporttype varchar(32) DEFAULT NULL,
    acctstarttime datetime NULL default NULL,
    acctupdatetime datetime NULL default NULL,
    acctstoptime datetime NULL default NULL,
    acctinterval int(12) DEFAULT NULL,
    acctsessiontime int(12) unsigned DEFAULT NULL,
    acctauthentic varchar(32) DEFAULT NULL,
    connectinfo_start varchar(50) DEFAULT NULL,
    connectinfo_stop varchar(50) DEFAULT NULL,
    acctinputoctets bigint(20) DEFAULT NULL,
    acctoutputoctets bigint(20) DEFAULT NULL,
    calledstationid varchar(50) NOT NULL DEFAULT '',
    callingstationid varchar(50) NOT NULL DEFAULT '',
    acctterminatecause varchar(32) NOT NULL DEFAULT '',
    servicetype varchar(32) DEFAULT NULL,
    framedprotocol varchar(32) DEFAULT NULL,
    framedipaddress varchar(15) NOT NULL DEFAULT '',
    PRIMARY KEY (radacctid),
    UNIQUE KEY acctuniqueid (acctuniqueid),
    KEY username (username),
    KEY framedipaddress (framedipaddress),
    KEY acctsessionid (acctsessionid),
    KEY acctsessiontime (acctsessiontime),
    KEY acctstarttime (acctstarttime),
    KEY acctstoptime (acctstoptime),
    KEY nasipaddress (nasipaddress)
);

CREATE TABLE radcheck (
    id int(11) unsigned NOT NULL auto_increment,
    username varchar(64) NOT NULL DEFAULT '',
    attribute varchar(64) NOT NULL DEFAULT '',
    op char(2) NOT NULL DEFAULT '==',
    value varchar(253) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    KEY username (username(32))
);

CREATE TABLE radreply (
    id int(11) unsigned NOT NULL auto_increment,
    username varchar(64) NOT NULL DEFAULT '',
    attribute varchar(64) NOT NULL DEFAULT '',
    op char(2) NOT NULL DEFAULT '=',
    value varchar(253) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    KEY username (username(32))
);

-- Insert sample data
INSERT INTO nas (nasname, shortname, type, secret, description) VALUES 
('192.168.1.1', 'router1', 'other', 'secret123', 'Main Router'),
('192.168.1.2', 'router2', 'other', 'secret456', 'Secondary Router');

EXIT;
```

### **Step 3: Application Deployment**

```bash
# Create application directory
sudo mkdir -p /opt/ggnetworks
sudo chown $USER:$USER /opt/ggnetworks
cd /opt/ggnetworks

# Clone or upload application code
# (Upload the JAR file and configuration files)

# Create application configuration
sudo nano /opt/ggnetworks/application.properties
```

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ggnetworks_radius
spring.datasource.username=ggnetworks
spring.datasource.password=ggnetworks123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server Configuration
server.port=8080
server.servlet.context-path=/api/v1

# CORS Configuration
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*

# Logging Configuration
logging.level.com.ggnetworks=INFO
logging.level.org.springframework.security=DEBUG
logging.file.name=/opt/ggnetworks/logs/application.log

# FreeRADIUS Configuration
freeradius.database.url=jdbc:mysql://localhost:3306/ggnetworks_radius
freeradius.database.username=ggnetworks
freeradius.database.password=ggnetworks123

# Payment Gateway Configuration
payment.gateway.zenopay.api-key=your_zenopay_api_key
payment.gateway.zenopay.api-secret=your_zenopay_api_secret
payment.gateway.zenopay.base-url=https://api.zenopay.co.tz

# SMS Gateway Configuration
sms.gateway.nextsms.api-key=your_nextsms_api_key
sms.gateway.nextsms.api-secret=your_nextsms_api_secret
sms.gateway.nextsms.base-url=https://api.messaging-service.co.tz
```

### **Step 4: System Service Configuration**

```bash
# Create systemd service file
sudo nano /etc/systemd/system/ggnetworks.service
```

```ini
[Unit]
Description=GGNetworks Backend Application
After=network.target mysql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/ggnetworks
ExecStart=/usr/bin/java -jar /opt/ggnetworks/ggnetworks-backend-1.0.0.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ggnetworks

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable ggnetworks
sudo systemctl start ggnetworks

# Check service status
sudo systemctl status ggnetworks
```

### **Step 5: Nginx Reverse Proxy Configuration**

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ggnetworks
```

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/ggnetworks /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **Step 6: Firewall Configuration**

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw enable
```

### **Step 7: SSL Certificate (Optional but Recommended)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## 🧪 **Post-Deployment Testing**

### **Step 1: Health Check**

```bash
# Test application health
curl -X GET http://localhost:8080/api/v1/admin/health

# Test database connection
curl -X GET http://localhost:8080/api/v1/admin/database-status

# Test FreeRADIUS integration
curl -X GET http://localhost:8080/api/v1/admin/radius/status
```

### **Step 2: API Testing**

```bash
# Test customer portal
curl -X GET http://localhost:8080/api/v1/customer-portal/packages

# Test admin endpoints
curl -X GET http://localhost:8080/api/v1/admin/dashboard

# Test payment flow
curl -X POST http://localhost:8080/api/v1/customer-portal/simple-payment \
  -H "Content-Type: application/json" \
  -d '{"buyer_phone":"255123456789","buyer_name":"Test User","buyer_email":"test@example.com","location":"Test Location","packageId":"1","packageName":"Test Package","amount":"1000"}'
```

### **Step 3: Comprehensive Testing**

```bash
# Run comprehensive testing framework
cd /opt/ggnetworks
node comprehensive-testing-framework.js
```

---

## 📊 **Monitoring and Maintenance**

### **Log Monitoring**

```bash
# View application logs
sudo journalctl -u ggnetworks -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View application log file
tail -f /opt/ggnetworks/logs/application.log
```

### **Performance Monitoring**

```bash
# Monitor system resources
htop

# Monitor disk usage
df -h

# Monitor MySQL
sudo mysql -u root -p -e "SHOW PROCESSLIST;"
```

### **Backup Strategy**

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u ggnetworks -pggnetworks123 ggnetworks_radius > /opt/ggnetworks/backups/db_backup_$DATE.sql
find /opt/ggnetworks/backups -name "*.sql" -mtime +7 -delete
```

---

## 🚀 **Deployment Readiness Summary**

### **✅ Ready for Deployment When:**
- [ ] All unit tests pass (100%)
- [ ] Integration tests successful (≥90%)
- [ ] System tests completed (≥90%)
- [ ] Requirements verification passed (≥90%)
- [ ] Database properly configured
- [ ] Application JAR built successfully
- [ ] Server environment prepared
- [ ] Monitoring and logging configured

### **🎯 Deployment Checklist:**
1. **Testing Complete**: Comprehensive testing framework executed
2. **Server Prepared**: Ubuntu server configured with all dependencies
3. **Database Ready**: MySQL database and FreeRADIUS tables created
4. **Application Deployed**: JAR file deployed and service configured
5. **Reverse Proxy**: Nginx configured for external access
6. **Security**: Firewall and SSL certificate configured
7. **Monitoring**: Logging and monitoring systems active
8. **Backup**: Database backup strategy implemented

### **🚀 Production Deployment Commands:**

```bash
# Final deployment commands
sudo systemctl restart ggnetworks
sudo systemctl restart nginx
sudo systemctl status ggnetworks
curl -X GET http://localhost:8080/api/v1/admin/health
```

**🎉 SYSTEM READY FOR PRODUCTION DEPLOYMENT TO VULTR VPS UBUNTU SERVER!**
# Production Deployment to Vultr VPS Ubuntu Server

## 📋 **Pre-Deployment Checklist**

### ✅ **Testing Requirements**
- [ ] **Unit Testing**: All 14 modules tested twice (28 tests)
- [ ] **Integration Testing**: Module relationships verified (5 integration tests)
- [ ] **System Testing**: End-to-end functionality verified (5 system tests)
- [ ] **Requirements Verification**: System specification compliance (10 requirement tests)
- [ ] **Overall Success Rate**: ≥90% test pass rate
- [ ] **All Unit Tests**: 100% pass rate required

### ✅ **System Requirements Verification**
- [ ] **Customer Management**: Phone number as unique identifier
- [ ] **Payment Processing**: Mobile money integration (ZenoPay)
- [ ] **Voucher Management**: Automatic generation and validation
- [ ] **Router Management**: Multi-router MikroTik support
- [ ] **Multi-Location**: Location-based operations
- [ ] **FreeRADIUS Integration**: Authentication and accounting
- [ ] **SMS Integration**: Next SMS gateway integration
- [ ] **Analytics & Reporting**: Business intelligence ready
- [ ] **Admin Management**: Role-based access control
- [ ] **System Security**: JWT authentication and API security

### ✅ **Database Requirements**
- [ ] **MySQL Database**: `ggnetworks_radius` database created
- [ ] **FreeRADIUS Tables**: `nas`, `radacct`, `radcheck`, `radreply` tables
- [ ] **Spring Boot Tables**: All entity tables created
- [ ] **Database User**: `ggnetworks` user with proper permissions
- [ ] **Data Integrity**: Foreign key relationships verified

### ✅ **Application Requirements**
- [ ] **Spring Boot Application**: JAR file built successfully
- [ ] **Dependencies**: All Maven dependencies resolved
- [ ] **Configuration**: Application properties configured
- [ ] **Port Configuration**: Application runs on port 8080
- [ ] **CORS Configuration**: Cross-origin requests enabled

---

## 🖥️ **Vultr VPS Ubuntu Server Deployment Guide**

### **Step 1: Server Preparation**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Java 21 (required for Spring Boot)
sudo apt install openjdk-21-jdk -y

# Install MySQL Server
sudo apt install mysql-server -y

# Install Nginx (for reverse proxy)
sudo apt install nginx -y

# Install Git (for code deployment)
sudo apt install git -y

# Install Node.js (for testing)
sudo apt install nodejs npm -y

# Install curl (for API testing)
sudo apt install curl -y
```

### **Step 2: Database Setup**

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
-- Create database
CREATE DATABASE ggnetworks_radius;

-- Create user
CREATE USER 'ggnetworks'@'localhost' IDENTIFIED BY 'ggnetworks123';

-- Grant privileges
GRANT ALL PRIVILEGES ON ggnetworks_radius.* TO 'ggnetworks'@'localhost';
FLUSH PRIVILEGES;

-- Create FreeRADIUS tables
USE ggnetworks_radius;

CREATE TABLE nas (
    id int(10) unsigned NOT NULL auto_increment,
    nasname varchar(128) NOT NULL,
    shortname varchar(32) NOT NULL,
    type varchar(30) DEFAULT 'other',
    ports int(5),
    secret varchar(60) NOT NULL DEFAULT 'secret',
    server varchar(64),
    community varchar(50),
    description varchar(200) DEFAULT 'RADIUS Client',
    PRIMARY KEY (id),
    KEY nasname (nasname)
);

CREATE TABLE radacct (
    radacctid bigint(21) NOT NULL auto_increment,
    acctsessionid varchar(64) NOT NULL DEFAULT '',
    acctuniqueid varchar(32) NOT NULL DEFAULT '',
    username varchar(64) NOT NULL DEFAULT '',
    realm varchar(64) DEFAULT '',
    nasipaddress varchar(15) NOT NULL DEFAULT '',
    nasportid varchar(15) DEFAULT NULL,
    nasporttype varchar(32) DEFAULT NULL,
    acctstarttime datetime NULL default NULL,
    acctupdatetime datetime NULL default NULL,
    acctstoptime datetime NULL default NULL,
    acctinterval int(12) DEFAULT NULL,
    acctsessiontime int(12) unsigned DEFAULT NULL,
    acctauthentic varchar(32) DEFAULT NULL,
    connectinfo_start varchar(50) DEFAULT NULL,
    connectinfo_stop varchar(50) DEFAULT NULL,
    acctinputoctets bigint(20) DEFAULT NULL,
    acctoutputoctets bigint(20) DEFAULT NULL,
    calledstationid varchar(50) NOT NULL DEFAULT '',
    callingstationid varchar(50) NOT NULL DEFAULT '',
    acctterminatecause varchar(32) NOT NULL DEFAULT '',
    servicetype varchar(32) DEFAULT NULL,
    framedprotocol varchar(32) DEFAULT NULL,
    framedipaddress varchar(15) NOT NULL DEFAULT '',
    PRIMARY KEY (radacctid),
    UNIQUE KEY acctuniqueid (acctuniqueid),
    KEY username (username),
    KEY framedipaddress (framedipaddress),
    KEY acctsessionid (acctsessionid),
    KEY acctsessiontime (acctsessiontime),
    KEY acctstarttime (acctstarttime),
    KEY acctstoptime (acctstoptime),
    KEY nasipaddress (nasipaddress)
);

CREATE TABLE radcheck (
    id int(11) unsigned NOT NULL auto_increment,
    username varchar(64) NOT NULL DEFAULT '',
    attribute varchar(64) NOT NULL DEFAULT '',
    op char(2) NOT NULL DEFAULT '==',
    value varchar(253) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    KEY username (username(32))
);

CREATE TABLE radreply (
    id int(11) unsigned NOT NULL auto_increment,
    username varchar(64) NOT NULL DEFAULT '',
    attribute varchar(64) NOT NULL DEFAULT '',
    op char(2) NOT NULL DEFAULT '=',
    value varchar(253) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    KEY username (username(32))
);

-- Insert sample data
INSERT INTO nas (nasname, shortname, type, secret, description) VALUES 
('192.168.1.1', 'router1', 'other', 'secret123', 'Main Router'),
('192.168.1.2', 'router2', 'other', 'secret456', 'Secondary Router');

EXIT;
```

### **Step 3: Application Deployment**

```bash
# Create application directory
sudo mkdir -p /opt/ggnetworks
sudo chown $USER:$USER /opt/ggnetworks
cd /opt/ggnetworks

# Clone or upload application code
# (Upload the JAR file and configuration files)

# Create application configuration
sudo nano /opt/ggnetworks/application.properties
```

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ggnetworks_radius
spring.datasource.username=ggnetworks
spring.datasource.password=ggnetworks123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server Configuration
server.port=8080
server.servlet.context-path=/api/v1

# CORS Configuration
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*

# Logging Configuration
logging.level.com.ggnetworks=INFO
logging.level.org.springframework.security=DEBUG
logging.file.name=/opt/ggnetworks/logs/application.log

# FreeRADIUS Configuration
freeradius.database.url=jdbc:mysql://localhost:3306/ggnetworks_radius
freeradius.database.username=ggnetworks
freeradius.database.password=ggnetworks123

# Payment Gateway Configuration
payment.gateway.zenopay.api-key=your_zenopay_api_key
payment.gateway.zenopay.api-secret=your_zenopay_api_secret
payment.gateway.zenopay.base-url=https://api.zenopay.co.tz

# SMS Gateway Configuration
sms.gateway.nextsms.api-key=your_nextsms_api_key
sms.gateway.nextsms.api-secret=your_nextsms_api_secret
sms.gateway.nextsms.base-url=https://api.messaging-service.co.tz
```

### **Step 4: System Service Configuration**

```bash
# Create systemd service file
sudo nano /etc/systemd/system/ggnetworks.service
```

```ini
[Unit]
Description=GGNetworks Backend Application
After=network.target mysql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/ggnetworks
ExecStart=/usr/bin/java -jar /opt/ggnetworks/ggnetworks-backend-1.0.0.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ggnetworks

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable ggnetworks
sudo systemctl start ggnetworks

# Check service status
sudo systemctl status ggnetworks
```

### **Step 5: Nginx Reverse Proxy Configuration**

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ggnetworks
```

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/ggnetworks /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **Step 6: Firewall Configuration**

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw enable
```

### **Step 7: SSL Certificate (Optional but Recommended)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## 🧪 **Post-Deployment Testing**

### **Step 1: Health Check**

```bash
# Test application health
curl -X GET http://localhost:8080/api/v1/admin/health

# Test database connection
curl -X GET http://localhost:8080/api/v1/admin/database-status

# Test FreeRADIUS integration
curl -X GET http://localhost:8080/api/v1/admin/radius/status
```

### **Step 2: API Testing**

```bash
# Test customer portal
curl -X GET http://localhost:8080/api/v1/customer-portal/packages

# Test admin endpoints
curl -X GET http://localhost:8080/api/v1/admin/dashboard

# Test payment flow
curl -X POST http://localhost:8080/api/v1/customer-portal/simple-payment \
  -H "Content-Type: application/json" \
  -d '{"buyer_phone":"255123456789","buyer_name":"Test User","buyer_email":"test@example.com","location":"Test Location","packageId":"1","packageName":"Test Package","amount":"1000"}'
```

### **Step 3: Comprehensive Testing**

```bash
# Run comprehensive testing framework
cd /opt/ggnetworks
node comprehensive-testing-framework.js
```

---

## 📊 **Monitoring and Maintenance**

### **Log Monitoring**

```bash
# View application logs
sudo journalctl -u ggnetworks -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View application log file
tail -f /opt/ggnetworks/logs/application.log
```

### **Performance Monitoring**

```bash
# Monitor system resources
htop

# Monitor disk usage
df -h

# Monitor MySQL
sudo mysql -u root -p -e "SHOW PROCESSLIST;"
```

### **Backup Strategy**

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u ggnetworks -pggnetworks123 ggnetworks_radius > /opt/ggnetworks/backups/db_backup_$DATE.sql
find /opt/ggnetworks/backups -name "*.sql" -mtime +7 -delete
```

---

## 🚀 **Deployment Readiness Summary**

### **✅ Ready for Deployment When:**
- [ ] All unit tests pass (100%)
- [ ] Integration tests successful (≥90%)
- [ ] System tests completed (≥90%)
- [ ] Requirements verification passed (≥90%)
- [ ] Database properly configured
- [ ] Application JAR built successfully
- [ ] Server environment prepared
- [ ] Monitoring and logging configured

### **🎯 Deployment Checklist:**
1. **Testing Complete**: Comprehensive testing framework executed
2. **Server Prepared**: Ubuntu server configured with all dependencies
3. **Database Ready**: MySQL database and FreeRADIUS tables created
4. **Application Deployed**: JAR file deployed and service configured
5. **Reverse Proxy**: Nginx configured for external access
6. **Security**: Firewall and SSL certificate configured
7. **Monitoring**: Logging and monitoring systems active
8. **Backup**: Database backup strategy implemented

### **🚀 Production Deployment Commands:**

```bash
# Final deployment commands
sudo systemctl restart ggnetworks
sudo systemctl restart nginx
sudo systemctl status ggnetworks
curl -X GET http://localhost:8080/api/v1/admin/health
```

**🎉 SYSTEM READY FOR PRODUCTION DEPLOYMENT TO VULTR VPS UBUNTU SERVER!**
