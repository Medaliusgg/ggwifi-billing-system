# Backend-Frontend API Alignment

## Current ƧapiStructure

### Backend Endpoints (Base: `/api/v1`)
- `/auth/admin-login` ✅
- `/admin/dashboard/stats` ✅
- `/admin/dashboard` ✅
- `/admin/dashboard/technician` ✅
- `/admin/dashboard/finance` ✅
- `/admin/dashboard/marketing` ✅
- `/admin/profile` ✅
- `/admin/users` ✅ (GET, POST)
- `/admin/users/{id}` ✅ (GET, PUT, DELETE)
- `/admin/users/{username}/role` ✅ (PUT)
- `/admin/packages` ✅ (GET, POST)
- `/admin/packages/{id}` ✅ (GET, PUT, DELETE)
- `/admin/vouchers` ✅ (GET, POST)
- `/admin/vouchers/{id}` ✅ (GET, PUT, DELETE)
- `/admin/payments` ✅ (GET, POST)
- `/admin/payments/{id}` ✅ (GET, PUT)
- `/admin/customers` ✅ (GET)
- `/admin/customers/{id}` ✅ (GET, PUT)
- `/admin/routers` ✅ (GET)
- `/admin/routers/status` ✅ (GET)

### Frontend API Calls (From `api.js`)
Looking good! Most endpoints align correctly.

## Issues Found:
1. Frontend calls `/admin/users` but backend expects `/admin/users` with pagination params
2. Frontend calls `/admin/loyalty/*` but backend doesn't have loyalty endpoints
3. Frontend calls `/admin/marketing/*` but backend doesn't have marketing endpoints
4. Frontend calls `/admin/mikrotik/routers` but backend has `/admin/routers`
5. Frontend calls `/admin/radius/*` but backend has `/admin/radius` in FreeRadiusController
6. Frontend calls `/admin/dashboard` but backend has `/admin/dashboard/stats` for main stats

## Actions Needed:
1. Update frontend API service to match backend endpoints
2. Remove non-existent endpoint calls (loyalty, marketing, blog, etc.)
3. Fix router API calls to use `/admin/routers` instead of `/admin/mikrotik/routers`
4. Fix dashboard API to use `/admin/dashboard/stats`


