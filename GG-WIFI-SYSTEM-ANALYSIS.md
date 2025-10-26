# 🚀 GG-WIFI WEB-APP Complete System Analysis

## 📋 **System Overview**

The GG-WIFI WEB-APP is a comprehensive **Wireless Internet Service Provider (WISP)** platform built with **Spring Boot 3.2.0** and **React**. It consists of **two main frontend portals**:

1. **Admin Portal** (`admin.ggnetworks.com`) - Full administrative control for staff and management
2. **Customer Portal** (`connect.ggnetworks.com`) - Hotspot access and package browsing for end customers

**Note**: The system also supports a **Public Portal** (`ggnetworks.com`) for general website and PPPoE applications, but the core functionality revolves around the two main portals.

---

## 🏗️ **System Architecture**

### **Backend Technology Stack**
- **Spring Boot 3.2.0** with Java 17
- **MySQL Database** with Flyway migrations
- **JWT Authentication** with role-based access control
- **FreeRADIUS Integration** for AAA (Authentication, Authorization, Accounting)
- **MikroTik Router Management** for hotspot and PPPoE delivery
- **ZenoPay Payment Gateway** integration
- **SMS Service** (NEXT SMS API) for notifications

### **Frontend Technology Stack**

#### **Admin Portal Frontend**
- **React 18** with Material-UI (MUI)
- **Vite** for build tooling and development
- **Axios** for HTTP client and API communication
- **Zustand** for state management
- **React Query** for API state management
- **Framer Motion** for animations
- **Responsive Design** (Mobile-first approach)

#### **Customer Portal Frontend (Hotspot)**
- **React 18** with Material-UI (MUI)
- **Vite** for build tooling and development
- **Axios** for HTTP client and API communication
- **Zustand** for state management
- **React Query** for API state management
- **Mobile-optimized** interface for hotspot access
- **Voucher-based** authentication flow
---

## 📊 **Core System Modules**

### **1. 👥 User Management Module**

#### **Entity: User**
```java
// User Roles
SUPER_ADMIN, ADMIN, TECHNICIAN, FINANCE, MARKETING, SALES

// User Status
ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION

// Key Features
- Role-based access control
- Permission management (30+ granular permissions)
- Account lockout after failed attempts
- Email/Phone verification
- Department and position tracking
```

#### **API Endpoints**
```bash
# User Management
GET    /admin/users                    # Get all users with pagination/filtering
POST   /admin/users                    # Create new user
GET    /admin/users/{id}               # Get user by ID
PUT    /admin/users/{id}               # Update user
DELETE /admin/users/{id}               # Delete user
PUT    /admin/users/{username}/role    # Update user role

# User Profile
GET    /admin/profile                  # Get current user profile
```

#### **Request/Response Examples**
```javascript
// Create User Request
POST /admin/users
{
  "username": "john.doe",
  "email": "john@ggwifi.co.tz",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "255123456789",
  "staffId": "EMP001",
  "role": "TECHNICIAN",
  "department": "IT",
  "position": "Network Engineer"
}

// Create User Response
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "id": 1,
    "username": "john.doe",
    "email": "john@ggwifi.co.tz",
    "firstName": "John",
    "lastName": "Doe",
    "role": "TECHNICIAN",
    "status": "ACTIVE",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

---

### **2. 📦 Package Management Module**

#### **Entity: InternetPackage**
```java
// Package Types
HOTSPOT, PPPOE, STATIC_IP, PREMIUM, STUDENT, ENTERPRISE, 
PAY_AS_YOU_GO, RECURRING, TIME_BASED_OFFER

// Package Categories
BASIC, STANDARD, PREMIUM, ENTERPRISE, STUDENT, FAMILY, BUSINESS, OFFER

// Package Status
ACTIVE, INACTIVE, DISCONTINUED, COMING_SOON, MAINTENANCE, SCHEDULED

