## Marketing Automation Module – Scope & Design Notes (2025-11-26)

### Responsibilities
Centralizes all outbound communication tooling:

- Campaign CRUD + execution (`MarketingCampaign`, `MarketingAutomationService`)
- Audience management (`AudienceSegment`, template storage)
- Media campaigns for captive portal splash screens
- Scheduler + automation triggers (birthday, inactive user, etc.)
- Event logging & analytics (impressions, marketing logs)

### Key APIs

| Path | Purpose | Auth Notes |
| --- | --- | --- |
| `GET/POST/PUT/DELETE /api/v1/marketing/campaigns` | Manage messaging campaigns | `@PreAuthorize` requires `ADMIN`/`MARKETING` roles |
| `POST /api/v1/marketing/campaigns/{id}/send` | Execute a campaign immediately | same as above |
| `POST /api/v1/marketing/campaigns/process-scheduled` | Sweep SCHEDULED campaigns and send them | same |
| `GET /api/v1/marketing/logs` | Inspect event logs | same |
| `GET/POST/DELETE /api/v1/marketing/segments` | Manage audience segments | same |
| `GET/POST/DELETE /api/v1/marketing/templates` | Manage SMS templates | same |
| `GET/POST /api/v1/marketing/media` | Manage portal media campaigns | same |
| `GET /api/v1/marketing/media/active` | **Public** endpoint used by portal UI to fetch current banner/video | no @PreAuthorize |
| `POST /api/v1/marketing/media/impressions` | **Public** endpoint to record an impression | no @PreAuthorize |
| `GET/POST /api/v1/marketing/schedules` | Manage scheduler config | guarded |
| `GET/POST/DELETE /api/v1/marketing/automation` | Manage automation triggers | guarded |

### Data Model Touchpoints
- Campaigns tie into customer data (`CustomerRepository`) for targeting; audience selection uses fields such as account type, loyalty points, last activity.
- Media campaigns + impressions use `MediaCampaignRepository` and `MediaImpressionRepository`.
- Templates, segments, scheduler configs, automation triggers each have dedicated repositories that store metadata.
- SMS delivery uses `SmsService` (currently mocked/stubbed in tests).

### Existing Tests
- `MarketingAutomationControllerIntegrationTest` (MockMvc-based, security filters disabled, `@WithMockUser`):
  - `GET /marketing/media/active` returns seeded campaign
  - `POST /marketing/media/impressions` persists entry
  - `GET /marketing/templates` exposes seeded template
- No explicit tests yet for campaign CRUD/send, scheduler, automation triggers.

### Current Limitations (testing profile)
- Controller methods still enforce `@PreAuthorize`. With global security disabled, calling them via curl without an authenticated principal returns 403. The integration test suite bypasses this using `@WithMockUser` and `addFilters=false`. We’ll follow the same pattern by either:
  - invoking MockMvc tests (preferred), or
  - introducing a testing-only bypass if we need manual API verification before re-enabling security globally.
- Campaign execution depends on actual customer records; in H2 we only have the two OTP accounts unless additional seeders are added.

### Plan of Attack
1. **Run existing integration tests** (`MarketingAutomationControllerIntegrationTest`) to confirm current baseline.
2. **Manual API checks (public endpoints)** – `GET /marketing/media/active`, `POST /marketing/media/impressions` should work without auth; confirm responses align with integration tests.
3. **Document guarded route behavior** – capture current 403 responses when hitting admin endpoints without auth, note requirement to revisit once security is on (or simulate JWT via curl if we wire a temporary testing Authentication).

---

## Test Execution – 26 Nov 2025

### Automated
- `mvn -Dtest=MarketingAutomationControllerIntegrationTest test` – ✅ PASS. Confirms integration suite still seeds campaigns/templates in isolation and exercises media endpoints via MockMvc.

### Manual API (security disabled, empty runtime DB)

| Endpoint | Request | Result | Notes |
| --- | --- | --- | --- |
| `GET /api/v1/marketing/media/active` | none | ⚠️ 404 | Expected in bare runtime because no `MediaCampaign` rows exist outside the integration test context. |
| `POST /api/v1/marketing/media/impressions` | `{"campaignId":"MEDIA-TEST",...}` | ⚠️ 404 | Same root cause—campaign repository is empty so controller returns 404. |

### Follow-ups
- To exercise marketing APIs against the running server we need a data seeding hook (similar to `/testing/reset-otps`). Options: add a testing endpoint to insert sample media campaigns/templates, or run a CLI seeder before hitting the endpoints.
- Guarded routes (campaign CRUD, segments, templates, etc.) require an authenticated admin principal; we’ll cover them when security is re-enabled or by extending the testing controller if needed.

---

## Test Execution Update – 01 Dec 2025

### Testing Seeder Added
- ✅ Added `POST /api/v1/testing/seed-media-campaign` endpoint to `TestingSupportController` for seeding test media campaigns.
- Creates a test `MediaCampaign` with ID `MEDIA-TEST`, active video campaign for portal testing.

### Manual API Testing (with seeded data)

| Endpoint | Request | Result | Notes |
| --- | --- | --- | --- |
| `POST /api/v1/testing/seed-media-campaign` | none | ✅ 200 | Successfully seeds test media campaign |
| `GET /api/v1/marketing/media/active` | none | ✅ 200 | Returns seeded campaign data: `{"type":"video","url":"...","duration":6,"skipAllowed":true,"campaignId":"MEDIA-TEST","title":"Test Portal Promo"}` |
| `POST /api/v1/marketing/media/impressions` | `{"campaignId":"MEDIA-TEST","phoneNumber":"+255742844024",...}` | ✅ 200 | Successfully records impression for test number `0742844024` |

### Test Numbers Used
- `+255742844024` (0742844024) - Successfully tested OTP request/verify/login flow and media impression recording.

### Configuration Fix Applied (01 Dec 2025)
- ✅ **Context Path Configuration Fixed**: 
  - Issue: Base `application.yml` had `context-path: /api/v1`, and controllers also use `/api/v1` in `@RequestMapping`, causing doubled paths.
  - Solution: Set `context-path: /` in `application-testing.yml` to override the base config, and updated `TestingSupportController` to use `/api/v1/testing` for consistency.
  - Result: All endpoints now work with single `/api/v1/...` paths:
    - `POST /api/v1/customer-auth/request-otp` ✅
    - `POST /api/v1/testing/seed-media-campaign` ✅
    - `GET /api/v1/marketing/media/active` ✅
    - `POST /api/v1/marketing/media/impressions` ✅

### Known Limitations
- Guarded routes (campaign CRUD, segments, templates, etc.) still require authenticated admin principal; will be covered when security is re-enabled.

