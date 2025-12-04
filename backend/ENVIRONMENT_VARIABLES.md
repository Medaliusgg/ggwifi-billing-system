# Environment Variables Documentation

This document describes all environment variables used by the GG-WIFI backend application.

## Quick Start

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in `.env`

3. For production, use environment variables or a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)

## Environment Variables by Category

### Database Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_USERNAME` | MySQL database username | `ggnetworks` | Yes |
| `DB_PASSWORD` | MySQL database password | - | Yes |
| `DB_HOST` | MySQL database host | `localhost` | Yes |
| `DB_PORT` | MySQL database port | `3306` | No |
| `DB_NAME` | MySQL database name | `ggnetworks_radius` | Yes |

### Server Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SERVER_PORT` | Application server port | `8080` | No |
| `SERVER_CONTEXT_PATH` | Application context path | `/api/v1` | No |

### JWT Security

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT token signing (min 64 chars) | - | **Yes** |
| `JWT_EXPIRATION` | JWT token expiration in milliseconds | `86400000` (24h) | No |
| `JWT_REFRESH_EXPIRATION` | Refresh token expiration in milliseconds | `604800000` (7d) | No |

**⚠️ Security Note:** Generate a strong JWT secret for production:
```bash
openssl rand -base64 64
```

### Encryption

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ENCRYPTION_SECRET_KEY` | Secret key for router password encryption (min 32 chars) | - | **Yes** |

### Redis Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REDIS_HOST` | Redis server host | `localhost` | Yes |
| `REDIS_PORT` | Redis server port | `6379` | No |
| `REDIS_PASSWORD` | Redis password (if set) | - | No |
| `REDIS_DATABASE` | Redis database number | `0` | No |

### ZenoPay Payment Gateway

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ZENOPAY_BASE_URL` | ZenoPay API base URL | `https://zenoapi.com` | Yes |
| `ZENOPAY_API_KEY` | ZenoPay API key | - | **Yes** |
| `ZENOPAY_MOBILE_MONEY_ENDPOINT` | Mobile money endpoint | `/api/payments/mobile_money_tanzania` | No |
| `ZENOPAY_ORDER_STATUS_ENDPOINT` | Order status endpoint | `/api/payments/order-status` | No |
| `ZENOPAY_PAYMENT_TIMEOUT` | Payment timeout in milliseconds | `300000` (5min) | No |
| `ZENOPAY_CURRENCY` | Payment currency | `TZS` | No |
| `ZENOPAY_LANGUAGE` | Payment language | `en` | No |
| `ZENOPAY_COUNTRY` | Payment country | `TZ` | No |

### SMS Service (NEXT SMS API)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SMS_API_BASE_URL` | SMS API base URL | `https://messaging-service.co.tz` | Yes |
| `SMS_API_USERNAME` | SMS API username | - | **Yes** |
| `SMS_API_PASSWORD` | SMS API password | - | **Yes** |
| `SMS_SENDER_ID` | SMS sender ID | `GGWi-Fi` | No |
| `SMS_TIMEOUT` | SMS request timeout in milliseconds | `30000` | No |

### Email Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MAIL_HOST` | SMTP server host | `smtp.gmail.com` | Yes |
| `MAIL_PORT` | SMTP server port | `587` | No |
| `MAIL_USERNAME` | SMTP username | - | **Yes** |
| `MAIL_PASSWORD` | SMTP password/app password | - | **Yes** |
| `MAIL_FROM` | Default sender email | `noreply@ggwifi.co.tz` | No |

### FreeRADIUS Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `RADIUS_HOST` | FreeRADIUS server host | `localhost` | Yes |
| `RADIUS_PORT` | FreeRADIUS authentication port | `1812` | No |
| `RADIUS_SECRET` | FreeRADIUS shared secret | `testing123` | **Yes** |
| `RADIUS_ACCOUNTING_PORT` | FreeRADIUS accounting port | `1813` | No |
| `RADIUS_TIMEOUT` | RADIUS request timeout in milliseconds | `5000` | No |
| `RADIUS_RETRIES` | RADIUS request retry count | `3` | No |
| `RADIUS_NAS_IDENTIFIER` | NAS identifier | `GGNetworks-Hotspot` | No |

### MikroTik Router Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MIKROTIK_MAIN_IP` | Main router IP address | `192.168.1.1` | Yes |
| `MIKROTIK_BRANCH_IP` | Branch router IP address | `192.168.2.1` | No |
| `MIKROTIK_USERNAME` | Router username | `admin` | Yes |
| `MIKROTIK_PASSWORD` | Router password | - | **Yes** |
| `MIKROTIK_PORT` | Router API port | `8728` | No |
| `MIKROTIK_API_TIMEOUT` | API timeout in milliseconds | `10000` | No |
| `MIKROTIK_API_RETRIES` | API retry count | `3` | No |
| `MIKROTIK_SESSION_TIMEOUT` | Session timeout in seconds | `300` | No |
| `MIKROTIK_USE_WIREGUARD` | Use WireGuard for API | `true` | No |
| `MIKROTIK_WIREGUARD_ENABLED` | Enable WireGuard | `true` | No |

