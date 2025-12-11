# 🚀 Deploy Backend Fix for Transaction Rollback Error

## Problem
The signup OTP request endpoint is returning a 500 error:
```
Transaction silently rolled back because it has been marked as rollback-only
```

## Solution Applied
✅ Fixed transaction handling in `SignupService.requestSignupOTP()`
- Changed to `REQUIRES_NEW` transaction propagation to isolate the transaction
- Added retry logic (max 3 attempts) for OTP code generation
- Improved exception handling

## Deploy to VPS

### Option 1: Automated Deployment (Recommended)
```bash
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"
chmod +x deploy-to-vps-now.sh
echo "y" | ./deploy-to-vps-now.sh
```

### Option 2: Manual Deployment via SSH
```bash
# SSH to VPS
ssh root@139.84.241.182

# Navigate to git repository
cd /root/ggwifi-billing-system || cd /opt/ggwifi-billing-system || cd ~/ggwifi-billing-system

# Pull latest code
git pull origin main

# Navigate to backend
cd backend

# Build backend
mvn clean package -DskipTests

# Stop service
sudo systemctl stop ggnetworks-backend

# Backup current JAR
sudo cp /opt/ggnetworks/ggnetworks-backend.jar /opt/ggnetworks/ggnetworks-backend.jar.backup.$(date +%Y%m%d_%H%M%S)

# Copy new JAR
sudo cp target/ggnetworks-backend-1.0.0.jar /opt/ggnetworks/ggnetworks-backend.jar

# Start service
sudo systemctl start ggnetworks-backend

# Check status
sudo systemctl status ggnetworks-backend

# View logs
sudo journalctl -u ggnetworks-backend -f
```

### Option 3: Quick Deploy Script (Run on VPS)
```bash
# SSH to VPS
ssh root@139.84.241.182

# Run deployment script
cd /root/ggwifi-billing-system/backend
git pull origin main
mvn clean package -DskipTests
sudo systemctl stop ggnetworks-backend
sudo cp target/ggnetworks-backend-1.0.0.jar /opt/ggnetworks/ggnetworks-backend.jar
sudo systemctl start ggnetworks-backend
sudo systemctl status ggnetworks-backend
```

## Verify Fix

After deployment, test the signup OTP endpoint:
```bash
curl -X POST https://api.ggwifi.co.tz/api/v1/auth/signup/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+255658823944"}'
```

Expected response:
```json
{
  "status": "success",
  "message": "OTP sent to your phone number",
  "phoneNumber": "+255658823944"
}
```

## Status
✅ Code fixed and committed (commit: latest)
⏳ **Needs deployment to VPS**
