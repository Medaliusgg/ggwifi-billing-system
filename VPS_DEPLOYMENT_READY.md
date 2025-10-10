# 🚀 VPS Deployment - Ready to Deploy

## 📋 **What's Prepared for You**

### ✅ **Ready Scripts:**
- `backend/vps-deployment.sh` - Complete VPS setup (all components)
- `backend/budget-vps-setup.sh` - Optimized for $2.50/month VPS
- `backend/deploy-backend.sh` - Multiple deployment options

### ✅ **Ready Configuration:**
- MySQL database schema
- FreeRADIUS configuration
- Spring Boot service setup
- Nginx reverse proxy config
- Firewall configuration

### ✅ **Ready Documentation:**
- Complete deployment guide
- Domain setup instructions
- Troubleshooting guide

## 🎯 **When You Get Your VPS - 3-Step Deployment**

### **Step 1: Create VPS (5 minutes)**
1. **Go to**: https://vultr.com (recommended - $2.50/month)
2. **Deploy Server**:
   - **OS**: Ubuntu 22.04 LTS
   - **Size**: $2.50/month (512MB RAM, 1 CPU, 10GB SSD)
   - **Location**: Choose closest to Tanzania
3. **Note down**: Your VPS IP address

### **Step 2: Deploy Backend (10 minutes)**
```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Run the deployment script
wget https://raw.githubusercontent.com/Medaliusgg/ggwifi-billing-system/main/backend/budget-vps-setup.sh
chmod +x budget-vps-setup.sh
sudo ./budget-vps-setup.sh
```

### **Step 3: Add API Subdomain (2 minutes)**
1. **Go to**: Cloudflare Dashboard → DNS → Records
2. **Add Record**:
   ```
   Type: A
   Name: api
   IPv4 address: YOUR_VPS_IP
   TTL: Auto
   Proxy: ✅ Proxied (orange cloud)
   ```
3. **Save**

## 🔧 **What the Deployment Script Does**

### **Automatic Setup:**
- ✅ **Installs**: Java 17, MySQL, FreeRADIUS
- ✅ **Configures**: MySQL database with your schema
- ✅ **Sets up**: FreeRADIUS with MySQL backend
- ✅ **Deploys**: Spring Boot application
- ✅ **Configures**: Firewall (ports 22, 8082, 1812, 1813)
- ✅ **Creates**: Admin user (0773404760 / Ashruha@123%)
- ✅ **Starts**: All services automatically

### **After Deployment:**
- 🌐 **API**: `http://YOUR_VPS_IP:8082`
- 📡 **FreeRADIUS**: `YOUR_VPS_IP:1812` (UDP)
- 🗄️ **MySQL**: `localhost:3306`
- 🔐 **Admin**: Phone: 0773404760, Password: Ashruha@123%

## 💰 **Cost Breakdown**

| Component | Cost | Notes |
|-----------|------|-------|
| **VPS** | $2.50/month | Vultr 512MB RAM |
| **Domain** | $0 | Already owned |
| **SSL** | $0 | Cloudflare provides |
| **CDN** | $0 | Cloudflare provides |
| **Total** | **$2.50/month** | vs $32/month originally! |

## 🎯 **VPS Provider Recommendations**

### **1. Vultr (Recommended - $2.50/month)**
- ✅ **Price**: $2.50/month
- ✅ **Resources**: 512MB RAM, 1 CPU, 10GB SSD
- ✅ **Free Credit**: $100 for new users
- ✅ **Global**: Multiple data centers
- ✅ **Performance**: Excellent

### **2. Kamatera ($4/month)**
- ✅ **Price**: $4/month
- ✅ **Resources**: 1GB RAM, 1 CPU, 20GB SSD
- ✅ **Free Trial**: 30 days
- ✅ **Customizable**: Flexible configuration

### **3. Linode ($5/month)**
- ✅ **Price**: $5/month
- ✅ **Resources**: 1GB RAM, 1 CPU, 25GB SSD
- ✅ **Free Credit**: $100 for new users
- ✅ **Reliable**: Established provider

## 📱 **Testing After Deployment**

### **1. Test API Endpoints:**
```bash
# Test health endpoint
curl http://YOUR_VPS_IP:8082/api/v1/health

# Test dashboard
curl http://YOUR_VPS_IP:8082/api/v1/dashboard

# Test login
curl -X POST http://YOUR_VPS_IP:8082/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"0773404760","password":"Ashruha@123%"}'
```

### **2. Test Frontend Connection:**
1. **Add API subdomain** in Cloudflare
2. **Update environment variables** in Cloudflare Pages
3. **Test login** from `admin.ggwifi.co.tz`

## 🔍 **Troubleshooting Guide**

### **Common Issues:**

**1. Backend not starting:**
```bash
# Check service status
systemctl status ggwifi-backend

# Check logs
journalctl -u ggwifi-backend -f

# Restart service
systemctl restart ggwifi-backend
```

**2. MySQL connection issues:**
```bash
# Check MySQL status
systemctl status mysql

# Connect to database
mysql -u root -pkolombo@123%
```

**3. FreeRADIUS not working:**
```bash
# Check FreeRADIUS status
systemctl status freeradius

# Test RADIUS
radtest test testing123 localhost 0 testing123
```

## 🚀 **Performance Optimization**

### **For 512MB RAM VPS:**
- ✅ **MySQL**: Optimized memory settings
- ✅ **Java**: Limited heap size (256MB)
- ✅ **FreeRADIUS**: Minimal configuration
- ✅ **Swap**: Automatic swap file creation

### **Monitoring:**
```bash
# Check memory usage
free -h

# Check disk usage
df -h

# Check running services
systemctl list-units --type=service --state=running
```

## 📞 **Support Information**

### **When You Need Help:**
- **Email**: medaliusggg@gmail.com
- **GitHub**: https://github.com/Medaliusgg/ggwifi-billing-system
- **Documentation**: All guides are in the repository

### **Quick Commands Reference:**
```bash
# Check all services
systemctl status ggwifi-backend mysql freeradius nginx

# View logs
journalctl -u ggwifi-backend -f

# Restart all services
systemctl restart ggwifi-backend mysql freeradius nginx

# Check firewall
ufw status

# Check disk space
df -h

# Check memory
free -h
```

## 🎉 **You're Ready!**

Everything is prepared for your VPS deployment:

1. ✅ **Scripts ready** - Just run one command
2. ✅ **Documentation ready** - Step-by-step guides
3. ✅ **Configuration ready** - All files prepared
4. ✅ **Support ready** - Help available when needed

**Once you get your VPS, deployment will take less than 15 minutes!** 🚀

---

**Next step**: Get your VPS, then run the deployment script. Your complete WiFi hotspot billing system will be live in minutes!
