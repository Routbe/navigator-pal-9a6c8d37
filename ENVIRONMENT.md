# Environment variables

## Deploy to Vercel (GitHub)

1. Import the GitHub repo in Vercel. Framework preset: **Other**. Build command: `vite build` (default `bun run build` works). Output: leave empty — the build writes `.vercel/output` itself (Vercel server preset is selected automatically when `VERCEL` is set).
2. Paste every variable from *Required on Vercel* below, plus the optional groups you use, in Vercel → Settings → Environment Variables (Production and Preview).
3. Before each release with new `db/NN_*.sql` files, run once from your machine: `MIGRATION_URL=<owner url> bun scripts/migrate.ts`.
4. Point each OAuth provider's callback to `<BETTER_AUTH_URL>/api/auth/callback/<provider>`.
5. Cron jobs call `/api/public/cron/*` with the `LOVABLE_CRON_SECRET` bearer token.

`NODE_ENV` is set by Vercel; never set it yourself.

## Required on Vercel

- `DATABASE_URL` — Neon connection as the least-privilege `rout_app` role (pooled endpoint). Never the owner role.
- `BETTER_AUTH_SECRET` — Signs sessions. 32+ random characters, identical on every deploy (changing it signs everyone out).
- `BETTER_AUTH_URL` — Public base URL, e.g. https://rout.be (no trailing slash).
- `NEXT_PUBLIC_APP_URL` — Same public URL; used for auth callbacks and links in emails.
- `PUBLIC_SITE_URL` — Public URL used in share links and metadata.
- `PUBLIC_ORIGIN` — Allowed origin for requests, normally the same URL.

## Database (not on Vercel)

- `MIGRATION_URL` — See below. Only for `bun scripts/migrate.ts`.

## Secrets (32+ random characters each)

- `APP_SESSION_SECRET` — Server-only random secret.
- `SESSION_SECRET` — Server-only random secret.
- `OAUTH_STATE_SECRET` — Server-only random secret.
- `MASTODON_STATE_SECRET` — Server-only random secret.
- `NEON_AUTH_COOKIE_SECRET` — Server-only random secret.
- `BOOKING_TOKEN_SECRET` — Server-only random secret.
- `GO_LINK_SECRET` — Server-only random secret.
- `ALTCHA_HMAC_KEY` — Server-only random secret.
- `CONTACT_HASH_SALT` — Server-only random secret.
- `ADMIN_BOOTSTRAP_TOKEN` — Server-only random secret.
- `LOVABLE_CRON_SECRET` — Server-only random secret.

## Sign-in providers (optional; tile shows a notice when missing)

- `GOOGLE_CLIENT_ID` — OAuth app credential.
- `GOOGLE_CLIENT_SECRET` — OAuth app credential.
- `APPLE_CLIENT_ID` — OAuth app credential.
- `APPLE_CLIENT_SECRET` — OAuth app credential.
- `APPLE_APP_BUNDLE_IDENTIFIER` — OAuth app credential.
- `GITHUB_CLIENT_ID` — OAuth app credential.
- `GITHUB_CLIENT_SECRET` — OAuth app credential.
- `GITLAB_CLIENT_ID` — OAuth app credential.
- `GITLAB_CLIENT_SECRET` — OAuth app credential.
- `INFOMANIAK_CLIENT_ID` — OAuth app credential.
- `INFOMANIAK_CLIENT_SECRET` — OAuth app credential.
- `OIDC_CLIENT_ID` — OAuth app credential.
- `OIDC_CLIENT_SECRET` — OAuth app credential.
- `OIDC_DISCOVERY_URL` — OAuth app credential.

## Login via ROUT (provider role)

- `ROUT_CLIENT_ID` — ROUT as identity provider.
- `ROUT_CLIENT_SECRET` — ROUT as identity provider.
- `ROUT_API_KEY` — ROUT as identity provider.

## File storage (Scaleway)

- `SCALEWAY_ACCESS_KEY` — Scaleway Object Storage.
- `SCALEWAY_SECRET_KEY` — Scaleway Object Storage.
- `SCALEWAY_ENDPOINT` — Scaleway Object Storage.
- `SCALEWAY_REGION` — Scaleway Object Storage.
- `SCALEWAY_DEFAULT_BUCKET` — Scaleway Object Storage.
- `BUCKET_ENV` — Scaleway Object Storage.

