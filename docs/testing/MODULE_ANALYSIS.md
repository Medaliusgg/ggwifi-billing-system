# Backend Module Analysis - Complete Endpoint Inventory

**Date:** December 4, 2024
**Purpose:** Comprehensive analysis of all backend modules and their API endpoints

---

## Module Categories

### 1. Authentication & Authorization
### 2. Customer Portal
### 3. Admin Portal
### 4. Customer Management
### 5. Package Management
### 6. Voucher Management
### 7. Payment Processing
### 8. Invoice Management
### 9. Transaction Management
### 10. Loyalty Program
### 11. Session Management
### 12. Router Management
### 13. Access Point Management
### 14. Device Management
### 15. User Management
### 16. System Settings
### 17. Marketing Automation
### 18. Support Tickets
### 19. Reports & Analytics
### 20. Notifications & Alerts
### 21. Audit Logs
### 22. Testing Support

---

## Module 1: Authentication & Authorization

### Controller: `AuthController`
**Base Path:** `/api/v1/auth`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/admin-login` | POST | No | Admin login |
| `/login` | POST | No | User login |
| `/password-reset/request` | POST | No | Request password reset |
| `/password-reset/confirm` | POST | No | Confirm password reset |
| `/email-verification/verify` | POST | No | Verify email |
| `/email-verification/resend` | POST | No | Resend verification email |

### Controller: `CustomerAuthController`
**Base Path:** `/api/v1/customer-auth`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/request-otp` | POST | No | Request OTP for customer login |
| `/verify-otp` | POST | No | Verify OTP and login |
| `/refresh` | POST | No | Refresh authentication token |

### Controller: `MFAController`
**Base Path:** `/api/v1/mfa`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/enable` | POST | Yes | Enable MFA |
| `/disable` | POST | Yes | Disable MFA |
| `/verify` | POST | Yes | Verify MFA code |

---

## Module 2: Customer Portal

### Controller: `CustomerPortalController`
**Base Path:** `/api/v1/customer-portal`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/test` | GET | No | Test endpoint |
| `/packages` | GET | No | Get available packages |
| `/payment` | POST | No | Process payment |
| `/webhook/zenopay` | POST | No | ZenoPay webhook handler |
| `/customer/{phoneNumber}/profile` | GET | No | Get customer profile |
| `/customer/{phoneNumber}/dashboard` | GET | No | Get customer dashboard |
| `/customer/{phoneNumber}/usage` | GET | No | Get customer usage history |
| `/customer/{phoneNumber}/payments` | GET | No | Get customer payment history |
| `/voucher/{voucherCode}/validate` | GET | No | Validate voucher |
| `/voucher/{voucherCode}/activate` | POST | No | Activate voucher |
| `/voucher/{voucherCode}/session/status` | GET | No | Get session status |
| `/voucher/{voucherCode}/session/heartbeat` | POST | No | Record heartbeat |
| `/voucher/{voucherCode}/session/reconnect` | POST | No | Reconnect session |
| `/voucher/{voucherCode}/session/update-mac` | POST | No | Update MAC address |
| `/voucher/{voucherCode}/session/update-ip` | POST | No | Update IP address |
| `/session/reconnect-token` | POST | No | Reconnect with token |

### Controller: `CustomerDashboardController`
**Base Path:** `/api/v1/customer-dashboard`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | Get dashboard data |
| `/profile` | GET | Yes | Get customer profile |

---

## Module 3: Admin Portal

