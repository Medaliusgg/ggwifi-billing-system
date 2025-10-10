# 🚀 GGNetworks Admin Portal - Cursor AI Development Prompt

## 📋 Project Overview

Build a comprehensive **Admin Portal** for **GGNetworks** centralized ISP system that manages Hotspot and PPPoE services across multiple MikroTik routers and sites. The portal should be built with **ReactJS + Vite + MUI + Emotion**, optimized for mobile and legacy support.

**Domain**: `admin.ggnetworks.com`
**Tech Stack**: React 18, TypeScript, Vite, Material-UI v5, Emotion, React Router v6, React Query, Framer Motion, Notistack

---

## 🎯 Core Features to Implement

### 🔐 **Authentication & Authorization**
- [ ] Role-based access control (single Admin role)
- [ ] Secure login/logout with session timeout (30 minutes)
- [ ] OTP-based critical action confirmation
- [ ] Encrypted token storage (JWT)
- [ ] Central admin access to all subdomain data (hotspot, PPPoE, website)
- [ ] Password strength requirements
- [ ] Failed login attempt tracking
- [ ] Session management with refresh tokens

### 📡 **Router & Network Infrastructure Management**
- [ ] Add/edit/remove MikroTik routers
- [ ] Assign routers to locations/sites
- [ ] View router health (online/offline) with real-time status
- [ ] Assign PPPoE or Hotspot function per router
- [ ] View RADIUS connection logs
- [ ] Integrate new routers via secure provisioning tunnel (WireGuard/IPSec)
- [ ] View real-time connected users per router
- [ ] Router performance metrics (CPU, memory, bandwidth)
- [ ] Bulk router operations
- [ ] Router configuration backup/restore

### 🌐 **Hotspot User Management**
- [ ] Generate, activate, deactivate vouchers
- [ ] View active sessions, expired vouchers
- [ ] Time tracking and session logs
- [ ] Auto-kick idle or expired sessions
- [ ] Usage analytics: time/data spent
- [ ] QR code voucher generation
- [ ] Loyalty bonus configurations (birthday, referral)
- [ ] Bulk voucher generation
- [ ] Voucher template management
- [ ] Session monitoring dashboard

### 🏢 **PPPoE User Management**
- [ ] Approve user applications
- [ ] Assign packages (1, 3, 6 months) with auto-expiry
- [ ] Grant free month for 6+ month subscriptions
- [ ] View user installation status (Request → Survey → Installed)
- [ ] Real-time session logs via RADIUS
- [ ] Update package plans or renewal status
- [ ] Customer KYC view (full profile + history)
- [ ] MAC address/device binding for account
- [ ] Customer support ticket system
- [ ] Installation scheduling

### 💳 **Finance & Payments**
- [ ] View total revenue: Hotspot vs PPPoE
- [ ] View all user transactions
- [ ] Track mobile money payments (Selcom integration)
- [ ] Auto-generate receipts/invoices
- [ ] Commission configurations (referrals, bonus)
- [ ] Refund handling
- [ ] Payment gateway management
- [ ] Financial reporting and analytics
- [ ] Tax calculation and reporting

### 📍 **Location Management**
- [ ] Add/edit/remove locations (towers, streets)
- [ ] Assign routers to locations
- [ ] Visual mapping of router locations
- [ ] Site-wise performance and user statistics
- [ ] Location-based analytics
- [ ] Coverage area management
- [ ] Location hierarchy (City → District → Street)

### 🧠 **Analytics & Reports**
- [ ] User growth (Hotspot & PPPoE)
- [ ] Revenue trends and forecasts
- [ ] Session trends (daily/weekly/monthly)
- [ ] User retention vs churn
- [ ] High-usage users / top customers
- [ ] Export data in CSV/Excel
- [ ] Dashboard overview cards (Revenue, Users, Routers Online)
- [ ] Custom report builder
- [ ] Scheduled report generation
- [ ] Real-time analytics dashboard

