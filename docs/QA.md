# QA — 2026-10-06

Passed: npm run test (3 tests), npm run typecheck, npm run build, npm run test:e2e (3 browser tests).

Browser tests cover: five activities, missed/real secret discovery, reload persistence, actual memory counters and book navigation, parent gate, quiet setting persistence, desktop/mobile overflow and page errors. Screenshots inspected; host lacks Japanese fonts, so Japanese typography needs real device verification.

Database QA runs in a transaction with generated temporary fixtures and rolls back. Verified child/world initialization; CREATE memory creates memory/world/creation/play-session records; duplicate event UUID cannot duplicate any record; another family sees no rows and cannot call record_memory for the first family's child. Anonymous public-key REST sees zero records; RPC write is 401. Post-change security advisor has no findings.

Not verified: real production login/email delivery and redirect configuration, live Vercel URL, browser-authenticated cloud round trip, durable saved-book reopening, child-data export/delete. Commercial character designs and deeper game content are pending.
