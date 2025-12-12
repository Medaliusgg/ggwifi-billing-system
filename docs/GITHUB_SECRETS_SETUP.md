# 🔐 GitHub Secrets Setup Guide

**Configure GitHub Actions secrets for CI/CD pipeline**

---

## 📋 **Required Secrets**

### **Backend Deployment Secrets**

| Secret Name | Description | Example |
|------------|-------------|---------|
| `STAGING_HOST` | Staging server IP/hostname | `139.84.241.182` |
| `STAGING_USER` | SSH username for staging | `root` |
| `STAGING_SSH_KEY` | Private SSH key for staging | `-----BEGIN RSA PRIVATE KEY-----...` |
| `STAGING_PORT` | SSH port (optional) | `22` |
| `PRODUCTION_HOST` | Production server IP/hostname | `139.84.241.182` |
| `PRODUCTION_USER` | SSH username for production | `root` |
| `PRODUCTION_SSH_KEY` | Private SSH key for production | `-----BEGIN RSA PRIVATE KEY-----...` |
| `PRODUCTION_PORT` | SSH port (optional) | `22` |

### **Frontend Deployment Secrets**

| Secret Name | Description | Example |
|------------|-------------|---------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | `abc123...` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | `1234567890abcdef` |
| `STAGING_API_URL` | Staging API base URL | `https://staging-api.ggwifi.co.tz/api/v1` |
| `PRODUCTION_API_URL` | Production API base URL | `https://api.ggwifi.co.tz/api/v1` |

---

## 🔑 **How to Add Secrets**

### **1. Navigate to Repository Settings**

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### **2. Add Each Secret**

For each secret:
1. Enter the **Name** (exactly as listed above)
2. Enter the **Value**
3. Click **Add secret**

---

## 🔐 **Generate SSH Keys**

### **1. Generate SSH Key Pair**

```bash
# Generate key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@ggwifi.co.tz" -f ~/.ssh/github_actions_ggwifi

# This creates:
# ~/.ssh/github_actions_ggwifi (private key)
# ~/.ssh/github_actions_ggwifi.pub (public key)
```

### **2. Add Public Key to Server**

```bash
# Copy public key to server
ssh-copy-id -i ~/.ssh/github_actions_ggwifi.pub root@139.84.241.182

# Or manually:
cat ~/.ssh/github_actions_ggwifi.pub | ssh root@139.84.241.182 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### **3. Add Private Key to GitHub**

```bash
# Copy private key content
cat ~/.ssh/github_actions_ggwifi

# Add entire output (including -----BEGIN and -----END) to GitHub secret:
# STAGING_SSH_KEY or PRODUCTION_SSH_KEY
```

---

## ☁️ **Cloudflare API Token**

### **1. Create API Token**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click your profile → **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use **Edit Cloudflare Workers** template
5. Add permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
6. Click **Continue to summary** → **Create Token**
7. Copy the token (you won't see it again!)

### **2. Get Account ID**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on your domain
3. Scroll down to **API** section
4. Copy **Account ID**

### **3. Add to GitHub**

- `CLOUDFLARE_API_TOKEN`: Paste the token from step 1
- `CLOUDFLARE_ACCOUNT_ID`: Paste the account ID from step 2

---

## ✅ **Verify Secrets**

### **Test SSH Connection**

```bash
# Test staging connection
ssh -i ~/.ssh/github_actions_ggwifi root@139.84.241.182 "echo 'Connection successful'"

# Test production connection (if different server)
ssh -i ~/.ssh/github_actions_ggwifi root@<production-ip> "echo 'Connection successful'"
```

### **Test Cloudflare API**

```bash
# Test API token
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🔒 **Security Best Practices**

1. **Never commit secrets to Git**
   - Use `.gitignore` to exclude secret files
   - Use GitHub Secrets for CI/CD

2. **Rotate secrets regularly**
   - Change SSH keys every 90 days
   - Rotate API tokens every 180 days

3. **Use separate keys for staging/production**
   - Different SSH keys for each environment
   - Different API tokens if possible

4. **Limit secret access**
   - Only add secrets needed for your workflow
   - Use environment-specific secrets

---

## 📝 **Quick Reference**

### **All Required Secrets Checklist**

**Backend:**
- [ ] `STAGING_HOST`
- [ ] `STAGING_USER`
- [ ] `STAGING_SSH_KEY`
- [ ] `STAGING_PORT` (optional)
- [ ] `PRODUCTION_HOST`
- [ ] `PRODUCTION_USER`
- [ ] `PRODUCTION_SSH_KEY`
- [ ] `PRODUCTION_PORT` (optional)

**Frontend:**
- [ ] `CLOUDFLARE_API_TOKEN`
- [ ] `CLOUDFLARE_ACCOUNT_ID`
- [ ] `STAGING_API_URL` (optional)
- [ ] `PRODUCTION_API_URL` (optional)

---

**Last Updated:** 2025-12-12  
**Status:** Ready for Configuration