### 📣 **Marketing & Messaging**
- [ ] SMS campaign builder (bound to verified phone numbers)
- [ ] Win-back campaign for inactive users
- [ ] Birthday voucher delivery
- [ ] Flash sale alerts
- [ ] Personalized upsell offers
- [ ] Push notifications integration
- [ ] Branding: customize login banners, voucher messages
- [ ] Email marketing integration
- [ ] Campaign performance tracking

### ⚙️ **System Configuration**
- [ ] Package management (Hotspot & PPPoE)
- [ ] Time-based or data-based configuration
- [ ] Session timeout settings
- [ ] Auto-connect rules
- [ ] SMS gateway configuration
- [ ] SELCOM API setup & testing
- [ ] Set global voucher prefixes
- [ ] Enable/disable marketing campaigns
- [ ] System backup and restore
- [ ] Environment configuration management

### 👥 **User Insights & Logs**
- [ ] User device history (based on MAC binding)
- [ ] IP logs, MAC logs
- [ ] Access logs (login/logout, actions taken)
- [ ] Support request tracking
- [ ] Blocked/blacklisted device list
- [ ] Device type statistics (smartphone, laptop, etc.)
- [ ] User behavior analytics
- [ ] Security audit logs

### 📁 **File & Resource Management**
- [ ] Upload & manage downloadable forms (PPPoE request, guides)
- [ ] Image/media management for the public site
- [ ] Document version control
- [ ] File access permissions
- [ ] Storage quota management

### 🛡️ **Security & Monitoring**
- [ ] Detect MAC randomization attempts
- [ ] Real-time admin alerts (router offline, payment failure)
- [ ] Session enforcement from RADIUS
- [ ] Audit trails of all admin actions
- [ ] Admin-only access to router provisioning
- [ ] Two-factor authentication
- [ ] IP whitelisting
- [ ] Security incident response

---

## 🏗️ Technical Architecture

### **Project Structure**
```
src/
├── components/
│   ├── common/
│   │   ├── Layout/
│   │   ├── Navigation/
│   │   ├── Forms/
│   │   └── Charts/
│   ├── features/
│   │   ├── Authentication/
│   │   ├── RouterManagement/
│   │   ├── HotspotManagement/
│   │   ├── PPPoEManagement/
│   │   ├── Finance/
│   │   ├── Analytics/
│   │   ├── Marketing/
│   │   └── Settings/
│   └── pages/
├── hooks/
├── services/
├── utils/
├── types/
├── constants/
└── assets/
```

### **State Management**
- React Query for server state
- Context API for global state
- Local state with useState/useReducer
- Zustand for complex state (optional)

### **API Integration**
- RESTful API with axios
- WebSocket for real-time updates
- File upload with progress tracking
- Error handling and retry logic

### **UI/UX Requirements**
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Lazy loading, code splitting
- **Theme**: Custom Material-UI theme with GGNetworks branding
- **Animations**: Smooth transitions with Framer Motion
- **Loading States**: Skeleton loaders and progress indicators

---

## 🎨 Design System

### **Color Palette**
```css
/* Primary Colors */
--primary-main: #1976d2;
--primary-light: #42a5f5;
--primary-dark: #1565c0;

/* Secondary Colors */
--secondary-main: #dc004e;
--secondary-light: #ff5983;
--secondary-dark: #9a0036;

/* Success/Error/Warning */
--success-main: #2e7d32;
--error-main: #d32f2f;
--warning-main: #ed6c02;
--info-main: #0288d1;

/* Neutral Colors */
--grey-50: #fafafa;
--grey-100: #f5f5f5;
--grey-200: #eeeeee;
--grey-300: #e0e0e0;
--grey-400: #bdbdbd;
--grey-500: #9e9e9e;
--grey-600: #757575;
--grey-700: #616161;
--grey-800: #424242;
--grey-900: #212121;
```

### **Typography**
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono (for code/logs)
- **Font Sizes**: 12px, 14px, 16px, 20px, 24px, 32px, 48px

