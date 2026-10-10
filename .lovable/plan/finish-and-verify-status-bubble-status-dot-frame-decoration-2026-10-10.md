# Finish and verify: status bubble, status dot, frame/decoration grid

## Goal
Make sure the imported app and the new status bubble / status dot / Popular grid work end-to-end, and can be saved to your Neon database.

## Steps
1. **Secrets first** — ask you, through the secure form, for what building and saving needs:
   - `DATABASE_URL` (Neon, app role `rout_app`) and `MIGRATION_URL` (Neon owner, only for schema changes)
   - `BETTER_AUTH_SECRET` (or let the app derive a fallback)
   - Optional, only if you want them tested now: login provider keys (Google, GitHub, …), Scaleway storage keys, email provider key
   I first check which secrets already exist so nothing is asked twice.
2. **Clean build** — fix every build and type error, including in the last unchecked bubble/dot/grid code.
3. **Database** — apply the pending `db/NN_*.sql` migrations with the owner connection so the new settings (bubble position, style, colour, font, dot icon/emoji) can be stored.
4. **Rule tests** (kept in the project):
   - Emoji field accepts exactly one emoji (rejects text, two emojis, empty)
   - Status line max 60 characters
   - "Popular" shows at most 8 items, favourites first
   - Search always covers all items whatever pill is selected
   - Old profiles default to top-right, Obsidian, plain-colour dot
5. **Screenshot check** — bubble in all 8 positions and all 5 styles on desktop, plus a phone-size screen to confirm it is never cut off; dot in colour, colour+icon and emoji mode.
6. **Real save** — sign in as a test user, change the settings, save, reload, and confirm they come back from Neon.

## Technical details
- Secrets requested via `add_secret`; never echoed.
- Tests with vitest next to existing tests; screenshots with Playwright under /tmp.
- Migrations via `scripts/migrate.ts`; runtime stays on least-privilege role.
