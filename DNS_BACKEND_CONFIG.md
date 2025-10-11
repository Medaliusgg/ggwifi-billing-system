# DNS and Backend Configuration Guide

## 🌐 DNS Configuration (CNAME Record)

Your backend is configured to use a CNAME DNS record pointing to your VPS. Here's the setup:

### Current DNS Configuration:
```
# Frontend (Admin Portal)
Type: CNAME
Name: admin
Value: [Cloudflare Pages URL or your hosting provider]
TTL: Auto

# Backend API
Type: A
Name: api
Value: [Your VPS IP Address]
TTL: Auto
```

### Frontend API Configuration:
```javascript
// Frontend API Client
const baseURL = 'http://api.ggwifi.co.tz:8080/api/v1';
```

## 🔧 Backend Configuration

### Spring Boot Application
- **Port**: 8080
- **Context Path**: `/api/v1`
- **Full URL**: `http://api.ggwifi.co.tz:8080/api/v1`

### CORS Configuration
The backend is configured with CORS enabled for all origins:
```yaml
cors:
  allowed-origins:
    - "*"
  allowed-methods:
    - GET
    - POST
    - PUT
    - DELETE
    - OPTIONS
  allowed-headers:
    - "*"
  allow-credentials: true
  max-age: 3600
```

## 🧪 Testing the Connection

### 1. Test DNS Resolution
```bash
# Test if the CNAME resolves correctly
nslookup api.ggwifi.co.tz

# Expected result: Should resolve to your VPS IP
```

### 2. Test Backend Endpoints
```bash
# Test health endpoint
curl http://api.ggwifi.co.tz:8080/api/v1/health

# Test login endpoint
curl -X POST http://api.ggwifi.co.tz:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 3. Test from Frontend
Navigate to the BackendTest component in your admin portal to test all endpoints.

## 🔒 SSL/HTTPS Configuration (Optional)

For production, consider adding SSL certificates:

### Option 1: Cloudflare SSL
- Enable Cloudflare proxy for the CNAME record
- Use HTTPS: `https://api.ggwifi.co.tz/api/v1`

### Option 2: Let's Encrypt on VPS
```bash
# Install certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d api.ggwifi.co.tz

# Update Spring Boot for HTTPS
```

## 🚀 Production Deployment

### Environment Variables
Create `.env.production` file:
```env
VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
```

### Build for Production
```bash
cd Frontend/admin_portal
npm run build
```

## 📱 Frontend Integration

### API Client Usage
```javascript
import apiClient from '@/api/client';

// Login example
const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

// Get packages example
const getPackages = async () => {
  const response = await apiClient.get('/packages');
  return response.data;
};
```

### Error Handling
The API client includes automatic error handling and token refresh functionality.

## 🔍 Troubleshooting

### Common Issues:

1. **DNS Not Resolving**
   - Check CNAME record configuration
   - Wait for DNS propagation (up to 24 hours)
   - Test with `nslookup` command

2. **Connection Refused**
   - Verify Spring Boot is running on port 8080
   - Check VPS firewall settings
   - Ensure VPS is accessible from internet

3. **CORS Errors**
   - Backend CORS is configured for all origins
   - Check browser console for specific errors

4. **Authentication Issues**
   - Verify login credentials (admin/admin123)
   - Check JWT token handling

## 📊 Monitoring

### Backend Health Check
```bash
curl http://api.ggwifi.co.tz:8080/api/v1/health
```

### Log Monitoring
Check Spring Boot logs on VPS:
```bash
# On VPS
tail -f /opt/ggwifi-billing-system/backend/logs/application.log
```

## 🎯 Next Steps

1. ✅ DNS CNAME configured
2. ✅ Frontend pointing to correct domain
3. ✅ Backend running with CORS enabled
4. 🔄 Test frontend-backend connection
5. 🔄 Implement SSL/HTTPS
6. 🔄 Production deployment
