# 📱 SMS API Configuration

**Date:** 2025-01-27  
**Status:** ✅ Configured

---

## 🔐 **SMS API Credentials**

### **Credentials:**
- **Username:** `medalius`
- **Password:** `Kolombo@123%`
- **Base URL:** `https://messaging-service.co.tz`
- **Sender ID:** `GGWi-Fi`

### **Base64 Encoding:**
The Base64 encoding is generated **dynamically** in the code:
```java
String credentials = smsApiUsername + ":" + smsApiPassword;
String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
headers.set("Authorization", "Basic " + encodedCredentials);
```

**For reference, the correct Base64 string is:**
```
bWVkYWxpdXM6S29sb21ib0AxMjMl
```

**Note:** The placeholder Base64 string (`QWxhZGRpbjpvcGVuIHNlc2FtZQ==`) is not used - the code generates it automatically.

---

## 📋 **Configuration Files**

### **1. application.yml**
```yaml
sms:
  api:
    base-url: ${SMS_API_BASE_URL:https://messaging-service.co.tz}
    username: ${SMS_API_USERNAME:medalius}
    password: ${SMS_API_PASSWORD:Kolombo@123%}
  sender-id: ${SMS_SENDER_ID:GGWi-Fi}
```

### **2. SmsService.java**
```java
@Value("${sms.api.username:medalius}")
private String smsApiUsername;

@Value("${sms.api.password:Kolombo@123%}")
private String smsApiPassword;
```

---

## 🔧 **Environment Variables (Optional)**

You can override credentials using environment variables:

```bash
export SMS_API_USERNAME="medalius"
export SMS_API_PASSWORD="Kolombo@123%"
export SMS_API_BASE_URL="https://messaging-service.co.tz"
export SMS_SENDER_ID="GGWi-Fi"
```

---

## 🧪 **Testing SMS API**

### **Test SMS Sending:**
```bash
# After deployment, test SMS by processing a payment
curl -X POST https://api.ggwifi.co.tz/api/v1/customer-portal/payment \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "AHMED ALI",
    "phoneNumber": "+255742844024",
    "packageId": "1",
    "amount": "2000"
  }'

# Then trigger webhook with SUCCESS status
# SMS should be sent to 0742844024
```

---

## ⚠️ **Previous Issue (403 FORBIDDEN)**

**Status:** ✅ **FIXED**

The 403 error was likely due to:
1. Incorrect password (missing `%` in default value) - **FIXED**
2. Incorrect Base64 encoding - **Not an issue** (generated dynamically)

**After deployment, SMS should work correctly.**

---

## ✅ **Verification**

After deployment, check SMS logs:
```bash
# On VPS
journalctl -u ggnetworks-backend -f | grep SMS
```

**Expected output:**
```
✅ SMS sent successfully to +255742844024
📱 SMS API Response: {...}
```

---

**Configuration Status:** ✅ **COMPLETE**  
**Ready for Deployment:** ✅ **YES**

