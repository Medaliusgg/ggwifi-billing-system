# 📋 Step-by-Step CI/CD Setup Guide

**Follow these steps in order to get your CI/CD pipeline running**

---

## ✅ **Step 1: Git Branches Created** ✓

Your repository now has:
- `main` branch (production)
- `develop` branch (staging)

**Next:** Configure GitHub Secrets

---

## 🔐 **Step 2: Configure GitHub Secrets**

### **2.1 Generate SSH Keys**

Run these commands on your local machine:

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@ggwifi.co.tz" -f ~/.ssh/github_actions_ggwifi

# This will create:
# ~/.ssh/github_actions_ggwifi (private key - keep secret!)
# ~/.ssh/github_actions_ggwifi.pub (public key - add to server)
```

### **2.2 Add Public Key to VPS**

```bash
# Copy public key to your VPS
ssh-copy-id -i ~/.ssh/github_actions_ggwifi.pub root@139.84.241.182

# Or manually:
cat ~/.ssh/github_actions_ggwifi.pub | ssh root@139.84.241.182 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### **2.3 Add Secrets to GitHub**

1. Go to: https://github.com/Medaliusgg/ggwifi-billing-system/settings/secrets/actions
2. Click **"New repository secret"** for each:

#### **Backend Secrets:**

| Name | Value | How to Get |
|------|-------|------------|
| `STAGING_HOST` | `139.84.241.182` | Your VPS IP |
| `STAGING_USER` | `root` | SSH username |
| `STAGING_SSH_KEY` | `cat ~/.ssh/github_actions_ggwifi` | Copy entire private key |
| `STAGING_PORT` | `22` | SSH port (optional) |
| `PRODUCTION_HOST` | `139.84.241.182` | Your VPS IP |
| `PRODUCTION_USER` | `root` | SSH username |
| `PRODUCTION_SSH_KEY` | `cat ~/.ssh/github_actions_ggwifi` | Same private key |
| `PRODUCTION_PORT` | `22` | SSH port (optional) |

#### **Frontend Secrets:**

| Name | Value | How to Get |
|------|-------|------------|
| `CLOUDFLARE_API_TOKEN` | `...` | See Step 2.4 below |
| `CLOUDFLARE_ACCOUNT_ID` | `...` | See Step 2.4 below |
| `STAGING_API_URL` | `https://staging-api.ggwifi.co.tz/api/v1` | Staging API URL |
| `PRODUCTION_API_URL` | `https://api.ggwifi.co.tz/api/v1` | Production API URL |

### **2.4 Get Cloudflare API Token**

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use **"Edit Cloudflare Workers"** template
4. Add permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
5. Click **"Continue to summary"** → **"Create Token"**
6. Copy the token (you won't see it again!)
7. Add to GitHub secret: `CLOUDFLARE_API_TOKEN`

**Get Account ID:**
1. Go to: https://dash.cloudflare.com/
2. Click on your domain
3. Scroll to **"API"** section
4. Copy **"Account ID"**
5. Add to GitHub secret: `CLOUDFLARE_ACCOUNT_ID`

---

## 🧪 **Step 3: Set Up Staging Environment**

### **Option A: Same Server, Different Port (Quick Setup)**

Run on your VPS:

```bash
# Create staging directory
sudo mkdir -p /opt/ggnetworks-staging/backup
sudo mkdir -p /opt/ggnetworks-staging/config
sudo mkdir -p /opt/ggnetworks-staging/logs

# Copy production config
sudo cp /opt/ggnetworks/config/application-production.yml /opt/ggnetworks-staging/config/application-staging.yml

# Edit staging config to use different port
sudo nano /opt/ggnetworks-staging/config/application-staging.yml
# Change: server.port: 8081
# Change: spring.datasource.url to use staging database (optional)

# Create staging systemd service
sudo nano /etc/systemd/system/ggnetworks-backend-staging.service
```

**Staging Service File:**
```ini
[Unit]
Description=GG-WIFI Backend Service (Staging)
After=network.target mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/ggnetworks-staging
ExecStart=/usr/bin/java -jar /opt/ggnetworks-staging/ggnetworks-backend.jar --spring.config.location=file:/opt/ggnetworks-staging/config/application-staging.yml
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start staging service
sudo systemctl daemon-reload
sudo systemctl enable ggnetworks-backend-staging
sudo systemctl start ggnetworks-backend-staging

# Verify it's running
sudo systemctl status ggnetworks-backend-staging
```

### **Option B: Separate Staging Server (Recommended)**

Set up a separate VPS for staging (better isolation).

---

## ✅ **Step 4: Test the Pipeline**

### **4.1 Create a Test Feature**

```bash
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"
git checkout develop
git pull origin develop
git checkout -b feature/test-cicd

# Make a small change (add a comment to a file)
echo "# CI/CD Test" >> backend/README.md

git add .
git commit -m "test: CI/CD pipeline validation"
git push origin feature/test-cicd
```

### **4.2 Create Pull Request**

1. Go to: https://github.com/Medaliusgg/ggwifi-billing-system
2. Click **"Pull requests"** → **"New pull request"**
3. Base: `develop` ← Compare: `feature/test-cicd`
4. Click **"Create pull request"**
5. GitHub Actions will automatically run!

### **4.3 Monitor Deployment**

1. Go to **"Actions"** tab in GitHub
2. Watch the workflow run:
   - ✅ Build
   - ✅ Test
   - ✅ Deploy to staging
   - ✅ Verify

### **4.4 Verify Staging Deployment**

```bash
# Check staging backend
ssh root@139.84.241.182 "systemctl status ggnetworks-backend-staging"

# Test staging API
curl http://139.84.241.182:8081/actuator/health
```

---

## 🚀 **Step 5: Production Deployment Setup**

### **5.1 Enable Manual Approval**

1. Go to: https://github.com/Medaliusgg/ggwifi-billing-system/settings/environments
2. Click **"New environment"**
3. Name: `production`
4. Check **"Required reviewers"**
5. Add yourself as reviewer
6. Click **"Save protection rules"**

### **5.2 Deploy to Production**

**When staging is stable:**

```bash
git checkout main
git merge develop
git push origin main
```

Then:
1. Go to **"Actions"** tab
2. Find the production workflow
3. Click **"Review deployments"**
4. Approve the deployment
5. Watch it deploy!

---

## 📊 **Step 6: Verify Everything Works**

### **Checklist:**

- [ ] GitHub Secrets configured
- [ ] Staging environment set up
- [ ] Test PR deployed to staging successfully
- [ ] Staging backend is running
- [ ] Production environment protection enabled
- [ ] Rollback script tested

---

## 🎯 **You're All Set!**

Your workflow is now:
- ✅ **Local** → Develop and test
- ✅ **Staging** → Auto-deploy on merge to `develop`
- ✅ **Production** → Manual approval from `main`

---

## 🆘 **Troubleshooting**

**Workflow fails:**
- Check GitHub Actions logs
- Verify secrets are correct
- Test SSH connection: `ssh -i ~/.ssh/github_actions_ggwifi root@139.84.241.182`

**Deployment fails:**
- Check server logs: `journalctl -u ggnetworks-backend-staging -f`
- Verify service: `systemctl status ggnetworks-backend-staging`
- Check disk space: `df -h`

---

**Next:** Start developing on feature branches and let CI/CD handle deployments!

