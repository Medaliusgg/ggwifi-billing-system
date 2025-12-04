# 🏢 GG-WiFi Enterprise Hotspot Billing System - Complete Architecture

## 📋 Overview

This document outlines the complete enterprise-grade architecture for the GG-WiFi Hotspot Billing System, designed to match telco-grade platforms (Vodacom, TTCL, Tigo standards).

---

## 🗄️ Database Schema (Using Existing + Enhancements)

### ✅ **Core Entities (Already Exist - Enhanced)**

1. **Customer** (`customers` table)
   - ✅ Already has: phone, email, loyalty points, status
   - ➕ **Enhancements Needed:**
     - `device_mac_history` (JSON) - Track all MAC addresses per customer
     - `blacklist_reason` - Reason for blacklisting
     - `total_sessions` - Count of all sessions
     - `last_device_mac` - Last used device MAC
   - **Usage:** Both Hotspot Users AND PPPoE Customers

2. **InternetPackage** (`internet_packages` table)
   - ✅ Already has: name, price, duration, bandwidth limits
   - ➕ **Enhancements Needed:**
     - `plan_type` (HOTSPOT/PPPOE) - Already exists via `package_type`
     - `loyalty_points_awarded` - Points given when package purchased
     - `validity_after_activation` - Days valid after activation
     - `router_profile_name` - MikroTik profile name
     - `auto_reconnect_capable` - Boolean flag

3. **Voucher** (`vouchers` table)
   - ✅ Already has: code, status, usage tracking
   - ➕ **Enhancements Needed:**
     - `device_mac_history` (JSON) - All MACs that used this voucher
     - `issued_date` - When voucher was issued
     - `revoked_at` - Revocation timestamp

4. **Router** (`routers` table)
   - ✅ Already has: IP, credentials, status, health monitoring
   - ➕ **Enhancements Needed:**
     - `hotspot_domain` - Assigned hotspot domain
     - `vlan_mappings` (JSON) - VLAN configuration
     - `hotspot_server_profile` - MikroTik hotspot profile name
     - `pppoe_profile` - MikroTik PPPoE profile name

5. **VoucherSession** (`voucher_sessions` table)
   - ✅ **Already Complete!** - Has all session management features
   - Used for: Active session tracking, MAC/IP changes, heartbeat

6. **Payment** (`payments` table)
   - ✅ Already has: gateway, transaction ID, status
   - **Usage:** Payment processing and callbacks

7. **Transaction** (`transactions` table)
   - ✅ Already has: reconciliation, retry logic
   - **Usage:** Financial transaction records

8. **Invoice** (`invoices` table)
   - ✅ Already has: invoice number, tax, PDF generation ready
   - **Usage:** Customer invoices

9. **Device** (`devices` table)
   - ✅ Already has: MAC, IP, status, type
   - **Usage:** Device management and tracking

### 🆕 **New Entities (Only Missing Ones)**

1. **AccessPoint** (`access_points` table) - NEW
   - AP management for Reyee APs
   - Fields: name, IP, MAC, signal strength, connected devices, SSID, channel

2. **LoyaltyReward** (`loyalty_rewards` table) - NEW
   - Reward items and redemption tracking
   - Fields: reward_name, points_required, inventory, redemption_history

3. **PPPoECustomer** (Uses `Customer` entity with `account_type = PPPOE`)
   - KYC data, installation workflow, technician assignment
   - **Note:** Uses existing `Customer` entity, no new table needed

4. **DeviceHistory** (`device_history` table) - NEW
   - Track MAC changes per customer/phone
   - Fields: customer_id, phone_number, mac_address, first_seen, last_seen, device_fingerprint

5. **MarketingCampaign** - ✅ Already exists!

---

## 🔧 Module Architecture

### 1. **Dashboard Module**
**Service:** `DashboardService.java` (NEW)
**Controller:** `DashboardController.java` (NEW)

**Features:**
- Real-time metrics aggregation
- Active sessions count (from `VoucherSession`)
- Router health (from `Router`)
- Revenue calculations (from `Payment`, `Transaction`)
- AP status (from `AccessPoint`)

