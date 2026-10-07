# MOCOMO technical state — 2026-10-07

Stack: Next.js 16.3.8 / React 19.3.0 / Supabase JS 2.117.2. Dependencies pinned.
Repository: https://github.com/kenkonitteki777-lab/MOCOMO (main).
Production: https://mocomo-lake.vercel.app/ (Vercel GitHub integration).
Supabase: xoqawubwmuwvsrvokmxi, 9 original tables with ownership RLS.

Memory RPCs remain SECURITY INVOKER, authenticated-only, atomic and idempotent. Companion ID whitelist now includes the selected nine friends and all legacy names. Live SQL transaction verified recording all nine plus legacy roo, invalid-name rejection; fixtures rolled back. Security advisor has one Auth warning: leaked-password protection disabled. This is an existing Auth setting, not a new database/RLS finding.

Guest records stay local (up to1000), separate from cloud. Parent email/password and child profiles exist. Production Supabase build-time environment variables, email delivery and authenticated cloud round trip remain unverified; no new claim of working production cloud authentication.

Ten distinct characters, three expressions each, six illustrated backgrounds. Five activities support cloud hopping, repeated discovery, independent rainbow bands, plate/food selection, optional breathing. Saved event payloads determine the illustrated story, companion and scene; latest eight memories, page navigation and optional conversation prompts. Legacy memory names remain readable. No scoring or forced completion timer.

Validation target: 5 unit tests, 8 browser tests (including 320/390/760/1440 widths), typecheck and production build. Updated results and publication are recorded in MOCOMO_WORK_HANDOFF.md. Local QA Chromium uses MOCOMO_CHROMIUM_PATH and Japanese fonts. Commercial final art approval, side/back views, polished animation, saved-book library, deletion/export and parent-gate strengthening remain future work.

Narrative story shelf: original six-page Moco/Sui story "ほしを、まんなかに", dedicated illustrations, psychological prose and optional ending prompt. Distinct from real event-based memory books; reading creates no child events. Implemented in BookShelf/FriendshipBook, text in lib/friendship-story.ts.
