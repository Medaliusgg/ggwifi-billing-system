# VPS Deployment - Corrected Steps

## What I've Prepared:
✅ Code is built and ready  
✅ Deployment script created: `deploy-to-vps.sh`  
✅ All changes committed and pushed to Git  

## What You Need to Do (3 Steps):

### Step 1: Copy deployment script to VPS
```bash
# From your local machine, navigate to project root first:
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"

# Then copy the script to VPS (replace YOUR_VPS_IP with your actual VPS IP):
scp deploy-to-vps.sh root@YOUR_VPS_IP:/root/
```

**OR if you prefer absolute path:**
```bash
scp "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP/deploy-to-vps.sh" root@YOUR_VPS_IP:/root/
```

### Step 2: SSH into VPS and run the script
```bash
# SSH into your VPS (replace YOUR_VPS_IP with your actual VPS IP)
ssh root@YOUR_VPS_IP

# Once on VPS, make script executable
chmod +x /root/deploy-to-vps.sh

# Run the deployment script
/root/deploy-to-vps.sh
```

### Step 3: Test from your local machine
```bash
# After deployment completes, wait 30 seconds, then test:
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP/backend"
./test-all-modules.sh
```

---

## Complete Example (Replace YOUR_VPS_IP):

```bash
# Step 1: Copy script
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"
scp deploy-to-vps.sh root@YOUR_VPS_IP:/root/

# Step 2: SSH and deploy
ssh root@YOUR_VPS_IP
chmod +x /root/deploy-to-vps.sh
/root/deploy-to-vps.sh

# Step 3: Test (from local machine, in new terminal)
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP/backend"
./test-all-modules.sh
```

---

## That's It!

The deployment script will:
- Pull latest code from Git
- Build the backend
- Stop the service
- Backup old JAR
- Install new JAR
- Start the service
- Verify it's running

**Expected result after deployment:** 31+ tests passing (95%+ success rate)

---

## If Something Goes Wrong:

Check logs:
```bash
sudo journalctl -u ggnetworks-backend.service -f
```

Restore backup:
```bash
sudo cp /opt/ggnetworks/ggnetworks-backend.jar.backup.* /opt/ggnetworks/ggnetworks-backend.jar
sudo systemctl restart ggnetworks-backend.service
```
