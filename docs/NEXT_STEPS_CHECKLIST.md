# ✅ CI/CD Setup Checklist

**Follow these steps to complete your CI/CD setup**

---

## ✅ **Completed Steps**

- [x] Git branches created (`main` and `develop`)
- [x] CI/CD files committed to repository
- [x] GitHub Actions workflows created
- [x] Documentation created

---

## 🔐 **Step 1: Generate SSH Keys** (5 minutes)

Run this script:

```bash
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"
./scripts/setup/generate-ssh-keys.sh
```

**Then:**
1. Copy the public key to your VPS:
   ```bash
   ssh-copy-id -i ~/.ssh/github_actions_ggwifi.pub root@139.84.241.182
   ```

2. Test the connection:
   ```bash
   ssh -i ~/.ssh/github_actions_ggwifi root@139.84.241.182 "echo 'Connection successful'"
   ```

---

## 🔑 **Step 2: Add GitHub Secrets** (10 minutes)

1. Go to: https://github.com/Medaliusgg/ggwifi-billing-system/settings/secrets/actions

2. Click **"New repository secret"** and add:

### **Backend Secrets:**

| Secret Name | Value | Command to Get |
|------------|-------|----------------|
| `STAGING_HOST` | `139.84.241.182` | Your VPS IP |
| `STAGING_USER` | `root` | SSH username |
| `STAGING_SSH_KEY` | `cat ~/.ssh/github_actions_ggwifi` | Copy entire output |
| `PRODUCTION_HOST` | `139.84.241.182` | Your VPS IP |
| `PRODUCTION_USER` | `root` | SSH username |
| `PRODUCTION_SSH_KEY` | `cat ~/.ssh/github_actions_ggwifi` | Same as staging |

### **Frontend Secrets:**

| Secret Name | Value | How to Get |
|------------|-------|------------|
| `CLOUDFLARE_API_TOKEN` | `...` | See below |
| `CLOUDFLARE_ACCOUNT_ID` | `...` | See below |

**Get Cloudflare Token:**
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use **"Edit Cloudflare Workers"** template
4. Add: **Account** → **Cloudflare Pages** → **Edit**
5. Copy token → Add to `CLOUDFLARE_API_TOKEN`

**Get Account ID:**
1. Go to: https://dash.cloudflare.com/
2. Click your domain
3. Scroll to **"API"** section
4. Copy **"Account ID"** → Add to `CLOUDFLARE_ACCOUNT_ID`

---

## 🧪 **Step 3: Set Up Staging Environment** (10 minutes)

Run this script:

```bash
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"
./scripts/setup/setup-staging-env.sh
```

**Or manually:**

```bash
ssh root@139.84.241.182 << 'EOF'
# Create directories
sudo mkdir -p /opt/ggnetworks-staging/{backup,config,logs}

# Copy config
sudo cp /opt/ggnetworks/config/application-production.yml /opt/ggnetworks-staging/config/application-staging.yml

# Edit config to use port 8081
sudo sed -i 's/server.port: 8080/server.port: 8081/' /opt/ggnetworks-staging/config/application-staging.yml

# Create service file (see scripts/setup/setup-staging-env.sh for full content)
# Then:
sudo systemctl daemon-reload
sudo systemctl enable ggnetworks-backend-staging
EOF
```

---

## ✅ **Step 4: Test the Pipeline** (5 minutes)

1. **Create a test branch:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/test-cicd
   echo "# CI/CD Test" >> backend/README.md
   git add .
   git commit -m "test: CI/CD pipeline"
   git push origin feature/test-cicd
   ```

2. **Create Pull Request:**
   - Go to: https://github.com/Medaliusgg/ggwifi-billing-system
   - Click **"Pull requests"** → **"New pull request"**
   - Base: `develop` ← Compare: `feature/test-cicd`
   - Create PR

3. **Watch GitHub Actions:**
   - Go to **"Actions"** tab
   - Watch the workflow run
   - Should deploy to staging automatically!

---

## 🚀 **Step 5: Enable Production Protection** (2 minutes)

1. Go to: https://github.com/Medaliusgg/ggwifi-billing-system/settings/environments
2. Click **"New environment"**
3. Name: `production`
4. Check **"Required reviewers"**
5. Add yourself
6. Save

---

## 📊 **Verification Checklist**

After setup, verify:

- [ ] SSH keys generated and added to VPS
- [ ] All GitHub secrets configured
- [ ] Staging environment set up
- [ ] Test PR deployed to staging successfully
- [ ] Production environment protection enabled
- [ ] Can SSH to VPS using the key

---

## 🎯 **You're Ready!**

Once all steps are complete:

1. **Develop locally** on feature branches
2. **Merge to `develop`** → Auto-deploys to staging
3. **Test in staging**
4. **Merge to `main`** → Manual approval → Deploys to production

---

## 🆘 **Need Help?**

- See `docs/STEP_BY_STEP_SETUP.md` for detailed instructions
- See `CI_CD_BLUEPRINT.md` for full architecture
- Check GitHub Actions logs if workflows fail

---

**Status:** Ready to proceed with Step 1! 🚀

