# 🚀 GGWIFI Multi-Domain Deployment Guide

## 📋 **Current Status**
✅ **Git Repository**: Initialized and committed  
✅ **Frontend Applications**: Ready for deployment  
✅ **Backend**: Working with MySQL database  
✅ **Multi-Domain Setup**: Configured for all domains  

## 🌐 **Your Domain Structure**

| Application | Domain | Status | Purpose |
|-------------|--------|--------|---------|
| **Admin Portal** | `admin.ggwifi.co.tz` | ✅ Ready | Internal admin management |
| **Customer Portal** | `portal.ggwifi.co.tz` | ✅ Ready | Customer self-service |
| **Main Website** | `www.ggwifi.co.tz` | ✅ Ready | Marketing & landing page |
| **Backend API** | `api.ggwifi.co.tz` | ✅ Ready | REST API services |

## 🚀 **Step-by-Step Deployment Process**

### **Phase 1: Create GitHub Repository**

1. **Go to GitHub**: https://github.com/new
2. **Repository Name**: `ggwifi-system` (or your preferred name)
3. **Description**: "Professional WiFi Hotspot Management System"
4. **Visibility**: Public (recommended for Cloudflare Pages)
5. **DO NOT** initialize with README (we already have files)

### **Phase 2: Push to GitHub**

```bash
# In your project directory
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"

# Add GitHub remote (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/ggwifi-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **Phase 3: Set up Cloudflare Pages**

#### **3.1 Admin Portal Deployment**
1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Create a Project**
2. **Connect to Git** → Select your `ggwifi-system` repository
3. **Configure Build Settings**:
   - **Project Name**: `ggwifi-admin-portal`
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend/admin_portal`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
4. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
   VITE_APP_NAME=GGWIFI Admin Portal
   VITE_APP_DOMAIN=admin.ggwifi.co.tz
   VITE_ENVIRONMENT=production
   ```
5. **Deploy** → Get URL: `https://ggwifi-admin-portal.pages.dev`

#### **3.2 Customer Portal Deployment**
1. Create another **Cloudflare Pages** project
2. **Configure Build Settings**:
   - **Project Name**: `ggwifi-customer-portal`
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend/customer_portal`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
3. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
   VITE_APP_NAME=GGWIFI Customer Portal
   VITE_APP_DOMAIN=portal.ggwifi.co.tz
   VITE_ENVIRONMENT=production
   ```

#### **3.3 Main Website Deployment**
1. Create another **Cloudflare Pages** project
2. **Configure Build Settings**:
   - **Project Name**: `ggwifi-main-website`
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend/main_website`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
3. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
   VITE_APP_NAME=GGWIFI
   VITE_APP_DOMAIN=www.ggwifi.co.tz
   VITE_ENVIRONMENT=production
   ```

### **Phase 4: Configure Custom Domains**

#### **4.1 DNS Configuration**
In your **Cloudflare DNS** settings, add these records:

```
Type    Name                    Content                    TTL
A       @                      [Your server IP]            Auto
CNAME   www                    [Cloudflare Pages URL]      Auto
CNAME   admin                  [Admin Pages URL]           Auto
CNAME   portal                 [Customer Pages URL]        Auto
A       api                    [Your backend server IP]    Auto
```

#### **4.2 Custom Domain Setup**
For each Cloudflare Pages project:

1. **Admin Portal**:
   - Go to **Custom Domains** → **Set up a custom domain**
   - Enter: `admin.ggwifi.co.tz`
   - Cloudflare will automatically configure DNS

2. **Customer Portal**:
   - Custom Domain: `portal.ggwifi.co.tz`

3. **Main Website**:
   - Custom Domain: `www.ggwifi.co.tz`

### **Phase 5: Backend Deployment**

#### **5.1 Deploy Backend to Cloud Provider**
**Recommended**: DigitalOcean Droplet or AWS EC2