### OTP Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OTP_EXPIRATION` | OTP expiration in seconds | `300` (5min) | No |
| `OTP_MAX_RETRIES` | Maximum OTP retry attempts | `3` | No |
| `OTP_LENGTH` | OTP code length | `6` | No |

### Rate Limiting

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `RATE_LIMIT_LOGIN_REQUESTS` | Login requests per window | `5` | No |
| `RATE_LIMIT_LOGIN_WINDOW` | Login window in seconds | `300` (5min) | No |
| `RATE_LIMIT_OTP_REQUESTS` | OTP requests per window | `3` | No |
| `RATE_LIMIT_OTP_WINDOW` | OTP window in seconds | `300` (5min) | No |
| `RATE_LIMIT_GENERAL_REQUESTS` | General requests per window | `100` | No |
| `RATE_LIMIT_GENERAL_WINDOW` | General window in seconds | `60` (1min) | No |

### Session Management

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SESSION_TIMEOUT` | Session timeout in seconds | `3600` (1h) | No |
| `SESSION_CLEANUP_INTERVAL` | Cleanup interval in seconds | `300` (5min) | No |
| `SESSION_MAX_CONCURRENT` | Maximum concurrent sessions | `3` | No |

### Voucher Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VOUCHER_CODE_LENGTH` | Voucher code length | `8` | No |
| `VOUCHER_PREFIX` | Voucher code prefix | `G` | No |
| `VOUCHER_DEFAULT_EXPIRATION` | Default expiration in days | `30` | No |
| `VOUCHER_CHECK_MAC` | Enable MAC address checking | `true` | No |
| `VOUCHER_ALLOW_MULTIPLE_DEVICES` | Allow multiple devices | `false` | No |

### Logging Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `LOG_LEVEL` | Application log level | `INFO` | No |
| `SECURITY_LOG_LEVEL` | Security log level | `WARN` | No |
| `SQL_LOG_LEVEL` | SQL log level | `WARN` | No |
| `SQL_PARAM_LOG_LEVEL` | SQL parameter log level | `WARN` | No |

### Health Check

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `HEALTH_CHECK_INTERVAL` | Health check interval in seconds | `30` | No |
| `HEALTH_CHECK_TIMEOUT` | Health check timeout in seconds | `5` | No |

### Feature Toggles

All feature toggles default to `true`. Set to `false` to disable:

- `BACKEND_ENABLED` - Enable/disable entire backend
- `BACKEND_DATABASE_ENABLED` - Database features
- `BACKEND_RADIUS_ENABLED` - FreeRADIUS integration
- `BACKEND_MIKROTIK_ENABLED` - MikroTik integration
- `BACKEND_PAYMENT_ENABLED` - Payment processing
- `BACKEND_SMS_ENABLED` - SMS notifications
- `BACKEND_EMAIL_ENABLED` - Email notifications
- `BACKEND_VOUCHER_ENABLED` - Voucher system
- `BACKEND_LOYALTY_ENABLED` - Loyalty program
- `BACKEND_MARKETING_ENABLED` - Marketing campaigns
- `BACKEND_ANALYTICS_ENABLED` - Analytics and reporting
- `BACKEND_USE_MOCK_DATA` - Use mock data (set to `false` in production)
- `BACKEND_USE_LOCAL_STORAGE` - Use local storage
- `BACKEND_USE_FILE_CONFIG` - Use file-based configuration

## Production Deployment

### Using Environment Variables

**Linux/Unix:**
```bash
export JWT_SECRET="your-secret-key"
export DB_PASSWORD="your-db-password"
# ... other variables
java -jar ggnetworks-backend-1.0.0.jar
```

**Systemd Service:**
Create `/etc/systemd/system/ggnetworks-backend.service`:
```ini
[Service]
Environment="JWT_SECRET=your-secret-key"
Environment="DB_PASSWORD=your-db-password"
# ... other variables
```

### Using .env File

1. Create `.env` file in the application directory
2. Add all required variables
3. Use a library like `dotenv` to load (if needed)

### Using Secrets Manager

For production, use a secrets manager:
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- Google Secret Manager

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong secrets** (minimum 64 characters for JWT)
3. **Rotate secrets regularly** (especially JWT_SECRET)
4. **Use different secrets** for development and production
5. **Restrict access** to environment variables
6. **Use secrets manager** in production
7. **Encrypt sensitive data** at rest

## Validation

Before deployment, verify all required variables are set:

```bash
# Check required variables
env | grep -E "JWT_SECRET|DB_PASSWORD|ZENOPAY_API_KEY|SMS_API_USERNAME"
```

## Troubleshooting

### Missing Environment Variable

If a required variable is missing, the application will:
- Use default values (if available)
- Fail to start (if required and no default)
- Log warnings about missing configuration

### Invalid Configuration

Check application logs for configuration errors:
```bash
tail -f logs/ggnetworks-backend.log | grep -i "configuration\|error"
```

## Support

For issues with environment variables, check:
1. Application logs
2. Configuration files (`application.yml`)
3. Environment variable documentation

