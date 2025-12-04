## Customer Profile & Loyalty – Module Map (2025-11-25)

### Goal
Validate the end-to-end “know your customer” experience for authenticated subscribers:

- Customer Dashboard aggregation (`/api/v1/customer-dashboard`)
- Loyalty analytics & redemption endpoints (`/api/v1/loyalty/**`)
- Supporting customer records (`CustomerAccount`, `Customer`, loyalty entities)

Security remains disabled (per global test plan); focus is on data integrity and module communication.

### Key Components

| Layer | Artifacts | Notes |
| --- | --- | --- |
| Controllers | `CustomerDashboardController`, `CustomerPortalController`, `LoyaltyController`, `CustomerController` | Dashboard exposes consolidated view; Loyalty controller offers admin + self-service APIs; Customer controller is admin CRUD but shares the same entities. |
| Services | `CustomerDashboardService`, `EnhancedLoyaltyService`, `CustomerService`, `PackageService`, `VoucherService`, `PaymentService` | Dashboard service fans out to 10+ repositories (accounts, payments, vouchers, sessions, loyalty, devices). Enhanced loyalty handles tier rules, transactions, redemption workflows, SMS notifications. |
| Data | `CustomerAccount`, `Customer`, `LoyaltyTransaction`, `LoyaltyReward`, `LoyaltyRedemption`, `Voucher`, `Payment`, `InternetPackage`, `DeviceHistory`, `VoucherSession` | CustomerAccount is the canonical login profile; `Customer` carries loyalty/CRM attributes; loyalty subsystems rely on payment/voucher data seeded via webhook simulation. |
| Config | `application.yml` (`otp`, `jwt`, `rate-limit`), testing profile disables security/rate limits | No additional toggles specific to dashboard/loyalty besides existing testing switches. |

### Primary Endpoints Under Test

1. `/api/v1/customer-dashboard?phoneNumber=...` – full dashboard payload (profile, loyalty, transactions, packages, sessions, devices, rewards, stats).
2. `/api/v1/customer-dashboard/{profile|loyalty|transactions|sessions}` – targeted slices, expect subsets of the dashboard aggregate.
3. `/api/v1/loyalty/progress/{phone}` – customer-facing snapshot via `EnhancedLoyaltyService.getCustomerProgress`.
4. `/api/v1/loyalty/customer/{customerId}/...` – admin-oriented variants (requires customer ID; we can map phone → ID via `CustomerAccount`/`Customer` tables created during auth tests).
5. `/api/v1/admin/customers/**` – readiness check for CRUD and stats endpoints (permissions bypassed because security is off, but responses must still be well-formed).

### Data Flow Highlights

- **Dashboard**: Resolves `CustomerAccount` by normalized phone → pulls CRM fallback from `Customer` entity → augments with loyalty (via `Customer` + `EnhancedLoyaltyService`), payments (`PaymentRepository`), vouchers/sessions (`VoucherRepository`, `VoucherSessionRepository`), packages (`InternetPackageRepository`), devices (`DeviceHistoryRepository`, `CustomerDeviceRegistryRepository`), and open rewards.
- **Loyalty**: `EnhancedLoyaltyService` awards/deducts points based on package purchases (`Payment` + `InternetPackage`), writes to `LoyaltyTransaction`/`LoyaltyRedemption`, adjusts `Customer` tier fields, emits SMS/notifications.
- **Portal webhook**: `CustomerPortalController`’s `/webhook/zenopay` path is the glue between payments, vouchers, loyalty, and device provisioning; manual testing will simulate key read-side endpoints rather than the entire webhook flow.

### Assumptions / Test Data

- Reuse the two customer phone numbers created during auth testing: `0742844024` and `0658823944`. Their accounts and loyalty balances already exist in H2 thanks to the OTP login + loyalty awarding hooks.
- Testing profile seeds default internet packages (`Universal Daily`, `Premium Monthly`, `Student Special`); voucher/session tables start empty but can be populated via future webhook simulations.
- Security remains disabled (`app.security.enabled=false`, `nosecurity` profile not required because config flag is honored).

### Next Actions

1. **Unit/Service Baseline** – run `mvn test` (currently only CustomerAuth tests exist; record absence of dedicated dashboard/loyalty tests).
2. **API Exercises** – hit the endpoints listed above with both phone numbers; note any missing data (e.g., empty transactions) or runtime exceptions.
3. **Findings Log** – update this doc with pass/fail notes and open issues (e.g., missing loyalty records in fresh DB, null pointer risks, inconsistent default tiers).

---

## Test Execution – 26 Nov 2025

### Automated / Unit
- `mvn test` (backend root) – ✅ PASS. Still only covers `CustomerAuthServiceTest`; no dashboard/loyalty-specific unit coverage exists.

### Manual API Runs (security disabled, fresh H2)

| Endpoint | Payload | Result |
| --- | --- | --- |
| `GET /api/v1/api/v1/customer-dashboard?phoneNumber=%2B255742844024` | n/a | ✅ 200 with structured payload (profile, loyalty, packages, etc.); all sections empty/default because no payments/sessions exist yet, but no errors. |
| `GET /api/v1/api/v1/customer-dashboard?phoneNumber=%2B255658823944` | n/a | ✅ 200, same structure as above with zeroed stats. Confirms aggregator handles multiple accounts. |
| `GET /api/v1/api/v1/customer-dashboard/loyalty?phoneNumber=...` | n/a | ✅ 200, returns tier + zeroed transactions. |
| `GET /api/v1/api/v1/customer-dashboard/transactions?phoneNumber=...` | n/a | ✅ 200, empty lists (expected). |
| `GET /api/v1/api/v1/customer-dashboard/sessions?phoneNumber=...` | n/a | ✅ 200, empty array (no active vouchers). |
| `GET /api/v1/loyalty/progress/%2B255742844024` | Authorization header omitted (security disabled) | ⚠️ **403** – `@PreAuthorize` still enforces roles even when global security is off, so unauthenticated calls can’t reach loyalty endpoints. Need either mocked Authentication or a testing bypass if we want to exercise these routes without re-enabling security. |
| `GET /api/v1/api/v1/admin/customers` | n/a | ⚠️ **403** – blocked by `PermissionService` (expects `CUSTOMER_READ` permission tied to an authenticated username). Even with security disabled, the permission check fails because no admin user is loaded in `UserDetailsService`. |

### Observations / Follow-ups

1. **Dashboard happy path confirmed** – retrieving customer aggregates works once the OTP login has seeded `CustomerAccount`. Behavior degrades gracefully (empty collections rather than stack traces) when downstream tables are empty.
2. **Loyalty/Admin routes still guarded** – method-level security (`@PreAuthorize`) plus explicit permission checks block testing without a populated `SecurityContext`. Options: (a) temporarily inject a mock Authentication in tests, (b) add a testing-only flag to bypass `PermissionService`, or (c) re-enable security and call endpoints with real JWTs at the final security pass.
3. **Data prerequisites** – every new H2 boot requires running the OTP login flow to recreate `CustomerAccount` entries before dashboard/loyalty calls succeed. Consider a lightweight seeder for future automated runs.