// Time-Based Offer Features
- Universal packages (available anytime)
- Daily-specific packages (Monday, Tuesday, etc.)
- Weekend-only packages
- Time-restricted packages (specific hours)
- Limited-time offers
```

#### **API Endpoints**
```bash
# Package Management
GET    /admin/packages                 # Get all packages with pagination
POST   /admin/packages                # Create new package
GET    /admin/packages/{id}           # Get package by ID
PUT    /admin/packages/{id}           # Update package
DELETE /admin/packages/{id}           # Delete package
GET    /admin/packages/search         # Search packages
GET    /admin/packages/filter         # Filter packages

# Customer Package Access
GET    /customer-portal/packages      # Get available packages for customers
```

#### **Request/Response Examples**
```javascript
// Create Package Request
POST /admin/packages
{
  "name": "Weekend Special",
  "description": "High-speed weekend package",
  "packageType": "TIME_BASED_OFFER",
  "price": 15000.00,
  "durationDays": 2,
  "dataLimitMb": 2048,
  "isUnlimitedData": false,
  "uploadSpeedMbps": 5,
  "downloadSpeedMbps": 10,
  "isTimeBasedOffer": true,
  "offerType": "WEEKEND_ONLY",
  "availableDays": "[\"SATURDAY\", \"SUNDAY\"]",
  "offerStartTime": "09:00",
  "offerEndTime": "18:00",
  "originalPrice": 20000.00,
  "discountPercentage": 25
}

// Create Package Response
{
  "status": "success",
  "message": "Package created successfully",
  "data": {
    "id": 1,
    "name": "Weekend Special",
    "packageType": "TIME_BASED_OFFER",
    "price": 15000.00,
    "originalPrice": 20000.00,
    "discountPercentage": 25,
    "isTimeBasedOffer": true,
    "offerType": "WEEKEND_ONLY"
  }
}
```

---

### **3. 🎫 Voucher Management Module**

#### **Entity: Voucher**
```java
// Voucher Status
ACTIVE, INACTIVE, EXPIRED, USED, CANCELLED

// Usage Status
UNUSED, USED, EXPIRED, CANCELLED

// Key Features
- 8-digit unique voucher codes
- Package-based voucher generation
- MAC address binding
- Expiration handling
- Usage tracking and statistics
```

#### **API Endpoints**
```bash
# Voucher Management
GET    /api/vouchers                  # Get all vouchers
POST   /api/vouchers                  # Create voucher
GET    /api/vouchers/{id}             # Get voucher by ID
PUT    /api/vouchers/{id}             # Update voucher
DELETE /api/vouchers/{id}             # Delete voucher
GET    /api/vouchers/code/{code}      # Get voucher by code
POST   /api/vouchers/use              # Use voucher
POST   /api/vouchers/activate         # Activate voucher
```

#### **Request/Response Examples**
```javascript
// Use Voucher Request
POST /api/vouchers/use
{
  "voucherCode": "ABC12345",
  "usedByIp": "192.168.1.100",
  "usedByDevice": "iPhone 13"
}

// Use Voucher Response
{
  "status": "success",
  "message": "Voucher used successfully",
  "data": {
    "voucherCode": "ABC12345",
    "packageName": "Premium Monthly",
    "duration": "30 days",
    "expiresAt": "2024-02-15T23:59:59"
  }
}
```

---

### **4. 💳 Payment Management Module**

#### **Entity: Payment**
```java
// Payment Status
PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, REFUNDED

// Payment Methods
MOBILE_MONEY, BANK_TRANSFER, CREDIT_CARD, CASH, VOUCHER

// Key Features
- ZenoPay Mobile Money integration
- Payment webhook handling
- Transaction tracking
- Refund processing
- SMS notifications
```

#### **API Endpoints**
```bash
# Payment Management
GET    /api/payments                  # Get all payments
POST   /api/payments                  # Create payment
GET    /api/payments/{id}             # Get payment by ID
PUT    /api/payments/{id}             # Update payment
DELETE /api/payments/{id}             # Delete payment
POST   /api/payments/process-success  # Process successful payment
POST   /api/payments/process-failure  # Process failed payment

