# GG Wi-Fi Customer Portal - Complete Documentation

## 📋 Table of Contents
1. [Design System & Color Theme](#design-system--color-theme)
2. [Features Overview](#features-overview)
3. [Activity Workflow](#activity-workflow)
4. [Technical Architecture](#technical-architecture)
5. [Component Structure](#component-structure)

---

## 🎨 Design System & Color Theme

### Primary Brand Colors (Core Identity)
The GG Wi-Fi brand uses a **Golden Yellow** theme as its primary identity:

- **Primary Gold**: `#F2C94C` - Main brand yellow (used for buttons, headers, highlights)
- **Primary Gold Dark**: `#E0B335` - Hover/active states
- **Primary Gold Light**: `#F8D97A` - Lighter variations
- **Text on Gold**: `#000000` (Deep Black) - All text on yellow backgrounds

### Secondary UI Colors (Supportive Only)
These are used for package categorization and UI elements, but never override the primary brand:

- **Blue** (`#3A8DFF`): Universal packages, trust badges, info states
- **Green** (`#10B981`): Success states, offer packages
- **Orange** (`#FF8A3D`): Alerts, offer banners, warning states
- **Purple** (`#A855F7`): Premium plans
- **Red** (`#EF4444`): Error states

### Neutral Colors
- **White**: `#FFFFFF` - Background and cards
- **Black**: `#0A0A0A` - Primary text
- **Gray Scale**: 
  - `#FAFAFA` (neutral-50)
  - `#F6F6F6` (neutral-100)
  - `#EEEEEE` (neutral-200)
  - `#E0E0E0` (neutral-300)
  - `#666666` (neutral-600)

### Typography
- **Font Family**: `Inter` (primary), fallback to system fonts
- **Font Weights**: 300, 400, 500, 600, 700
- **Headings**: 
  - H1: 28px, weight 700
  - H2: 22px, weight 600
  - H3: 18px, weight 600
  - H4: 16px, weight 600
- **Body**: 14px (body1), 12px (body2)

### Design Principles
1. **Brand Consistency**: Golden yellow (`#F2C94C`) is the primary brand color used throughout
2. **Clean & Modern**: White backgrounds with subtle shadows
3. **Accessibility**: High contrast (black text on yellow/white)
4. **Responsive**: Mobile-first design with breakpoints
5. **Smooth Animations**: Framer Motion for page transitions

### Border Radius
- Small: `8px` (--radius-sm)
- Medium: `12px` (--radius-md) - Default for buttons, inputs
- Large: `16px` (--radius-lg) - Cards, modals

### Shadows
- Extra Small: `0 1px 2px rgba(0,0,0,0.04)`
- Small: `0 4px 12px rgba(0,0,0,0.06)` - Default for cards
- Large: `0 12px 36px rgba(0,0,0,0.10)` - Modals, elevated elements

### Focus States
- Gold focus ring: `0 0 0 3px rgba(242, 201, 76, 0.35)`
- All interactive elements have visible focus states

---

## ✨ Features Overview

### 1. **Authentication System**
- **PIN Login**: 4-digit PIN authentication
- **OTP Login**: One-time password via SMS
- **Voucher Login**: Quick access using voucher codes
- **Signup Flow**: 
  - Phone number verification
  - OTP verification
  - User details collection (name, email, PIN)
  - Referral code support

### 2. **Dashboard**
- **Welcome Section**: Personalized greeting with user avatar
- **Active Session Display**: 
  - Real-time countdown timer
  - Download/Upload usage statistics
  - Session type indicator
  - Disconnect functionality
- **Quick Actions**:
  - Voucher Code entry
  - Access Code entry
- **Suggested Packages**: Top 4 recommended packages
- **Statistics Cards**:
  - GG Points (Loyalty points)
  - Lifetime Spend
  - Active Sessions count
  - Redeemed Rewards

### 3. **Package Management**
- **Package Discovery**: Browse available Wi-Fi packages
- **Package Categories**:
  - Universal Packages (Blue theme)
  - Offer Packages (Orange theme)
  - Premium Plans (Purple theme)
- **Package Details**:
  - Price (TZS)
  - Duration
  - Data limits
  - Speed specifications
  - Package descriptions
- **Purchase Flow**: Direct navigation to purchase page

### 4. **Session Management**
- **Active Sessions**: View all connected devices
- **Session History**: Past connection records
- **Session Statistics**:
  - Data usage (Download/Upload)
  - Session duration
  - IP addresses
  - Device information
- **Disconnect**: Manual session termination

### 5. **Purchase & Payment**
- **Purchase History**: All past transactions
- **Payment Methods**: Multiple payment options
- **Order Details**: Individual purchase information
- **Payment Status**: Real-time payment tracking
- **SELCOM Integration**: Payment gateway integration

### 6. **Loyalty & Rewards**
- **GG Points System**: Earn points on purchases
- **Loyalty Tiers**: Tier-based rewards system
- **Reward Products**: Redeemable items catalog
- **Reward Orders**: History of redeemed rewards
- **Referral System**: Share and earn referral bonuses
- **Free Trial**: 20-minute free trial voucher for new users

### 7. **Connections Page**
- **Connection History**: Past Wi-Fi connections
- **Connection Statistics**: Usage analytics
- **Device Management**: Track connected devices

### 8. **Marketing Features**
- **Campaign Carousel**: Promotional banners
- **Marketing Campaigns**: Dynamic campaign display
- **Quick Actions Grid**: Featured actions
- **Value Strips**: Highlighted benefits

### 9. **User Profile**
- **Profile Information**: Name, phone, email
- **Avatar Display**: User initials in golden circle
- **Loyalty Status**: Current tier and points
- **Account Settings**: Profile management

### 10. **Navigation**
- **Global Header**: 
  - Logo (GG Wi-Fi)
  - WhatsApp contact button
  - Phone contact button
  - Account menu
- **Sticky Bottom Navigation** (Mobile):
  - Home/Dashboard
  - Wi-Fi Plans
  - Connections
  - Purchases
  - Rewards

---

## 🔄 Activity Workflow

### Authentication Flow

#### 1. **Landing Page** (`/home`)
```
User arrives → Sees marketing content → Clicks "Login" or "Sign Up"
```

#### 2. **Login Options**
```
┌─────────────────────────────────────┐
│  Login Page (/login)                │
├─────────────────────────────────────┤
│  Option A: PIN Login                │
│  - Enter phone number               │
│  - Enter 4-digit PIN                │
│  - Submit → Dashboard               │
│                                     │
│  Option B: OTP Login                │
│  - Click "Use one-time PIN"         │
│  - Navigate to /otp-login          │
│  - Enter phone → Receive OTP        │
│  - Enter OTP → Verify → Dashboard   │
│                                     │
│  Option C: Voucher Login            │
│  - Navigate to /voucher-login       │
│  - Enter voucher code               │
│  - Validate → Access granted       │
└─────────────────────────────────────┘
```

#### 3. **Signup Flow**
```
Step 1: Phone Entry (/signup/phone)
  → Enter phone number
  → Request OTP
  ↓
Step 2: OTP Verification (/signup/verify)
  → Enter OTP code
  → Verify OTP
  → Receive signup token
  ↓
Step 3: User Details (/signup/details)
  → Enter first name, last name
  → Enter email (optional)
  → Create 4-digit PIN
  → Enter referral code (optional)
  → Submit → Create account
  ↓
Step 4: Welcome & Rewards
  → Redirect to dashboard
  → Show welcome message
  → Display free trial voucher
  → Show earned rewards (voucher + points)
```

### Post-Authentication Flow

#### 4. **Dashboard Access** (`/dashboard`)
```
User logs in → Token stored in localStorage
  ↓
Protected Route Check:
  - Token exists? → Allow access
  - No token? → Redirect to /login
  ↓
Dashboard Loads:
  1. Fetch user profile
  2. Fetch active sessions (polling every 5s)
  3. Fetch suggested packages
  4. Fetch loyalty status
  5. Fetch analytics
  ↓
Display:
  - Welcome card with user info
  - Active session card (if any)
  - Quick action buttons
  - Suggested packages grid
  - Statistics cards
```

#### 5. **Package Purchase Flow**
```
User browses packages (/plans)
  ↓
Select package → Click "BUY"
  ↓
Navigate to /purchases/new?package={id}
  ↓
Purchase Page:
  1. Display package details
  2. Select payment method
  3. Initiate payment (SELCOM)
  4. Payment processing
  5. Payment verification
  ↓
Success:
  - Voucher code generated
  - Points awarded
  - Redirect to dashboard
  - Show success notification
```

#### 6. **Session Management Flow**
```
User connects to GG Wi-Fi hotspot
  ↓
Backend creates session
  ↓
Dashboard polls for active sessions:
  - GET /customer/sessions/active (every 5s)
  ↓
Display active session:
  - Countdown timer (expiresAt)
  - Download/Upload usage
  - Session type
  - Disconnect button
  ↓
User disconnects:
  - POST /customer/sessions/{id}/disconnect
  - Session removed
  - UI updates
```

#### 7. **Voucher Usage Flow**
```
User receives voucher code (purchase/signup)
  ↓
User connects to GG Wi-Fi hotspot
  ↓
User enters voucher code at hotspot portal
  ↓
Backend validates voucher:
  - POST /customer-portal/voucher-login
  - Validate voucher code
  - Check expiration
  - Check usage status
  ↓
If valid:
  - Create session
  - Grant internet access
  - Mark voucher as used
  ↓
Dashboard updates:
  - Active session appears
  - Voucher status changes to "Used"
```

#### 8. **Rewards Redemption Flow**
```
User accumulates GG Points
  ↓
Browse rewards (/rewards)
  ↓
Select reward product
  ↓
Check points balance:
  - GET /customer/loyalty/status
  - Verify sufficient points
  ↓
Redeem product:
  - POST /customer/loyalty/products/{id}/redeem
  - Deduct points
  - Create reward order
  ↓
Order confirmation:
  - Display order details
  - Update points balance
  - Show order in /rewards/orders
```

### Data Flow Architecture

#### API Communication
```
Frontend (React)
  ↓
Axios Client (api.js / customerPortalApi.js)
  ↓
Request Interceptor:
  - Add Authorization header (Bearer token)
  - Add Content-Type header
  ↓
Backend API (https://api.ggwifi.co.tz/api/v1)
  ↓
Response Interceptor:
  - Handle 401 (unauthorized) → Clear token → Redirect to login
  - Handle errors → Display toast notifications
  ↓
React Query:
  - Cache responses
  - Refetch on interval
  - Invalidate on mutations
```

#### State Management
```
Local Storage:
  - token: Authentication token
  - user: User profile object
  - authToken: Alternative token key

React Query Cache:
  - customer-dashboard: Dashboard data
  - customer-profile: User profile
  - customer-loyalty: Loyalty status
  - active-session: Current session
  - packages: Available packages
  - campaigns: Marketing campaigns

Component State:
  - Form inputs (local state)
  - UI toggles (modals, menus)
  - Loading states
```

### Real-time Updates

#### Polling Strategy
```
Active Session: Every 5 seconds
  - GET /customer/sessions/active
  - Update countdown timer
  - Update usage statistics

Dashboard Data: Every 30 seconds
  - GET /customer/dashboard
  - Refresh statistics
  - Update loyalty points

Loyalty Status: Every 60 seconds
  - GET /customer/loyalty/status
  - Check for tier upgrades
  - Show notifications for point gains

Packages: Every 5 minutes
  - GET /customer/packages
  - Update available packages
```

---

## 🏗️ Technical Architecture

### Technology Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.4.21
- **UI Library**: Material-UI (MUI) 5.14.20
- **Routing**: React Router DOM 6.20.1
- **State Management**: React Query 3.39.3
- **HTTP Client**: Axios 1.6.2
- **Animations**: Framer Motion 10.16.16
- **Notifications**: React Hot Toast 2.6.0
- **Charts**: Recharts 3.1.0

### Project Structure
```
customer_portal/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── customer/        # Customer-specific components
│   │   ├── marketing/       # Marketing components
│   │   ├── referral/        # Referral system
│   │   └── ui/              # Generic UI components
│   ├── pages/               # Route pages
│   ├── services/            # API services
│   ├── theme/               # Theme configuration
│   ├── styles/              # Global styles
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── App.jsx              # Main app component
├── public/                  # Static assets
└── package.json            # Dependencies
```

### Key Services

#### `customerPortalApi.js`
Main API service for customer portal:
- Authentication (login, OTP, signup)
- Packages (get, get by ID)
- Sessions (active, history, disconnect)
- Purchases (history, get by ID)
- Loyalty (account, products, redeem)
- Marketing (campaigns)
- Voucher (login)

#### `api.js`
Comprehensive API client with:
- Request/Response interceptors
- Multiple API endpoints grouped by feature
- Utility functions (formatting, tokens)

### Routing Structure
```
Public Routes:
  /home → LandingPage
  /login → LoginPage
  /otp-login → OTPLoginPage
  /voucher-login → VoucherLoginPage
  /signup/phone → SignupPhonePage
  /signup/verify → SignupVerifyPage
  /signup/details → SignupDetailsPage

Protected Routes (require token):
  /dashboard → DashboardPage
  /plans → PlansPage
  /connections → ConnectionsPage
  /purchases → PurchasesPage
  /purchases/:orderId → PurchasesPage (detail)
  /rewards → RewardsPage
  /rewards/product/:id → RewardsPage (product detail)
  /rewards/orders → RewardsPage (orders)
```

### Component Hierarchy
```
App
├── ThemeProvider (MUI Theme)
├── QueryClientProvider (React Query)
├── BrowserRouter
│   └── Routes
│       ├── LandingPage
│       │   ├── GlobalHeader
│       │   ├── MarketingCarousel
│       │   └── Footer
│       ├── LoginPage
│       │   └── GlobalHeader
│       ├── DashboardPage
│       │   ├── GlobalHeader
│       │   ├── Welcome Card
│       │   ├── Active Session Card
│       │   ├── Quick Actions
│       │   ├── Suggested Packages
│       │   └── StickyBottomNav
│       ├── PlansPage
│       │   ├── GlobalHeader
│       │   ├── Package Tabs
│       │   ├── Package Cards
│       │   └── StickyBottomNav
│       └── ... (other pages)
└── Toaster (Notifications)
```

---

## 📱 Component Structure

### Core Components

#### `GlobalHeader`
- Golden yellow background (`#F2C94C`)
- Logo: "GG Wi-Fi"
- Contact buttons (WhatsApp, Phone)
- Account menu (Login/Logout, Profile)

#### `StickyBottomNav`
- Mobile-only bottom navigation
- 5 tabs: Home, Plans, Connections, Purchases, Rewards
- Active tab highlighted in gold

#### `CustomerDashboard`
- Comprehensive dashboard component
- Statistics cards
- Active sessions table
- Recent transactions
- Available packages grid
- Loyalty information
- Referral card

#### `CountdownTimer`
- Real-time countdown for session expiration
- Updates every second
- Calls callback on expiration

### Page Components

#### `LandingPage`
- Marketing carousel
- Trust features section
- Testimonials
- Call-to-action buttons

#### `DashboardPage`
- Welcome section
- Active session display
- Quick actions
- Suggested packages

#### `PlansPage`
- Tabbed interface (Universal/Offer)
- Package cards with details
- Purchase navigation

#### `LoginPage`
- PIN login form
- OTP login link
- Signup navigation

---

## 🔐 Security Features

1. **Token-based Authentication**
   - JWT tokens stored in localStorage
   - Automatic token injection in API requests
   - Token refresh mechanism

2. **Protected Routes**
   - Route guards check for token
   - Redirect to login if unauthorized

3. **API Security**
   - Request interceptors add auth headers
   - Response interceptors handle 401 errors
   - Automatic logout on token expiration

4. **Input Validation**
   - Phone number format validation
   - PIN length restrictions (4 digits)
   - OTP code validation

---

## 📊 Data Flow Summary

### User Journey Example: Purchase Package
```
1. User logs in → Token stored
2. User browses /plans → Packages fetched
3. User selects package → Navigate to purchase
4. Payment initiated → SELCOM integration
5. Payment processed → Backend creates voucher
6. Points awarded → Loyalty updated
7. Dashboard refreshed → New voucher displayed
8. User connects to hotspot → Uses voucher code
9. Session created → Active session appears
10. User browses internet → Usage tracked
11. Session expires → Countdown reaches zero
12. Dashboard updates → Session removed
```

---

## 🎯 Key Design Patterns

1. **Component Composition**: Reusable components with props
2. **Custom Hooks**: `useTokenRefresh`, `useSessionManager`
3. **React Query**: Data fetching, caching, and synchronization
4. **Theme System**: Centralized MUI theme with brand colors
5. **Responsive Design**: Mobile-first with breakpoints
6. **Error Handling**: Toast notifications for user feedback
7. **Loading States**: Skeleton loaders and spinners
8. **Animation**: Framer Motion for smooth transitions

---

## 📝 Notes

- All colors follow the official GG Wi-Fi brand guidelines
- Golden yellow (`#F2C94C`) is the primary brand color
- Secondary colors (blue, green, orange) are supportive only
- The design system is consistent across all pages
- Mobile navigation uses sticky bottom bar
- Desktop uses header navigation
- All API calls go through centralized services
- Real-time updates use polling (no WebSocket currently)

---

*Last Updated: Based on current codebase analysis*
*Documentation Version: 1.0*