### Controller: `AdminController`
**Base Path:** `/api/v1/admin`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/health` | GET | Yes | Health check |
| `/dashboard` | GET | Yes | Dashboard data |
| `/dashboard/stats` | GET | Yes | Dashboard statistics |
| `/dashboard/technician` | GET | Yes | Technician dashboard |
| `/dashboard/finance` | GET | Yes | Finance dashboard |
| `/dashboard/marketing` | GET | Yes | Marketing dashboard |
| `/profile` | GET | Yes | Admin profile |
| `/users` | GET | Yes | List users |
| `/users` | POST | Yes | Create user |
| `/users/{id}` | GET | Yes | Get user |
| `/users/{id}` | PUT | Yes | Update user |
| `/users/{id}` | DELETE | Yes | Delete user |
| `/users/{username}/role` | PUT | Yes | Update user role |
| `/routers/legacy` | GET | Yes | Legacy routers |
| `/routers/status` | GET | Yes | Router status |
| `/transactions/{transactionId}/approve` | POST | Yes | Approve transaction |
| `/records` | POST | Yes | Create record |

---

## Module 4: Customer Management

### Controller: `CustomerController`
**Base Path:** `/api/v1/admin/customers`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List customers |
| `/{id}` | GET | Yes | Get customer |
| `/phone/{phoneNumber}` | GET | Yes | Get customer by phone |
| `/email/{email}` | GET | Yes | Get customer by email |
| `/active` | GET | Yes | Get active customers |
| `/statistics` | GET | Yes | Customer statistics |
| `/` | POST | Yes | Create customer |
| `/{id}` | PUT | Yes | Update customer |
| `/{id}` | DELETE | Yes | Delete customer |

---

## Module 5: Package Management

### Controller: `PackageController`
**Base Path:** `/api/v1/admin/packages`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List packages |
| `/{id}` | GET | Yes | Get package |
| `/` | POST | Yes | Create package |
| `/{id}` | PUT | Yes | Update package |
| `/{id}` | DELETE | Yes | Delete package |
| `/search` | GET | Yes | Search packages |
| `/filter` | GET | Yes | Filter packages |
| `/analytics` | GET | Yes | Package analytics |
| `/{id}/performance` | GET | Yes | Package performance |

---

## Module 6: Voucher Management

### Controller: `VoucherController`
**Base Path:** `/api/v1/admin/vouchers`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List vouchers |
| `/{id}` | GET | Yes | Get voucher |
| `/code/{voucherCode}` | GET | Yes | Get voucher by code |
| `/phone/{phoneNumber}` | GET | Yes | Get vouchers by phone |
| `/active` | GET | Yes | Get active vouchers |
| `/unused` | GET | Yes | Get unused vouchers |
| `/` | POST | Yes | Create voucher |
| `/{voucherCode}/use` | POST | Yes | Use voucher |
| `/bulk` | POST | Yes | Bulk create vouchers |
| `/template` | POST | Yes | Create from template |
| `/statistics` | GET | Yes | Voucher statistics |
| `/analytics` | GET | Yes | Voucher analytics |
| `/status/{status}` | GET | Yes | Get vouchers by status |
| `/package/{packageId}` | GET | Yes | Get vouchers by package |
| `/{voucherCode}` | DELETE | Yes | Delete voucher |
| `/sessions/active` | GET | Yes | Get active sessions |

### Controller: `VoucherBatchController`
**Base Path:** `/api/v1/admin/voucher-batches`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List batches |
| `/{id}` | GET | Yes | Get batch |
| `/` | POST | Yes | Create batch |
| `/{id}` | PUT | Yes | Update batch |
| `/{id}` | DELETE | Yes | Delete batch |

---

## Module 7: Payment Processing

### Controller: `PaymentController`
**Base Path:** `/api/v1/admin/payments`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List payments |
| `/{id}` | GET | Yes | Get payment |
| `/phone/{phoneNumber}` | GET | Yes | Get payments by phone |
| `/status/{status}` | GET | Yes | Get payments by status |
| `/statistics` | GET | Yes | Payment statistics |
| `/reconcile` | GET | Yes | Reconcile payments |
| `/reconcile/pending` | GET | Yes | Pending reconciliations |
| `/analytics` | GET | Yes | Payment analytics |
| `/` | POST | Yes | Create payment |
| `/{id}` | PUT | Yes | Update payment |
| `/{id}` | DELETE | Yes | Delete payment |

---

## Module 8: Invoice Management

### Controller: `InvoiceController`
**Base Path:** `/api/v1/admin/invoices`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List invoices |
| `/{id}` | GET | Yes | Get invoice |
| `/number/{invoiceNumber}` | GET | Yes | Get invoice by number |
| `/customer/{customerId}` | GET | Yes | Get invoices by customer |
| `/status/{status}` | GET | Yes | Get invoices by status |
| `/paid` | GET | Yes | Get paid invoices |
| `/unpaid` | GET | Yes | Get unpaid invoices |
| `/statistics` | GET | Yes | Invoice statistics |
| `/{id}/pdf` | GET | Yes | Generate PDF |
| `/template` | GET | Yes | Get template |
| `/` | POST | Yes | Create invoice |

---

## Module 9: Transaction Management

### Controller: `TransactionController`
**Base Path:** `/api/v1/admin/transactions`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List transactions |
| `/{id}` | GET | Yes | Get transaction |
| `/phone/{phoneNumber}` | GET | Yes | Get transactions by phone |
| `/status/{status}` | GET | Yes | Get transactions by status |
| `/statistics` | GET | Yes | Transaction statistics |
| `/{id}/refund` | POST | Yes | Refund transaction |
| `/reconcile` | GET | Yes | Reconcile transactions |
| `/reconcile/pending` | GET | Yes | Pending reconciliations |

---

## Module 10: Loyalty Program

### Controller: `LoyaltyController`
**Base Path:** `/api/v1/loyalty`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/customer/{customerId}` | GET | Yes | Get customer loyalty |
| `/customer/{customerId}/rewards` | GET | Yes | Get available rewards |
| `/customer/{customerId}/redeem/{rewardId}` | POST | Yes | Redeem reward |
| `/rewards` | GET | No | Get all rewards |
| `/rewards/all` | GET | Yes | Get all rewards (admin) |
| `/rewards/{rewardId}` | GET | Yes | Get reward |
| `/rewards` | POST | Yes | Create reward |
| `/rewards/{rewardId}` | PUT | Yes | Update reward |
| `/top-customers` | GET | Yes | Get top customers |
| `/customer/{customerId}/progress` | GET | Yes | Get customer progress |
| `/progress/{phoneNumber}` | GET | No | Get progress by phone |
| `/customer/{customerId}/transactions` | GET | Yes | Get loyalty transactions |
| `/customer/{customerId}/redemptions` | GET | Yes | Get redemptions |
| `/customer/{customerId}/redeem` | POST | Yes | Redeem points |
| `/redemptions/pending` | GET | Yes | Get pending redemptions |
| `/redemptions/{redemptionId}/approve` | POST | Yes | Approve redemption |
| `/redemptions/{redemptionId}/deliver` | POST | Yes | Deliver redemption |
| `/customer/phone/{phoneNumber}/snapshot` | GET | Yes | Get customer snapshot |
| `/point-rules` | GET | Yes | Get point rules |
| `/point-rules` | POST | Yes | Create point rule |
| `/point-rules/{ruleId}` | DELETE | Yes | Delete point rule |
| `/tiers` | GET | Yes | Get tiers |
| `/tiers` | POST | Yes | Create tier |
| `/inventory` | GET | Yes | Get inventory |
| `/inventory` | POST | Yes | Update inventory |

