# Vercel deployment

Repository: https://github.com/kenkonitteki777-lab/MOCOMO
Import: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkenkonitteki777-lab%2FMOCOMO
Framework: Next.js; root directory: repository root; build: npm run build.

Required build-time environment variables (Production + Preview):
- NEXT_PUBLIC_SUPABASE_URL=https://xoqawubwmuwvsrvokmxi.supabase.co
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: active publishable key from Supabase API Keys.
  https://supabase.com/dashboard/project/xoqawubwmuwvsrvokmxi/settings/api-keys

No service role key is used or required. .env.local must never be committed.

After the production URL exists, update Supabase Auth Site URL and permitted Redirect URLs to the exact HTTPS production origin:
https://supabase.com/dashboard/project/xoqawubwmuwvsrvokmxi/auth/url-configuration
Do not use broad wildcard production redirects.

Verify production HTTP response, mobile/desktop screenshots, five activities, reload persistence, signup email confirmation/login, child creation, logout/family isolation, quiet mode, cloud saved book, public anonymity. Configure production SMTP before inviting general users; default email delivery is not production validation.

Deployment is blocked until a Vercel connection is available. No production URL has been confirmed.
