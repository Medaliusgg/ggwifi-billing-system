# GG Wi-Fi Customer Portal - Current Design & Activity Workflow

**Last Updated:** December 2024  
**Version:** 2.0 (Latest Implementation)

---

## 🎨 **CURRENT DESIGN SYSTEM**

### **Brand Colors (Strict Implementation)**

#### **Primary Colors**
- **Golden Yellow**: `#FFCC00` - Primary brand color
  - Used for: Header background, Footer background, Buttons (on white backgrounds)
  - Text on yellow: `#000000` (Black)
- **Primary Dark**: `#E6B800` - Hover states, borders
- **Primary Light**: `#FFD633` - Lighter variations

#### **Neutral Colors**
- **Primary Black**: `#000000` - Text, Buttons (on yellow backgrounds)
- **Primary White**: `#FFFFFF` - Backgrounds, Text (on black buttons)
- **Dark Gray Text**: `#333333` - Secondary text

#### **Secondary Accent Colors** (Supportive Only)
- **Blue** (`#3B82F6`): Universal packages, trust badges
- **Purple** (`#8B5CF6`): Premium plans
- **Green** (`#10B981`): Success states, offer packages
- **Orange** (`#F59E0B`): Alerts, offer banners

### **Smart Button Color System**

Buttons automatically adapt based on background context:

1. **White Background** → **Golden Yellow Button** (`#FFCC00`)
   - Text: Black (`#000000`)
   - Hover: Darker yellow (`#E6B800`) with scale animation

2. **Yellow Background** → **Black Button** (`#000000`)
   - Text: White (`#FFFFFF`)
   - Hover: Darker black (`#1A1A1A`) with scale animation

### **Layout Components**

#### **1. Global Header (Top Navigation)**
- **Background**: Always Golden Yellow (`#FFCC00`)
- **Position**: Sticky at top
- **Content**:
  - Left: GG Wi-Fi logo (circular) + "GG Wi-Fi" text
  - Right: WhatsApp icon, Phone icon, Login/Account menu
- **Behavior**: Always visible, black text/icons on yellow

#### **2. Footer System**

**Normal Footer** (Bottom of page):
- **Background**: Golden Yellow (`#FFCC00`)
- **Content**: Copyright text, social icons
- **Position**: Fixed at bottom

**Animated Sticky Footer** (Voucher prompt):
- **Background**: Golden Yellow (`#FFCC00`)
- **Shows when**: User scrolls down >300px AND within 300px of bottom
- **Content**: "Already have a voucher?" + Voucher Login button + View Packages button
- **Behavior**: Smooth slide-up animation, stable (no blinking)
- **Buttons**: Black with white text (smart button system)

#### **3. Mobile Bottom Navigation** (After Login Only)
- **Background**: Golden Yellow (`#FFCC00`)
- **Visibility**: Only shows when user is logged in (token check)
- **Tabs**: Home, Plans, Connections, Purchases, Rewards
- **Icons**: Black icons with text labels below
- **Active State**: Darker background, scaled icon

### **Typography**
- **Font Family**: Inter, sans-serif
- **Headings**: Bold (700), Black text
- **Body**: Regular (400), Black/Gray text
- **Buttons**: Semi-bold (600), no text transform

### **Animations**
- **Framer Motion**: All page transitions, hover effects
- **Button Hover**: Scale (1.05) + shadow
- **Footer Animation**: Spring animation (stiffness: 400, damping: 40)
- **Page Transitions**: Fade + slide

---

## 🏠 **HOMEPAGE STRUCTURE** (`/home`)

### **Section 1: Hero Section**
- **Background**: White
- **Content**:
  - Large heading: "GG Wi-Fi — The Signal That Cares"
  - Subtext: Reliability, speed, stability messaging
  - CTA Buttons: "Get Started" (golden yellow), "View Packages" (outlined)
- **Animation**: Slow parallax background elements

### **Section 2: Marketing Campaign Carousel**
- **Type**: Auto-playing video/image carousel
- **Features**:
  - Horizontal slider with smooth transitions
  - Fade + slide effects
  - Dot indicators
  - Swipe support
  - Auto-slide: Every 5 seconds

### **Section 3: Package List Section**
- **Layout**: Big card block with tabs
- **Tabs**: "Universal Packages" (Blue) | "Offer Packages" (Orange)
- **Package Cards**:
  - Name, Duration, Price, Description
  - Color-coded accent (blue/purple/green/orange)
  - "Buy Now" button (golden yellow on white)
- **Animations**:
  - Auto-hover pulse
  - Auto-focus every 3 seconds
  - Scale animation when focused

### **Section 4: Trust & Security Section**
- **Cards**: Reliability, Fast Speeds, Customer Rewards, Secure Network, Privacy & Encryption, Support
- **Behavior**:
  - Auto-cycle focus
  - Enlarge + brightness increase on focus
  - Border animation
  - Horizontal scrollable with snap points

