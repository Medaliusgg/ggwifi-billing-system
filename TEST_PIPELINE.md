# 🧪 Test CI/CD Pipeline

**After adding GitHub Secrets, test the pipeline with these steps**

---

## ✅ **Step 1: Verify Secrets Are Added**

1. Go to: https://github.com/Medaliusgg/ggwifi-billing-system/settings/secrets/actions
2. Verify you see **8 secrets** listed
3. If any are missing, add them from `SECRETS_TO_ADD.md`

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

3. Click on a workflow to see details:
   - ✅ Build step
   - ✅ Test step (if enabled)
   - ✅ Deploy step
   - ✅ Verify step

---

## ✅ **Step 5: Verify Staging Deployment**

Once the workflow completes:

```bash
# Check staging backend status
ssh root@139.84.241.182 "systemctl status ggnetworks-backend-staging --no-pager | head -10"

# Test staging API
curl http://139.84.241.182:8081/actuator/health
```

**Expected:** Staging backend should be running on port 8081

---

## 🎉 **Success Indicators**

- ✅ GitHub Actions workflow shows green checkmarks
- ✅ Staging backend is running
- ✅ Health endpoint responds
- ✅ No errors in workflow logs

---

## 🆘 **If Something Fails**

### **Workflow Fails:**
1. Click on the failed workflow
2. Check the error message
3. Common issues:
   - Missing secrets → Add them
   - SSH connection failed → Verify SSH key
   - Build failed → Check backend code
   - Deployment failed → Check server logs

### **Check Server Logs:**
```bash
ssh root@139.84.241.182 "journalctl -u ggnetworks-backend-staging -n 50 --no-pager"
```

---

## 🚀 **After Successful Test**

1. **Merge the test PR** to `develop`
2. **Delete the test branch** (optional)
3. **You're ready for real development!**

Now your workflow is:
- ✅ Feature branch → PR to `develop` → Auto-deploy to staging
- ✅ After testing → Merge to `main` → Manual approval → Deploy to production

---

**Ready to test?** Run the commands in Step 2!

