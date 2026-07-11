# SwipeX production readiness guide

## Delivered hardening

- Bcrypt password hashes with automatic upgrade of legacy development hashes after a successful login.
- Fifteen-minute access tokens and refresh-token responses; the frontend retries one expired request after refreshing.
- Explicit CORS allow-list, production HSTS, frame/content-type protections, referrer and permissions policies.
- Bounded job pagination, validated swipe actions, stronger registration constraints, and recruiter ownership enforcement for application status changes.
- Resume profile writes now match the database schema, preventing the upload flow from failing during profile synchronization.
- Docker configuration reads secrets from the environment and waits for a backend health check.

## Deployment requirements

1. Copy `.env.example` to a private deployment secret store. Use a random, 32-byte-or-longer `SECRET_KEY` and set `ENVIRONMENT=production`.
2. Set `CORS_ORIGINS` to the exact frontend origins. Do not use a wildcard with authenticated APIs.
3. Use managed PostgreSQL and private object storage for resume files. SQLite and a local uploads volume are development-only defaults.
4. Add Alembic migrations before schema changes. `Base.metadata.create_all()` bootstraps local development but is not a migration strategy.
5. Run `pytest tests -q` and `npm run build` in CI before deployment. This workspace did not contain Python or Node, so local execution could not be performed.

## Deliberately disabled integration

Google sign-in is visibly marked as unavailable and the backend rejects it until a server-side Google ID-token verifier is wired in. The former mock accepted browser-provided names and emails, which could enable account impersonation. Apply the same verified-callback approach for GitHub.

## Next production increments

- Persist hashed refresh-token identifiers for device-level revocation and logout-all support.
- Replace in-memory rate limiting with Redis and add centralized structured logs, error tracking, and metrics.
- Protect resume download access with authorization-checked, short-lived signed URLs.
- Normalize skills into relational tables or use PostgreSQL JSON/GIN indexes for high-volume filtering.
- Add password reset, email verification, OAuth callback, API integration, and UI accessibility tests to CI.
