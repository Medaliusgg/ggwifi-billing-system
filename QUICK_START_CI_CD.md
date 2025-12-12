# 🚀 Quick Start: CI/CD Implementation

**Get your CI/CD pipeline running in 30 minutes**

---

## ⚡ **Step 1: Set Up GitHub Secrets (10 minutes)**

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add all secrets from `docs/GITHUB_SECRETS_SETUP.md`
3. Generate SSH keys:
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_actions_ggwifi
   ssh-copy-id -i ~/.ssh/github_actions_ggwifi.pub root@139.84.241.182
   ```
4. Add private key to GitHub secrets: `STAGING_SSH_KEY` and `PRODUCTION_SSH_KEY`

---

## ⚡ **Step 2: Configure Staging Environment (10 minutes)**

### **Option A: Use Same Server (Different Port)**

```bash
# On VPS
sudo cp /etc/systemd/system/ggnetworks-backend.service /etc/systemd/system/ggnetworks-backend-staging.service

# Edit staging service:
sudo nano /etc/systemd/system/ggnetworks-backend-staging.service
# Change:
# - WorkingDirectory=/opt/ggnetworks-staging
# - ExecStart=... --server.port=8081
# - Service name: ggnetworks-backend-staging

# Create staging directory
sudo mkdir -p /opt/ggnetworks-staging/backup
sudo systemctl daemon-reload
```

### **Option B: Use Different Server**

Set up a separate VPS for staging (recommended for production).

---

## ⚡ **Step 3: Test Workflow (10 minutes)**

1. **Create a test branch:**
   ```bash
   git checkout -b feature/test-cicd
   # Make a small change (add a comment)
   git commit -m "test: CI/CD pipeline"
   git push origin feature/test-cicd
   ```

2. **Create PR to `develop`:**
   - GitHub will auto-run staging workflow
   - Check Actions tab for status

3. **Verify deployment:**
   - Check staging backend is running
   - Test staging frontend URL

---

## ✅ **You're Done!**

Now your workflow is:
- ✅ **Local** → Develop and test
- ✅ **Staging** → Auto-deploy on merge to `develop`
- ✅ **Production** → Manual deploy from `main`

---

## 📚 **Next Steps**

1. Read `CI_CD_BLUEPRINT.md` for full details
2. Set up local development (see `docs/LOCAL_SETUP.md`)
3. Configure monitoring and alerts
4. Set up staging database
5. Document your deployment process

---

## 🆘 **Troubleshooting**

**Workflow fails:**
- Check GitHub Actions logs
- Verify secrets are set correctly
- Test SSH connection manually

**Deployment fails:**
- Check server logs: `journalctl -u ggnetworks-backend-staging`
- Verify service is running: `systemctl status ggnetworks-backend-staging`
- Check disk space: `df -h`

---

**Questions?** Check the full documentation in `CI_CD_BLUEPRINT.md`

