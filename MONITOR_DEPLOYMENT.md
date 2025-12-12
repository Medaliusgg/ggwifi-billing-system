# 👀 Monitor CI/CD Deployment

**After creating the PR, use this guide to monitor the deployment**

---

## 🔗 **PR Link**

**Create PR:** https://github.com/Medaliusgg/ggwifi-billing-system/compare/develop...feature/test-cicd-pipeline

---

## 📊 **Step 1: Create the PR**

1. Click the link above
2. Click **"Create pull request"** button
3. **Title:** `Test: CI/CD Pipeline`
4. **Description:** `Testing automated deployment to staging`
5. Click **"Create pull request"**

---

## 👀 **Step 2: Watch GitHub Actions**

**Actions URL:** https://github.com/Medaliusgg/ggwifi-billing-system/actions

### **What to Look For:**

1. **Workflow Runs:**
   - **Backend - Deploy to Staging** (should appear)
   - **Frontend - Deploy to Staging** (if frontend changed)

2. **Workflow Status:**
   - 🟡 **Yellow dot** = Running
   - ✅ **Green checkmark** = Success
   - ❌ **Red X** = Failed

3. **Click on the workflow** to see:
   - Build step
   - Deploy step
   - Verify step

---

## ⏱️ **Expected Timeline**

- **Build:** 1-2 minutes
- **Deploy:** 30 seconds
- **Verify:** 15 seconds
- **Total:** 2-5 minutes

---

## ✅ **Step 3: Verify Deployment**

Once workflow shows ✅ **Success**, verify staging:

```bash
# Check staging backend status
ssh root@139.84.241.182 "systemctl status ggnetworks-backend-staging --no-pager | head -10"

# Test health endpoint
curl http://139.84.241.182:8081/actuator/health
```

**Expected:**
- ✅ Service: `active (running)`
- ✅ Health: `{"status":"UP"}` or similar JSON response

---

## 🆘 **If Workflow Fails**

### **Check Workflow Logs:**
1. Go to Actions tab
2. Click on failed workflow
3. Click on failed step
4. Read error message

### **Common Issues:**

**SSH Connection Failed:**
- Verify `STAGING_SSH_KEY` secret is correct
- Test: `ssh -i ~/.ssh/github_actions_ggwifi root@139.84.241.182`

**Build Failed:**
- Check Maven dependencies
- Check Java version

**Deployment Failed:**
- Check server space: `ssh root@139.84.241.182 "df -h"`
- Check logs: `ssh root@139.84.241.182 "journalctl -u ggnetworks-backend-staging -n 50"`

---

## 🎉 **Success Indicators**

- ✅ GitHub Actions shows green checkmarks
- ✅ Staging backend is running
- ✅ Health endpoint responds
- ✅ No errors in logs

---

**Ready?** Create the PR and let me know when it's created - I'll help monitor it!

