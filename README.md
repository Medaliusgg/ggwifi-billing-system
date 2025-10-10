# 🌐 GGWIFI - Professional WiFi Hotspot Management System

A comprehensive WiFi hotspot billing and management system built with modern technologies.

## 🚀 Live Demo

- **Frontend**: https://ggwifi.co.tz (Coming Soon)
- **Backend API**: https://api.ggwifi.co.tz (Coming Soon)

## 🏗️ Architecture

### Frontend (Admin Portal)
- **React 18** with Vite for fast development
- **Material-UI (MUI)** for professional UI components
- **TailwindCSS** for custom styling
- **React Router** for navigation
- **Axios** for API communication
- **Zustand** for state management
- **Framer Motion** for animations

### Backend
- **Java Standalone Server** (Development)
- **Spring Boot** (Production Ready)
- **MySQL** database with complete schema
- **FreeRADIUS** integration for WiFi authentication
- **MikroTik Router** management via API
- **JWT Authentication** with BCrypt password hashing

## 🎯 Features

### 🔐 Authentication & Security
- JWT-based authentication
- BCrypt password hashing
- Role-based access control (Admin, Hotspot User, PPPoE User)
- Session management with refresh tokens

### 📊 Admin Dashboard
- Real-time system statistics
- User management
- Router monitoring and control
- Package management
- Financial reporting
- Voucher generation and tracking

### 🌐 WiFi Hotspot Management
- MikroTik router integration
- FreeRADIUS authentication
- Voucher-based access control
- Session monitoring
- Bandwidth management

### 💰 Billing & Payments
- Multiple package types (Hotspot, PPPoE)
- Voucher generation (manual and automatic)
- Payment integration ready
- Revenue tracking

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18 + Vite | Modern UI development |
| **UI Library** | Material-UI v6 | Professional components |
| **Styling** | TailwindCSS | Custom styling |
| **State** | Zustand | Global state management |
| **HTTP Client** | Axios | API communication |
| **Backend** | Java + Spring Boot | RESTful API |
| **Database** | MySQL 8.0 | Data persistence |
| **Authentication** | FreeRADIUS | WiFi user authentication |
| **Router Management** | MikroTik API | Network device control |

## 📁 Project Structure

```
GG-WIFI WEB-APP/
├── Frontend/
│   ├── admin_portal/          # React admin dashboard
│   ├── customer_portal/       # Customer-facing portal
│   └── main_website/          # Marketing website
├── backend/                   # Java backend services
│   ├── src/main/java/        # Java source code
│   ├── src/main/resources/   # Configuration files
│   └── pom.xml              # Maven dependencies
├── database/                 # Database schemas and migrations
├── docs/                    # Documentation
└── scripts/                 # Deployment and utility scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Java 17+ and Maven
- MySQL 8.0+
- FreeRADIUS (for WiFi authentication)

### Frontend Development
```bash
cd Frontend/admin_portal
npm install
npm run dev
```

### Backend Development
```bash
cd backend
mvn clean compile
java -cp ".:$(find ~/.m2/repository -name "*.jar" | tr '\n' ':')" StandaloneServer
```

### Database Setup
```bash
mysql -u root -p
CREATE DATABASE ggwifi;
USE ggwifi;
source database/schema.sql;
```

## 🔧 Configuration

### Environment Variables
Create `.env` files in each frontend project:

```env
VITE_API_BASE_URL=http://localhost:8082/api/v1
VITE_APP_NAME=GGWIFI Admin Portal
```

### Database Configuration
Update `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ggwifi
    username: your_username
    password: your_password
```

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token

### Dashboard
- `GET /api/v1/dashboard` - System statistics

### User Management
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Router Management
- `GET /api/v1/routers` - List routers
- `POST /api/v1/routers` - Add router
- `PUT /api/v1/routers/{id}` - Update router
- `DELETE /api/v1/routers/{id}` - Remove router

## 🔐 Default Credentials

### Admin Access
- **Phone**: 0773404760
- **Password**: Ashruha@123%

## 🌐 Deployment

### Cloudflare Pages (Frontend)
1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy with custom domain

### Backend Deployment
1. Build Spring Boot application
2. Deploy to cloud provider (AWS, DigitalOcean, etc.)
3. Configure database and environment variables
4. Set up reverse proxy (Nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary software developed for GGWIFI.

## 📞 Support

For support and questions:
- Email: support@ggwifi.co.tz
- Website: https://ggwifi.co.tz

---

**Built with ❤️ for GGWIFI - Professional WiFi Solutions**
# ggwifi-billing-system
# ggwifi-billing-system
