# Backend Deployment Status

## Current Issue
The signup OTP endpoint is returning a transaction rollback error. The fix has been implemented in the code but needs to be deployed to the VPS.

## Problem
- `pom.xml` file is empty in the repository (both local and VPS)
- Cannot build new JAR with the transaction fix
- Existing JAR on VPS is from Dec 6 (doesn't have the fix)

## Solution Applied (Code)
✅ **Fixed in `SignupService.java`:**
- Changed to `REQUIRES_NEW` transaction propagation
- Added retry logic for OTP generation
- Improved exception handling

✅ **Committed to Git:** `65434ea`

## Next Steps

### Option 1: Restore pom.xml and Build on VPS
```bash
# SSH to VPS
ssh root@139.84.241.182

# Restore pom.xml from git history
cd /opt/ggwifi-src/ggwifi-billing-system
git show d42cbc3:backend/pom.xml > backend/pom.xml

# Pull latest code
git pull origin main

# Build
cd backend
mvn clean package -DskipTests

# Deploy
sudo systemctl stop ggnetworks-backend
sudo cp /opt/ggnetworks/ggnetworks-backend.jar /opt/ggnetworks/backup/ggnetworks-backend.jar.backup.$(date +%Y%m%d_%H%M%S)
sudo cp target/ggnetworks-backend-1.0.0.jar /opt/ggnetworks/ggnetworks-backend.jar
sudo systemctl start ggnetworks-backend
```

### Option 2: Fix pom.xml in Repository
The `pom.xml` needs to be restored in the git repository. It was accidentally deleted or corrupted.

### Option 3: Manual JAR Update
If you have a working JAR file with the fix, you can deploy it directly:
```bash
scp your-jar.jar root@139.84.241.182:/tmp/
ssh root@139.84.241.182 "sudo systemctl stop ggnetworks-backend && sudo cp /tmp/your-jar.jar /opt/ggnetworks/ggnetworks-backend.jar && sudo systemctl start ggnetworks-backend"
```

## Current Status
- ✅ Code fix implemented
- ✅ Code committed to Git
- ❌ Cannot build due to missing pom.xml
- ❌ Backend service needs restart with new JAR

## Temporary Workaround
The transaction error might be intermittent. Users can try again, or you can manually create accounts in the database for testing.
