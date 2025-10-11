# GitHub CI/CD Setup for GGNetworks Project

## 🚀 **Automatic Deployment Workflow**

This setup enables automatic deployment whenever you push changes to GitHub:

### **Backend Deployment (VPS)**
- **Trigger**: Push to `main` branch with changes in `backend/` folder
- **Action**: Automatically deploys to VPS and restarts Spring Boot application

### **Frontend Deployment (Cloudflare Pages)**
- **Trigger**: Push to `main` branch with changes in `Frontend/` folder
- **Action**: Automatically builds and deploys to Cloudflare Pages

## 🔧 **Required GitHub Secrets**

You need to add these secrets to your GitHub repository:

### **VPS Secrets**
1. Go to GitHub → Your Repository → Settings → Secrets and variables → Actions
2. Add these secrets:

```
VPS_HOST = your-vps-ip-address
VPS_USERNAME = root
VPS_PASSWORD = your-vps-password
VPS_PORT = 22
```

### **Cloudflare Secrets**
```
CLOUDFLARE_API_TOKEN = your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID = your-cloudflare-account-id
```

## 📋 **How to Get Cloudflare Credentials**

### **1. Get Cloudflare API Token**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template
4. Set permissions:
   - Zone:Zone:Read
   - Zone:Zone Settings:Edit
   - Account:Cloudflare Pages:Edit
5. Copy the generated token

### **2. Get Account ID**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain (ggwifi.co.tz)
3. Copy the "Account ID" from the right sidebar

## 🔄 **Development Workflow**

### **For Backend Changes:**
1. Make changes in `backend/` folder
2. Commit and push to GitHub
3. GitHub Actions automatically:
   - Connects to VPS
   - Pulls latest code
   - Rebuilds Spring Boot application
   - Restarts the backend service

### **For Frontend Changes:**
1. Make changes in `Frontend/` folder
2. Commit and push to GitHub
3. GitHub Actions automatically:
   - Builds the frontend
   - Deploys to Cloudflare Pages
   - Updates the live website

## 🧪 **Testing the Setup**

### **Test Backend Deployment:**
```bash
# Make a small change to backend
echo "// Updated $(date)" >> backend/src/main/java/com/ggnetworks/SimpleApplication.java

# Commit and push
git add .
git commit -m "test: Trigger backend deployment"
git push origin main
```

### **Test Frontend Deployment:**
```bash
# Make a small change to frontend
echo "/* Updated $(date) */" >> Frontend/admin_portal/src/App.jsx

# Commit and push
git add .
git commit -m "test: Trigger frontend deployment"
git push origin main
```

## 📊 **Monitoring Deployments**

### **GitHub Actions Tab**
1. Go to your GitHub repository
2. Click "Actions" tab
3. See deployment status and logs

### **VPS Backend Logs**
```bash
# SSH to your VPS
ssh root@your-vps-ip

# Check backend logs
tail -f /var/log/ggwifi-backend.log

# Check if backend is running
ps aux | grep java
```

### **Cloudflare Pages**
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Check deployment status for both projects:
   - ggwifi-admin-portal
   - ggwifi-customer-portal

## 🎯 **Benefits of This Setup**

✅ **Automatic Deployment** - No manual deployment needed
✅ **Version Control** - All changes tracked in GitHub
✅ **Rollback Capability** - Easy to revert to previous versions
✅ **Testing Environment** - Test changes before production
✅ **Team Collaboration** - Multiple developers can work together
✅ **CI/CD Pipeline** - Professional development workflow

## 🚨 **Troubleshooting**

### **Backend Deployment Fails**
1. Check VPS credentials in GitHub Secrets
2. Verify VPS SSH access
3. Check GitHub Actions logs

### **Frontend Deployment Fails**
1. Check Cloudflare credentials in GitHub Secrets
2. Verify Cloudflare Pages projects exist
3. Check build logs in GitHub Actions

### **Manual Deployment (Fallback)**
```bash
# Backend manual deployment
ssh root@your-vps-ip
cd /opt/ggwifi-billing-system/backend
git pull origin main
mvn clean package -DskipTests
sudo pkill -f java
nohup java -jar target/ggnetworks-backend-1.0.0.jar > /var/log/ggwifi-backend.log 2>&1 &

# Frontend manual deployment
cd Frontend/admin_portal
npm run build
# Upload dist/ folder to Cloudflare Pages
```

## 🔐 **Security Notes**

- Never commit passwords or API keys to GitHub
- Use GitHub Secrets for sensitive information
- Regularly rotate API tokens and passwords
- Monitor deployment logs for security issues

## 📱 **Next Steps**

1. Add the required GitHub Secrets
2. Test the deployment workflows
3. Set up monitoring and alerts
4. Configure custom domains
5. Set up SSL certificates

**Your development workflow is now fully automated! 🎉**
