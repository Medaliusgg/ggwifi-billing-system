# Admin Portal Testing Checklist

## Test Environment
- **Backend URL**: `http://139.84.241.182:8080/api/v1`
- **Test Admin Credentials**: (Use your actual admin credentials)
- **Test Customer Phone**: `0658823944` → `+255658823944`

---

## Module 1: Authentication & Authorization ✅

### 1.1 Admin Login
- [ ] **Login Page Loads**
  - Navigate to `/login`
  - Verify login form renders with GG Wi-Fi branding
  - Verify "Admin Login" and "Staff Login" toggle buttons work
  - Verify username, phone number (admin), and password fields are present

- [ ] **Admin Login Success**
  - Enter valid admin credentials:
    - Username: `admin` (or your admin username)
    - Phone Number: `0742844024` (or your admin phone)
    - Password: `admin123` (or your admin password)
  - Click "Sign In as Admin"
  - Verify:
    - JWT token stored in `localStorage` as `authToken`
    - User object stored in `localStorage` as `user`
    - Redirect to `/dashboard`
    - No console errors

- [ ] **Admin Login Failure**
  - Enter invalid credentials
  - Verify error message displays
  - Verify no token stored
  - Verify user stays on login page

- [ ] **Logout**
  - Click logout button
  - Verify:
    - Token removed from `localStorage`
    - User removed from `localStorage`
    - Redirect to `/login`

---

## Module 2: Admin Dashboard ✅

### 2.1 Dashboard Loads
- [ ] **After Login**
  - Verify dashboard renders after successful login
  - Verify role-based dashboard (ADMIN → SimpleAdminDashboard)
  - Verify no console errors

- [ ] **Dashboard API Calls**
  - Open browser DevTools → Network tab
  - Verify these API calls succeed (HTTP 200):
    - `GET /api/v1/admin/dashboard` → Returns dashboard stats
    - `GET /api/v1/admin/dashboard/stats` → Returns detailed statistics
  - Verify data displays in dashboard cards:
    - Total Customers
    - Active Sessions
    - Revenue (Today/This Month)
    - Total Packages
    - System Health Status

- [ ] **Dashboard Cards Render**
  - Verify all KPI cards display with:
    - Icon
    - Title
    - Value (number)
    - Trend indicator (if applicable)
    - Golden accent border (GG Wi-Fi branding)

- [ ] **Dashboard Refresh**
  - Click refresh button (if available)
  - Verify data updates without page reload

---

## Module 3: Customer Management ✅

### 3.1 Customer List
- [ ] **Navigate to Customers**
  - Click "Customers" in sidebar
  - Verify route: `/customers`
  - Verify page loads without errors

- [ ] **List All Customers**
  - Verify API call: `GET /api/v1/admin/customers`
  - Verify customer table/list displays:
    - Phone number
    - Name
    - Email (if available)
    - Status
    - Actions (View/Edit/Delete)

- [ ] **Search Customer by Phone**
  - Enter phone: `0658823944` or `+255658823944`
  - Verify API call: `GET /api/v1/admin/customers/phone/+255658823944`
  - Verify customer details display

- [ ] **View Customer Details**
  - Click "View" on a customer
  - Verify customer profile shows:
    - Phone number
    - Name
    - Email
    - Account status
    - Payment history
    - Voucher history
    - Usage history

- [ ] **Create Customer**
  - Click "Create Customer" or "Add Customer"
  - Fill form:
    - Phone: `+255658823944`
    - Name: `Test Customer`
    - Email: `test@example.com`
  - Submit
  - Verify API call: `POST /api/v1/admin/customers`
  - Verify success message
  - Verify customer appears in list

- [ ] **Edit Customer**
  - Click "Edit" on a customer
  - Update name or email
  - Submit
  - Verify API call: `PUT /api/v1/admin/customers/{id}`
  - Verify changes saved

- [ ] **Customer Statistics**
  - Verify API call: `GET /api/v1/admin/customers/statistics`
  - Verify stats display (total, active, inactive, etc.)

---

## Module 4: Package Management ✅

### 4.1 Package List
- [ ] **Navigate to Packages**
  - Click "Packages" in sidebar
  - Verify route: `/packages`
  - Verify page loads

- [ ] **List All Packages**
  - Verify API call: `GET /api/v1/admin/packages`
  - Verify package list displays:
    - Package name
    - Price
    - Duration
    - Data limit
    - Status (Active/Inactive)

