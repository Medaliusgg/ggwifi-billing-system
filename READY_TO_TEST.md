# 🧪 Ready to Test CI/CD Pipeline

**Once you've added all 8 secrets to GitHub, follow these steps:**

---

## ✅ **Step 1: Verify Secrets**

Go to: https://github.com/Medaliusgg/ggwifi-billing-system/settings/secrets/actions

Verify you see **8 secrets**:
- ✅ STAGING_HOST
- ✅ STAGING_USER
- ✅ STAGING_SSH_KEY
- ✅ PRODUCTION_HOST
- ✅ PRODUCTION_USER
- ✅ PRODUCTION_SSH_KEY
- ✅ CLOUDFLARE_API_TOKEN
- ✅ CLOUDFLARE_ACCOUNT_ID

---

## 🧪 **Step 2: Create Test Branch**

Run these commands:

```bash
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"
git checkout develop
git pull origin develop
git checkout -b feature/test-cicd-pipeline

# Make a small test change
echo "" >> backend/README.md
echo "## CI/CD Test - $(date '+%Y-%m-%d %H:%M:%S')" >> backend/README.md
echo "Testing automated deployment to staging." >> backend/README.md

git add backend/README.md
git commit -m "test: CI/CD pipeline validation"
git push origin feature/test-cicd-pipeline
```

---

## 🔀 **Step 3: Create Pull Request**

1. Go to: https://github.com/Medaliusgg/ggwifi-billing-system
2. You should see a banner: **"feature/test-cicd-pipeline had recent pushes"**
3. Click **"Compare & pull request"**
4. **Base:** `develop` ← **Compare:** `feature/test-cicd-pipeline`
5. Title: `Test: CI/CD Pipeline`
6. Description: `Testing automated deployment to staging`
7. Click **"Create pull request"**

---

## 👀 **Step 4: Watch GitHub Actions**

1. After creating the PR, go to the **"Actions"** tab
2. You should see workflows running:
   - **Backend - Deploy to Staging**
   - **Frontend - Deploy to Staging**

3. Click on a workflow to see:
   - ✅ Build step
   - ✅ Deploy step
   - ✅ Verify step

**Expected time:** 2-5 minutes for full deployment

---

## ✅ **Step 5: Verify Staging Deployment**

Once workflow completes:

```bash
# Check staging backend status
ssh root@139.84.241.182 "systemctl status ggnetworks-backend-staging --no-pager | head -10"

# Test staging API
curl http://139.84.241.182:8081/actuator/health
```

**Expected:** 
- ✅ Service status: `active (running)`
- ✅ Health endpoint: `{"status":"UP"}` or similar

---

## 🎉 **Success Indicators**

- ✅ GitHub Actions shows green checkmarks
- ✅ Staging backend is running
- ✅ Health endpoint responds
- ✅ No errors in workflow logs

---

## 🆘 **If Something Fails**

### **Check Workflow Logs:**
1. Go to **Actions** tab
2. Click on failed workflow
3. Click on failed step
4. Read error message

### **Common Issues:**

**SSH Connection Failed:**
- Verify `STAGING_SSH_KEY` is correct (full key including BEGIN/END)
- Test manually: `ssh -i ~/.ssh/github_actions_ggwifi root@139.84.241.182`

**Build Failed:**
- Check backend code compiles
- Check Maven dependencies

**Deployment Failed:**
- Check server has space: `ssh root@139.84.241.182 "df -h"`
- Check service logs: `ssh root@139.84.241.182 "journalctl -u ggnetworks-backend-staging -n 50"`

---

## 🚀 **After Successful Test**

1. **Merge the test PR** to `develop`
2. **Delete the test branch** (optional)
3. **You're ready for real development!**

Your workflow is now:
- ✅ Feature branch → PR to `develop` → **Auto-deploy to staging**
- ✅ After testing → Merge to `main` → Manual approval → Deploy to production

---

**Ready?** Run the commands in Step 2!

