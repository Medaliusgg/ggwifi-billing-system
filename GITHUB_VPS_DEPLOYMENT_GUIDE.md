# 🚀 Complete GitHub + VPS Deployment Guide

This guide will help you set up automated deployment from GitHub to your Vultr VPS for the GG-WIFI backend system.

## 📋 Prerequisites

- Vultr VPS with Ubuntu 20.04+ or CentOS 8+
- GitHub repository: `https://github.com/Medaliusgg/ggwifi-billing-system`
- SSH access to your VPS
- GitHub account with repository access

## 🛠️ Step 1: Prepare Your VPS

### Option A: Automated VPS Setup (Recommended)
```bash
# Update VPS IP in the script
nano setup-vps-for-deployment.sh
# Change: VPS_IP="your-vps-ip-address"

# Run the setup script
./setup-vps-for-deployment.sh
```

### Option B: Manual VPS Setup
```bash
# Connect to your VPS
ssh root@your-vps-ip

# Update system packages
apt update && apt upgrade -y

# Install Java 17
apt install -y openjdk-17-jdk

# Install MySQL 8.0
apt install -y mysql-server mysql-client

# Install additional tools
apt install -y curl wget unzip jq git

# Start and enable MySQL
systemctl start mysql
systemctl enable mysql

# Create deployment directory
mkdir -p /opt/ggnetworks/{logs,config,backup}

# Setup firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 8080
ufw --force enable
```

## 🔐 Step 2: Configure GitHub Secrets

1. **Go to your GitHub repository**
   - Navigate to: `https://github.com/Medaliusgg/ggwifi-billing-system`
   - Click on **Settings** → **Secrets and variables** → **Actions**

2. **Add the following secrets:**
   ```
   VPS_HOST=your-vps-ip-address
   VPS_USER=root
   VPS_PORT=22
   VPS_SSH_KEY=your-private-ssh-key
   DB_USERNAME=ggnetworks
   DB_PASSWORD=secure_password
   ZENOPAY_API_KEY=your-zenopay-api-key
   SMS_API_KEY=your-sms-api-key
   JWT_SECRET=your-super-secret-jwt-key
   ```

### How to get your SSH private key:
```bash
# If you don't have an SSH key pair, generate one:
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy your private key content:
cat ~/.ssh/id_rsa

# Add the public key to your VPS:
ssh-copy-id root@your-vps-ip
```

## 🚀 Step 3: Deploy Backend

### Option A: Automatic Deployment (Recommended)
1. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push origin main
   ```

2. **Monitor deployment:**
   - Go to GitHub → Actions
   - Watch the "Deploy Backend to VPS" workflow
   - Check for success/failure status

### Option B: Manual Deployment Trigger
1. **Go to GitHub Actions:**
   - Navigate to: `https://github.com/Medaliusgg/ggwifi-billing-system/actions`
   - Click on "Deploy Backend to VPS"
   - Click "Run workflow"
   - Select "production" environment
   - Click "Run workflow"

## 🧪 Step 4: Test Deployment

### Check deployment status:
```bash
# SSH to your VPS
ssh root@your-vps-ip

# Check service status
systemctl status ggnetworks-backend

# View logs
journalctl -u ggnetworks-backend -f

# Test health endpoint
curl http://localhost:8080/actuator/health
```

### Test API endpoints:
```bash
# Health check
curl http://your-vps-ip:8080/actuator/health

# Admin login
curl -X POST http://your-vps-ip:8080/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","phoneNumber":"0676591880","password":"admin123"}'

# Get packages
curl http://your-vps-ip:8080/api/packages/active
```

## 🔧 Step 5: Configure Production Environment

### Update system configuration with real API keys:
```bash
# SSH to your VPS
ssh root@your-vps-ip

# Update MySQL with real API keys
mysql -u ggnetworks -psecure_password ggnetworks -e "
UPDATE system_configurations SET config_value = 'your-real-zenopay-api-key' WHERE config_key = 'ZENOPAY_API_KEY';
UPDATE system_configurations SET config_value = 'your-real-sms-api-key' WHERE config_key = 'SMS_API_KEY';
UPDATE system_configurations SET config_value = 'http://your-vps-ip:8080/api/customer-portal/webhook' WHERE config_key = 'ZENOPAY_WEBHOOK_URL';
"
```

