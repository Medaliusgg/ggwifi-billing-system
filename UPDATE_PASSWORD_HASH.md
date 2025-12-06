# 🔐 Update Admin Password Hash

## Problem
The password hash in the database might not match what Spring Security expects, causing authentication to fail.

## Solution: Generate Correct BCrypt Hash

### Method 1: Use Backend Test Endpoint (Recommended)

```bash
# URL encode the password: Kolombo@123% → Kolombo@123%25
curl 'https://api.ggwifi.co.tz/test/hash-password?password=Kolombo@123%25'
```

This will return a JSON response with the hash:
```json
{
  "password": "Kolombo@123%",
  "hash": "$2a$10$...",
  "verification": true
}
```

### Method 2: Use Online BCrypt Generator

1. Go to: **https://bcrypt-generator.com/**
2. Enter password: `Kolombo@123%`
3. Set rounds: **10** (Spring Security default)
4. Click **"Generate Hash"**
5. Copy the generated hash

### Method 3: Use Python (if bcrypt is installed)

```bash
python3 -c "import bcrypt; print(bcrypt.hashpw(b'Kolombo@123%', bcrypt.gensalt(rounds=10)).decode())"
```

Or install bcrypt first:
```bash
pip3 install bcrypt
python3 -c "import bcrypt; print(bcrypt.hashpw(b'Kolombo@123%', bcrypt.gensalt(rounds=10)).decode())"
```

---

## Update Database with New Hash

Once you have the correct BCrypt hash, run this on your VPS:

```bash
mysql -u ggnetworks -psecure_password ggnetworks -e "UPDATE users SET password = 'PASTE_HASH_HERE' WHERE username = 'medalius';"
```

**Example:**
```bash
mysql -u ggnetworks -psecure_password ggnetworks -e "UPDATE users SET password = '\$2a\$10\$YourGeneratedHashHere' WHERE username = 'medalius';"
```

**Important:** 
- Escape the `$` signs with backslashes: `\$2a\$10\$...`
- Or use single quotes around the hash

---

## Verify the Update

After updating, verify the user exists:

```bash
mysql -u ggnetworks -psecure_password ggnetworks -e "SELECT username, phone_number, role, is_active FROM users WHERE username = 'medalius';"
```

---

## Test Login

After updating the hash, try logging in again:
- Username: `medalius`
- Phone: `0742844024`
- Password: `Kolombo@123%`


