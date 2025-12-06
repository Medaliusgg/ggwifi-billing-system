# 🔧 Fix Admin Login - Step by Step

## Current Status
✅ Admin user created in database (username: `medalius`)  
❌ Login failing with "Bad credentials" - password hash issue

---

## Solution: Update Password Hash

### Step 1: Generate BCrypt Hash

**Option A: Use Backend Test Endpoint (Recommended)**

On your VPS, run:
```bash
curl 'https://api.ggwifi.co.tz/test/hash-password?password=Kolombo@123%25'
```

**Expected Response:**
```json
{
  "password": "Kolombo@123%",
  "hash": "$2a$10$...",
  "verification": true
}
```

**Copy the `hash` value** (the long string starting with `$2a$10$`)

---

**Option B: Use Online Generator**

1. Go to: **https://bcrypt-generator.com/**
2. Enter password: `Kolombo@123%`
3. Set rounds: **10**
4. Click **"Generate Hash"**
5. Copy the generated hash

---

### Step 2: Update Database

On your VPS, run this command (replace `PASTE_HASH_HERE` with the hash from Step 1):

```bash
mysql -u ggnetworks -psecure_password ggnetworks -e "UPDATE users SET password = 'PASTE_HASH_HERE' WHERE username = 'medalius';"
```

**Example:**
```bash
mysql -u ggnetworks -psecure_password ggnetworks -e "UPDATE users SET password = '\$2a\$10\$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa' WHERE username = 'medalius';"
```

**Important:** 
- Escape `$` signs with backslashes: `\$2a\$10\$...`
- Or use single quotes around the entire hash

---

### Step 3: Verify Update

Check that the password was updated:
```bash
mysql -u ggnetworks -psecure_password ggnetworks -e "SELECT username, phone_number, role, is_active FROM users WHERE username = 'medalius';"
```

---

### Step 4: Test Login

1. Go to: **https://admin.ggwifi.co.tz**
2. Enter credentials:
   - **Username:** `medalius`
   - **Phone Number:** `0742844024`
   - **Password:** `Kolombo@123%`
3. Click **Login**

---

## Troubleshooting

### If hash generation fails:
- Try the online generator: https://bcrypt-generator.com/
- Make sure rounds = 10
- Copy the entire hash (starts with `$2a$10$`)

### If login still fails:
1. Verify the hash was updated:
   ```bash
   mysql -u ggnetworks -psecure_password ggnetworks -e "SELECT username, password FROM users WHERE username = 'medalius';"
   ```
2. Check backend logs for authentication errors
3. Verify the password in the SQL matches exactly: `Kolombo@123%`

---

## Quick Command Reference

```bash
# 1. Generate hash
curl 'https://api.ggwifi.co.tz/test/hash-password?password=Kolombo@123%25'

# 2. Update database (replace HASH with result from step 1)
mysql -u ggnetworks -psecure_password ggnetworks -e "UPDATE users SET password = 'HASH' WHERE username = 'medalius';"

# 3. Verify
mysql -u ggnetworks -psecure_password ggnetworks -e "SELECT username, role FROM users WHERE username = 'medalius';"
```