---

## Module 11: Session Management

### Controller: `SessionManagementController`
**Base Path:** `/api/v1/sessions`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/active` | GET | Yes | Get active sessions |
| `/{sessionId}` | GET | Yes | Get session |
| `/{sessionId}/disconnect` | POST | Yes | Disconnect session |
| `/statistics` | GET | Yes | Session statistics |

---

## Module 12: Router Management

### Controller: `RouterController`
**Base Path:** `/api/v1/admin/routers`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List routers |
| `/{id}` | GET | Yes | Get router |
| `/` | POST | Yes | Create router |
| `/{id}` | PUT | Yes | Update router |
| `/{id}` | DELETE | Yes | Delete router |
| `/{routerId}/configure` | POST | Yes | Configure router |
| `/status` | GET | Yes | Router status |

---

## Module 13: Access Point Management

### Controller: `APManagementController`
**Base Path:** `/api/v1/ap-management`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List access points |
| `/{id}` | GET | Yes | Get access point |
| `/ap/{apId}` | GET | Yes | Get by AP ID |
| `/router/{routerId}` | GET | Yes | Get by router |
| `/online` | GET | Yes | Get online APs |
| `/offline` | GET | Yes | Get offline APs |
| `/` | POST | Yes | Create access point |
| `/{apId}` | PUT | Yes | Update access point |
| `/{apId}/health` | POST | Yes | Update health |
| `/statistics` | GET | Yes | AP statistics |
| `/health-summary` | GET | Yes | Health summary |
| `/location/{location}` | GET | Yes | Get by location |
| `/low-signal` | GET | Yes | Get low signal APs |
| `/{apId}` | DELETE | Yes | Delete access point |

---

## Module 14: Device Management

### Controller: `DeviceManagementController`
**Base Path:** `/api/v1/devices`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/record` | POST | Yes | Record device |
| `/customer/{customerId}` | GET | Yes | Get customer devices |
| `/phone/{phoneNumber}` | GET | Yes | Get devices by phone |
| `/phone/{phoneNumber}/macs` | GET | Yes | Get MAC addresses |
| `/phone/{phoneNumber}/mac-count` | GET | Yes | Get MAC count |
| `/mac/{macAddress}` | GET | Yes | Get device by MAC |
| `/merge` | POST | Yes | Merge devices |
| `/{macAddress}/blacklist` | POST | Yes | Blacklist device |
| `/{macAddress}/blacklist` | DELETE | Yes | Remove from blacklist |
| `/blacklisted` | GET | Yes | Get blacklisted devices |
| `/fraud/{phoneNumber}` | GET | Yes | Check fraud |
| `/statistics` | GET | Yes | Device statistics |
| `/primary` | POST | Yes | Set primary device |
| `/primary/{phoneNumber}` | GET | Yes | Get primary device |

