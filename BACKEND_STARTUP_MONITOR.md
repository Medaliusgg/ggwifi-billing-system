# 🔍 Backend Startup Monitor

**Current Status:** Backend is starting in the background

---

## 📊 How to Check Backend Status

### Option 1: Check Health Endpoint
```bash
curl http://localhost:8080/api/v1/health
```

**Expected when ready:**
```json
{"status":"UP"}
```

### Option 2: Check Logs
```bash
tail -f backend-dev.log
```

**Look for:**
```
Started GgnetworksBackendApplication in X.XXX seconds
```

### Option 3: Check if Port is Listening
```bash
lsof -ti:8080
```

If it returns a process ID, the backend is running.

---

## ⏱️ Typical Startup Time

- **First startup:** 30-60 seconds
- **Subsequent startups:** 20-40 seconds

---

## 🐛 If Backend Fails to Start

### Check for Errors
```bash
tail -50 backend-dev.log | grep -E "ERROR|Exception|Failed"
```

### Common Issues:

1. **Database Connection Error**
   - Check MySQL is running: `sudo systemctl status mysql`
   - Verify database exists: `mysql -u ggnetworks -pggnetworks123 -e "SHOW DATABASES;"`

2. **Port Already in Use**
   - Check: `lsof -ti:8080`
   - Kill process: `kill $(lsof -ti:8080)`

3. **Compilation Errors**
   - Check: `tail -50 backend-dev.log | grep "ERROR"`

---

## ✅ Once Backend is Ready

1. **Verify Backend:**
   ```bash
   curl http://localhost:8080/api/v1/health
   ```

2. **Test Login:**
   - Go to: http://localhost:5173
   - Username: `medalius`
   - Phone: `0742844024`
   - Password: `Kolombo@123%`

3. **Test Features:**
   - Follow: `ADMIN_PORTAL_LOCAL_TESTING_GUIDE.md`

---

**Status:** ⏳ Backend starting... (check logs for progress)



