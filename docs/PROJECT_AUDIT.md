# SwipeX project audit — July 2026

## Scope

Reviewed the React/Vite frontend, FastAPI routers and AI modules, SQLAlchemy models, Docker configuration, tests, and existing documentation. This is an implementation audit, not a claim that external cloud or OAuth integrations have been deployed.

## Fixed in this iteration

| Severity | Finding | Resolution |
|---|---|---|
| Critical | Google mock trusted a browser-provided email/name. | Disabled the endpoint and UI until a server-side ID-token verifier is supplied. |
| Critical | A public seed endpoint could mutate production data. | It now requires an admin and is unavailable in production. |
| High | Password hashes used a deterministic, application-secret-derived PBKDF2 value. | New passwords use bcrypt; legacy hashes upgrade after successful login. |
| High | Access tokens lived for seven days with no renewal path. | Access tokens now expire quickly and the client refreshes once before retrying. |
| High | Any recruiter could change an application status. | Ownership is now checked against the job's recruiter. |
| High | Resume upload assigned a non-existent `UserProfile.ats_score` field. | Removed the invalid writes; the score remains on `Resume`. |
| Medium | API served a separate stale static UI in addition to Vite. | Legacy UI is opt-in via `SERVE_LEGACY_UI`; API root returns service metadata by default. |
| Medium | Search pagination accepted unbounded values and ignored skills. | Added page bounds and skill filtering. |
| Medium | Account deletion used a bulk operation that skipped ORM cascades. | It now deletes the loaded user entity so configured dependent records cascade. |

## Open findings

### Critical

- Resume files are still mounted under `/uploads`. Their random names reduce guessing but do not provide authorization-checked access. Move files to private object storage and issue short-lived signed downloads.
- Refresh tokens are stateless. They cannot yet be revoked per device or invalidated immediately after logout/password change.

### High

- SQLite is the default and schema creation uses `Base.metadata.create_all()`. There are no Alembic migrations or production PostgreSQL operational procedures.
- API routers combine HTTP, persistence, and business logic. Introduce service/repository boundaries before adding significant features.
- In-memory rate limiting and request telemetry are single-process, unbounded, and unsuitable for multi-instance deployment.
- The database does not consistently enforce uniqueness at the schema level for swipes and applications; application code alone cannot prevent race-condition duplicates.

### Medium

- AI features are deterministic heuristics and TF-IDF scoring, not validated embedding models. The stated ATS and salary accuracy should not be presented as measured product performance.
- Several UI pages use raw `console.error`, while errors are not uniformly surfaced as accessible user feedback.
- The user experience is dark-only. Light theme, focus-visible treatment, route-level error pages, and automated accessibility checks are still absent.
- Admin telemetry fabricates sample logs when the table is empty, which makes operational reporting misleading.
- Job skill filtering scans JSON in application memory; normalize skills or use a PostgreSQL GIN index for catalogue-scale search.

### Low

- Several older strings have mojibake characters (for example, copyright and bullet symbols).
- Docker Compose uses SQLite by default and has no persistent database backup policy.
- Test coverage is small and lacks isolated database fixtures, browser tests, and CI execution.

## Recommended delivery order

1. Private resume storage, Alembic + PostgreSQL, token revocation, verified OAuth, and Redis-based rate limiting.
2. Service/repository split, structured logs/metrics, background jobs, transactional uniqueness constraints, and integration tests.
3. Theme system, accessible error/loading states, email notifications, WebSockets, and progressive web app support.
4. Evaluate sentence-transformer matching against a labelled dataset, add model version/metrics tables, and introduce a human-review path for recommendation quality.
