# Frontend Testing Guide - GG Wi-Fi Web App

## 🚀 Quick Start

### Dev Servers
- **Admin Portal**: http://localhost:3000
- **Customer Portal**: http://localhost:3001

### Server Status
```bash
# Check if servers are running
netstat -tuln | grep -E ":(3000|3001)"

# View admin portal logs
tail -f /tmp/admin_portal.log

# View customer portal logs
tail -f /tmp/customer_portal.log
```

---

## 📋 Admin Portal Testing Checklist

### 1. Authentication & Access
- [ ] **Login Page** (`/login`)
  - [ ] Admin login with username, phone number, and password
  - [ ] Staff login with username, staff ID, and password
  - [ ] Error handling for invalid credentials
  - [ ] Remember me functionality
  - [ ] Redirect to dashboard after successful login

- [ ] **Protected Routes**
  - [ ] Unauthenticated users redirected to `/login`
  - [ ] Authenticated users can access protected pages
  - [ ] Role-based access control (Admin, Staff, Finance, Marketing, Technician)

### 2. Dashboard (`/dashboard`)
- [ ] **KPI Cards Display**
  - [ ] Total Revenue, Active Users, GG Points, Active Campaigns
  - [ ] Cards have white backgrounds with pale yellow borders
  - [ ] Icons are neutral grey/charcoal (color-free)
  - [ ] Trend chips show neutral grey backgrounds
  - [ ] Values are displayed correctly

- [ ] **Activity Feed**
  - [ ] Recent activities are listed
  - [ ] Empty state shows when no activities
  - [ ] Status chips are neutral grey

- [ ] **Layout & Styling**
  - [ ] White background throughout
  - [ ] Sidebar is white with charcoal text
  - [ ] Top navbar is charcoal black with yellow bottom border
  - [ ] All text is visible and readable

### 3. Navigation & Layout
- [ ] **Sidebar Navigation**
  - [ ] All menu items are visible
  - [ ] Active item has yellow left border indicator
  - [ ] Hover states work (pale yellow highlight)
  - [ ] Icons are charcoal black
  - [ ] Collapse/expand functionality works

- [ ] **Top Navbar**
  - [ ] Logo displays correctly
  - [ ] Profile menu works
  - [ ] Notifications icon visible
  - [ ] Logout functionality works

### 4. Key Modules to Test

#### User Management (`/users`)
- [ ] User list displays
- [ ] Create new user
- [ ] Edit user details
- [ ] Delete user
- [ ] Search and filter

#### Customer Management (`/customers`)
- [ ] Customer list displays
- [ ] View customer details
- [ ] Customer activity history
- [ ] GG Points balance
- [ ] Loyalty tier information

#### Package Management (`/packages`)
- [ ] Package list displays
- [ ] Create/edit packages
- [ ] Package pricing
- [ ] Time-based offers
- [ ] Package activation/deactivation

#### Finance (`/finance`)
- [ ] Revenue dashboard
- [ ] Payment transactions
- [ ] Settlement logs
- [ ] Financial reports

#### Marketing (`/marketing`)
- [ ] Campaign management
- [ ] SMS templates
- [ ] Audience segments
- [ ] Video/image ad management

#### Loyalty (`/loyalty`)
- [ ] GG Points configuration
- [ ] Tier management
- [ ] Rewards catalog
- [ ] Redemption tracking

#### Routers (`/routers`)
- [ ] Router list
- [ ] Router status monitoring
- [ ] Location management
- [ ] Authentication logs

#### Sessions (`/sessions`)
- [ ] Active session monitoring
- [ ] Session history
- [ ] Session details

---

## 🛒 Customer Portal Testing Checklist

### 1. Landing Page
- [ ] **Hero Section**
  - [ ] Main heading and CTA visible
  - [ ] Background animations work
  - [ ] Yellow navbar displays correctly

- [ ] **Navigation**
  - [ ] Mobile menu works
  - [ ] Profile icon visible
  - [ ] Language selector works

### 2. Authentication
- [ ] **Voucher Login** (`/voucher-login`)
  - [ ] Phone number input
  - [ ] OTP verification
  - [ ] Error handling
  - [ ] Redirect to dashboard after login

### 3. Customer Dashboard
- [ ] **User Info Card**
  - [ ] Profile photo with yellow ring border
  - [ ] Customer name and details
  - [ ] GG Points balance
  - [ ] Loyalty tier badge

- [ ] **Active Session Card**
  - [ ] Current hotspot session info
  - [ ] Session duration
  - [ ] Data usage

- [ ] **Package Cards**
  - [ ] All packages display with white backgrounds
  - [ ] Package names in unique colors (Blue/Green/Purple/Orange)
  - [ ] Descriptions in charcoal black
  - [ ] Prices visible
  - [ ] Select buttons work
  - [ ] Hover effects work (card lifts, colored border)
  - [ ] Selected state shows package color background

