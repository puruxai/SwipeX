# Production verification and registration incident report

Verified against `https://swipex.onrender.com` and `https://swipe-x-nine.vercel.app` on 2026-07-13.

## Registration incident

| Item | Finding |
|---|---|
| Symptom | Browser reports registration failure; a valid direct API request currently receives HTTP 500, not HTTP 422. |
| Frontend form | `Signup.handleSubmit` sends `{ email, password, full_name, role }`, which is the correct request shape. |
| Axios/Auth Context | `AuthContext.register` forwards that payload to `/auth/register` without mutation. |
| Live Pydantic contract | OpenAPI requires `email`, `password` (10–128 characters), and `full_name` (2–255 characters). The tested payload met every constraint. |
| Server isolation | `/health` and `/api/v1/jobs/` return 200, while both `/auth/register` and `/auth/login` return 500. The fault is authentication-specific. |
| Root cause | The deployed password hashing path uses Passlib/bcrypt on a managed Linux image. Passlib's bcrypt capability probe hashes a 260-byte test secret; bcrypt 4.x rejects secrets longer than 72 bytes, causing an unhandled exception before either authentication endpoint responds. |
| Code change | `backend/app/auth.py` wraps only bcrypt's internal overlong probe input at 72 bytes, which is bcrypt's defined effective limit. Application passwords remain limited by Pydantic. `test_password_hash_round_trip` prevents regression. |
| Frontend change | `Signup` now mirrors API length constraints, reports a visible accessible password error, and prevents an avoidable validation request. |
| Required deployment | Deploy the current backend revision to Render, then run the verification sequence below. The live service cannot reflect un-deployed repository changes. |

## Deployment compatibility findings

- Live health endpoint: **200**.
- Live public jobs endpoint: **200**.
- Live Vercel-origin CORS header: `Access-Control-Allow-Origin: https://swipe-x-nine.vercel.app`.
- Live API additionally sends `Access-Control-Allow-Credentials: true`; the current repository configuration uses bearer tokens and should keep credentials disabled unless cookie authentication is introduced.
- The application must set `CORS_ORIGINS=https://swipe-x-nine.vercel.app` in Render. Use no wildcard origin.
- Set `SECRET_KEY` in Render's secret store, `ENVIRONMENT=production`, and `SERVE_LEGACY_UI=false`.

## Post-deploy verification sequence

1. Submit a valid new candidate registration. Expect **200**, bearer access token, refresh token, and `user.role === "user"`.
2. Login using that account. Expect **200**, then call `/api/v1/auth/me` with the access token. Expect the account email.
3. Call `/api/v1/auth/refresh` with the refresh token. Expect a new access token and a valid `/auth/me` response.
4. Upload an allowed PDF/DOCX/TXT below 10 MB; verify the analyzer returns `ats_score`, `breakdown`, and a primary resume.
5. Call authenticated swipe feed, record `like`, verify application creation, then verify candidate dashboard data.
6. Verify recruiter ownership restrictions with a second recruiter, and admin-only routes with a candidate token.
7. Request a nonexistent frontend route and verify the new 404 page; force a component failure in a staging build to verify the error boundary.

## Static frontend corrections

| File | Function/component | Change | Reason |
|---|---|---|---|
| `frontend/src/pages/Signup.jsx` | `handleSubmit` | Matches API min/max constraints and uses an accessible error message. | Removes client-side cause of predictable 422 responses and makes the contract visible. |
| `frontend/src/App.jsx` | route tree | Uses an explicit 404 page. | Broken links are no longer silently redirected to home. |
| `frontend/src/components/AppErrorBoundary.jsx` | `AppErrorBoundary` | Captures uncaught rendering exceptions and renders recovery UI. | Prevents a blank screen from a React runtime exception. |
| `frontend/src/pages/ErrorPage.jsx` | error routes | Provides 404 and recoverable application-error states. | Completes the missing route/error UX without altering existing routes. |
| `frontend/src/pages/*` | API failure handlers | Replaces console-only catches with existing toast notifications. | Makes network/API failures actionable for users and eliminates production console noise. |
| `frontend/src/pages/ResumeAnalyzer.jsx` | `handleFileUpload` | Validates supported formats and the 10 MB backend limit before upload. | Avoids preventable upload requests while retaining server-side validation as the security boundary. |
