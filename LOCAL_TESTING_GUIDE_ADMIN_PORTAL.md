# 🧪 Local Testing Guide - Admin Portal

**Date:** 2025-01-27  
**Status:** Ready for Local Testing

---

## 📋 Pre-Testing Checklist

### ✅ Prerequisites
- [x] Backend running on `http://localhost:8080`
- [x] MySQL database running and accessible
- [x] Admin user password hash fixed
- [x] Frontend dependencies installed
- [x] Build successful

---

## 🚀 Step 1: Fix Admin Password Hash

### Option A: Using Script (Recommended)
```bash
# Make script executable
chmod +x fix-admin-password-local.sh

# Run the script
./fix-admin-password-local.sh
```

### Option B: Manual SQL
```bash
mysql -u ggnetworks -pggnetworks123 ggnetworks_radius << 'EOF'
UPDATE users 
SET password = '$2a$10$YNq4hCKiuzZ5Wc6.ghp2kuBtaewzeuwMNayw37XiJ2Sb41P9pqwEm' 
WHERE username = 'medalius';

SELECT username, LEFT(password, 30) as hash_start FROM users WHERE username = 'medalius';
EOF
```

### Expected Output
```
✅ Password hash updated successfully!
hash_start: $2a$10$YNq4hCKiuzZ5Wc6.ghp2ku
```

---

## 🚀 Step 2: Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

**Verify Backend is Running:**
```bash
curl http://localhost:8080/api/v1/health
```

Expected response:
```json
{"status":"UP"}
```

---

## 🚀 Step 3: Start Admin Portal Frontend

```bash
cd Frontend/admin_portal
npm run dev
```

**Frontend will start on:** `http://localhost:5173` (or next available port)

---

## 🧪 Step 4: Test Authentication

### Test Login
1. Open `http://localhost:5173`
2. You should see the login page
3. Enter credentials:
   - **Username:** `medalius`
   - **Phone:** `0742844024`
   - **Password:** `Kolombo@123%`
4. Click "Login"

### Expected Results
- ✅ Login successful
- ✅ Redirects to dashboard
- ✅ JWT token stored in localStorage
- ✅ User info displayed in top navbar

### If Login Fails
1. Check browser console for errors
2. Check backend logs for authentication errors
3. Verify password hash in database:
   ```sql
   SELECT username, LEFT(password, 30) FROM users WHERE username = 'medalius';
   ```
4. Verify backend is running: `curl http://localhost:8080/api/v1/health`

---

## 🧪 Step 5: Test Dashboard

### Test Dashboard Loading
1. After login, you should see the dashboard
2. Check for:
   - ✅ KPI cards displaying data
   - ✅ Charts rendering
   - ✅ Activity feed showing recent activities
   - ✅ Quick actions visible

### Test Dashboard Refresh
1. Click the refresh button (🔄)
2. Verify data updates
3. Check for loading states

### Expected API Calls
- `GET /api/v1/admin/dashboard/stats`
- `GET /api/v1/admin/dashboard/recent-activities`

---

## 🧪 Step 6: Test Navigation

### Test Sidebar Navigation
1. Click each menu item:
   - ✅ Dashboard
   - ✅ Customers
   - ✅ Packages
   - ✅ Vouchers
   - ✅ Routers
   - ✅ Finance
   - ✅ Marketing
   - ✅ Loyalty
   - ✅ Sessions
   - ✅ Users
   - ✅ Settings

2. Verify:
   - ✅ Active item highlighted (yellow bar)
   - ✅ Page content loads
   - ✅ No white blank pages
   - ✅ Loading states work

---

## 🧪 Step 7: Test UI/UX Theme

### Verify White Theme
1. **Sidebar:**
   - ✅ White background
   - ✅ Black text
   - ✅ Yellow active indicator

2. **Top Navbar:**
   - ✅ Charcoal black background (`#1A1A1A`)
   - ✅ White text/icons
   - ✅ Yellow bottom border

3. **Cards:**
   - ✅ White background
   - ✅ Pale yellow borders (`#FFE89C`)
   - ✅ Soft shadows

4. **Buttons:**
   - ✅ Primary: Golden yellow (`#F5C400`)
   - ✅ Secondary: White with yellow border

5. **Text:**
   - ✅ Headings: Charcoal black (`#1A1A1A`)
   - ✅ Body: Charcoal black (`#1A1A1A`)
   - ✅ Labels: Grey (`#505050`)

---

## 🧪 Step 8: Test Key Features

### Test Customer Management
1. Navigate to **Customers**
2. Test:
   - ✅ List loads
   - ✅ Search works
   - ✅ Filter works
   - ✅ Pagination works
   - ✅ View customer details
   - ✅ Edit customer
   - ✅ Delete customer (if applicable)

### Test Package Management
1. Navigate to **Packages**
2. Test:
   - ✅ List loads
   - ✅ Create new package
   - ✅ Edit package
   - ✅ Delete package
   - ✅ Toggle active status

