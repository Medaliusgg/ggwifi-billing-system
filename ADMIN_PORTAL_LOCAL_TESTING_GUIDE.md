# 🧪 Admin Portal - Local Testing Guide

**Date:** 2025-01-27  
**Status:** Ready for Testing

---

## 📋 Pre-Testing Checklist

### ✅ Prerequisites
- [x] Admin Portal frontend visible and running
- [ ] Backend running on `http://localhost:8080`
- [ ] MySQL database running
- [ ] Admin user credentials ready

---

## 🚀 Step 1: Start Backend (If Not Running)

### Check if Backend is Running
```bash
curl http://localhost:8080/api/v1/health
```

**Expected Response:**
```json
{"status":"UP"}
```

### If Backend is NOT Running:

**Option A: Using Maven (Recommended)**
```bash
cd backend
mvn spring-boot:run
```

**Option B: Using JAR**
```bash
cd backend
java -jar target/ggnetworks-backend-*.jar
```

**Wait for:** `Started GgnetworksBackendApplication in X.XXX seconds`

---

## 🧪 Step 2: Test Login

### Access Admin Portal
Open: **http://localhost:5173**

### Login Credentials
- **Username:** `medalius`
- **Phone:** `0742844024`
- **Password:** `Kolombo@123%`

### Expected Results
- ✅ Login form displays correctly
- ✅ Can enter credentials
- ✅ Click "Sign In as Admin" button
- ✅ Redirects to dashboard after successful login
- ✅ No error messages

### If Login Fails
1. Check browser console (F12) for errors
2. Check backend logs for authentication errors
3. Verify backend is running: `curl http://localhost:8080/api/v1/health`
4. Verify password hash in database:
   ```sql
   SELECT username, LEFT(password, 30), role FROM users WHERE username = 'medalius';
   ```

---

## 🧪 Step 3: Test Dashboard

### After Login, Verify:
- ✅ Dashboard loads without errors
- ✅ KPI cards display data (or show "0" if no data)
- ✅ Charts render (if data exists)
- ✅ Activity feed shows (or empty state)
- ✅ Quick actions are visible
- ✅ No white blank pages
- ✅ UI theme is correct (white background, black text, yellow accents)

### Test Dashboard Refresh
1. Click the refresh button (🔄)
2. Verify data updates
3. Check for loading states

### Expected API Calls
- `GET /api/v1/admin/dashboard/stats`
- `GET /api/v1/admin/dashboard/recent-activities`

**Check in Browser DevTools → Network tab**

---

## 🧪 Step 4: Test Navigation

### Test Each Menu Item
Click each item in the sidebar and verify:

1. **Dashboard** ✅
   - Should show dashboard with KPIs

2. **Customers** ✅
   - Should load customer list
   - Test search functionality
   - Test pagination (if multiple customers)

3. **Packages** ✅
   - Should load package list
   - Test create new package
   - Test edit package
   - Test delete package (if applicable)
   - Test toggle active status

4. **Vouchers** ✅
   - Should load voucher list
   - Test generate single voucher
   - Test generate bulk vouchers
   - Test export vouchers
   - Test voucher statistics

5. **Routers** ✅
   - Should load router list
   - Test add new router
   - Test edit router
   - Test test connection
   - Test sync routers

6. **Finance** ✅
   - Should load finance dashboard
   - Test revenue reports
   - Test payment logs

7. **Marketing** ✅
   - Should load marketing campaigns
   - Test create campaign
   - Test edit campaign

8. **Loyalty** ✅
   - Should load loyalty settings
   - Test GG Points configuration
   - Test tier management

9. **Sessions** ✅
   - Should load active sessions
   - Test session details

10. **Users** ✅
    - Should load user list
    - Test create user
    - Test edit user
    - Test delete user (if applicable)

11. **Settings** ✅
    - Should load settings page
    - Test configuration options

---

## 🧪 Step 5: Test CRUD Operations

### Create Operations
For each module (Packages, Customers, Routers, etc.):
1. Click "Create New" or "Add" button
2. Fill in required fields
3. Submit form
4. Verify:
   - ✅ Success message appears
   - ✅ Item appears in list
   - ✅ No errors in console

### Read Operations
1. Click on an item in the list
2. Verify:
   - ✅ Details page loads
   - ✅ All data displays correctly
   - ✅ No errors

### Update Operations
1. Click "Edit" on an item
2. Modify fields
3. Save changes
4. Verify:
   - ✅ Success message appears
   - ✅ Changes are reflected in list
   - ✅ No errors

### Delete Operations
1. Click "Delete" on an item
2. Confirm deletion
3. Verify:
   - ✅ Success message appears
   - ✅ Item removed from list
   - ✅ No errors

---

## 🧪 Step 6: Test Search & Filtering

### For Each List Page:
1. **Search:**
   - Enter search term
   - Verify results filter correctly
   - Clear search and verify all items return

2. **Filter:**
   - Apply filters (status, date, etc.)
   - Verify results update
   - Clear filters

3. **Pagination:**
   - Navigate to next page
   - Navigate to previous page
   - Change items per page
   - Verify data updates correctly