### **Section 5: Testimonials Section**
- **Layout**: Horizontal card slider
- **Content**: User image, name, comment
- **Behavior**:
  - Focused card is bigger and centered
  - Auto-slide with smooth spring animations
  - Loop with fade + scale

---

## 🔄 **ACTIVITY WORKFLOW**

### **1. PUBLIC ACCESS FLOW**

#### **Landing Page** (`/home`)
```
User arrives → Views 5 sections → Clicks CTA buttons
  ↓
Options:
  - "Get Started" → /login
  - "View Packages" → /packages
  - Scroll to bottom → Voucher footer appears
```

#### **Package Purchase Without Login** (`/packages`)
```
User browses packages → Selects package → Clicks "Buy Now"
  ↓
Phone Verification Modal appears
  ↓
User enters phone number
  ↓
API: /user-management/profile/phone/{phoneNumber}
  ↓
If registered → Allow payment
If not registered → Force signup flow
  ↓
Payment button enabled → Proceed to payment
```

### **2. AUTHENTICATION FLOW**

#### **Login Options**

**A. PIN Login** (`/login`)
```
1. Enter phone number
2. Enter 4-digit PIN
3. Submit → API: /customer-portal/login
4. Token stored → Redirect to /dashboard
```

**B. OTP Login** (`/otp-login`)
```
1. Enter phone number
2. Request OTP → API: /customer-portal/otp/send
3. Enter OTP code
4. Verify → API: /customer-portal/otp/verify
5. Token stored → Redirect to /dashboard
```

**C. Voucher Login** (`/voucher-login`)
```
1. Enter 6-digit voucher code
2. Click "Login With Voucher"
3. API: /customer-portal/voucher-login
4. If valid → Access granted (session created)
5. Footer buttons: "Home" | "Buy Packages"
```

#### **Signup Flow** (3 Steps)

**Step 1: Phone Entry** (`/signup/phone`)
```
1. Enter phone number
2. Click "Continue"
3. API: /customer-portal/signup/send-otp
4. OTP sent → Navigate to /signup/verify
```

**Step 2: OTP Verification** (`/signup/verify`)
```
1. Enter OTP code (6 digits)
2. Click "Verify"
3. API: /customer-portal/signup/verify-otp
4. Signup token received → Navigate to /signup/details
```

**Step 3: User Details** (`/signup/details`)
```
1. Enter full name (first + last)
2. Enter email (optional)
3. Create 4-digit PIN
4. Confirm PIN
5. Enter referral code (optional)
6. Submit → API: /customer-portal/signup/create
7. Auto-login → Redirect to /dashboard
8. Show welcome message + rewards (voucher + points)
```

### **3. POST-AUTHENTICATION FLOW**

#### **Dashboard** (`/dashboard`) - Protected Route

**Initial Load:**
```
1. Check token in localStorage
2. If no token → Redirect to /login
3. If token exists → Load dashboard
  ↓
Fetch Data (Parallel):
  - User profile: /customer-dashboard/profile
  - Active session: /customer-dashboard/sessions/active (poll every 5s)
  - Suggested packages: /customer-portal/packages (top 4)
  - Loyalty status: /customer-dashboard/loyalty
  - Dashboard stats: /customer-dashboard
  ↓
Display:
  - Welcome card (user name, avatar)
  - Active session card (if any) with countdown timer
  - Quick actions (Voucher code, Access code)
  - Suggested packages grid
  - Statistics cards (Points, Spend, Sessions, Rewards)
```

**Active Session Management:**
```
Session exists → Display:
  - Countdown timer (real-time)
  - Download/Upload usage
  - Session type (Voucher/Access Code)
  - Disconnect button
  ↓
Polling: GET /customer-dashboard/sessions/active (every 5s)
  ↓
User disconnects:
  - POST /customer-dashboard/sessions/{id}/disconnect
  - Session removed from UI
```

#### **Plans Page** (`/plans` or `/packages`) - Protected/Public

**Public Access** (`/packages`):
```
- Browse all packages
- Phone verification required before purchase
- No login required
```

**Protected Access** (`/plans`):
```
- Browse packages
- Direct purchase (no phone verification)
- Login required
```

**Package Purchase Flow:**
```
1. Select package → Click "Buy Now"
2. Navigate to /purchases/new?package={id}
3. Display package details
4. If not logged in → Phone verification modal
5. Select payment method
6. Initiate payment (SELCOM integration)
7. Payment processing
8. Success:
   - Voucher code generated
   - Points awarded
   - Redirect to dashboard
   - Show success notification
```

#### **Connections Page** (`/connections`) - Protected

```
1. Fetch active sessions: /customer-dashboard/sessions/active
2. Fetch session history: /customer-dashboard/sessions/history
3. Display:
   - Active connections table
   - Connection history
   - Usage statistics
   - Disconnect functionality
```

#### **Purchases Page** (`/purchases`) - Protected

```
1. Fetch purchase history: /customer-dashboard/transactions
2. Display:
   - Transaction list
   - Order details
   - Payment status
   - Voucher codes
3. Click order → View details: /purchases/{orderId}
```

