# Exact Deployment Commands for VPS: 139.84.241.182

## Step 1: Copy Script to VPS
```bash
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"
scp deploy-to-vps.sh root@139.84.241.182:/root/
```

## Step 2: SSH and Deploy
```bash
ssh root@139.84.241.182
chmod +x /root/deploy-to-vps.sh
/root/deploy-to-vps.sh
```

## Step 3: Test (After Deployment Completes)
```bash
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP/backend"
./test-all-modules.sh
```

---

## Or Run Step 1 Automatically:
```bash
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"
./DEPLOY_NOW.sh
```

Then SSH and run the deployment script on the VPS.

