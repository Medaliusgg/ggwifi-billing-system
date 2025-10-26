# 🔧 **Deployment Troubleshooting Guide**

## **📊 Current Status Analysis**

### **✅ What's Working:**
- ✅ Port 8080 is accessible on api.ggwifi.co.tz
- ✅ VPS is reachable
- ✅ GitHub repository is configured

### **❌ What's Not Working:**
- ❌ HTTP endpoints not responding
- ❌ Spring Boot application not running properly
- ❌ CI/CD deployment may have failed

## **🔍 Troubleshooting Steps**

### **Step 1: Check GitHub Actions Status**
**Primary Check**: https://github.com/Medaliusgg/ggwifi-billing-system/actions

**Look for:**
- 🟡 **Yellow Circle** = Deployment in progress
- ✅ **Green Checkmark** = Deployment successful
- ❌ **Red X** = Deployment failed

**If you see a red X:**
1. Click on the failed workflow
2. Check the logs for specific error messages
3. Common issues:
   - Missing GitHub secrets
   - VPS SSH connection problems
   - Java/Maven build failures

### **Step 2: Manual VPS Check**
If GitHub Actions shows failure, check VPS manually:

```bash
# SSH to your VPS
ssh root@your-vps-ip

# Check if Java process is running
ps aux | grep java

# Check backend logs
tail -f /var/log/ggwifi-backend.log

# Check if Spring Boot is running on port 8080
netstat -tlnp | grep 8080

# Test locally on VPS
curl http://localhost:8080/api/v1/test
```

### **Step 3: Manual Deployment (If Needed)**
If automatic deployment failed, deploy manually:

```bash
# SSH to VPS
ssh root@your-vps-ip

# Navigate to backend directory
cd /opt/ggwifi-billing-system/backend

# Pull latest changes
git pull origin main

# Stop any existing Java processes
sudo pkill -f java

# Build the application
mvn clean package -DskipTests

# Start Spring Boot in background
nohup java -jar target/ggnetworks-backend-1.0.0.jar > /var/log/ggwifi-backend.log 2>&1 &

# Check if it started
sleep 5
ps aux | grep java

# Test the endpoint
curl http://localhost:8080/api/v1/test
```

## **🚨 Common Issues & Solutions**

### **Issue 1: GitHub Secrets Missing**
**Symptoms**: GitHub Actions fails with authentication errors
**Solution**: Add required secrets to GitHub repository
- VPS_HOST, VPS_USERNAME, VPS_PASSWORD, VPS_PORT
- CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID

### **Issue 2: SSH Connection Failed**
**Symptoms**: GitHub Actions can't connect to VPS
**Solution**: 
- Verify VPS credentials in GitHub secrets
- Check VPS firewall settings
- Ensure SSH is enabled on port 22

### **Issue 3: Java Build Failed**
**Symptoms**: Maven build fails during deployment
**Solution**:
- Check Java version compatibility
- Verify Maven configuration
- Check for missing dependencies

### **Issue 4: Port Already in Use**
**Symptoms**: Spring Boot fails to start
**Solution**:
```bash
# Kill existing Java processes
sudo pkill -f java

# Check what's using port 8080
sudo lsof -i :8080

# Kill specific process if needed
sudo kill -9 <PID>
```

## **🧪 Testing After Fix**

Once you've resolved the issue, test the deployment:

```bash
# Run the status checker
./check-deployment-status.sh

# Test individual endpoints
curl http://api.ggwifi.co.tz:8080/api/v1/test
curl http://api.ggwifi.co.tz:8080/api/v1/health
curl -X POST http://api.ggwifi.co.tz:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"0773404760","password":"Ashruha@123%"}'
```

## **📱 Expected Results After Fix**

### **Successful Deployment Should Show:**
```json
{
  "status": "success",
  "message": "Spring Boot is running! - Complete CI/CD Test [timestamp]",
  "timestamp": 1234567890,
  "deployment": "GitHub Actions CI/CD - FULLY CONFIGURED",
  "status": "PRODUCTION READY"
}
```

## **🔄 Next Steps**

1. **Check GitHub Actions** for deployment status
2. **SSH to VPS** if needed for manual troubleshooting
3. **Test endpoints** once deployment is successful
4. **Verify frontend deployment** to Cloudflare Pages
5. **Test complete login flow** in admin portal

## **📞 Need Help?**

- **GitHub Actions Logs**: Check the Actions tab for detailed error messages
- **VPS Logs**: Check `/var/log/ggwifi-backend.log` for Spring Boot errors
- **Manual Deployment**: Use the manual deployment steps above as fallback

**Your CI/CD pipeline should work once the deployment issue is resolved! 🚀**
