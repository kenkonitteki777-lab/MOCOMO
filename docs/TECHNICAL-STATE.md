# MOCOMO technical state — 2026-10-06

Stack: Next.js 16.3.8 / React 19.3.0 / Supabase JS 2.117.2 / GitHub / Vercel. Dependencies pinned; package-lock committed.

Repository: https://github.com/kenkonitteki777-lab/MOCOMO (main).
Supabase ref: xoqawubwmuwvsrvokmxi (Tokyo), ACTIVE_HEALTHY.

9 original public tables, all RLS owner/parent checks. Applied migrations: mocomo_core_schema_v1, mocomo_memory_system, mocomo_memory_validation. Added invoker RPCs atomically initialize a child world and record an idempotent memory plus world/creation/play session.

App: client-only Supabase Auth and Data API using publishable key. No service role. Guest local storage is separate from cloud storage. Parent email/password signup/signin UI, child nicknames, quiet settings. Email verification required; production SMTP/redirect settings still need verification. No external analytics or advertising.

Functional prototype: TODAY/WORLD/PLAY/BOOK/FAMILY, five interactive activities, 3-expression Moco SVG prototype, deterministic story of last 8 memories and cloud book save. Other characters use placeholder cloud icons. Commercial art/game depth are not complete.

Validation: 3 unit tests, 3 Playwright mobile/desktop tests; typecheck and production build pass. Database transactional QA passed owner write, atomic world/creation/play-session changes, retry idempotency, and cross-family read/write isolation. Fixtures rolled back. Anonymous Data API read 200 / 0 rows; RPC write 401. Post-migration security advisors: no findings.

Local browser fallback: MOCOMO_CHROMIUM_PATH can point at a test Chromium. The execution host has no Japanese font by default, so typography must be rechecked on a Japanese-capable browser. Browser behavior/persistence and overflow assertions passed. Production UI/auth/cloud round trip remain unverified.

Vercel installed-state confirmed but deployment tools were not available in this session. No Vercel production URL exists in verified state. Continue deployment after connection/tool availability check; do not claim production is live.