# Customer Payment Processing
POST   /customer-portal/payment       # Process customer payment
POST   /customer-portal/webhook       # Handle ZenoPay webhook
```

#### **Request/Response Examples**
```javascript
// Process Customer Payment Request
POST /customer-portal/payment
{
  "customerName": "John Doe",
  "customerPhone": "255123456789",
  "customerEmail": "john@example.com",
  "packageId": 1,
  "amount": 15000.00,
  "paymentMethod": "MOBILE_MONEY"
}

// Process Customer Payment Response
{
  "status": "success",
  "message": "Payment initiated successfully",
  "data": {
    "orderId": "ORD-20240115-001",
    "voucherCode": "ABC12345",
    "packageName": "Weekend Special",
    "amount": 15000.00,
    "customerPhone": "255123456789",
    "zenopayResponse": {
      "status": "PENDING",
      "transactionId": "TXN123456"
    }
  }
}
```

---

### **5. 🏢 Customer Management Module**

#### **Entity: Customer**
```java
// Customer Status
ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION, 
EXPIRED, CANCELLED, BLACKLISTED, VIP

// Account Types
INDIVIDUAL, BUSINESS, ENTERPRISE, STUDENT, SENIOR_CITIZEN

// Loyalty Status
NEW_CUSTOMER, REGULAR_CUSTOMER, LOYAL_CUSTOMER, VIP_CUSTOMER, 
AT_RISK_CUSTOMER, UNLOYAL_CUSTOMER, CHURNED_CUSTOMER

// Key Features
- Customer profile management
- Loyalty points system
- Balance tracking
- Activity monitoring
```

#### **API Endpoints**
```bash
# Customer Management
GET    /admin/customers                # Get all customers
GET    /admin/customers/{id}           # Get customer by ID
GET    /admin/customers/phone/{phone}  # Get customer by phone
GET    /admin/customers/email/{email}  # Get customer by email
GET    /admin/customers/active         # Get active customers
GET    /admin/customers/statistics     # Get customer statistics
```

#### **Request/Response Examples**
```javascript
// Get Customer Statistics Response
GET /admin/customers/statistics
{
  "status": "success",
  "message": "Customer statistics retrieved successfully",
  "data": {
    "totalCustomers": 1250,
    "activeCustomers": 980,
    "inactiveCustomers": 270,
    "newCustomersToday": 15,
    "vipCustomers": 45,
    "averageSpending": 25000.00
  }
}
```

---

### **6. 🌐 Router Management Module**

#### **Entity: Router**
```java
// Router Status
ONLINE, OFFLINE, MAINTENANCE, ERROR, UNKNOWN

// Router Types
MIKROTIK, CISCO, JUNIPER, HUAWEI, OTHER

// Key Features
- Multi-router support
- MikroTik API integration
- Real-time monitoring
- Configuration management
- Health checks and alerts
```

#### **API Endpoints**
```bash
# Router Management
GET    /admin/routers                  # Get all routers
GET    /admin/routers/status           # Get router status
POST   /admin/routers/{id}/configure   # Configure router

# MikroTik Integration
POST   /radius/users                   # Add RADIUS user
DELETE /radius/users/{username}        # Remove RADIUS user
POST   /radius/authenticate            # Authenticate user
GET    /radius/sessions                # Get active sessions
POST   /radius/accounting/start        # Start accounting session
POST   /radius/accounting/stop         # Stop accounting session
```

#### **Request/Response Examples**
```javascript
// Add RADIUS User Request
POST /radius/users
{
  "username": "customer001",
  "password": "securepass123",
  "userType": "HOTSPOT"
}