- [ ] **Create Package**
  - Click "Create Package"
  - Fill form:
    - Name: `Test Package`
    - Price: `1000`
    - Duration: `30` days
    - Data limit: `10GB`
  - Submit
  - Verify API call: `POST /api/v1/admin/packages`
  - Verify success message
  - Verify package appears in list

- [ ] **Edit Package**
  - Click "Edit" on a package
  - Update price or duration
  - Submit
  - Verify API call: `PUT /api/v1/admin/packages/{id}`
  - Verify changes saved

- [ ] **View Package Details**
  - Click "View" on a package
  - Verify package details display

- [ ] **Deactivate Package**
  - Click "Deactivate" on a package
  - Verify package status changes to "Inactive"

---

## Module 5: Voucher Management ✅

### 5.1 Voucher List
- [ ] **Navigate to Vouchers**
  - Click "Vouchers" in sidebar
  - Verify route: `/vouchers`
  - Verify page loads

- [ ] **List All Vouchers**
  - Verify API call: `GET /api/v1/admin/vouchers`
  - Verify voucher list displays:
    - Voucher code
    - Customer phone
    - Package name
    - Amount
    - Status (ACTIVE/USED/EXPIRED)
    - Usage status

- [ ] **Generate Bulk Vouchers**
  - Click "Generate Bulk Vouchers"
  - Fill form:
    - Package ID: `1`
    - Quantity: `10`
    - Amount: `100`
  - Submit
  - Verify API call: `POST /api/v1/admin/vouchers/bulk`
  - Verify success message
  - Verify vouchers appear in list

- [ ] **Search Voucher by Code**
  - Enter voucher code
  - Verify API call: `GET /api/v1/admin/vouchers/code/{code}`
  - Verify voucher details display

- [ ] **View Voucher Details**
  - Click "View" on a voucher
  - Verify voucher details:
    - Code
    - Customer info
    - Package info
    - Status
    - Expiry date
    - Usage date (if used)

---

## Module 6: Payment Management ✅

### 6.1 Payment List
- [ ] **Navigate to Payments**
  - Click "Payments" in sidebar
  - Verify route: `/payments`
  - Verify page loads

- [ ] **List All Payments**
  - Verify API call: `GET /api/v1/admin/payments`
  - Verify payment list displays:
    - Payment ID
    - Customer phone
    - Amount
    - Status (PENDING/COMPLETED/FAILED)
    - Payment method
    - Date

- [ ] **View Payment Details**
  - Click "View" on a payment
  - Verify payment details:
    - Payment ID
    - Customer info
    - Amount
    - Status
    - Transaction ID
    - Date/time

- [ ] **Filter Payments by Phone**
  - Enter phone: `+255658823944`
  - Verify API call: `GET /api/v1/admin/payments/phone/+255658823944`
  - Verify filtered results

---

## Module 7: Invoice Management ✅

### 7.1 Invoice List
- [ ] **Navigate to Invoices**
  - Click "Invoices" in sidebar
  - Verify route: `/invoices`
  - Verify page loads

- [ ] **List All Invoices**
  - Verify API call: `GET /api/v1/admin/invoices`
  - Verify invoice list displays:
    - Invoice number
    - Customer phone
    - Amount
    - Status (PAID/UNPAID)
    - Due date

- [ ] **View Invoice Details**
  - Click "View" on an invoice
  - Verify invoice details:
    - Invoice number
    - Customer info
    - Items
    - Total amount
    - Status
    - Date

- [ ] **Filter Invoices by Status**
  - Select status: "PAID" or "UNPAID"
  - Verify API call: `GET /api/v1/admin/invoices/status/{status}`
  - Verify filtered results

- [ ] **Invoice Statistics**
  - Verify API call: `GET /api/v1/admin/invoices/statistics`
  - Verify stats display

---

## Module 8: Session Management ✅

### 8.1 Active Sessions
- [ ] **Navigate to Sessions**
  - Click "Sessions" in sidebar
  - Verify route: `/sessions`
  - Verify page loads

- [ ] **List Active Sessions**
  - Verify API call: `GET /api/v1/sessions/active`
  - Verify session list displays:
    - Username (voucher code or customer phone)
    - IP address
    - Start time
    - Duration
    - Data usage

- [ ] **Terminate Session**
  - Click "Terminate" on a session
  - Verify API call: `POST /api/v1/sessions/{sessionId}/terminate`
  - Verify success message
  - Verify session removed from list

