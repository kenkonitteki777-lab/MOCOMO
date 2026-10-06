# MOCOMO

モコモは、いつも君のそばにいる友達。

Next.js + React + Supabase + Vercel。AppDeployには戻さない。

## Development

Node 24 / npm. `npm ci`, copy `.env.example` to `.env.local`, set the Supabase publishable key, then `npm run dev`.

`npm run test`, `npm run typecheck`, `npm run build`, `npm run test:e2e`.
Install the Playwright browser with `npx playwright install chromium` before browser tests.

Guest memories stay on the device (last 1000). They are not automatically uploaded on login. Signed-in parents create child profiles with nicknames, and memories are isolated by database RLS. A child experience does not require an account. Use FAMILY for adult signup/login and quiet-mode settings.

Five activities feed a Memory System, a world view, and a deterministic story built from the latest eight real memories. No rankings, streaks, login rewards or forced tasks. Character art and game interactions are prototype quality; see docs/CHARACTER-MASTER.md and docs/TECHNICAL-STATE.md for remaining work.

Deployment setup: docs/DEPLOYMENT.md. Current handoff: MOCOMO_WORK_HANDOFF.md.