---

## 🧪 Step 7: Test Error Handling

### Test Network Errors
1. Stop backend server
2. Try to perform an action (e.g., refresh dashboard)
3. Verify:
   - ✅ Error message displayed
   - ✅ No white blank page
   - ✅ User-friendly error message
   - ✅ Option to retry

### Test Invalid Input
1. Try to submit forms with invalid data
2. Verify:
   - ✅ Validation errors displayed
   - ✅ Form doesn't submit
   - ✅ Error messages are clear

### Test Empty States
1. Navigate to pages with no data
2. Verify:
   - ✅ Empty state message displayed
   - ✅ "Create New" button visible
   - ✅ No errors

---

## 🧪 Step 8: Test UI/UX Theme

### Verify White Theme
1. **Sidebar:**
   - ✅ White background
   - ✅ Black text
   - ✅ Yellow active indicator (4px bar)
   - ✅ Hover effects work

2. **Top Navbar:**
   - ✅ Charcoal black background (`#1A1A1A`)
   - ✅ White text/icons
   - ✅ Yellow bottom border (3px)

3. **Cards:**
   - ✅ White background
   - ✅ Pale yellow borders (`#FFE89C`)
   - ✅ Soft shadows
   - ✅ 16px rounded corners

4. **Buttons:**
   - ✅ Primary: Golden yellow (`#F5C400`)
   - ✅ Secondary: White with yellow border
   - ✅ Hover effects work

5. **Text:**
   - ✅ Headings: Charcoal black (`#1A1A1A`)
   - ✅ Body: Charcoal black (`#1A1A1A`)
   - ✅ Labels: Grey (`#505050`)

---

## 🧪 Step 9: Test Responsive Design

### Test Mobile View
1. Open browser DevTools (F12)
2. Switch to mobile view (375px width)
3. Test:
   - ✅ Sidebar collapses to drawer
   - ✅ Cards stack vertically
   - ✅ Buttons are large enough
   - ✅ Text is readable
   - ✅ Navigation works
   - ✅ Forms are usable

### Test Tablet View
1. Switch to tablet view (768px width)
2. Test:
   - ✅ Layout adapts
   - ✅ Cards display in grid
   - ✅ Navigation works

### Test Desktop View
1. Switch to desktop view (1440px width)
2. Test:
   - ✅ Full layout displays
   - ✅ All features accessible
   - ✅ Proper spacing

---

## 🧪 Step 10: Test Authentication Flow

### Test Logout
1. Click logout button
2. Verify:
   - ✅ Redirects to login page
   - ✅ Token cleared
   - ✅ Cannot access protected routes

### Test Session Expiry
1. Wait for session to expire (or manually clear token)
2. Try to access protected route
3. Verify:
   - ✅ Redirects to login
   - ✅ Error message displayed

### Test Protected Routes
1. Try to access `/dashboard` without login
2. Verify:
   - ✅ Redirects to `/login`
   - ✅ After login, redirects back to intended page

---

## 📊 Testing Checklist

### Authentication
- [ ] Login works
- [ ] Logout works
- [ ] Session management works
- [ ] Protected routes redirect correctly

### Dashboard
- [ ] Dashboard loads
- [ ] KPI cards display data
- [ ] Charts render (if data exists)
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

### Search & Filtering
- [ ] Search works
- [ ] Filters work
- [ ] Pagination works

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

## 🐛 Troubleshooting

### Issue: Login Fails
**Solutions:**
1. Check backend is running: `curl http://localhost:8080/api/v1/health`
2. Check browser console for errors
3. Verify credentials in database
4. Check CORS configuration in backend

### Issue: API Calls Fail (404/500)
**Solutions:**
1. Verify backend is running
2. Check API endpoint URLs in `.env.local`
3. Check backend logs for errors
4. Verify CORS is configured

### Issue: White Blank Page
**Solutions:**
1. Check browser console for JavaScript errors
2. Hard refresh: `Ctrl+Shift+R`
3. Clear browser cache
4. Check if CSS files are loading

### Issue: Data Not Loading
**Solutions:**
1. Check Network tab in DevTools
2. Verify API responses
3. Check backend logs
4. Verify database has data

---

## 📝 Test Results Template

```markdown
## Test Results - [Date]

### Authentication
- Login: ✅ / ❌
- Logout: ✅ / ❌
- Session: ✅ / ❌

### Dashboard
- Loads: ✅ / ❌
- Data Display: ✅ / ❌
- Refresh: ✅ / ❌

### Navigation
- All Pages: ✅ / ❌
- Active States: ✅ / ❌

### CRUD Operations
- Create: ✅ / ❌
- Read: ✅ / ❌
- Update: ✅ / ❌
- Delete: ✅ / ❌

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

1. **Document Issues:** Note any bugs or issues found
2. **Fix Issues:** Address critical issues before deployment
3. **Re-test:** Verify fixes work
4. **Deploy:** Push to Cloudflare Pages after all tests pass

---

**Status:** ✅ **READY FOR TESTING**  
**Next Action:** Start backend and begin testing!


