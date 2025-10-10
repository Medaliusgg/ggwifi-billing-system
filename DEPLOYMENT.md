# 🚀 GGWIFI Multi-Domain Deployment Strategy

## 📋 Domain Structure

### Frontend Applications
| Application | Domain | Purpose | Environment |
|-------------|--------|---------|-------------|
| **Admin Portal** | `admin.ggwifi.co.tz` | Internal admin management | Production |
| **Customer Portal** | `portal.ggwifi.co.tz` | Customer self-service | Production |
| **Main Website** | `www.ggwifi.co.tz` | Marketing & landing page | Production |
| **API Backend** | `api.ggwifi.co.tz` | REST API services | Production |

### Development/Staging
| Application | Domain | Purpose | Environment |
|-------------|--------|---------|-------------|
| **Admin Portal** | `admin-dev.ggwifi.co.tz` | Development testing | Staging |
| **Customer Portal** | `portal-dev.ggwifi.co.tz` | Development testing | Staging |
| **Main Website** | `dev.ggwifi.co.tz` | Development testing | Staging |
| **API Backend** | `api-dev.ggwifi.co.tz` | Development API | Staging |

## 🏗️ Deployment Architecture

### Cloudflare Pages Setup
Each frontend application will be deployed as a separate Cloudflare Pages project:

```
GitHub Repository Structure:
├── Frontend/
│   ├── admin_portal/          → admin.ggwifi.co.tz
│   ├── customer_portal/       → portal.ggwifi.co.tz
│   └── main_website/          → www.ggwifi.co.tz
├── backend/                   → api.ggwifi.co.tz
└── shared/                    → Common components
```

### Build Configuration

#### Admin Portal (`admin_portal/`)
```yaml
Build Command: npm run build
Output Directory: dist
Root Directory: Frontend/admin_portal
Node Version: 18
Environment Variables:
  - VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
  - VITE_APP_NAME=GGWIFI Admin Portal
  - VITE_APP_DOMAIN=admin.ggwifi.co.tz
```

#### Customer Portal (`customer_portal/`)
```yaml
Build Command: npm run build
Output Directory: dist
Root Directory: Frontend/customer_portal
Node Version: 18
Environment Variables:
  - VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
  - VITE_APP_NAME=GGWIFI Customer Portal
  - VITE_APP_DOMAIN=portal.ggwifi.co.tz
```

#### Main Website (`main_website/`)
```yaml
Build Command: npm run build
Output Directory: dist
Root Directory: Frontend/main_website
Node Version: 18
Environment Variables:
  - VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
  - VITE_APP_NAME=GGWIFI
  - VITE_APP_DOMAIN=www.ggwifi.co.tz
```

## 🔧 GitHub Repository Structure

### Option 1: Monorepo (Recommended)
Single repository with multiple frontend applications:

```
ggwifi-system/
├── .github/
│   └── workflows/
│       ├── deploy-admin.yml
│       ├── deploy-customer.yml
│       ├── deploy-website.yml
│       └── deploy-backend.yml
├── Frontend/
│   ├── admin_portal/
│   ├── customer_portal/
│   └── main_website/
├── backend/
├── shared/
├── docs/
└── scripts/
```

### Option 2: Separate Repositories
Individual repositories for each application:

```
ggwifi-admin-frontend/         → admin.ggwifi.co.tz
ggwifi-customer-frontend/      → portal.ggwifi.co.tz
ggwifi-main-website/           → www.ggwifi.co.tz
ggwifi-backend/                → api.ggwifi.co.tz
```

## 🚀 Deployment Workflow

### 1. Cloudflare Pages Projects
Create separate Cloudflare Pages projects for each frontend:

1. **GGWIFI Admin Portal**
   - Repository: `Frontend/admin_portal/`
   - Domain: `admin.ggwifi.co.tz`
   - Build: `npm run build`

2. **GGWIFI Customer Portal**
   - Repository: `Frontend/customer_portal/`
   - Domain: `portal.ggwifi.co.tz`
   - Build: `npm run build`

3. **GGWIFI Main Website**
   - Repository: `Frontend/main_website/`
   - Domain: `www.ggwifi.co.tz`
   - Build: `npm run build`

### 2. Backend Deployment
Deploy backend to cloud provider (DigitalOcean, AWS, etc.):
- Domain: `api.ggwifi.co.tz`
- SSL Certificate
- Load Balancer
- Database connection

## 🔐 SSL & Security

### SSL Certificates
- All domains will use Cloudflare's SSL certificates
- Automatic HTTPS redirect
- HSTS headers enabled

### CORS Configuration
```javascript
// Backend CORS settings
const corsOrigins = [
  'https://admin.ggwifi.co.tz',
  'https://portal.ggwifi.co.tz',
  'https://www.ggwifi.co.tz',
  'https://ggwifi.co.tz'
];
```

### Security Headers
```yaml
Cloudflare Security Rules:
- WAF Protection: Enabled
- Bot Management: Enabled
- Rate Limiting: Per domain
- DDoS Protection: Enabled
```

## 📊 Monitoring & Analytics

### Cloudflare Analytics
- Page views per domain
- Performance metrics
- Security events
- Bandwidth usage

### Application Monitoring
- Error tracking per application
- Performance monitoring
- User analytics
- API response times

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
    paths:
      - 'Frontend/admin_portal/**'
      - 'Frontend/customer_portal/**'
      - 'Frontend/main_website/**'

jobs:
  deploy-admin:
    if: contains(github.event.head_commit.modified, 'Frontend/admin_portal/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Admin Portal
        run: |
          cd Frontend/admin_portal
          npm install
          npm run build
          # Deploy to Cloudflare Pages

  deploy-customer:
    if: contains(github.event.head_commit.modified, 'Frontend/customer_portal/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Customer Portal
        run: |
          cd Frontend/customer_portal
          npm install
          npm run build
          # Deploy to Cloudflare Pages

  deploy-website:
    if: contains(github.event.head_commit.modified, 'Frontend/main_website/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Main Website
        run: |
          cd Frontend/main_website
          npm install
          npm run build
          # Deploy to Cloudflare Pages
```

## 🌍 Environment Management

### Production Environment
```env
# All production domains
VITE_API_BASE_URL=https://api.ggwifi.co.tz/api/v1
VITE_ENVIRONMENT=production
VITE_APP_DOMAIN=ggwifi.co.tz
```

### Staging Environment
```env
# Development domains
VITE_API_BASE_URL=https://api-dev.ggwifi.co.tz/api/v1
VITE_ENVIRONMENT=staging
VITE_APP_DOMAIN=dev.ggwifi.co.tz
```

## 📝 Next Steps

1. **Create GitHub Repository** with monorepo structure
2. **Set up Cloudflare Pages** for each frontend application
3. **Configure Custom Domains** for each subdomain
4. **Set up CI/CD Pipeline** with GitHub Actions
5. **Deploy Backend** to cloud provider
6. **Configure SSL** and security settings
7. **Set up Monitoring** and analytics

## 🔗 Domain DNS Configuration

### Cloudflare DNS Records
```
Type    Name                    Content
A       @                      [Cloudflare Pages IP]
CNAME   www                    [Cloudflare Pages URL]
CNAME   admin                  [Cloudflare Pages URL]
CNAME   portal                 [Cloudflare Pages URL]
CNAME   api                    [Backend Server IP]
A       api-dev                [Development Server IP]
```

This multi-domain approach ensures:
- ✅ **Separate deployments** for each application
- ✅ **Independent scaling** per domain
- ✅ **Isolated environments** for testing
- ✅ **Professional domain structure**
- ✅ **Easy maintenance** and updates
