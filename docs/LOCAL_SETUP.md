# 💻 Local Development Setup Guide

**Complete guide to setting up GGNetworks for local development**

---

## 📋 **Prerequisites**

- **Java 21** (Backend)
- **Node.js 18+** (Frontend)
- **MySQL 8.0** (Database)
- **Git**
- **Maven 3.8+** (Backend build tool)
- **npm/yarn** (Frontend package manager)

---

## 🗄️ **Database Setup**

### **1. Install MySQL**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS
brew install mysql
brew services start mysql

# Windows
# Download from https://dev.mysql.com/downloads/mysql/
```

### **2. Create Local Database**

```bash
mysql -u root -p

# In MySQL console:
CREATE DATABASE ggnetworks_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ggnetworks'@'localhost' IDENTIFIED BY 'ggnetworks123';
GRANT ALL PRIVILEGES ON ggnetworks_local.* TO 'ggnetworks'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### **3. Configure Backend Database**

Create `backend/src/main/resources/application-local.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ggnetworks_local?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=ggnetworks
spring.datasource.password=ggnetworks123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Flyway Configuration
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true

# Server Configuration
server.port=8080
server.servlet.context-path=/

# Logging
logging.level.com.ggnetworks=DEBUG
logging.level.org.springframework.web=INFO

# Security (Disabled for local dev)
app.security.enabled=false

# CORS (Allow localhost)
spring.web.cors.allowed-origins=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

---

## 🔧 **Backend Setup**

### **1. Navigate to Backend Directory**

```bash
cd backend
```

### **2. Run Database Migrations**

```bash
mvn flyway:migrate -Dspring.profiles.active=local
```

### **3. Start Backend**

**Option A: Maven (Recommended for development)**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

**Option B: JAR (Production-like)**
```bash
mvn clean package -DskipTests
java -jar target/ggnetworks-backend-1.0.0.jar --spring.profiles.active=local
```

### **4. Verify Backend**

```bash
# Health check
curl http://localhost:8080/actuator/health

# Test endpoint
curl http://localhost:8080/test/hash-password?password=test123
```

**Expected:** Backend should start on `http://localhost:8080`

---

## 🎨 **Frontend Setup**

### **1. Navigate to Frontend Directory**

```bash
cd Frontend/admin_portal
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Configure Environment**

Create `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=GG-WIFI Admin Portal
VITE_APP_VERSION=1.0.0
```

### **4. Start Development Server**

```bash
npm run dev
```

**Expected:** Frontend should start on `http://localhost:5173`

---

## ✅ **Local Testing Checklist**

### **Backend Tests**

- [ ] Backend starts without errors
- [ ] Database connection successful
- [ ] Migrations applied successfully
- [ ] Health endpoint responds: `http://localhost:8080/actuator/health`
- [ ] Test endpoint works: `http://localhost:8080/test/hash-password?password=test`

### **Frontend Tests**

- [ ] Frontend starts without errors
- [ ] No console errors in browser
- [ ] API connection works (check Network tab)
- [ ] Login page loads
- [ ] Can make API calls to local backend

### **Integration Tests**

- [ ] Frontend can call backend API
- [ ] CORS headers are set correctly
- [ ] Login flow works end-to-end
- [ ] No CORS errors in browser console

---

## 🐛 **Troubleshooting**

### **Backend Issues**

**Problem: Port 8080 already in use**
```bash
# Find process using port 8080
lsof -i :8080
# Kill process
kill -9 <PID>
```

**Problem: Database connection failed**
- Check MySQL is running: `sudo systemctl status mysql`
- Verify credentials in `application-local.properties`
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`

**Problem: Flyway migration fails**
```bash
# Reset database (WARNING: Deletes all data)
mysql -u root -p -e "DROP DATABASE ggnetworks_local; CREATE DATABASE ggnetworks_local;"
mvn flyway:migrate -Dspring.profiles.active=local
```

### **Frontend Issues**

**Problem: Cannot connect to backend**
- Verify backend is running: `curl http://localhost:8080/actuator/health`
- Check `.env.local` has correct API URL
- Check browser console for CORS errors

**Problem: npm install fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📚 **Development Workflow**

### **1. Start Development Session**

```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local

# Terminal 2: Frontend
cd Frontend/admin_portal
npm run dev
```

### **2. Make Changes**

- Edit backend code → Auto-reload (if using Spring Boot DevTools)
- Edit frontend code → Hot reload in browser

### **3. Test Locally**

- Test feature in browser
- Check backend logs
- Verify database changes
- Test API endpoints with Postman/curl

### **4. Commit Changes**

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

---

## 🔗 **Useful Commands**

### **Backend**

```bash
# Run tests
mvn test

# Build without tests
mvn clean package -DskipTests

# Check for updates
mvn versions:display-dependency-updates

# Format code
mvn spotless:apply
```

### **Frontend**

```bash
# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

---

## 📝 **Next Steps**

1. ✅ Complete local setup
2. ✅ Test all features locally
3. ✅ Fix any issues
4. ✅ Commit to feature branch
5. ✅ Create PR to `develop`
6. ✅ Auto-deploy to staging
7. ✅ Test in staging
8. ✅ Merge to `main` (manual approval)
9. ✅ Deploy to production

---

**Last Updated:** 2025-12-12  
**Status:** Ready for Use