### Restart service:
```bash
systemctl restart ggnetworks-backend
```

## 📊 Step 6: Monitor and Maintain

### Service Management:
```bash
# Check service status
systemctl status ggnetworks-backend

# Start service
systemctl start ggnetworks-backend

# Stop service
systemctl stop ggnetworks-backend

# Restart service
systemctl restart ggnetworks-backend

# Enable service (start on boot)
systemctl enable ggnetworks-backend

# Disable service
systemctl disable ggnetworks-backend
```

### Log Monitoring:
```bash
# View real-time logs
journalctl -u ggnetworks-backend -f

# View recent logs
journalctl -u ggnetworks-backend --since "1 hour ago"

# View application logs
tail -f /opt/ggnetworks/logs/ggnetworks-backend.log
```

### System Monitoring:
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check network connections
netstat -tlnp

# Check Java processes
ps aux | grep java
```

## 🚨 Troubleshooting

### Common Issues:

1. **Deployment fails in GitHub Actions**
   ```bash
   # Check GitHub Actions logs
   # Go to: GitHub → Actions → Failed workflow → View logs
   
   # Common fixes:
   # 1. Check VPS_SSH_KEY secret
   # 2. Verify VPS_HOST is correct
   # 3. Ensure VPS is running
   # 4. Check firewall settings
   ```

2. **Service won't start**
   ```bash
   # Check logs
   journalctl -u ggnetworks-backend -n 50
   
   # Check Java version
   java -version
   
   # Check port availability
   netstat -tlnp | grep 8080
   
   # Check file permissions
   ls -la /opt/ggnetworks/
   ```

3. **Database connection issues**
   ```bash
   # Check MySQL status
   systemctl status mysql
   
   # Test connection
   mysql -u ggnetworks -psecure_password ggnetworks -e "SELECT 1;"
   
   # Check MySQL logs
   tail -f /var/log/mysql/error.log
   ```

4. **API endpoints not responding**
   ```bash
   # Check if service is running
   systemctl status ggnetworks-backend
   
   # Test health endpoint
   curl http://localhost:8080/actuator/health
   
   # Check firewall
   ufw status
   ```

## 🔄 Continuous Deployment

### Making Code Changes:
1. **Make changes locally**
2. **Commit and push to main branch:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **GitHub Actions will automatically deploy**
4. **Monitor deployment in GitHub Actions**

### Rollback Deployment:
1. **Go to GitHub Actions**
2. **Find the last successful deployment**
3. **Click "Re-run jobs"**
4. **Or manually deploy a specific commit**

## 📈 Production Optimization

### Performance Tuning:
```bash
# Increase JVM heap size
# Edit: /opt/ggnetworks/config/application-production.yml
# Add: JAVA_OPTS="-Xms512m -Xmx2048m"

# Optimize MySQL
# Edit: /etc/mysql/mysql.conf.d/mysqld.cnf
# Add: innodb_buffer_pool_size = 1G
```

### Security Hardening:
```bash
# Change default passwords
# Update MySQL root password
# Update admin user password
# Configure SSL certificates
# Setup fail2ban
# Configure log rotation
```

## 🎯 Success Criteria

After successful deployment, you should have:
- ✅ Backend service running on port 8080
- ✅ MySQL database with all tables
- ✅ Admin user: `admin` / `admin123`
- ✅ Sample packages available
- ✅ All API endpoints responding
- ✅ Health checks passing
- ✅ Automated deployment working

## 📞 Support

- **GitHub Issues**: Create issues for bugs or feature requests
- **Documentation**: Check `DEPLOYMENT_GUIDE.md` for detailed instructions
- **Logs**: Check application logs for debugging information
- **GitHub Actions**: Monitor deployment status and logs

---

**🚀 Your backend is now ready for production with automated deployment!**