- [ ] **Recent Transactions**
  - [ ] Transaction history displays
  - [ ] Payment status indicators

### 4. Package Purchase Flow
- [ ] **Package Selection** (`/buy-package`)
  - [ ] All packages load from backend
  - [ ] Package cards display correctly
  - [ ] Package selection works
  - [ ] "Proceed to Payment" button works

- [ ] **Payment Process**
  - [ ] Payment gateway selection (Selcom/ZenoPay)
  - [ ] Payment form displays
  - [ ] Payment initiation works
  - [ ] Payment status updates
  - [ ] Success/error handling

### 5. UI/UX Verification
- [ ] **Color Scheme**
  - [ ] All backgrounds are white
  - [ ] Text is charcoal black or grey
  - [ ] Yellow accents (#F5C400) for highlights
  - [ ] Pale yellow (#FFE89C) for borders/hovers

- [ ] **Responsiveness**
  - [ ] Mobile view works
  - [ ] Tablet view works
  - [ ] Desktop view works
  - [ ] Navigation adapts to screen size

- [ ] **Icons & Visuals**
  - [ ] All icons are monochrome (no colorful icons)
  - [ ] Icons are visible and properly sized
  - [ ] Badges display correctly

---

## 🐛 Common Issues & Solutions

### Blank White Page
1. **Check Browser Console (F12)**
   - Look for JavaScript errors
   - Check for import/module errors
   - Verify API connection errors

2. **Check Network Tab**
   - Verify API requests are being made
   - Check if backend is accessible
   - Look for CORS errors

3. **Check Authentication**
   - Clear localStorage: `localStorage.clear()`
   - Try logging in again
   - Check if token is valid

4. **Check Environment Variables**
   - Verify `.env.local` files exist
   - Check `VITE_API_URL` is correct
   - Ensure backend URL is accessible

### Styling Issues
1. **CSS Not Loading**
   - Check if CSS files exist in `src/styles/`
   - Verify imports in `index.css` or `main.jsx`
   - Clear browser cache

2. **Colors Not Applied**
   - Check if theme files are imported
   - Verify color values in theme files
   - Check MUI theme provider

### API Connection Issues
1. **Backend Not Accessible**
   - Verify backend is running
   - Check backend URL in `.env.local`
   - Test API endpoint directly: `curl http://localhost:8080/api/v1/health`

2. **CORS Errors**
   - Check backend CORS configuration
   - Verify allowed origins include frontend URLs
   - Check if credentials are being sent

---

## 📊 Testing Scenarios

### Scenario 1: Admin Login & Dashboard
1. Navigate to http://localhost:3000
2. Should redirect to `/login` if not authenticated
3. Enter admin credentials
4. Should redirect to `/dashboard`
5. Verify dashboard displays with KPI cards
6. Check sidebar navigation works
7. Verify all text is visible on white background

### Scenario 2: Customer Package Purchase
1. Navigate to http://localhost:3001
2. Login with voucher/phone number
3. Navigate to package purchase page
4. Select a package
5. Click "Proceed to Payment"
6. Complete payment flow
7. Verify success message and redirect

### Scenario 3: UI Consistency Check
1. Navigate through all major pages
2. Verify consistent white backgrounds
3. Check all text is readable
4. Verify icons are monochrome
5. Test hover effects
6. Check responsive design

---

## ✅ Success Criteria

### Admin Portal
- ✅ All pages load without errors
- ✅ White background theme applied consistently
- ✅ All text is visible and readable
- ✅ Icons are monochrome (no colorful icons)
- ✅ Navigation works smoothly
- ✅ Authentication flow works
- ✅ Dashboard displays data correctly

### Customer Portal
- ✅ Landing page displays correctly
- ✅ Package cards have white backgrounds
- ✅ Package names in unique colors
- ✅ Payment flow works end-to-end
- ✅ All UI elements are visible
- ✅ Responsive design works

---

## 🔧 Quick Commands

```bash
# Restart admin portal
cd Frontend/admin_portal && npm run dev

# Restart customer portal
cd Frontend/customer_portal && npm run dev

# Check running processes
ps aux | grep vite

# Kill all vite processes
pkill -f vite

# View logs
tail -f /tmp/admin_portal.log
tail -f /tmp/customer_portal.log
```

---

## 📝 Notes

- Both portals use the ZenoPay-style white theme
- All icons should be monochrome (black/grey/white)
- Package cards in customer portal use unique colors for package names only
- All backgrounds should be white (#FFFFFF)
- Text should be charcoal black (#1A1A1A) or label grey (#505050)

---

**Last Updated**: $(date)
**Status**: Ready for Testing ✅