// Add RADIUS User Response
{
  "status": "success",
  "message": "RADIUS user added successfully",
  "data": {
    "username": "customer001",
    "userType": "HOTSPOT",
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

---

### **7. 💰 Financial Management Module**

#### **Entities: Budget, Expense, Profit, Salary**
```java
// Budget Categories
OPERATIONAL, EQUIPMENT, MAINTENANCE, UTILITIES, RENT, SALARIES, 
MARKETING, TRANSPORT, COMMUNICATION, INSURANCE, TAXES, LEGAL

// Expense Status
PENDING, APPROVED, REJECTED, PAID, OVERDUE, CANCELLED

// Profit Status
PENDING, CALCULATED, REVIEWED, APPROVED, FINALIZED

// Salary Status
PENDING, APPROVED, PROCESSED, PAID, CANCELLED, ON_HOLD
```

#### **API Endpoints**
```bash
# Financial Dashboard
GET    /admin/dashboard/finance        # Get finance dashboard
GET    /api/v1/finance/dashboard       # Financial dashboard
POST   /api/v1/finance/transactions/{id}/approve  # Approve transaction

# Budget Management
GET    /api/budgets                    # Get all budgets
POST   /api/budgets                    # Create budget
PUT    /api/budgets/{id}               # Update budget

# Expense Management
GET    /api/expenses                   # Get all expenses
POST   /api/expenses                   # Create expense
PUT    /api/expenses/{id}              # Update expense

# Salary Management
GET    /api/salaries                   # Get all salaries
POST   /api/salaries                   # Create salary record
PUT    /api/salaries/{id}              # Update salary
```

#### **Request/Response Examples**
```javascript
// Finance Dashboard Response
GET /admin/dashboard/finance
{
  "status": "success",
  "data": {
    "kpis": {
      "dailyRevenue": {
        "value": "TZS 125,000",
        "subtitle": "Today's income",
        "trend": "up",
        "trendValue": 15.5,
        "icon": "attach_money",
        "color": "#4CAF50"
      },
      "monthlyRevenue": {
        "value": "TZS 3,750,000",
        "subtitle": "This month",
        "trend": "up",
        "trendValue": 8.3,
        "icon": "trending_up",
        "color": "#4CAF50"
      },
      "successRate": {
        "value": "97.5%",
        "subtitle": "Payment success",
        "trend": "up",
        "trendValue": 2.5,
        "icon": "check",
        "color": "#4CAF50"
      }
    },
    "role": "FINANCE",
    "lastUpdated": "2024-01-15T10:30:00"
  }
}
```

---

### **8. 🔐 Authentication & Security Module**

#### **Key Features**
- JWT-based authentication
- Role-based access control
- Permission management
- Session management
- Account lockout protection
- Password hashing (BCrypt)
- CORS configuration
- XSS protection

#### **API Endpoints**
```bash
# Authentication
POST   /auth/login                     # User login
POST   /auth/admin-login               # Admin login
POST   /auth/staff-login               # Staff login
POST   /auth/register                  # User registration
POST   /auth/refresh                    # Refresh token
POST   /auth/logout                     # Logout

# OTP Management
POST   /auth/otp/generate              # Generate OTP
POST   /auth/otp/validate              # Validate OTP
POST   /auth/otp/resend                # Resend OTP

# Test Endpoints
GET    /test/hash-password             # Test password hashing
```

#### **Request/Response Examples**
```javascript
// Admin Login Request
POST /auth/admin-login
{
  "username": "admin",
  "phoneNumber": "255123456789",
  "password": "admin123"
}

// Admin Login Response
{
  "status": "success",
  "message": "Admin login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "firstName": "System",
      "lastName": "Administrator",
      "role": "ADMIN",
      "permissions": [
        "USER_CREATE", "USER_READ", "USER_UPDATE", "USER_DELETE",
        "PACKAGE_CREATE", "PACKAGE_READ", "PACKAGE_UPDATE", "PACKAGE_DELETE",
        "VOUCHER_CREATE", "VOUCHER_READ", "VOUCHER_UPDATE", "VOUCHER_DELETE",
        "ROUTER_CREATE", "ROUTER_READ", "ROUTER_UPDATE", "ROUTER_DELETE",
        "FINANCE_CREATE", "FINANCE_READ", "FINANCE_UPDATE", "FINANCE_DELETE",
        "ANALYTICS_READ", "SYSTEM_MONITOR"
      ]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🎯 **Role-Based Access Control**

### **Permission System**
The system implements a granular permission system with 30+ permissions:

```javascript
// Permission Categories
USER_CREATE, USER_READ, USER_UPDATE, USER_DELETE
PACKAGE_CREATE, PACKAGE_READ, PACKAGE_UPDATE, PACKAGE_DELETE
VOUCHER_CREATE, VOUCHER_READ, VOUCHER_UPDATE, VOUCHER_DELETE
ROUTER_CREATE, ROUTER_READ, ROUTER_UPDATE, ROUTER_DELETE, ROUTER_CONFIGURE
FINANCE_CREATE, FINANCE_READ, FINANCE_UPDATE, FINANCE_DELETE, FINANCE_APPROVE
MARKETING_CREATE, MARKETING_READ, MARKETING_UPDATE, MARKETING_DELETE, MARKETING_SEND
SALES_CREATE, SALES_READ, SALES_UPDATE, SALES_DELETE
CUSTOMER_READ, CUSTOMER_UPDATE
ANALYTICS_READ, ANALYTICS_EXPORT
SYSTEM_CONFIGURE, SYSTEM_MONITOR
```

### **Role Permissions**
```javascript
// SUPER_ADMIN: All permissions (30+)
// ADMIN: Most permissions except system configuration
// TECHNICIAN: Router and system monitoring permissions
// FINANCE: Financial and customer permissions
// MARKETING: Marketing and customer permissions
// SALES: Sales and customer permissions
```

---

## 📱 **Frontend Implementation Guide**

### **Two-Portal Architecture**

The GG-WIFI WEB-APP consists of **two distinct frontend applications**:

#### **1. Admin Portal** (`Frontend/admin_portal/`)
- **Purpose**: Administrative control for staff and management
- **Users**: Admin, Technician, Finance, Marketing, Sales roles
- **Features**: User management, package management, router monitoring, financial reports, analytics
- **Authentication**: JWT-based with role-based permissions
- **Technology**: React + Vite + MUI + Axios + Zustand + React Query

#### **2. Customer Portal** (`Frontend/customer_portal/`)
- **Purpose**: Hotspot access and package browsing for end customers
- **Users**: End customers accessing WiFi hotspots
- **Features**: Package browsing, payment processing, voucher redemption, hotspot login
- **Authentication**: Voucher-based or phone number-based
- **Technology**: React + Vite + MUI + Axios + Zustand + React Query

### **API Client Setup**
```javascript
// API Client Configuration
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### **Authentication Store (Zustand)**
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      permissions: [],

      // Actions
      login: async (credentials) => {
        const response = await apiClient.post('/auth/admin-login', credentials);
        if (response.data.status === 'success') {
          const { user, token } = response.data.data;
          set({ user, token, isAuthenticated: true, permissions: user.permissions });
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, permissions: [] });
        delete apiClient.defaults.headers.common['Authorization'];
      },

      hasPermission: (permission) => {
        return get().permissions.includes(permission);
      }
    }),
    { name: 'auth-storage' }
  )
);
```

### **API Service Examples**
```javascript
// User Management API
export const userAPI = {
  getAllUsers: (params = {}) => apiClient.get('/admin/users', { params }),
  createUser: (userData) => apiClient.post('/admin/users', userData),
  updateUser: (userId, userData) => apiClient.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
};

