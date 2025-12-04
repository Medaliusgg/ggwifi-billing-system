## Customer Auth Module – Testing Record (2025-11-25)

### Environment
- Profile: `testing`
- DB: H2 in-memory (`ddl-auto=create-drop`)
- Security: disabled (`APP_SECURITY_ENABLED=false`, `/testing/reset-otps` used)
- Backend started via `mvn spring-boot:run --spring.profiles.active=testing --spring.flyway.enabled=false`

### Scope
1. Design/requirements alignment
2. Unit tests (`CustomerAuthServiceTest`)
3. Manual API/integration checks (cURL equivalents of `api-test.sh`)
4. Data-model & inter-module interactions (OTP repo, account auto-creation, JWT service)
5. Security temporarily bypassed per test plan

### Results
| Step | Action | Outcome |
| --- | --- | --- |
| Unit suite | `mvn test` (focus on `CustomerAuthServiceTest`) | ✅ Pass |
| OTP request (0742844024) | `POST /api/v1/customer-auth/request-otp` | ✅ `{"status":"success"}` |
| OTP login (0742844024) | `POST /api/v1/customer-auth/verify-otp` with logged OTP `443966` | ✅ tokens + account payload |
| Refresh (0742844024) | `POST /api/v1/customer-auth/refresh` with latest refresh token | ✅ new token pair |
| OTP request (0658823944) | same as above | ✅ |
| OTP login (0658823944) | OTP `101530` | ✅ |
| Refresh (0658823944) | | ✅ |

### Key Checks & Fixes
1. **Configurable expiry** – introduced `otp.expiry-minutes` and set each `CustomerOTP.expiresAt` before persisting, avoiding NULL errors and making lifetime adjustable per env.
2. **Repository portability** – switched to `findTopByPhoneNumberAndPurposeAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc` to keep H2 + MySQL behavior consistent.
3. **JWT fallback** – `JwtService.generateTokenWithContext` now catches `UsernameNotFoundException` and emits `ROLE_CUSTOMER` claims so customer logins don’t depend on the admin `User` table.
4. **Testing aids** – `/testing/reset-otps` endpoint plus log-based OTP visibility enabled deterministic runs without SMS gateway.
5. **Rate limits** – adhered to `disable-otp-rate-limit` flag in testing profile to avoid throttling during repeated runs.

### Remaining Notes / Next Steps
- Re-enable full Spring Security at the end of the overall plan and retest OTP + JWT with filters active.
- Consider scripting `api-test.sh` to auto-feed OTPs now that they are logged; currently tests executed via manual cURL.
- Customer Auth module can be marked “functionally green” with security disabled. Ready to proceed to the next backend module per master checklist.





