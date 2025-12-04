# 🚀 Quick Deploy - Manual Steps

## **On VPS (SSH to api.ggwifi.co.tz):**

```bash
# 1. Stop service
systemctl stop ggnetworks-backend

# 2. Backup
cp /opt/ggnetworks/ggnetworks-backend.jar /opt/ggnetworks/backup/ggnetworks-backend-$(date +%Y%m%d-%H%M%S).jar

# 3. Upload JAR from local (run this from local machine):
scp target/ggnetworks-backend-1.0.0.jar root@api.ggwifi.co.tz:/opt/ggnetworks/ggnetworks-backend.jar

# 4. Start service
systemctl start ggnetworks-backend
systemctl status ggnetworks-backend
```

## **Then Test:**
```bash
cd backend
API_BASE_URL="https://api.ggwifi.co.tz/api/v1" ./test-payment-sms.sh
```