### Test Voucher Management
1. Navigate to **Vouchers**
2. Test:
   - ✅ List loads
   - ✅ Generate single voucher
   - ✅ Generate bulk vouchers
   - ✅ Export vouchers
   - ✅ View voucher statistics

### Test Router Management
1. Navigate to **Routers**
2. Test:
   - ✅ List loads
   - ✅ Add new router
   - ✅ Edit router
   - ✅ Test connection
   - ✅ Sync routers

---

## 🧪 Step 9: Test Error Handling

### Test Network Errors
1. Stop backend server
2. Try to perform an action
3. Verify:
   - ✅ Error message displayed
   - ✅ No white blank page
   - ✅ User-friendly error message

### Test Invalid Input
1. Try to submit forms with invalid data
2. Verify:
   - ✅ Validation errors displayed
   - ✅ Form doesn't submit
   - ✅ Error messages are clear

---

## 🧪 Step 10: Test Responsive Design

### Test Mobile View
1. Open browser DevTools
2. Switch to mobile view (375px width)
3. Test:
   - ✅ Sidebar collapses to drawer
   - ✅ Cards stack vertically
   - ✅ Buttons are large enough
   - ✅ Text is readable
   - ✅ Navigation works

### Test Tablet View
1. Switch to tablet view (768px width)
2. Test:
   - ✅ Layout adapts
   - ✅ Cards display in grid
   - ✅ Navigation works

---

## 🐛 Common Issues & Solutions

### Issue 1: White Blank Page
**Symptoms:** Page loads but shows white screen

**Solutions:**
1. Check browser console for errors
2. Verify all imports are correct
3. Check if CSS file is loaded: `premium-design-system.css`
4. Verify theme files exist: `premiumDesignSystem.js`, `designSystem.js`

### Issue 2: Login Fails
**Symptoms:** "Authentication failed: Bad credentials"

**Solutions:**
1. Verify password hash in database
2. Check backend logs for errors
3. Verify backend is running
4. Check CORS configuration

### Issue 3: API Calls Fail
**Symptoms:** Network errors, 404, 500 errors

**Solutions:**
1. Verify backend is running on port 8080
2. Check API endpoint URLs in `.env.local`
3. Verify CORS is configured
4. Check backend logs

### Issue 4: UI Theme Not Applied
**Symptoms:** Old colors, wrong styling

**Solutions:**
1. Clear browser cache
2. Restart dev server
3. Verify `premium-design-system.css` is imported in `index.css`
4. Check browser console for CSS errors

---

## ✅ Testing Checklist

### Authentication
- [ ] Login works
- [ ] Logout works
- [ ] Token refresh works
- [ ] Protected routes redirect to login

### Dashboard
- [ ] Dashboard loads
- [ ] KPI cards display data
- [ ] Charts render
- [ ] Activity feed works
- [ ] Refresh button works

### Navigation
- [ ] All menu items work
- [ ] Active state highlights correctly
- [ ] No white blank pages
- [ ] Breadcrumbs work (if applicable)

### CRUD Operations
- [ ] Create operations work
- [ ] Read operations work
- [ ] Update operations work
- [ ] Delete operations work

### UI/UX
- [ ] White theme applied correctly
- [ ] Colors match specification
- [ ] Typography is correct
- [ ] Spacing is consistent
- [ ] Shadows are subtle
- [ ] Hover effects work

### Error Handling
- [ ] Network errors handled
- [ ] Validation errors displayed
- [ ] Loading states work
- [ ] Empty states displayed

### Responsive Design
- [ ] Mobile view works
- [ ] Tablet view works
- [ ] Desktop view works
- [ ] Navigation adapts

---

## 📊 Test Results Template

```markdown
## Test Results - [Date]

### Authentication
- Login: ✅ / ❌
- Logout: ✅ / ❌
- Token Refresh: ✅ / ❌

### Dashboard
- Loads: ✅ / ❌
- Data Display: ✅ / ❌
- Refresh: ✅ / ❌

### Navigation
- All Pages: ✅ / ❌
- Active States: ✅ / ❌

### UI/UX
- White Theme: ✅ / ❌
- Colors: ✅ / ❌
- Responsive: ✅ / ❌

### Issues Found
1. [Issue description]
2. [Issue description]

### Overall Status
✅ Ready for Deployment / ❌ Needs Fixes
```

---

## 🚀 Next Steps After Testing

1. **Fix any issues found** during testing
2. **Document test results** in `ADMIN_PORTAL_TEST_RESULTS.md`
3. **Update deployment checklist** if needed
4. **Proceed with deployment** to Cloudflare Pages

---

## 📝 Notes

- Keep browser DevTools open during testing
- Check Network tab for API calls
- Check Console for errors
- Test on multiple browsers if possible
- Test on different screen sizes

---

**Status:** ✅ Ready for Local Testing  
**Next Step:** Run `fix-admin-password-local.sh` and start testing!


