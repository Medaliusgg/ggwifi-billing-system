# GGNetworks Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the complete GGNetworks system with FreeRADIUS integration, MikroTik router configuration, and SMS marketing capabilities.

## Prerequisites

- Ubuntu 20.04+ server
- MySQL 8.0+ installed and configured
- Java 17+ installed
- Maven 3.6+ installed
- Network access to MikroTik routers
- SMS gateway API credentials (e.g., Africa's Talking)

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GGNetworks    │◄──►│   FreeRADIUS    │◄──►│   MikroTik      │
│   Backend       │    │   Server        │    │   Routers       │
│   (Spring Boot) │    │   (MySQL)       │    │   (Hotspot/     │
└─────────────────┘    └─────────────────┘    │   PPPoE)        │
         │                       │            └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   SMS Gateway   │    │   Customer      │
│   (Marketing)   │    │   Portals       │
└─────────────────┘    └─────────────────┘
```

## Step 1: Database Setup

### 1.1 Create Database and User

```bash
# Access MySQL as root
sudo mysql -u root -p

# Create database and user
CREATE DATABASE ggnetworks;
CREATE USER 'ggnetworks'@'localhost' IDENTIFIED BY 'ggnetworks_password';
GRANT ALL PRIVILEGES ON ggnetworks.* TO 'ggnetworks'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 1.2 Import FreeRADIUS Schema

```bash
# Import FreeRADIUS SQL configuration
mysql -u root -p ggnetworks < freeradius-sql-config.sql
```

### 1.3 Run Database Migrations

```bash
# Navigate to backend directory
cd backend

# Run Flyway migrations
mvn flyway:migrate
```

## Step 2: FreeRADIUS Setup

### 2.1 Install FreeRADIUS

```bash
# Run the FreeRADIUS setup script
sudo chmod +x setup-freeradius.sh
sudo ./setup-freeradius.sh
```

### 2.2 Verify FreeRADIUS Installation

```bash
# Check service status
sudo systemctl status freeradius

# Test configuration
sudo freeradius -C

# Test authentication
sudo /usr/local/bin/test-radius.sh
```

### 2.3 Configure Firewall

```bash
# Allow RADIUS ports
sudo ufw allow 1812/udp comment "RADIUS Authentication"
sudo ufw allow 1813/udp comment "RADIUS Accounting"
```

## Step 3: Backend Application Setup

### 3.1 Configure Environment Variables

```bash
# Create environment file
cat > .env << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ggnetworks
DB_USERNAME=ggnetworks
DB_PASSWORD=ggnetworks_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=86400000

# RADIUS Configuration
RADIUS_HOST=localhost
RADIUS_PORT=1812
RADIUS_SECRET=testing123
RADIUS_ACCOUNTING_PORT=1813

# SMS Configuration
SMS_API_BASE_URL=https://api.africastalking.com/version1/messaging
SMS_API_KEY=your_sms_api_key
SMS_API_SECRET=your_sms_api_secret
SMS_SENDER_ID=GGNetworks

# SELCOM Payment Configuration
SELCOM_BASE_URL=https://paypoint.selcommobile.com
SELCOM_MERCHANT_ID=your_merchant_id
SELCOM_MERCHANT_KEY=your_merchant_key
SELCOM_API_KEY=your_api_key
SELCOM_API_SECRET=your_api_secret

# Server Configuration
SERVER_PORT=8080
EOF
```

### 3.2 Build and Run Backend

```bash
# Build the application
mvn clean package -DskipTests

# Run the application
java -jar target/ggnetworks-backend-1.0.0.jar
```

### 3.3 Verify Backend

```bash
# Test health endpoint
curl http://localhost:8080/api/v1/health

# Test FreeRADIUS integration
curl http://localhost:8080/api/v1/radius/status
```

## Step 4: MikroTik Router Configuration

### 4.1 Upload Configuration to Router

```bash
# Copy configuration file to router
scp mikrotik-radius-config.rsc admin@192.168.1.1:/tmp/

# SSH to router and import configuration
ssh admin@192.168.1.1
/import file-name=mikrotik-radius-config.rsc
```

### 4.2 Verify Router Configuration

```bash
# Check RADIUS configuration
/radius print

# Check hotspot configuration
/ip hotspot profile print

# Check PPPoE configuration
/ppp profile print
```

### 4.3 Test Router Integration

```bash
# Test hotspot authentication
# Connect to hotspot network and try voucher authentication

# Test PPPoE authentication
# Configure PPPoE client and test connection
```

## Step 5: SMS Marketing Setup

### 5.1 Configure SMS Gateway

```bash
# Run SMS setup script
sudo chmod +x sms-marketing-setup.sh
sudo ./sms-marketing-setup.sh
```

### 5.2 Update SMS Credentials

```bash
# Edit SMS configuration
sudo nano /etc/ggnetworks/sms/config.json

# Update with your SMS gateway credentials
{
  "sms_gateway": {
    "api_key": "your_actual_api_key",
    "api_secret": "your_actual_api_secret"
  }
}
```

### 5.3 Test SMS Functionality

```bash
# Test single SMS
sudo /usr/local/bin/ggnetworks-sms.sh send +255123456789 "Test message"

# Test campaign
sudo /usr/local/bin/ggnetworks-sms.sh campaign "Test Campaign" hotspot_users "Welcome to GGNetworks!"

# Monitor SMS activity
sudo /usr/local/bin/monitor-sms.sh
```

## Step 6: Integration Testing

### 6.1 Run Complete Integration Test

```bash
# Run integration test suite
chmod +x test-integration.sh
./test-integration.sh
```

### 6.2 Manual Testing Checklist

- [ ] Backend API responds correctly
- [ ] FreeRADIUS authentication works
- [ ] Voucher generation and validation
- [ ] PPPoE user authentication
- [ ] SMS sending and delivery
- [ ] Phone number collection
- [ ] MikroTik router integration
- [ ] Database connectivity
- [ ] Log monitoring

## Step 7: Production Deployment

### 7.1 Security Hardening

```bash
# Change default passwords
sudo mysql -u root -p -e "ALTER USER 'freeradius'@'localhost' IDENTIFIED BY 'strong_password';"
sudo mysql -u root -p -e "ALTER USER 'ggnetworks'@'localhost' IDENTIFIED BY 'strong_password';"

# Update RADIUS secret
sudo sed -i 's/testing123/your_strong_radius_secret/g' /etc/freeradius/3.0/clients.conf
sudo systemctl restart freeradius

# Secure file permissions
sudo chmod 600 /etc/ggnetworks/sms/config.json
sudo chown root:root /etc/ggnetworks/sms/config.json
```

### 7.2 SSL/TLS Configuration

```bash
# Install SSL certificate
sudo apt install certbot

# Generate certificate for your domain
sudo certbot certonly --standalone -d admin.ggnetworks.co.tz
sudo certbot certonly --standalone -d connect.ggnetworks.co.tz

# Configure HTTPS for backend
# Add SSL configuration to application.yml
```

### 7.3 Monitoring Setup

```bash
# Set up log rotation
sudo logrotate -f /etc/logrotate.d/ggnetworks

# Create monitoring dashboard
# Configure monitoring tools (Prometheus, Grafana, etc.)

# Set up alerts
# Configure email/SMS alerts for critical events
```

### 7.4 Backup Configuration

```bash
# Create backup script
cat > /usr/local/bin/backup-ggnetworks.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/ggnetworks"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u ggnetworks -pggnetworks_password ggnetworks > $BACKUP_DIR/database_$DATE.sql

# Backup configuration files
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /etc/ggnetworks /etc/freeradius/3.0

# Backup logs
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz /var/log/ggnetworks /var/log/freeradius

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-ggnetworks.sh

# Add to crontab
echo "0 2 * * * /usr/local/bin/backup-ggnetworks.sh" | sudo crontab -
```

## Step 8: Frontend Deployment

### 8.1 Build Frontend Applications

```bash
# Admin Portal
cd Frontend/admin_portal
npm install
npm run build

# Customer Portal
cd ../customer_portal
npm install
npm run build

# Main Portal
cd ../main_portal
npm install
npm run build
```

### 8.2 Deploy to Web Server

```bash
# Install Nginx
sudo apt install nginx

# Configure Nginx for each portal
sudo nano /etc/nginx/sites-available/admin.ggnetworks.co.tz
sudo nano /etc/nginx/sites-available/connect.ggnetworks.co.tz
sudo nano /etc/nginx/sites-available/ggnetworks.co.tz

# Enable sites
sudo ln -s /etc/nginx/sites-available/admin.ggnetworks.co.tz /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/connect.ggnetworks.co.tz /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ggnetworks.co.tz /etc/nginx/sites-enabled/

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

## Troubleshooting

### Common Issues

1. **FreeRADIUS Authentication Fails**
   - Check database connectivity
   - Verify user credentials in radcheck table
   - Check FreeRADIUS logs: `sudo tail -f /var/log/freeradius/radius.log`

2. **Backend API Errors**
   - Check application logs: `tail -f logs/ggnetworks-backend.log`
   - Verify database connection
   - Check JWT configuration

3. **SMS Not Sending**
   - Verify API credentials
   - Check SMS gateway status
   - Review SMS logs: `tail -f /var/log/ggnetworks/sms/sms.log`

4. **MikroTik Integration Issues**
   - Verify RADIUS server IP and secret
   - Check firewall rules
   - Test RADIUS connectivity from router

### Useful Commands

```bash
# Check service status
sudo systemctl status freeradius
sudo systemctl status ggnetworks-backend

# View logs
sudo journalctl -u freeradius -f
sudo journalctl -u ggnetworks-backend -f

# Test RADIUS authentication
radtest voucher_GG12345678 GG12345678 localhost 0 testing123

# Monitor active sessions
mysql -u ggnetworks -pggnetworks_password ggnetworks -e "SELECT * FROM radacct WHERE acctstoptime IS NULL;"

# Check phone number collection
mysql -u ggnetworks -pggnetworks_password ggnetworks -e "SELECT COUNT(*) FROM users WHERE phone_number IS NOT NULL;"
```

## Support and Maintenance

### Regular Maintenance Tasks

1. **Daily**
   - Check service status
   - Review error logs
   - Monitor active sessions

2. **Weekly**
   - Review SMS delivery reports
   - Check database performance
   - Update security patches

3. **Monthly**
   - Review system performance
   - Update SSL certificates
   - Review backup integrity

### Contact Information

- Technical Support: support@ggnetworks.co.tz
- Emergency Contact: +255123456789
- Documentation: https://docs.ggnetworks.co.tz

## Conclusion

This deployment guide covers the complete setup of the GGNetworks system. After following these steps, you should have a fully functional system with:

- ✅ FreeRADIUS authentication server
- ✅ MikroTik router integration
- ✅ SMS marketing capabilities
- ✅ Phone number collection
- ✅ Complete backend API
- ✅ Frontend portals
- ✅ Monitoring and backup systems

For additional support or customization, please refer to the individual component documentation or contact the development team.