// Package Management API
export const packageAPI = {
  getAllPackages: (params = {}) => apiClient.get('/admin/packages', { params }),
  createPackage: (packageData) => apiClient.post('/admin/packages', packageData),
  updatePackage: (packageId, packageData) => apiClient.put(`/admin/packages/${packageId}`, packageData),
  deletePackage: (packageId) => apiClient.delete(`/admin/packages/${packageId}`),
};

// Payment API
export const paymentAPI = {
  processPayment: (paymentData) => apiClient.post('/customer-portal/payment', paymentData),
  getPayments: (params = {}) => apiClient.get('/api/payments', { params }),
};
```

### **React Component Examples**
```javascript
// User Management Component
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../api/userAPI';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch users with React Query
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users', page, rowsPerPage, searchTerm],
    queryFn: () => userAPI.getAllUsers({
      page,
      size: rowsPerPage,
      search: searchTerm
    }),
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: userAPI.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  const handleCreateUser = (userData) => {
    createUserMutation.mutate(userData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* User management UI */}
    </div>
  );
};
```

---

## 🚀 **Deployment & Production**

### **Environment Configuration**
```bash
# Application Properties
spring.datasource.url=jdbc:mysql://localhost:3306/ggnetworks
spring.datasource.username=ggnetworks
spring.datasource.password=secure_password