**Data Sources:**
- `VoucherSession` - Active sessions
- `Router` - Router status
- `Payment` - Revenue
- `Customer` - New customers today
- `RadiusAcct` - Failed login attempts

---

### 2. **User Management Module**
**Service:** `UserManagementService.java` (NEW)
**Controller:** `UserManagementController.java` (NEW)

**Uses Existing:**
- `Customer` entity (for hotspot users)
- `DeviceHistory` entity (for MAC tracking)
- `VoucherSession` (for session history)

**Features:**
- Search by phone/MAC
- Device history (from `DeviceHistory`)
- MAC randomization tracking
- Blacklist management (enhance `Customer` entity)
- Session history (from `VoucherSession`)

---

### 3. **Internet Packages Module**
**Service:** `PackageService.java` ✅ EXISTS
**Controller:** `PackageController.java` ✅ EXISTS

**Enhancements:**
- Add missing fields to `InternetPackage` entity
- Split Hotspot vs PPPoE plans (use `package_type` enum)

---

### 4. **Voucher Management Module**
**Service:** `VoucherService.java` ✅ EXISTS
**Controller:** `VoucherController.java` ✅ EXISTS

**Enhancements:**
- Bulk creation (already exists via `VoucherBatch`)
- Import/export (add to service)
- Device MAC history tracking

---

### 5. **Router Management Module**
**Service:** `RouterService.java` ✅ EXISTS
**Controller:** `RouterController.java` ✅ EXISTS

**Enhancements:**
- Add hotspot domain, VLAN mappings to `Router` entity
- AP list per router (via `AccessPoint.router_id`)

---

### 6. **Customer Management Module (PPPoE)**
**Service:** `CustomerService.java` ✅ EXISTS
**Controller:** `CustomerController.java` ✅ EXISTS

**Uses:**
- `Customer` entity with `account_type = PPPOE`
- Installation workflow tracking (add fields to `Customer`)

**Enhancements:**
- Add installation status fields to `Customer`
- Technician assignment field

---

### 7. **Finance & Payments Module**
**Service:** `PaymentService.java` ✅ EXISTS
**Controller:** `PaymentController.java` ✅ EXISTS

**Uses:**
- `Payment` entity
- `Transaction` entity
- `Invoice` entity

**Features:**
- Transaction history ✅
- Payment gateway logs ✅
- Revenue breakdown ✅
- Refund capability (add to service)

---

### 8. **Transactions Module**
**Service:** `TransactionService.java` ✅ EXISTS
**Controller:** `TransactionController.java` ✅ EXISTS

**Uses:**
- `Transaction` entity (already has reconciliation, duplicate detection)

---

### 9. **Invoices Module**
**Service:** `InvoiceService.java` ✅ EXISTS
**Controller:** `InvoiceController.java` ✅ EXISTS

**Uses:**
- `Invoice` entity (already has invoice number, tax, PDF ready)

**Enhancements:**
- PDF generation implementation
- Reprint functionality

---

### 10. **Payments Processing Module**
**Service:** `PaymentService.java` ✅ EXISTS (enhance)
**Controller:** `CustomerPortalController.java` ✅ EXISTS

**Features:**
- Payment callbacks ✅ (ZenoPay webhook)
- Retry failed callbacks (add to service)
- Auto-reconnect after payment (already in `EnhancedRadiusService`)

---

### 11. **Analytics & Reports Module**
**Service:** `ReportService.java` ✅ EXISTS
**Controller:** `ReportsAnalyticsController.java` ✅ EXISTS

**Enhancements:**
- Usage per plan charts
- Top customers
- Revenue trends
- Router uptime charts

---

### 12. **Session Management Module**
**Service:** `SessionManagementService.java` ✅ EXISTS
**Controller:** `WebSocketController.java` ✅ EXISTS

**Uses:**
- `VoucherSession` entity (already complete!)

**Features:**
- Active sessions list ✅
- Terminate session ✅
- Reset session ✅
- MAC mapping ✅
- Auto-reconnect ✅

