# Quick GitHub Secrets Setup Guide

## 🔐 **Step-by-Step GitHub Secrets Configuration**

### **1. Access GitHub Secrets**
1. Go to: https://github.com/Medaliusgg/ggwifi-billing-system
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### **2. Add VPS Secrets**

Add these 4 secrets one by one:

#### **Secret 1: VPS_HOST**
- **Name**: `VPS_HOST`
- **Value**: `your-vps-ip-address` (replace with your actual VPS IP)

#### **Secret 2: VPS_USERNAME**
- **Name**: `VPS_USERNAME`
- **Value**: `root`

#### **Secret 3: VPS_PASSWORD**
- **Name**: `VPS_PASSWORD`
- **Value**: `your-vps-password` (replace with your actual VPS password)

#### **Secret 4: VPS_PORT**
- **Name**: `VPS_PORT`
- **Value**: `22`

### **3. Add Cloudflare Secrets**

#### **Secret 5: CLOUDFLARE_API_TOKEN**
- **Name**: `CLOUDFLARE_API_TOKEN`
- **Value**: Get from Cloudflare Dashboard → Profile → API Tokens

#### **Secret 6: CLOUDFLARE_ACCOUNT_ID**
- **Name**: `CLOUDFLARE_ACCOUNT_ID`
- **Value**: Get from Cloudflare Dashboard → Your Domain → Account ID

## 🧪 **Test the Setup**

After adding all secrets, make a small test change:

```bash
# Test backend deployment
echo "// Test deployment $(date)" >> backend/src/main/java/com/ggnetworks/SimpleApplication.java
git add .
git commit -m "test: Trigger CI/CD deployment"
git push origin main
```

Then check:
1. **GitHub Actions**: https://github.com/Medaliusgg/ggwifi-billing-system/actions
2. **VPS Backend**: Should restart automatically
3. **Cloudflare Pages**: Should deploy automatically

## ✅ **Expected Results**

- ✅ GitHub Actions workflow runs successfully
- ✅ Backend restarts on VPS automatically
- ✅ Frontend deploys to Cloudflare Pages automatically
- ✅ No manual deployment needed

## 🎯 **Your Development Workflow Now**

1. **Make changes** in your code
2. **Commit and push** to GitHub
3. **Automatic deployment** happens
4. **Test on live environment**

**No more manual deployment! Everything is automated! 🚀**
