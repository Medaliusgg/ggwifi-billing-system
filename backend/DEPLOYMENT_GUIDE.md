# 🚀 GG-WIFI Backend Deployment Guide for Vultr VPS

This guide will help you deploy the GG-WIFI backend to your Vultr VPS and test all API endpoints.

## 📋 Prerequisites

- Vultr VPS with Ubuntu 20.04+ or CentOS 8+
- SSH access to your VPS
- Java 17+ installed on VPS
- MySQL 8.0+ installed on VPS
- Maven 3.6+ installed locally

## 🛠️ Step 1: Prepare Your VPS

### Connect to your VPS
```bash
ssh root@your-vps-ip
```

### Update system packages
```bash
apt update && apt upgrade -y
```

### Install Java 17
```bash
apt install -y openjdk-17-jdk
java -version
```

### Install MySQL 8.0
```bash
apt install -y mysql-server mysql-client
systemctl start mysql
systemctl enable mysql
```

### Install additional tools
```bash
apt install -y curl wget unzip jq
```

## 🗄️ Step 2: Setup Database

### Run the database setup script
```bash
# Upload the script to your VPS
scp setup-database-vps.sh root@your-vps-ip:/root/
ssh root@your-vps-ip "chmod +x setup-database-vps.sh && ./setup-database-vps.sh"
```

### Verify database setup
```bash
mysql -u ggnetworks -psecure_password ggnetworks -e "SHOW TABLES;"
```

## 🚀 Step 3: Deploy Backend

### Update deployment script with your VPS IP
```bash
# Edit the deployment script
nano deploy-to-vps.sh

# Update this line with your VPS IP:
VPS_IP="your-vps-ip-address"
```

### Run deployment script
```bash
./deploy-to-vps.sh
```

### Verify deployment
```bash
# Check service status
ssh root@your-vps-ip "systemctl status ggnetworks-backend"

# Check logs
ssh root@your-vps-ip "journalctl -u ggnetworks-backend -f"
```

## 🧪 Step 4: Test All APIs

### Update testing script with your VPS IP
```bash
# Edit the testing script
nano test-all-apis.sh

# Update this line with your VPS IP:
BASE_URL="http://your-vps-ip:8080"
```

### Run comprehensive API tests
```bash
./test-all-apis.sh
```

## 🔧 Step 5: Configure Production Environment

### Update system configuration
```bash
# Connect to your VPS
ssh root@your-vps-ip

# Update MySQL with real API keys
mysql -u ggnetworks -psecure_password ggnetworks -e "
UPDATE system_configurations SET config_value = 'your-real-zenopay-api-key' WHERE config_key = 'ZENOPAY_API_KEY';
UPDATE system_configurations SET config_value = 'your-real-sms-api-key' WHERE config_key = 'SMS_API_KEY';
UPDATE system_configurations SET config_value = 'http://your-vps-ip:8080/api/customer-portal/webhook' WHERE config_key = 'ZENOPAY_WEBHOOK_URL';
"
```

### Update production configuration
```bash
# Edit production config
nano /opt/ggnetworks/config/application-production.yml

# Update with real values:
# - ZenoPay API key
# - SMS API key
# - FreeRADIUS configuration
# - MikroTik router details
# - JWT secret
```

### Restart service
```bash
systemctl restart ggnetworks-backend
```

## 🔒 Step 6: Security Configuration

### Configure firewall
```bash
# Allow SSH, HTTP, HTTPS, and backend port
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 8080
ufw enable
```

### Secure MySQL
```bash
# Run MySQL secure installation
mysql_secure_installation
```

### Update default passwords
```bash
# Change admin password
mysql -u ggnetworks -psecure_password ggnetworks -e "
UPDATE users SET password = '\$2a\$10\$new_hashed_password' WHERE username = 'admin';
"
```

## 📊 Step 7: Monitoring and Logs

### Check service status
```bash
systemctl status ggnetworks-backend
```

### View logs
```bash
# Real-time logs
journalctl -u ggnetworks-backend -f

# Recent logs
journalctl -u ggnetworks-backend --since "1 hour ago"

# Application logs
tail -f /opt/ggnetworks/logs/ggnetworks-backend.log
```

### Monitor system resources
```bash
# CPU and memory usage
htop

# Disk usage
df -h

# Network connections
netstat -tlnp
```

## 🧪 Step 8: API Testing Checklist

### ✅ Authentication APIs
- [ ] Admin login
- [ ] Token validation
- [ ] Logout

### ✅ User Management APIs
- [ ] Get all users
- [ ] Create user
- [ ] Update user
- [ ] Delete user
- [ ] User statistics

### ✅ Package Management APIs
- [ ] Get all packages
- [ ] Create package
- [ ] Update package
- [ ] Delete package
- [ ] Get active packages

### ✅ Customer Portal APIs
- [ ] Get customer packages
- [ ] Initiate payment
- [ ] Process webhook
- [ ] Generate voucher

### ✅ Router Management APIs
- [ ] Get all routers
- [ ] Add router
- [ ] Update router
- [ ] Delete router
- [ ] Router statistics

### ✅ FreeRADIUS APIs
- [ ] Health check
- [ ] Add RADIUS user
- [ ] Remove RADIUS user
- [ ] Get active sessions
- [ ] RADIUS statistics

### ✅ Transaction APIs
- [ ] Get all transactions
- [ ] Get transaction statistics
- [ ] Search transactions

### ✅ Payment APIs
- [ ] Get all payments
- [ ] Get payment statistics
- [ ] Process payment

### ✅ Voucher APIs
- [ ] Get all vouchers
- [ ] Generate voucher
- [ ] Validate voucher
- [ ] Voucher statistics

### ✅ Customer APIs
- [ ] Get all customers
- [ ] Get customer by ID
- [ ] Customer statistics

### ✅ Invoice APIs
- [ ] Get all invoices
- [ ] Generate invoice
- [ ] Invoice statistics

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check logs
journalctl -u ggnetworks-backend -n 50

# Check Java version
java -version

# Check port availability
netstat -tlnp | grep 8080
```

### Database connection issues
```bash
# Check MySQL status
systemctl status mysql

# Test connection
mysql -u ggnetworks -psecure_password ggnetworks -e "SELECT 1;"

# Check MySQL logs
tail -f /var/log/mysql/error.log
```

### API endpoints not responding
```bash
# Check if service is running
systemctl status ggnetworks-backend

# Check if port is open
curl -I http://localhost:8080/actuator/health

# Check firewall
ufw status
```

## 📞 Support

If you encounter any issues:

1. Check the logs: `journalctl -u ggnetworks-backend -f`
2. Verify database connection: `mysql -u ggnetworks -psecure_password ggnetworks`
3. Test API endpoints: `./test-all-apis.sh`
4. Check system resources: `htop`

## 🎉 Success!

Once all tests pass, your GG-WIFI backend is successfully deployed and ready for production use!

### Next Steps:
1. Deploy the Admin Portal frontend
2. Deploy the Customer Portal frontend
3. Configure Nginx reverse proxy
4. Setup SSL certificates
5. Configure monitoring and alerts
