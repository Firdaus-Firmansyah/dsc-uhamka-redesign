# DSC UHAMKA service setup

Node 22+ and npm. `npm ci`, `npm test`, `npm run build`, `npm start`.
The existing removal of static export is preserved: APIs and nonce CSP require a Next.js server.

## Skills and security

BrochBuilds is a catalogue, not an `npx skill apply` generator. Its Vercel
React Best Practices skill was consulted alongside the local frontend-design skill.
Sources: https://brochbuilds.com/skills and
https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices.

Each rendered request receives a CSP nonce; script inline/eval permissions are
not enabled in production. Inline styles are allowed for Motion and existing styling.
X-XSS-Protection is deliberately 0 (the obsolete browser filter is not a replacement
for CSP). HTTPS production gets HSTS. All HTML renders dynamically so nonces match.
Secrets and `.vercel` are ignored. APIs validate input, bound request sizes/timeouts,
and return sanitized failures. Certificate and chat production endpoints require
shared Upstash counters; missing or failed rate limiting returns 503, not unmetered access.
Configure Vercel firewall quotas as additional protection against distributed abuse.

## Google Sheets CMS

1. Copy `.env.example` to `.env.local`; fill `GOOGLE_SHEET_ID`.
2. Enable Sheets API. Share the sheet read-only with the service-account email.
3. Add a `Content` tab with `slug,title,description,content` headers.
4. Put the service-account JSON in ignored `secrets/gsheets.json`, or set
   `GOOGLE_SERVICE_ACCOUNT_JSON` in CI/Vercel. Never use a NEXT_PUBLIC secret.
5. Run `npm run cms:sync`. Generated per-page files live in `src/content/cms/`;
   the validated atomic `cms-index.json` drives `/content` and `/content/<slug>`.
   Isolation prevents sheet slugs from overwriting curated events/team/FAQ/roadmap.
   Unlisted old per-page files are inactive; only the index is rendered.
6. `prebuild` syncs when configured; a configured sync failure aborts the build.
   Set `CMS_SYNC_REQUIRED=1` to forbid builds without configuration.
   Configure the same variables on Vercel: GitHub CI artifacts are not automatically
   passed to Vercel builds. Trigger a new deploy after sheet changes.

Content is plain text, escaped by React, never injected as HTML. Existing event,
team and FAQ schema remain curated JSON. No sample text is presented as a live Sheet result.

## Roadmap and social sharing

`/roadmap` has status filters, keyboard-accessible expanding steps, reduced-motion
support and resource links. Edit `src/content/roadmap.json`; its initial stages
are explicitly a suggested learning path, not invented dated community commitments.
`/api/og/<slug>` renders a 1200×630 PNG through `next/og` (Next's bundled OG renderer).
All official routes and event details have page-specific Open Graph/Twitter metadata.
`SITE_URL` must be the canonical production URL.

## Certificates

Run `supabase/migrations/20261115_certificates.sql` in the intended Supabase project.
Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` on the server. The table denies anonymous
reads; a narrow security-definer RPC permits only exact UUID lookup and exposes
ID/issue date, never email. Issuance is an administrator operation; no public write API.
Revoked/future certificates are invalid. `/certificates` provides the verification UI.
Verify a real issued ID and an absent UUID after applying the migration. Invalid UUID
syntax is 400, a completed negative lookup is 200/valid:false, provider failure is 502,
missing configuration is 503, and quota exhaustion is 429. A service failure never
claims the certificate is invalid. The SQL migration still requires live DB validation.

## Gemini and rate limits

Set `GEMINI_API_KEY` and `GEMINI_MODEL` to a generateContent-compatible model enabled
for the project. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for both APIs.
The widget sends each question separately; no chat history is persisted or sent.
Responses are plain text. Public FAQ/event context grounds the model; it cannot access
certificate data. Gemini remains probabilistic, so prompts are not an authorization boundary.
Quota: chat 10/minute/IP, certificates 30/minute/IP. Vercel's trusted forwarded-IP header
is used; other hosts share the unknown-IP bucket unless adapted behind a trusted proxy.

## Deploy and verify

Log in with `vercel login`, link the intended existing project with `vercel link`,
configure production environment variables, then `vercel --prod`.
Check the domain mapping before treating the requested URL as production.
Install the test browser once with `npx playwright install chromium`.
Run `npm run test:e2e` against the local production server on port 3000.
After deployment repeat HTTP/header, OG and browser checks with `BASE_URL` set to
the production URL. Also perform real Sheet sync, known-ID certificate lookup and
Gemini response checks; mocked tests do not establish provider connectivity.