- [ ] **Session Statistics**
  - Verify API call: `GET /api/v1/radius/statistics`
  - Verify stats display

---

## Module 9: Router Management ✅

### 9.1 Router List
- [ ] **Navigate to Routers**
  - Click "Routers" in sidebar
  - Verify route: `/routers`
  - Verify page loads

- [ ] **List All Routers**
  - Verify API call: `GET /api/v1/admin/routers`
  - Verify router list displays:
    - Router name
    - IP address
    - Status (ONLINE/OFFLINE)
    - Location

- [ ] **Router Status**
  - Verify API call: `GET /api/v1/admin/routers/status`
  - Verify status indicators display

- [ ] **Test Router Connection**
  - Click "Test Connection" on a router
  - Verify API call: `POST /api/v1/admin/routers/{id}/test-connection`
  - Verify connection test result

---

## Module 10: Loyalty Program ✅

### 10.1 Loyalty Overview
- [ ] **Navigate to Loyalty**
  - Click "Loyalty" in sidebar
  - Verify route: `/loyalty`
  - Verify page loads

- [ ] **Top Customers**
  - Verify API call: `GET /api/v1/loyalty/top-customers?limit=10`
  - Verify top customers list displays:
    - Customer phone
    - Points
    - Tier
    - Rewards redeemed

- [ ] **Customer Loyalty Info**
  - Search customer: `+255658823944`
  - Verify API call: `GET /api/v1/loyalty/customer/phone/+255658823944/snapshot`
  - Verify customer loyalty details:
    - Current points
    - Tier
    - Progress to next tier
    - Rewards available

- [ ] **Rewards List**
  - Verify API call: `GET /api/v1/loyalty/rewards`
  - Verify rewards list displays

- [ ] **Tiers Configuration**
  - Verify API call: `GET /api/v1/loyalty/tiers`
  - Verify tiers display

---

## Module 11: Transaction Management ✅

### 11.1 Transaction List
- [ ] **Navigate to Transactions**
  - Click "Transactions" in sidebar
  - Verify route: `/transactions`
  - Verify page loads

- [ ] **List All Transactions**
  - Verify API call: `GET /api/v1/admin/transactions`
  - Verify transaction list displays

- [ ] **Transaction Statistics**
  - Verify API call: `GET /api/v1/admin/transactions/statistics`
  - Verify stats display

---

## Module 12: User Management ✅

### 12.1 User List
- [ ] **Navigate to Users**
  - Click "Users" in sidebar
  - Verify route: `/users`
  - Verify page loads

- [ ] **List All Users**
  - Verify API call: `GET /api/v1/admin/users`
  - Verify user list displays

- [ ] **Create User**
  - Click "Create User"
  - Fill form and submit
  - Verify API call: `POST /api/v1/admin/users`
  - Verify success

---

## Module 13: Analytics & Reports ✅

### 13.1 Analytics Dashboard
- [ ] **Navigate to Analytics**
  - Click "Analytics" in sidebar
  - Verify route: `/analytics`
  - Verify page loads

- [ ] **Reports**
  - Verify API calls:
    - `GET /api/v1/admin/reports-analytics/reports`
    - `GET /api/v1/admin/reports-analytics/reports/statistics`
  - Verify reports display

---

## Module 14: Settings ✅

### 14.1 System Settings
- [ ] **Navigate to Settings**
  - Click "Settings" in sidebar
  - Verify route: `/settings`
  - Verify page loads

- [ ] **System Settings**
  - Verify API call: `GET /api/v1/system-settings`
  - Verify settings display

---

## Module 15: Marketing ✅

### 15.1 Marketing Dashboard
- [ ] **Navigate to Marketing**
  - Click "Marketing" in sidebar
  - Verify route: `/marketing`
  - Verify page loads

- [ ] **Campaigns**
  - Verify API call: `GET /api/v1/marketing/campaigns`
  - Verify campaigns display

---

## Notes
- All API calls should include `Authorization: Bearer {token}` header
- All API calls should return HTTP 200 for success
- Check browser console for any JavaScript errors
- Check Network tab for failed API calls
- Verify GG Wi-Fi branding (golden colors) throughout UI

---

## Test Results Summary
- **Total Modules**: 15
- **Modules Tested**: ___
- **Modules Passed**: ___
- **Modules Failed**: ___
- **Issues Found**: ___

