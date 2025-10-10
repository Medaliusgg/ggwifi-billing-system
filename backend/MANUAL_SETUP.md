# 🚨 GGWIFI Backend Manual Setup Guide

## Issues Found:
1. **Maven is not installed** - Required to build and run the Spring Boot backend
2. **MySQL authentication issue** - Root user needs password configuration
3. **FreeRADIUS is not installed** - Required for RADIUS authentication
4. **Backend cannot start** - Due to missing dependencies

## 🔧 Step-by-Step Fix

### Step 1: Install Maven
```bash
sudo apt update
sudo apt install -y maven
```

### Step 2: Fix MySQL Authentication
```bash
# Connect to MySQL as root
sudo mysql

# In MySQL prompt, run these commands:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'kolombo@123%';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Test MySQL Connection
```bash
mysql -u root -p'kolombo@123%' -e "SELECT 'MySQL connection successful!' as status;"
```

### Step 4: Install FreeRADIUS
```bash
sudo apt install -y freeradius freeradius-mysql freeradius-utils
```

### Step 5: Start and Enable Services
```bash
# Start MySQL (if not already running)
sudo systemctl start mysql
sudo systemctl enable mysql

# Start FreeRADIUS
sudo systemctl start freeradius
sudo systemctl enable freeradius

# Check status
sudo systemctl status mysql
sudo systemctl status freeradius
```

### Step 6: Setup Database
```bash
cd backend
./setup-database.sh
```

### Step 7: Start Backend
```bash
cd backend
mvn spring-boot:run
```

## 🧪 Quick Test Commands

### Test Maven Installation
```bash
mvn -version
```

### Test MySQL Connection
```bash
mysql -u root -p'kolombo@123%' -e "SHOW DATABASES;"
```

### Test FreeRADIUS
```bash
sudo systemctl status freeradius
```

### Test Backend Health
```bash
curl http://localhost:8080/api/v1/health
```

## 🔍 Troubleshooting

### If MySQL Authentication Still Fails:
```bash
# Try connecting without password first
sudo mysql

# Then set password
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'kolombo@123%';
FLUSH PRIVILEGES;
EXIT;

# Test connection
mysql -u root -p'kolombo@123%' -e "SELECT 1;"
```

### If Maven Build Fails:
```bash
# Clean and rebuild
mvn clean install
mvn spring-boot:run
```

### If FreeRADIUS Won't Start:
```bash
# Check configuration
sudo freeradius -X

# Check logs
sudo tail -f /var/log/freeradius/radius.log
```

## 📋 Verification Checklist

- [ ] Maven installed and working (`mvn -version`)
- [ ] MySQL running and accessible with password
- [ ] FreeRADIUS installed and running
- [ ] Database `ggwifi` created
- [ ] Backend starts without errors
- [ ] Health endpoint responds (`curl http://localhost:8080/api/v1/health`)

## 🚀 Expected Output

After successful setup, you should see:
```
Started GgwifiBackendApplication in X.XXX seconds (JVM running for X.XXX)
```

And the backend will be accessible at:
- **API Base URL**: `http://localhost:8080/api/v1`
- **Health Check**: `http://localhost:8080/api/v1/health`
- **Swagger UI**: `http://localhost:8080/api/v1/swagger-ui.html`

---

**Run these commands in order and the backend will work!** 🎯
