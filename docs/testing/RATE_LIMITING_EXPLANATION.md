# Rate Limiting - Explanation

## 📚 What is Rate Limiting?

**Rate limiting** is a security mechanism that controls how many requests a user or IP address can make to your API within a specific time period.

---

## 🔒 Purpose

Rate limiting serves several important security purposes:

1. **Prevents Brute Force Attacks**
   - Stops attackers from trying thousands of password combinations
   - Limits login attempts to a reasonable number

2. **Protects Against DDoS**
   - Prevents overwhelming your server with too many requests
   - Ensures your API remains available for legitimate users

3. **Prevents API Abuse**
   - Stops users from making excessive requests
   - Ensures fair usage of server resources

4. **Resource Protection**
   - Prevents one user from consuming all server resources
   - Ensures all users get fair access

---

## ⚙️ How It Works in Your Backend

### Configuration (RateLimitingConfig.java)

```java
MAX_LOGIN_ATTEMPTS_PER_MINUTE = 5
MAX_REQUESTS_PER_MINUTE = 60
```

### What Gets Rate Limited

1. **Login Endpoints** (5 attempts/minute):
   - `/api/v1/auth/login`
   - `/api/v1/auth/admin-login`
   - `/api/v1/auth/staff-login`

2. **General API Endpoints** (60 requests/minute):
   - All `/api/v1/**` endpoints
   - Excludes `/api/v1/customer-portal/**`

### How It Tracks

- **By IP Address**: Each IP address has its own limit
- **Time Window**: Resets after 1 minute
- **In-Memory Storage**: Uses ConcurrentHashMap (cleared on restart)

---

## 📊 Example Scenario

### Login Attempts:

```
Time 00:00 - Attempt 1: ✅ Allowed
Time 00:10 - Attempt 2: ✅ Allowed
Time 00:20 - Attempt 3: ✅ Allowed
Time 00:30 - Attempt 4: ✅ Allowed
Time 00:40 - Attempt 5: ✅ Allowed
Time 00:50 - Attempt 6: ❌ BLOCKED (429 error)
         "Too many login attempts. Please try again later."

Time 01:10 - Attempt 7: ✅ Allowed (1 minute passed, reset)
```

### General API Requests:

```
First 60 requests in 1 minute: ✅ Allowed
61st request: ❌ BLOCKED (429 error)
         "Rate limit exceeded. Please try again later."

After 1 minute: ✅ Reset, can make requests again
```

---

## 🛡️ Security Benefits

### Without Rate Limiting:
- Attacker can try 10,000 passwords in 1 minute
- Server gets overwhelmed
- Legitimate users can't access the system

### With Rate Limiting:
- Attacker can only try 5 passwords per minute
- Server stays protected
- Legitimate users have normal access

---

## 🔄 How to Clear Rate Limit

### Option 1: Wait
- Rate limit automatically resets after 1 minute
- No action needed

### Option 2: Restart Backend
- Rate limit is stored in memory
- Restarting clears the cache
- **Note**: Only for testing, not recommended in production

### Option 3: Use Different IP
- Rate limiting is per IP address
- Different IP = fresh limit

---

## ⚠️ Important Notes

1. **Rate limiting is a security feature** - Don't disable in production
2. **It's working correctly** when you see "Too many login attempts"
3. **It protects your system** from attacks
4. **It resets automatically** after the time window

---

## 📋 Summary

**Rate limiting = Security feature that limits how many requests you can make**

- **Login**: 5 attempts per minute
- **API**: 60 requests per minute
- **Purpose**: Prevent attacks and abuse
- **Reset**: Automatically after 1 minute

**It's a good thing!** It means your security is working. 🛡️

---

**Status**: Rate limiting is active and protecting your backend!



