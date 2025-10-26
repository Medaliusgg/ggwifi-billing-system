# 🚀 GG-WIFI Backend System

A comprehensive Spring Boot backend system for GG-WIFI billing and hotspot management with automated deployment to VPS.

## 📋 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, SUPER_ADMIN, TECHNICIAN, FINANCE, MARKETING)
- User management with permissions
- Password encryption and security

### 💰 Payment Processing
- ZenoPay payment gateway integration
- SMS notifications via NEXT SMS API
- Webhook processing for payment confirmations
- Transaction tracking and management

### 📦 Package Management
- Internet package CRUD operations
- Time-based offer packages
- Package categorization and targeting
- Dynamic package filtering

### 🌐 Router Management
- MikroTik router integration
- Multi-router support
- Router monitoring and statistics
- WireGuard VPN configuration

### 🔐 FreeRADIUS Integration
- Centralized authentication
- User session management
- Accounting and billing
- NAS (Network Access Server) management

### 🎫 Voucher System
- 8-digit voucher generation
- Voucher validation and redemption
- Package-based vouchers
- Voucher statistics and tracking

### 👥 Customer Management
- Customer CRUD operations
- Customer statistics
- Contact management
- Device assignment

### 📊 Analytics & Reporting
- Dashboard statistics
- Transaction reports
- Payment analytics
- User activity tracking

## 🛠️ Technology Stack

- **Backend**: Spring Boot 3.3.6, Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security, JWT
- **Build Tool**: Maven
- **Migration**: Flyway
- **Deployment**: GitHub Actions, VPS

## 🚀 Quick Start

### Prerequisites
- Java 17+
- MySQL 8.0+
- Maven 3.6+
- VPS with Ubuntu 20.04+

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Medaliusgg/ggwifi-billing-system.git
   cd ggwifi-billing-system/backend
   ```

2. **Setup database**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE ggnetworks;
   CREATE USER 'ggnetworks'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON ggnetworks.* TO 'ggnetworks'@'localhost';
   ```

3. **Build and run**
   ```bash
   mvn clean install -DskipTests
   java -jar target/ggnetworks-backend-1.0.0.jar
   ```

4. **Test the API**
   ```bash
   # Health check
   curl http://localhost:8080/actuator/health
   
   # Admin login
   curl -X POST http://localhost:8080/api/auth/admin-login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","phoneNumber":"0676591880","password":"admin123"}'
   ```

## 🚀 Automated Deployment

### GitHub Actions Setup

1. **Configure GitHub Secrets**
   Go to your repository → Settings → Secrets and variables → Actions, add:
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

2. **Deploy automatically**
   - Push to `main` branch → Automatic deployment
   - Or manually trigger: Actions → Deploy Backend to VPS → Run workflow

### Manual Deployment

1. **Update VPS IP in deployment script**
   ```bash
   nano deploy-to-vps.sh
   # Change: VPS_IP="your-vps-ip-address"
   ```

2. **Deploy backend**
   ```bash
   ./deploy-to-vps.sh
   ```

3. **Setup database**
   ```bash
   scp setup-database-vps.sh root@your-vps-ip:/root/
   ssh root@your-vps-ip "chmod +x setup-database-vps.sh && ./setup-database-vps.sh"
   ```

4. **Test all APIs**
   ```bash
   # Update BASE_URL in test script
   nano test-all-apis.sh
   # Change: BASE_URL="http://your-vps-ip:8080"
   
   # Run comprehensive tests
   ./test-all-apis.sh
   ```

## 🧪 API Testing

### Comprehensive Testing Script
```bash
./test-all-apis.sh
```

### Manual Testing
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

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/staff-login` - Staff login
- `POST /api/auth/logout` - Logout

### User Management
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

### Package Management
- `GET /api/packages` - Get all packages
- `POST /api/packages` - Create package
- `PUT /api/packages/{id}` - Update package
- `DELETE /api/packages/{id}` - Delete package
- `GET /api/packages/active` - Get active packages

### Customer Portal
- `GET /api/customer-portal/packages` - Get customer packages
- `POST /api/customer-portal/payment/initiate` - Initiate payment
- `POST /api/customer-portal/webhook` - ZenoPay webhook

### Router Management
- `GET /api/admin/routers` - Get all routers
- `POST /api/admin/routers` - Add router
- `PUT /api/admin/routers/{id}` - Update router
- `DELETE /api/admin/routers/{id}` - Delete router

### FreeRADIUS Integration
- `GET /api/freeradius/health` - Health check
- `POST /api/freeradius/users` - Add RADIUS user
- `DELETE /api/freeradius/users/{username}` - Remove RADIUS user
- `GET /api/freeradius/sessions` - Get active sessions

## 🔧 Configuration

### Environment Variables
```yaml
# Database
DB_USERNAME=ggnetworks
DB_PASSWORD=secure_password

# ZenoPay
ZENOPAY_API_KEY=your-api-key
ZENOPAY_WEBHOOK_URL=http://your-vps-ip:8080/api/customer-portal/webhook

# SMS Service
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=GGNETWORKS

# JWT
JWT_SECRET=your-super-secret-jwt-key

# FreeRADIUS
FREERADIUS_HOST=localhost
FREERADIUS_PORT=1812
FREERADIUS_SECRET=testing123

# MikroTik
MIKROTIK_HOST=192.168.1.1
MIKROTIK_PORT=8728
MIKROTIK_USERNAME=admin
MIKROTIK_PASSWORD=admin
```

## 📊 Monitoring

### Service Status
```bash
# Check service status
systemctl status ggnetworks-backend

# View logs
journalctl -u ggnetworks-backend -f

# Application logs
tail -f /opt/ggnetworks/logs/ggnetworks-backend.log
```

### Health Checks
- Health endpoint: `http://your-vps-ip:8080/actuator/health`
- Database connectivity
- Third-party service integration
- API endpoint availability

## 🚨 Troubleshooting

### Common Issues

1. **Service won't start**
   ```bash
   # Check logs
   journalctl -u ggnetworks-backend -n 50
   
   # Check Java version
   java -version
   
   # Check port availability
   netstat -tlnp | grep 8080
   ```

2. **Database connection issues**
   ```bash
   # Check MySQL status
   systemctl status mysql
   
   # Test connection
   mysql -u ggnetworks -psecure_password ggnetworks -e "SELECT 1;"
   ```

3. **API endpoints not responding**
   ```bash
   # Check if service is running
   systemctl status ggnetworks-backend
   
   # Test health endpoint
   curl http://localhost:8080/actuator/health
   ```

## 📞 Support

- **Documentation**: See `DEPLOYMENT_GUIDE.md` for detailed instructions
- **Issues**: Create GitHub issues for bugs or feature requests
- **Logs**: Check application logs for debugging information

## 🎯 Next Steps

1. **Deploy Frontend Applications**
   - Admin Portal (React + MUI)
   - Customer Portal (React + MUI)

2. **Setup Reverse Proxy**
   - Nginx configuration
   - SSL certificates
   - Domain configuration

3. **Production Monitoring**
   - Log monitoring
   - Performance monitoring
   - Health checks and alerts

---

**🚀 Ready for production deployment!**