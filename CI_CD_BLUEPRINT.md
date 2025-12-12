# 🚀 GGNetworks CI/CD Blueprint

**Enterprise-Grade Deployment Pipeline: Local → Staging → Production**

---

## 📋 **Table of Contents**

1. [Architecture Overview](#architecture-overview)
2. [Git Branching Strategy](#git-branching-strategy)
3. [Local Development Setup](#local-development-setup)
4. [Staging Environment](#staging-environment)
5. [Production Environment](#production-environment)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Deployment Workflows](#deployment-workflows)
8. [Monitoring & Rollback](#monitoring--rollback)

---

## 🏗️ **Architecture Overview**

```
┌─────────────────┐
│  Local Dev      │  →  Write, Test, Fix Locally
│  (Your Laptop)  │
└────────┬────────┘
         │
         │ git push → develop
         ▼
┌─────────────────┐
│  Staging        │  →  Auto-deploy on merge to develop
│  (QA Server)    │     Test with real services
└────────┬────────┘
         │
         │ Manual approval + merge → main
         ▼
┌─────────────────┐
│  Production     │  →  Manual deploy from main
│  (Live Server)  │     Customer-facing only
└─────────────────┘
```

---

## 🌿 **Git Branching Strategy**

### **Branch Structure**

```
main (production-ready)
  │
  ├── develop (staging-ready)
  │     │
  │     ├── feature/admin-dashboard
  │     ├── feature/payment-integration
  │     ├── feature/router-management
  │     └── bugfix/login-issue
  │
  └── hotfix/critical-security-patch
```

### **Branch Rules**

| Branch | Purpose | Auto-Deploy | Manual Approval |
|--------|---------|-------------|-----------------|
| `main` | Production code | ❌ No | ✅ Required |
| `develop` | Staging code | ✅ Yes | ❌ No |
| `feature/*` | New features | ❌ No | ❌ No |
| `bugfix/*` | Bug fixes | ❌ No | ❌ No |
| `hotfix/*` | Critical fixes | ⚠️ Emergency only | ✅ Required |

### **Workflow**

1. **Feature Development:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/my-feature
   # ... develop locally ...
   git push origin feature/my-feature
   # Create PR: feature/my-feature → develop
   ```

2. **Staging Deployment:**
   ```bash
   # After PR merge to develop
   # GitHub Actions auto-deploys to staging
   ```

3. **Production Deployment:**
   ```bash
   # After staging validation
   git checkout main
   git merge develop
   git push origin main
   # Manual approval triggers production deploy
   ```

---

## 💻 **Local Development Setup**

### **Prerequisites**

- Java 21 (Backend)
- Node.js 18+ (Frontend)
- MySQL 8.0 (Local DB)
- Docker (Optional, for services)
- Git

### **Backend Local Setup**

```bash
cd backend

# 1. Configure local database
cp src/main/resources/application.properties.example \
   src/main/resources/application-local.properties

# Edit application-local.properties:
# spring.datasource.url=jdbc:mysql://localhost:3306/ggnetworks_local
# spring.datasource.username=root
# spring.datasource.password=your_password

# 2. Create local database
mysql -u root -p
CREATE DATABASE ggnetworks_local;
exit

# 3. Run Flyway migrations
mvn flyway:migrate

# 4. Start backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
# OR
mvn clean package -DskipTests
java -jar target/ggnetworks-backend-1.0.0.jar --spring.profiles.active=local
```

### **Frontend Local Setup**

```bash
cd Frontend/admin_portal

# 1. Install dependencies
npm install

# 2. Configure API endpoint
# Edit .env.local:
# VITE_API_BASE_URL=http://localhost:8080/api/v1

# 3. Start dev server
npm run dev
# Frontend runs on http://localhost:5173
```

### **Local Testing Checklist**

- [ ] Backend starts without errors
- [ ] Database migrations run successfully
- [ ] Frontend connects to local backend
- [ ] Login flow works locally
- [ ] API endpoints respond correctly
- [ ] No CORS errors in browser console

---

## 🧪 **Staging Environment**

### **Staging Server Configuration**

- **Backend URL:** `https://staging-api.ggwifi.co.tz`
- **Admin Portal:** `https://staging-admin.ggwifi.co.tz`
- **Customer Portal:** `https://staging-portal.ggwifi.co.tz`
- **Database:** Separate staging database
- **Services:** Real integrations (RADIUS, routers, payments)

### **Staging Deployment Criteria**

✅ **Auto-deploy to staging when:**
- PR merged to `develop` branch
- All tests pass
- Build succeeds

❌ **Do NOT deploy to staging if:**
- Tests fail
- Build errors
- Breaking changes without migration plan

### **Staging Validation Checklist**

- [ ] Backend starts successfully
- [ ] Database migrations applied
- [ ] Frontend builds without errors
- [ ] Login works
- [ ] API endpoints functional
- [ ] Router integration works
- [ ] Payment gateway responds
- [ ] RADIUS accounting works
- [ ] No critical errors in logs

---

## 🏭 **Production Environment**

### **Production Server Configuration**

- **Backend URL:** `https://api.ggwifi.co.tz`
- **Admin Portal:** `https://admin.ggwifi.co.tz`
- **Customer Portal:** `https://portal.ggwifi.co.tz`
- **Database:** Production database (backed up)
- **Services:** Live integrations

### **Production Deployment Criteria**

✅ **Deploy to production ONLY when:**
- Staging is stable for 24+ hours
- All staging tests pass
- No critical bugs reported
- Manual approval granted
- Rollback plan documented

❌ **NEVER deploy to production if:**
- Staging has errors
- Breaking changes without migration
- No rollback plan
- During peak hours (unless emergency)

---

## ⚙️ **CI/CD Pipeline**

### **Pipeline Stages**

```
┌─────────────┐
│  1. Build   │  →  Compile code, run tests
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  2. Test    │  →  Unit tests, integration tests
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  3. Deploy  │  →  Deploy to staging/production
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  4. Verify  │  →  Smoke tests, health checks
└─────────────┘
```

---

## 📝 **Deployment Workflows**

### **Backend Deployment**

**Staging (Auto):**
- Trigger: Merge to `develop`
- Build: `mvn clean package -DskipTests`
- Deploy: Copy JAR to staging server
- Restart: `systemctl restart ggnetworks-backend-staging`

**Production (Manual):**
- Trigger: Merge to `main` + Manual approval
- Build: `mvn clean package -DskipTests`
- Backup: Current JAR + Database
- Deploy: Copy JAR to production server
- Restart: `systemctl restart ggnetworks-backend`
- Verify: Health check endpoint

### **Frontend Deployment**

**Staging (Auto):**
- Trigger: Merge to `develop`
- Build: `npm run build`
- Deploy: Upload to Cloudflare Pages (staging project)

**Production (Manual):**
- Trigger: Merge to `main` + Manual approval
- Build: `npm run build`
- Deploy: Upload to Cloudflare Pages (production project)
- Verify: Check live site

---

## 🔍 **Monitoring & Rollback**

### **Post-Deployment Monitoring**

1. **Health Checks:**
   - Backend: `GET /actuator/health`
   - Frontend: Load admin portal
   - Database: Connection test

2. **Error Monitoring:**
   - Check application logs
   - Monitor Cloudflare errors
   - Watch for 5xx errors

3. **Performance:**
   - Response times
   - Database query performance
   - Memory usage

### **Rollback Procedure**

**Backend Rollback:**
```bash
# On VPS
cd /opt/ggnetworks
cp ggnetworks-backend.jar ggnetworks-backend.jar.failed
cp backup/ggnetworks-backend-<previous-version>.jar ggnetworks-backend.jar
systemctl restart ggnetworks-backend
```

**Frontend Rollback:**
- Cloudflare Pages: Revert to previous deployment
- Or: Redeploy previous build from GitHub Actions artifacts

---

## 🎯 **Next Steps**

1. **Set up GitHub Actions workflows** (see `.github/workflows/`)
2. **Configure staging environment** (separate VPS or subdomain)
3. **Create deployment scripts** (see `scripts/deploy/`)
4. **Document local setup** (see `docs/LOCAL_SETUP.md`)
5. **Set up monitoring** (Cloudflare Analytics, Application logs)

---

## 📚 **Additional Resources**

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Pages Deployment](https://developers.cloudflare.com/pages/)
- [Spring Boot Production Best Practices](https://spring.io/guides/gs/production-ready/)

---

**Last Updated:** 2025-12-12  
**Status:** Blueprint Ready for Implementation