# JWT Configuration
jwt.secret=your-super-secret-jwt-key
jwt.expiration=28800000
jwt.refresh-expiration=604800000

# ZenoPay Configuration
zenopay.api.base-url=https://zenoapi.com
zenopay.api.api-key=your-zenopay-api-key

# SMS Configuration
sms.api.url=https://api.nextsms.co.tz
sms.api.username=your-sms-username
sms.api.password=your-sms-password
```

### **Database Migration**
```bash
# Run Flyway migrations
mvn flyway:migrate

# Or with Spring Boot
java -jar ggnetworks-backend.jar --spring.profiles.active=production
```

### **Frontend Build**

#### **Admin Portal Build**
```bash
# Build Admin Portal
cd Frontend/admin_portal
npm run build

# Serve with nginx
sudo cp -r dist/* /var/www/html/admin/
```

#### **Customer Portal Build**
```bash
# Build Customer Portal
cd Frontend/customer_portal
npm run build

# Serve with nginx
sudo cp -r dist/* /var/www/html/customer/
```

#### **Nginx Configuration**
```nginx
# Admin Portal
server {
    listen 80;
    server_name admin.ggnetworks.com;
    root /var/www/html/admin;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Customer Portal
server {
    listen 80;
    server_name connect.ggnetworks.com;
    root /var/www/html/customer;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📊 **System Statistics**

### **Database Tables**
- **32 Entity Tables** (Users, Packages, Vouchers, Payments, etc.)
- **32 Repository Interfaces** for data access
- **15 Service Classes** for business logic
- **12 Controller Classes** for API endpoints

### **API Endpoints**
- **88+ REST Endpoints** across all modules
- **Role-based access control** on all admin endpoints
- **Comprehensive error handling** and validation
- **Real-time data** with pagination and filtering

### **Frontend Components**

#### **Admin Portal Components**
- **15+ React Pages** for administrative modules
- **Material-UI Components** for consistent design
- **Responsive Design** for desktop and mobile
- **State Management** with Zustand and React Query
- **Role-based UI** rendering based on permissions

#### **Customer Portal Components**
- **10+ React Pages** for customer-facing features
- **Mobile-optimized** Material-UI components
- **Voucher-based** authentication flow
- **Payment processing** interface
- **Hotspot login** and package browsing

---

## 🎯 **Key Features Summary**

### **✅ Production-Ready Features**
- **Complete User Management** with role-based access
- **Package Management** with time-based offers
- **Voucher System** with usage tracking
- **Payment Processing** with ZenoPay integration
- **Router Management** with MikroTik API
- **Customer Portal** with package browsing
- **Financial Management** with budgeting
- **SMS Notifications** with NEXT SMS API
- **Real-time Dashboard** with KPIs
- **Security Features** with JWT and permissions

### **🔧 Technical Excellence**
- **Enterprise-grade architecture**
- **Scalable database design**
- **Comprehensive API documentation**
- **Mobile-responsive frontend**
- **Production-ready deployment**
- **Security best practices**
- **Error handling and logging**
- **Performance optimization**

---

## 🚀 **Getting Started**

### **Backend Setup**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### **Frontend Setup**

#### **Admin Portal Setup**
```bash
cd Frontend/admin_portal
npm install
npm run dev
```

#### **Customer Portal Setup**
```bash
cd Frontend/customer_portal
npm install
npm run dev
```

### **Default Admin Credentials**
- **Username**: admin
- **Password**: admin123
- **Phone**: 0676591880

---

**The GG-WIFI WEB-APP is a complete, production-ready WISP platform with two distinct frontend portals (Admin Portal and Customer Portal), enterprise-grade features, and comprehensive API endpoints for easy frontend implementation.**
