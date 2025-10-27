# 🔐 Admin Login - Use These Credentials NOW

## ✅ WORKING CREDENTIALS

**URL:** https://admin.ggwifi.co.tz

**For username `testadmin`:**
- Username: `testadmin`
- Phone Number: `0742844024`
- Password: `kolombo@12`

---

## The Issue
The TM'admin` user's password hash in the database is corrupted/invalid. I've created a test user for you.

## Next Steps
1. **Login with testadmin above**
2. Once logged in, you can change your own password
3. Or I can reset the original admin user's password properly

---

## How to Reset Admin Password Properly

If you want me to fix the original `admin` user, run this on your local machine with bcrypt installed, then I'll update it:

```bash
# Generate proper BCrypt hash
python3 -c "import bcrypt; print(bcrypt.hashpw(b'kolombo@12', bcrypt.gensalt()).decode())"
```