#### **Rewards Page** (`/rewards`) - Protected

**Loyalty Overview:**
```
1. Fetch loyalty account: /customer-dashboard/loyalty
2. Display:
   - Current points balance
   - Loyalty tier
   - Points history
```

**Product Catalog:**
```
1. Fetch products: /customer-portal/rewards/products
2. Display grid:
   - Product image
   - Title
   - Points cost
   - Money price
   - "Redeem with Points" button (golden yellow)
   - "Buy Now (Zenopay)" button (golden yellow)
```

**Redemption Flow:**
```
1. Select product → Click "Redeem with Points"
2. API: /customer-portal/rewards/products/{id}/redeem
3. Points deducted
4. Order created
5. Show confirmation
6. Update points balance
```

---

## 📱 **MOBILE-FIRST DESIGN**

### **Responsive Breakpoints**
- **Mobile**: < 768px (360px minimum)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Mobile Navigation**
- **Bottom Navigation Bar**: Only visible after login
- **Background**: Golden Yellow (`#FFCC00`)
- **Tabs**: Home, Plans, Connections, Purchases, Rewards
- **Icons**: Black with text labels below
- **Active State**: Darker background, scaled icon

### **Mobile Optimizations**
- Touch-friendly button sizes (min 44px)
- Swipe gestures for carousels
- Bottom navigation for quick access
- Responsive typography scaling
- Optimized images and animations

---

## 🔐 **SECURITY & AUTHENTICATION**

### **Token Management**
- **Storage**: localStorage (`token`, `user`)
- **Injection**: Automatic via Axios interceptors
- **Expiration**: Handled by backend, 401 redirects to login
- **Refresh**: Manual re-login required

### **Protected Routes**
- **Check**: Token exists in localStorage
- **No Token**: Redirect to `/login`
- **Valid Token**: Allow access

### **API Security**
- **Request Interceptor**: Adds `Authorization: Bearer {token}`
- **Response Interceptor**: Handles 401 → Clear token → Redirect
- **Error Handling**: Toast notifications for errors

---

## 🎯 **KEY FEATURES**

### **1. Real-time Updates**
- **Active Session**: Polls every 5 seconds
- **Dashboard Data**: Refetches every 30 seconds
- **Loyalty Status**: Updates every 60 seconds

### **2. Smart Button System**
- Automatic color adaptation based on background
- Consistent hover animations
- Icon + label on all buttons

### **3. Animated Components**
- **Spinner**: For loading states
- **Notifications**: Toast messages for important activities
- **Page Transitions**: Smooth fade + slide
- **Footer Animation**: Spring-based slide-up

### **4. User Experience**
- **Auto-login after signup**: Seamless onboarding
- **Welcome rewards**: Voucher + points on signup
- **Phone verification**: For non-logged-in purchases
- **Voucher prompt**: Appears when scrolling near bottom

---

## 📊 **DATA FLOW**

### **API Endpoints Structure**

**Customer Portal APIs** (`/customer-portal/*`):
- `/login` - PIN login
- `/otp/send` - Send OTP
- `/otp/verify` - Verify OTP
- `/signup/*` - Signup flow
- `/packages` - Get packages
- `/voucher-login` - Voucher authentication
- `/rewards/*` - Rewards system

**Customer Dashboard APIs** (`/customer-dashboard/*`):
- `/` - Dashboard overview
- `/profile` - User profile
- `/sessions/active` - Active sessions
- `/sessions/history` - Session history
- `/sessions/{id}/disconnect` - Disconnect session
- `/transactions` - Purchase history
- `/loyalty` - Loyalty account

**User Management APIs** (`/user-management/*`):
- `/profile/phone/{phoneNumber}` - Check phone registration

### **State Management**
- **Local Storage**: `token`, `user`, `signup_phone`, `signup_verified`, `signup_token`
- **React Query**: Caching, refetching, invalidation
- **Component State**: Forms, UI toggles, loading states

---

## 🚀 **DEPLOYMENT**

### **Build Process**
- **Tool**: Vite
- **Command**: `npm run build`
- **Output**: `dist/` directory
- **Deployment**: Cloudflare Pages (auto-deploy from GitHub)

### **Environment**
- **Base URL**: `https://api.ggwifi.co.tz/api/v1`
- **Production**: Auto-deployed on push to `main` branch

---

## 📝 **NOTES**

1. **Color Consistency**: All primary yellow is `#FFCC00` (updated from old `#F2C94C`)
2. **Button Intelligence**: Buttons automatically adapt to background context
3. **Footer Stability**: Animated footer only shows near bottom, no blinking
4. **Mobile Nav**: Only visible after login (token check)
5. **Phone Verification**: Required for non-logged-in purchases
6. **Auto-login**: Enabled after successful signup
7. **Real-time Updates**: Polling-based (no WebSocket)

---

**Documentation Version**: 2.0  
**Last Updated**: December 2024  
**Status**: Production Ready ✅