---

### 13. **System Settings Module**
**Service:** `SystemConfigurationService.java` (NEW - use `SystemConfiguration` entity)
**Controller:** `SystemSettingsController.java` (NEW)

**Uses:**
- `SystemConfiguration` entity ✅ EXISTS

---

### 14. **Loyalty Program Module**
**Service:** `LoyaltyService.java` (NEW)
**Controller:** `LoyaltyController.java` (NEW)

**Uses:**
- `Customer.loyalty_points` ✅ EXISTS
- `LoyaltyReward` entity (NEW)

**Features:**
- Points per package (configurable)
- Reward tiers
- Redemption management

---

### 15. **Marketing Module**
**Service:** `MarketingCampaignService.java` ✅ EXISTS
**Controller:** `MarketingCampaignController.java` (check if exists)

**Uses:**
- `MarketingCampaign` entity ✅ EXISTS

---

### 16. **Device Management Module**
**Service:** `DeviceManagementService.java` (NEW)
**Controller:** `DeviceManagementController.java` (NEW)

**Uses:**
- `Device` entity ✅ EXISTS
- `DeviceHistory` entity (NEW)
- `DeviceFingerprint` entity ✅ EXISTS

**Features:**
- MAC tracking
- Device fingerprinting ✅
- Fraud detection

---

### 17. **AP Management Module**
**Service:** `APManagementService.java` (NEW)
**Controller:** `APManagementController.java` (NEW)

**Uses:**
- `AccessPoint` entity (NEW)
- `Router` entity (for router association)

**Features:**
- AP online/offline status
- Signal strength
- Connected devices count
- Traffic per AP

---

## 📊 Entity Relationship Summary

```
Customer (1) ──< (N) DeviceHistory
Customer (1) ──< (N) VoucherSession
Customer (1) ──< (N) Payment
Customer (1) ──< (N) Invoice
Customer (1) ──< (N) Transaction

InternetPackage (1) ──< (N) Voucher
InternetPackage (1) ──< (N) VoucherSession

Router (1) ──< (N) AccessPoint
Router (1) ──< (N) VoucherSession (via radius_username)

Voucher (1) ──< (1) VoucherSession

LoyaltyReward (N) ──< (N) Customer (via redemption_history)
```

---

## 🚀 Implementation Priority

### Phase 1: Enhance Existing (No New Tables)
1. Enhance `Customer` entity with device history fields
2. Enhance `InternetPackage` with missing attributes
3. Enhance `Router` with hotspot/PPPoE profile fields
4. Enhance `Voucher` with MAC history

### Phase 2: New Entities (Minimal)
1. Create `AccessPoint` entity
2. Create `LoyaltyReward` entity
3. Create `DeviceHistory` entity

### Phase 3: New Services
1. `DashboardService`
2. `LoyaltyService`
3. `APManagementService`
4. `DeviceManagementService`
5. `SystemConfigurationService`

### Phase 4: Enhance Existing Services
1. Add missing methods to existing services
2. Implement PDF generation in `InvoiceService`
3. Add refund logic to `PaymentService`

---

## ✅ What's Already Complete

- ✅ Session Management (`VoucherSession` - fully featured)
- ✅ Payment Processing (ZenoPay integration)
- ✅ SMS Notifications
- ✅ RADIUS Integration
- ✅ MikroTik API Integration
- ✅ Device Fingerprinting
- ✅ Redis Session Management
- ✅ Encryption Service
- ✅ Audit Logging
- ✅ User Management
- ✅ Voucher Management
- ✅ Router Management (basic)

---

## 📝 Next Steps

1. **Enhance existing entities** (add missing fields)
2. **Create 3 new entities** (AccessPoint, LoyaltyReward, DeviceHistory)
3. **Build new services** for missing modules
4. **Enhance existing services** with missing methods
5. **Create comprehensive API controllers**
6. **Build admin frontend** with all modules

---

**Last Updated:** 2025-01-27
**Status:** Architecture Complete - Ready for Implementation