```bash
# On your server
sudo apt update
sudo apt install openjdk-17-jdk mysql-server nginx

# Clone your repository
git clone https://github.com/YOUR_USERNAME/ggwifi-system.git
cd ggwifi-system/backend

# Install MySQL and configure database
sudo mysql_secure_installation
mysql -u root -p
CREATE DATABASE ggwifi;
USE ggwifi;
source src/main/resources/db/migration/V1__Create_initial_schema.sql;

# Run the backend
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
java -cp ".:$(find ~/.m2/repository -name "*.jar" | tr '\n' ':')" StandaloneServer
```

#### **5.2 Configure Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name api.ggwifi.co.tz;
    
    location / {
        proxy_pass http://localhost:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **Phase 6: SSL Certificates**
Cloudflare automatically provides SSL certificates for all domains.

## 🔧 **Environment Configuration**

### **Production Environment Variables**
Each frontend application needs these environment variables in Cloudflare Pages:

```env
VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
VITE_ENVIRONMENT=production
VITE_APP_VERSION=1.0.0
```

### **Backend Configuration**
Update `backend/src/main/resources/application.yml`:

```yaml
server:
  port: 8082
  
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ggwifi
    username: your_db_username
    password: your_db_password
```

## 🚀 **Deployment Commands**

### **Local Development**
```bash
# Frontend (Admin Portal)
cd Frontend/admin_portal
npm install
npm run dev

# Backend
cd backend
java -cp ".:$(find ~/.m2/repository -name "*.jar" | tr '\n' ':')" StandaloneServer
```

### **Production Deployment**
```bash
# Build and deploy all applications
./scripts/deploy.sh build-all production

# Deploy specific application
./scripts/deploy.sh deploy admin_portal production
```

## 🔄 **Continuous Deployment**

### **Automatic Deployments**
Once set up, every push to `main` branch will automatically:
1. ✅ Build the affected frontend applications
2. ✅ Deploy to Cloudflare Pages
3. ✅ Update the live websites

### **Manual Deployment**
```bash
# Make changes locally
git add .
git commit -m "Update admin portal features"
git push origin main

# Cloudflare Pages automatically builds and deploys
```

## 📊 **Monitoring & Analytics**

### **Cloudflare Analytics**
- Page views per domain
- Performance metrics
- Security events
- Bandwidth usage

### **Application Health**
- Backend health: `https://api.ggwifi.co.tz/api/v1/health`
- Frontend status: Check Cloudflare Pages dashboard

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Build Failures**:
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check environment variables

2. **Domain Not Working**:
   - Verify DNS propagation (can take up to 24 hours)
   - Check Cloudflare DNS settings
   - Ensure SSL certificate is active

3. **API Connection Issues**:
   - Verify backend is running
   - Check CORS configuration
   - Verify API URL in environment variables

### **Support Commands**
```bash
# Check deployment status
./scripts/deploy.sh status

# Test local build
./scripts/deploy.sh build admin_portal production

# Check Git status
git status
git log --oneline
```

## 🎯 **Next Steps After Deployment**

1. ✅ **Test all domains**:
   - https://admin.ggwifi.co.tz
   - https://portal.ggwifi.co.tz
   - https://www.ggwifi.co.tz
   - https://api.ggwifi.co.tz

2. ✅ **Configure monitoring** and alerts

3. ✅ **Set up automated backups** for database

4. ✅ **Configure security** (WAF, rate limiting)

5. ✅ **Performance optimization** (CDN, caching)

## 📞 **Support**

- **Email**: medaliusggg@gmail.com
- **Documentation**: See README.md files in each directory
- **Issues**: Create GitHub issues for bugs or feature requests

---

**🎉 Your GGWIFI system is ready for professional deployment!**

**Estimated Deployment Time**: 2-3 hours for complete setup
**Cost**: ~$10-20/month for hosting + domain
**Performance**: Global CDN with automatic scaling
