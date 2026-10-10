# Overdrachtsplan: openstaand werk Rout-app

## Context (wat al klaar is)

- De app is geïmporteerd uit GitHub (Rout: QR-codes, korte links, profielen) en bouwt succesvol.
- Neon-migraties zijn toegepast t/m `67_oauth_handle_sync.sql`.
- Tests toegevoegd en groen: `src/lib/status-bubble.test.ts` (8 tests) en `src/lib/background-panel.test.ts` (samen 12 tests geslaagd).
- UX-refactor "Achtergrond & Visual FX" is geïmplementeerd: dubbele "Themapreset"-lijst verwijderd, "Achtergrond aanpassen"-schakelaar bovenaan, geavanceerde blok klapt open/dicht, nieuwe gradient-richting-opties, ROUT-preset klik zet de schakelaar op UIT. Gewijzigde bestanden: `src/lib/profile-design.ts`, `src/components/dashboard/DesignTabEditor.tsx`, `src/components/dashboard/editor/ProfileThemePicker.tsx`.
- Vercel-build werkt: bouwen met `VERCEL=1` én sandbox-variabelen (`DEV_SERVER__PROJECT_PATH`, `LOVABLE_SANDBOX`) unset, anders forceert de Lovable-config Cloudflare-output. Smoke-test van de gebouwde server: `/` 200, `/auth` 307, `/api/public/health` 200, `/api/public/auth/providers` 200, `/explore` 200.
- `ENVIRONMENT.md` herschreven met alle 63 env-vars + Vercel-deploy-checklist; `.env.example` aangemaakt.
- `AGENTS.md` bijgewerkt (ingekort wegens limiet); design-beslissing over ROUT-presets staat in een notitie naast het designpaneel.

## Wat de volgende AI moet doen (in volgorde)

### 1. Finale verificatie van de UI-refactor
- Draai volledige typecheck: `bunx tsgo --noEmit -p .`
- Draai volledige test-suite: `bunx vitest run`
- Controleer `/tmp/observability/build-errors.log` op "build OK" na de laatste edits.
- Verifieer visueel met Playwright (viewport 1280x1800 én telefoonformaat): het "Achtergrond & Visual FX"-paneel toont alleen ROUT-presets bij schakelaar UIT; bij AAN klapt het blok soepel open met achtergrondtype-pills, kleurkiezers, gradient-richting, texturen en bezoek-effecten; een ROUT-preset-klik klapt het blok dicht.

### 2. Beveiligingsfix: DATABASE_URL-rol
- De huidige `DATABASE_URL` secret gebruikt de owner-rol (`neondb_owner`) in plaats van de beperkte `rout_app`-rol. Dit is een beveiligingsrisico bij lekken.
- Vraag de gebruiker om een nieuwe connectiestring voor de `rout_app`-rol en werk de `DATABASE_URL` secret bij. `MIGRATION_URL` mag de owner-rol houden.

### 3. Instellingen-opslagflow end-to-end testen
- Log in (gebruik `lovable auth-session --json` indien geen sessie), open de instellingeninterface, wijzig een instelling, sla op en bevestig dat de waarde terugleesbaar is uit de Neon-database.

### 4. Emoji-weergave controleren
- In de headless browser was de emoji-statusdot niet zichtbaar (font-probleem in de testomgeving). Controleer of dit alleen een sandbox-font-issue is of een echte bug; zo nodig fallback-font toevoegen.

### 5. Vercel-deploy afronden
- Bevestig dat alle benodigde env-vars uit `ENVIRONMENT.md` in Vercel zijn ingesteld (DATABASE_URL, MIGRATION_URL, BETTER_AUTH_SECRET, ROUT_PROVIDER_*, Stripe, Brevo, Scaleway S3, etc.).
- Na succesvolle deploy: suggestie geven om te publiceren.

## Technische details

- Stack: TanStack Start v1, React 19, Vite 7, Nitro (preset `vercel` bij `VERCEL=1`).
- Database: Neon PostgreSQL; migraties via `scripts/migrate.ts` met `MIGRATION_URL` (owner), runtime via `DATABASE_URL` (moet `rout_app` zijn).
- Tests: `bunx vitest run <bestand>`; typecheck: `bunx tsgo --noEmit -p .`
- Vercel-testbuild: `env -u DEV_SERVER__PROJECT_PATH -u LOVABLE_SANDBOX VERCEL=1 bun run build`
- Screenshots/scripts onder `/tmp/browser/`, nooit in het project.
