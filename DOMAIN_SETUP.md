# 🌐 GGWIFI Domain Architecture

## 📋 **Complete Domain Structure**

### **Required Domains for Full System:**

| Subdomain | Purpose | Status | Hosting | SSL |
|-----------|---------|--------|---------|-----|
| `admin.ggwifi.co.tz` | Admin Portal | ✅ Created | Cloudflare Pages | ✅ Auto |
| `portal.ggwifi.co.tz` | Customer Portal | ✅ Created | Cloudflare Pages | ✅ Auto |
| `www.ggwifi.co.tz` | Main Website | ✅ Created | Cloudflare Pages | ✅ Auto |
| `api.ggwifi.co.tz` | Backend API | ❌ **MISSING** | VPS/Cloud | ❌ Need to add |

## 🔧 **How Frontends Communicate with Backend**

### **Communication Flow:**
```
┌─────────────────────┐    ┌─────────────────────┐
│ admin.ggwifi.co.tz  │───▶│ api.ggwifi.co.tz    │
│ (Cloudflare Pages)  │    │ (Your VPS Backend)  │
└─────────────────────┘    └─────────────────────┘
           │                           │
           │                           │
┌─────────────────────┐               │
│ portal.ggwifi.co.tz │───────────────┤
│ (Cloudflare Pages)  │               │
└─────────────────────┘               │
           │                           │
           │                           │
┌─────────────────────┐               │
│ www.ggwifi.co.tz    │───────────────┘
│ (Cloudflare Pages)  │
└─────────────────────┘
```

### **API Endpoints Used by Frontends:**
- `POST /api/v1/auth/login` - Authentication
- `GET /api/v1/dashboard` - Dashboard data
- `GET /api/v1/users` - User management
- `GET /api/v1/routers` - Router management
- `GET /api/v1/packages` - Package management
- And many more...

## 🚀 **Step-by-Step API Subdomain Setup**

### **1. Add DNS Record in Cloudflare:**
```
Type: A
Name: api
IPv4 address: YOUR_VPS_IP
TTL: Auto
Proxy: ✅ Proxied (Orange cloud)
```

### **2. Configure VPS for API Subdomain:**
```bash
# On your VPS, configure Nginx
server {
    listen 80;
    server_name api.ggwifi.co.tz;
    
    location / {
        proxy_pass http://localhost:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers for all frontends
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

### **3. Update Frontend Environment Variables:**
In Cloudflare Pages, update all frontend projects:

**Admin Portal:**
```
VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
```

**Customer Portal:**
```
VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
```

**Main Website:**
```
VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
```

## 🔍 **Why API Subdomain is Critical**

### **Current Problem:**
- ✅ Frontends are live and accessible
- ❌ Backend API is not accessible from internet
- ❌ Frontends can't authenticate or load data
- ❌ Login fails because no backend connection

### **After Adding API Subdomain:**
- ✅ All frontends can connect to backend
- ✅ Authentication works
- ✅ Dashboard loads data
- ✅ Complete system functionality

## 🎯 **Complete System Architecture**

```
Internet Users
      │
      ▼
┌─────────────────────────────────────────┐
│           Cloudflare CDN               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  Admin  │ │Customer │ │  Main   │   │
│  │ Portal  │ │ Portal  │ │Website  │   │
│  └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────┘
      │           │           │
      └───────────┼───────────┘
                  │
                  ▼
    ┌─────────────────────────┐
    │   api.ggwifi.co.tz     │
    │   (Your VPS Backend)   │
    │  ┌─────────────────┐   │
    │  │   Spring Boot   │   │
    │  │   MySQL DB      │   │
    │  │   FreeRADIUS    │   │
    │  └─────────────────┘   │
    └─────────────────────────┘
```

## ✅ **Next Steps After Adding API Subdomain:**

1. ✅ **Add DNS record** for `api.ggwifi.co.tz`
2. ✅ **Deploy backend** to VPS
3. ✅ **Configure Nginx** for API subdomain
4. ✅ **Update frontend** environment variables
5. ✅ **Test login** from all frontends
6. ✅ **Verify complete** system functionality

## 🚨 **Important Notes:**

- **SSL Certificate**: Cloudflare will automatically provide SSL for `api.ggwifi.co.tz`
- **CORS Configuration**: Backend must allow requests from all frontend domains
- **Firewall**: Ensure VPS allows traffic on ports 80, 443, and 8082
- **Database**: MySQL and FreeRADIUS must be properly configured

## 📞 **Support:**
- **Email**: medaliusggg@gmail.com
- **Documentation**: See DEPLOYMENT_GUIDE.md
- **Issues**: Create GitHub issues for bugs