## Email

- `BREVO_API_KEY` — Transactional email / forwarding.
- `BREVO_SENDER_EMAIL` — Transactional email / forwarding.
- `BREVO_SENDER_NAME` — Transactional email / forwarding.
- `BREVO_REPLY_TO_EMAIL` — Transactional email / forwarding.
- `BREVO_ADMIN_EMAIL` — Transactional email / forwarding.
- `BREVO_SMS_SENDER` — Transactional email / forwarding.
- `EMAIL_FROM` — Transactional email / forwarding.
- `IMPROVMX_API_KEY` — Transactional email / forwarding.
- `CONTACT_ADMIN_EMAIL` — Transactional email / forwarding.
- `ADMIN_EMAIL` — Transactional email / forwarding.
- `OWNER_EMAILS` — Transactional email / forwarding.

## Payments

- `STRIPE_SECRET_KEY` — Payments and payouts.
- `STRIPE_PUBLISHABLE_KEY` — Payments and payouts.
- `STRIPE_WEBHOOK_SECRET` — Payments and payouts.
- `BUNQ_API_KEY` — Payments and payouts.
- `BUNQ_ENV` — Payments and payouts.
- `BUNQ_OAUTH_CLIENT_ID` — Payments and payouts.
- `BUNQ_OAUTH_CLIENT_SECRET` — Payments and payouts.
- `BUNQ_PRIVATE_KEY` — Payments and payouts.
- `BUNQ_PUBLIC_KEY` — Payments and payouts.
- `BANKING_WEBHOOK_SECRET` — Payments and payouts.
- `BANKING_WEBHOOK_HMAC_SECRET` — Payments and payouts.
- `PAYMENT_BENEFICIARY` — Payments and payouts.
- `PIX_KEY` — Payments and payouts.
- `PIX_CITY` — Payments and payouts.
- `UPI_VPA` — Payments and payouts.
- `PROMO_CODES` — Payments and payouts.

## Company details (invoices)

- `ROUT_COMPANY_NAME` — Shown on invoices.
- `ROUT_COMPANY_ADDRESS` — Shown on invoices.
- `ROUT_VAT_NUMBER` — Shown on invoices.
- `ROUT_BILLING_EMAIL` — Shown on invoices.

## Notifications

- `KCHAT_WEBHOOK_URL` — kChat alerts.
- `KCHAT_USERNAME` — kChat alerts.

## Details

## PSP_ENCRYPTION_KEY
Server-only. AES-256-GCM key material for creator PSP secrets (`psp_credentials`). At least 32 random characters.

## MIGRATION_URL
Owner connection to Neon, used only by `bun scripts/migrate.ts` (never at runtime). Must differ from DATABASE_URL (rout_app). Not needed on Vercel.

## GITLAB_ISSUER
Optional GitLab server URL (default https://gitlab.com, no trailing slash). Set for self-managed GitLab.

## GITLAB_REDIRECT_URI
Optional. Defaults to <BETTER_AUTH_URL>/api/auth/callback/gitlab (e.g. https://rout.be/api/auth/callback/gitlab). Must match the GitLab application exactly.

## OAUTH_CLIENT_SECRET_PEPPER
Optional, server-only, 32+ random characters. Pepper for "Login met ROUT" client-secret hashes. Falls back to the auth secret. Changing it invalidates every app secret created since (rotate them in the console).

## SMS_PROVIDER
Optional: `android-gateway` (default), `twilio` or `brevo`. Without the keys below, phone verification shows "not configured" and sends nothing.

## SMS_API_KEY
Server-only. Android gateway bearer token, Brevo API key, or Twilio `<AccountSID>:<AuthToken>`.

## SMS_SENDER_ID
Sender name or number (required for Twilio and Brevo).

## SMS_GATEWAY_URL
Android gateway endpoint (POST JSON `{to, text, sender}`).

## PHONE_ENCRYPTION_KEY
Server-only, 32+ random characters. Encrypts stored phone numbers (AES-GCM) and hashes codes.
