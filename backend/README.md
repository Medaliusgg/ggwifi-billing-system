# GGNetworks Backend System

## Overview

This is a comprehensive Spring Boot backend system for GGNetworks, a WISP (Wireless Internet Service Provider) platform. The system manages three distinct subdomains:

1. **Admin Portal** (`admin.ggnetworks.com`) - Full administrative control
2. **Public Portal** (`ggnetworks.com`) - Main website and PPPoE applications
3. **Hotspot Portal** (`connect.ggnetworks.com`) - Voucher-based hotspot access

## Architecture

### Core Components

- **Spring Boot 3.2.0** with Java 17
- **MySQL Database** with Flyway migrations
- **JWT Authentication** with role-based access control
- **FreeRADIUS Integration** for AAA (Authentication, Authorization, Accounting)
- **MikroTik Router Management** for hotspot and PPPoE delivery
- **SELCOM Payment Gateway** integration
- **Redis** for caching and session management

### Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (ADMIN, HOTSPOT_USER, PPPOE_USER)
- OTP verification for phone numbers
- Rate limiting and CORS configuration
- Secure password hashing with BCrypt

## Database Schema

### Core Entities

1. **User** - Central user management with phone number as primary identifier
2. **Package** - Internet packages for both Hotspot and PPPoE
3. **HotspotVoucher** - Voucher-based access management
4. **HotspotSession** - Real-time session tracking
5. **InternetApplicationForm** - PPPoE application workflow
6. **Payment** - Payment processing and tracking
7. **Router** - MikroTik router management
8. **Location** - Geographic coverage management
9. **Finance** - Financial tracking and reporting
10. **AuditLog** - Comprehensive audit trail

### Key Relationships

- Users are tied to phone numbers only
- Vouchers are linked to packages and sessions
- Applications flow through approval workflow
- All transactions are traceable through audit logs

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /login` - Admin login with JWT
- `POST /otp/generate` - Generate OTP for verification
- `POST /otp/validate` - Validate OTP codes
- `POST /register` - User registration with OTP
- `POST /refresh` - Refresh JWT tokens

### Admin Portal (`/api/v1/admin`)
- User management (CRUD operations)
- Package management
- Voucher generation (bulk/manual)
- Payment processing and refunds
- Router monitoring and management
- Financial reporting and analytics
- Session management and force logout
- Application form approval workflow

### Public Portal (`/api/v1/public`)
- Company information and services
- Package listings (Hotspot & PPPoE)
- Application form submission
- Contact and feedback forms
- Blog posts and promotions
- OTP generation for registration

### Hotspot Portal (`/api/v1/hotspot`)
- Voucher validation and connection
- Session management
- Payment integration for voucher purchase
- Real-time statistics and monitoring

### Customer Portal (`/api/v1/customer`)
- User profile management
- Application status tracking
- Payment history
- Service management

## Key Features Implemented

### ✅ Complete JWT Authentication System
- Custom UserDetailsService implementation
- JWT token generation and validation
- Role-based authorization
- Refresh token mechanism

### ✅ OTP Service
- Phone number verification
- Rate limiting and retry logic
- Multiple OTP types (REGISTRATION, LOGIN, PASSWORD_RESET)
- Automatic cleanup of expired OTPs

### ✅ FreeRADIUS Integration
- Real-time user authentication
- Session accounting and tracking
- Bandwidth limit enforcement
- Multi-device detection and control

### ✅ MikroTik Router Management
- Router status monitoring
- User session management
- Configuration management
- Health checks and alerts

### ✅ Payment Processing
- SELCOM payment gateway integration
- Payment callback handling
- Refund processing
- Transaction tracking

### ✅ Voucher Management
- Bulk voucher generation
- MAC address binding
- Expiration handling
- Usage tracking and statistics

### ✅ Application Workflow
- PPPoE application forms
- Admin approval process
- Technician scheduling
- Installation cost estimation

### ✅ Financial Management
- Revenue tracking
- Expense management
- Commission calculations
- Profit/loss reporting

### ✅ Security Features
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## Configuration

### Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ggnetworks
DB_USERNAME=root
DB_PASSWORD=kolombo@12

# JWT
JWT_SECRET=ggnetworks-super-secret-key-for-jwt-token-generation-and-validation-2024
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# OTP
OTP_EXPIRATION=300
OTP_MAX_RETRIES=3
OTP_LENGTH=6

# RADIUS
RADIUS_HOST=localhost
RADIUS_PORT=1812
RADIUS_SECRET=testing123

# SELCOM Payment
SELCOM_BASE_URL=https://paypoint.selcommobile.com
SELCOM_MERCHANT_ID=your_merchant_id
SELCOM_MERCHANT_KEY=your_merchant_key
```

### Admin Credentials

- **Phone Number**: 0742844024
- **Username**: medaliusgg
- **Password**: #Kolombo@123%

## Running the Application

### Prerequisites
- Java 17+
- MySQL 8.0+
- Redis (optional)
- FreeRADIUS server

### Development Setup

1. **Clone and setup**:
```bash
git clone <repository>
cd backend
```

2. **Configure database**:
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE ggnetworks;
```

3. **Set environment variables**:
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Run the application**:
```bash
./mvnw spring-boot:run
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## API Documentation

Once the application is running, access the Swagger UI at:
- **Swagger UI**: http://localhost:8080/api/v1/swagger-ui.html
- **API Docs**: http://localhost:8080/api/v1/api-docs

## Testing

### Health Check
```bash
curl http://localhost:8080/api/v1/health
```

### Admin Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0742844024",
    "password": "#Kolombo@123%"
  }'
```

## Monitoring and Logging

- **Application Logs**: `logs/ggnetworks-backend.log`
- **Health Endpoints**: `/actuator/health`
- **Metrics**: Prometheus-compatible metrics
- **Audit Trail**: All actions logged in `audit_logs` table

## Security Considerations

1. **JWT Secret**: Use a strong, unique secret in production
2. **Database**: Secure MySQL with proper user permissions
3. **Network**: Use HTTPS in production
4. **Rate Limiting**: Configure appropriate limits for your traffic
5. **Monitoring**: Set up alerts for security events

## Production Deployment

### Recommended Setup
- **Load Balancer**: Nginx or HAProxy
- **SSL/TLS**: Let's Encrypt certificates
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack or similar
- **Backup**: Automated database backups
- **CDN**: Cloudflare for static assets

### Performance Optimization
- Enable Redis for session caching
- Configure connection pooling
- Use database indexes for frequent queries
- Implement API response caching
- Monitor and tune JVM settings

## Troubleshooting

### Common Issues

1. **Database Connection**: Check MySQL service and credentials
2. **JWT Issues**: Verify JWT secret configuration
3. **RADIUS Connection**: Ensure FreeRADIUS server is running
4. **Payment Gateway**: Verify SELCOM credentials and network access

### Logs
- Application logs: `logs/ggnetworks-backend.log`
- Database logs: Check MySQL error log
- RADIUS logs: Check FreeRADIUS logs

## Contributing

1. Follow the existing code structure
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Follow security best practices
5. Use meaningful commit messages

## License

This project is proprietary software for GGNetworks.

---

**GGNetworks Backend System** - Complete WISP Management Platform 
lets first complete the recommendation updates then followed by recommendation additions exclude multi-tenancy , focus on building the backend once ready and complete testing is  done . Then we will proceed with frontend development.lastly update the finance to make sure it has high advance feature of complete finance functionality eg budgeting, calculating profit by recording manual data of total income per month(revenue), all expenses,profit,government profit taxation percentage etc let the finance module do all finance activities