### **Spacing System**
- **Base Unit**: 8px
- **Spacing Scale**: 8px, 16px, 24px, 32px, 40px, 48px, 64px

### **Component Library**
- **Buttons**: Primary, Secondary, Text, Icon buttons
- **Cards**: Elevated, Outlined, Interactive
- **Forms**: Text fields, Selects, Checkboxes, Radio buttons
- **Tables**: Sortable, Filterable, Paginated
- **Charts**: Line, Bar, Pie, Area charts
- **Modals**: Confirmation, Form, Preview modals

---

## 📱 Mobile Optimization

### **Responsive Breakpoints**
```css
/* Mobile First */
xs: 0px      /* Mobile */
sm: 600px    /* Tablet */
md: 900px    /* Small Desktop */
lg: 1200px   /* Desktop */
xl: 1536px   /* Large Desktop */
```

### **Mobile-Specific Features**
- Touch-friendly interface
- Swipe gestures for navigation
- Bottom navigation for mobile
- Collapsible sidebars
- Optimized forms for mobile input
- Mobile-specific charts and tables

---

## 🔧 Development Guidelines

### **Code Quality**
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb config with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks
- **Testing**: Jest + React Testing Library

### **Performance**
- **Bundle Size**: < 500KB gzipped
- **Lighthouse Score**: > 90
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s

### **Security**
- **Input Validation**: Client and server-side
- **XSS Protection**: Sanitize user inputs
- **CSRF Protection**: Token-based
- **Content Security Policy**: Strict CSP headers
- **HTTPS Only**: All communications encrypted

### **Error Handling**
- **Global Error Boundary**: Catch and display errors
- **API Error Handling**: Consistent error messages
- **Offline Support**: Service worker for caching
- **Retry Logic**: Automatic retry for failed requests

---

## 🚀 Implementation Priority

### **Phase 1: Core Infrastructure (Week 1-2)**
1. Project setup with Vite + TypeScript
2. Authentication system
3. Basic layout and navigation
4. Dashboard with overview cards
5. Router management (CRUD operations)

### **Phase 2: User Management (Week 3-4)**
1. Hotspot voucher management
2. PPPoE user management
3. Customer profiles and KYC
4. Session monitoring
5. Device management

### **Phase 3: Analytics & Finance (Week 5-6)**
1. Analytics dashboard
2. Financial reporting
3. Payment integration
4. Revenue tracking
5. Export functionality

### **Phase 4: Advanced Features (Week 7-8)**
1. Marketing campaigns
2. Location management
3. System configuration
4. Security features
5. Mobile optimization

### **Phase 5: Polish & Testing (Week 9-10)**
1. Performance optimization
2. Accessibility improvements
3. Comprehensive testing
4. Documentation
5. Deployment preparation

---

## 📊 Success Metrics

### **Technical Metrics**
- **Performance**: Lighthouse score > 90
- **Accessibility**: WCAG 2.1 AA compliance
- **Code Coverage**: > 80% test coverage
- **Bundle Size**: < 500KB gzipped
- **Load Time**: < 3 seconds

### **User Experience Metrics**
- **Task Completion**: > 95% success rate
- **Error Rate**: < 2% user errors
- **Navigation**: < 3 clicks to complete tasks
- **Mobile Usability**: > 90% mobile satisfaction

### **Business Metrics**
- **Admin Efficiency**: 50% reduction in manual tasks
- **Response Time**: < 30 seconds for critical operations
- **Data Accuracy**: > 99% data integrity
- **System Uptime**: > 99.9% availability

---

## 🎯 Next Steps

1. **Set up the development environment** with Vite + TypeScript
2. **Create the project structure** following the architecture
3. **Implement the authentication system** with JWT
4. **Build the core layout and navigation**
5. **Develop the dashboard with overview cards**
6. **Implement router management features**
7. **Add user management capabilities**
8. **Integrate analytics and reporting**
9. **Implement payment and finance features**
10. **Add advanced features and optimizations**

---

**Ready to start building the GGNetworks Admin Portal? Let's create a world-class ISP management system! 🚀** 