---

## Module 15: User Management

### Controller: `UserManagementController`
**Base Path:** `/api/v1/user-management`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/search` | GET | Yes | Search users |
| `/profile/{customerId}` | GET | Yes | Get user profile |
| `/profile/phone/{phoneNumber}` | GET | Yes | Get profile by phone |
| `/{customerId}/blacklist` | POST | Yes | Blacklist user |
| `/phone/{phoneNumber}/blacklist` | POST | Yes | Blacklist by phone |
| `/{customerId}/blacklist` | DELETE | Yes | Remove blacklist |
| `/{customerId}/disable` | POST | Yes | Disable user |
| `/{customerId}/enable` | POST | Yes | Enable user |
| `/phone/{phoneNumber}/mac-analysis` | GET | Yes | MAC analysis |
| `/statistics` | GET | Yes | User statistics |

---

## Module 16: System Settings

### Controller: `SystemSettingsController`
**Base Path:** `/api/v1/system-settings`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | Get all settings |
| `/hotspot` | GET | Yes | Get hotspot settings |
| `/hotspot/domain` | POST | Yes | Set hotspot domain |
| `/api-keys` | GET | Yes | Get API keys |
| `/api-keys/{service}` | POST | Yes | Set API key |
| `/notifications` | GET | Yes | Get notification settings |
| `/notifications/{type}` | POST | Yes | Set notification setting |
| `/voucher` | GET | Yes | Get voucher settings |
| `/loyalty` | GET | Yes | Get loyalty settings |
| `/branding` | GET | Yes | Get branding settings |
| `/branding/{key}` | POST | Yes | Set branding |
| `/config/{key}` | GET | Yes | Get config |
| `/config` | POST | Yes | Set config |

---

## Module 17: Marketing Automation

### Controller: `MarketingAutomationController`
**Base Path:** `/api/v1/marketing`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/campaigns` | GET | Yes | List campaigns |
| `/campaigns` | POST | Yes | Create campaign |
| `/campaigns/{campaignId}` | PUT | Yes | Update campaign |
| `/campaigns/{campaignId}` | DELETE | Yes | Delete campaign |
| `/campaigns/{campaignId}/send` | POST | Yes | Send campaign |
| `/campaigns/process-scheduled` | POST | Yes | Process scheduled |
| `/logs` | GET | Yes | Get campaign logs |
| `/segments` | GET | Yes | List segments |
| `/segments` | POST | Yes | Create segment |
| `/segments/{segmentId}` | DELETE | Yes | Delete segment |
| `/templates` | GET | Yes | List templates |
| `/templates` | POST | Yes | Create template |
| `/templates/{templateId}` | DELETE | Yes | Delete template |
| `/media` | GET | Yes | List media |
| `/media` | POST | Yes | Upload media |
| `/media/active` | GET | Yes | Get active media |
| `/media/impressions` | POST | Yes | Record impressions |
| `/schedules` | GET | Yes | List schedules |
| `/schedules` | POST | Yes | Create schedule |
| `/schedules/{scheduleId}/pause` | POST | Yes | Pause schedule |
| `/automation` | GET | Yes | List automations |
| `/automation` | POST | Yes | Create automation |
| `/automation/{triggerId}` | DELETE | Yes | Delete automation |

---

## Module 18: Support Tickets

### Controller: `SupportTicketController`
**Base Path:** `/api/v1/support`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | POST | No | Create ticket |
| `/{ticketId}` | GET | Yes | Get ticket |
| `/` | GET | Yes | List tickets |
| `/{ticketId}/status` | PUT | Yes | Update status |
| `/{ticketId}/assign` | PUT | Yes | Assign ticket |
| `/statistics` | GET | Yes | Ticket statistics |
| `/{ticketId}/resolve` | PUT | Yes | Resolve ticket |

---

## Module 19: Reports & Analytics

### Controller: `ReportsAnalyticsController`
**Base Path:** `/api/v1/reports`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/revenue` | GET | Yes | Revenue reports |
| `/customers` | GET | Yes | Customer reports |
| `/packages` | GET | Yes | Package reports |
| `/vouchers` | GET | Yes | Voucher reports |
| `/payments` | GET | Yes | Payment reports |
| `/analytics` | GET | Yes | Analytics data |

---

## Module 20: Notifications & Alerts

### Controller: `NotificationController`
**Base Path:** `/api/v1/notifications`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List notifications |
| `/{id}` | GET | Yes | Get notification |
| `/` | POST | Yes | Create notification |
| `/{id}/read` | PUT | Yes | Mark as read |
| `/read-all` | PUT | Yes | Mark all as read |

### Controller: `AlertController`
**Base Path:** `/api/v1/alerts`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List alerts |
| `/{id}` | GET | Yes | Get alert |
| `/` | POST | Yes | Create alert |
| `/{id}/acknowledge` | PUT | Yes | Acknowledge alert |

---

## Module 21: Audit Logs

### Controller: `AuditLogController`
**Base Path:** `/api/v1/audit-logs`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | Yes | List audit logs |
| `/{id}` | GET | Yes | Get audit log |
| `/user/{userId}` | GET | Yes | Get logs by user |
| `/action/{action}` | GET | Yes | Get logs by action |

---

## Module 22: Testing Support

### Controller: `TestingSupportController`
**Base Path:** `/api/v1/testing`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/reset-otps` | POST | Yes | Reset OTPs |
| `/seed-media-campaign` | POST | Yes | Seed media campaign |
| `/create-admin-user` | POST | Yes | Create admin user |

---

## Module 23: FreeRADIUS Integration

### Controller: `FreeRadiusController`
**Base Path:** `/api/v1/radius`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/users` | GET | Yes | List RADIUS users |
| `/users` | POST | Yes | Create RADIUS user |
| `/users/{username}` | GET | Yes | Get RADIUS user |
| `/users/{username}` | DELETE | Yes | Delete RADIUS user |

---

## Module 24: Finance Management

### Controller: `FinanceManagementController`
**Base Path:** `/api/v1/finance`

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/overview` | GET | Yes | Finance overview |
| `/transactions` | GET | Yes | List transactions |
| `/transactions` | POST | Yes | Create transaction |
| `/transactions/{id}` | PUT | Yes | Update transaction |
| `/transactions/{id}` | DELETE | Yes | Delete transaction |
| `/budgets` | GET | Yes | List budgets |

---

## Summary Statistics

- **Total Controllers:** 33
- **Total Modules:** 24
- **Total Endpoints:** ~200+
- **Public Endpoints:** ~15
- **Authenticated Endpoints:** ~185+

---

**Next Step:** Create module-by-module test scripts

