# Roadmap
- [x] VIP-handles crash, batch approval, header translation, Explore + About redesign
- [x] Invite links: invitation card on profile + 10% for new member (tested)
- [x] AT Protocol engine shared by Bluesky + Wsocial (wsocial.eu), linked-accounts table (db/66)
- [ ] Wire Bluesky/Wsocial verify button to the new engine (needs Neon to test)
- [ ] Google YouTube extra-permission link + auto badge (needs Google keys + consent review)
- [ ] GitHub/GitLab auto badge on link (needs Neon to test)
- [ ] X / Meta login flows (blocked: no developer apps/keys yet)
- [ ] Mobile/desktop polish of Profile Hub + dashboard (needs a signed-in session → needs Neon)
- [ ] Admin portal overhaul (needs Neon to load real data)
- [ ] Explore: category/platform filters, extra rows, infinite scroll
- [ ] Translate remaining fixed Dutch dashboard labels; admin screen to approve reviews
- [ ] Run db/65 + db/66 migrations (needs Neon)

## Handoff plan (Oct 2026)
- [x] Typecheck + full test suite (401 tests green)
- [x] Visual check of "Achtergrond & Visual FX" panel
- [ ] DATABASE_URL secret with `rout_app` role (still owner role; needs rout_app connection string from user)
- [x] Settings save flow end-to-end (fixed: database keys were missing; saving verified)
- [x] Emoji check (sandbox has no emoji font; emoji font fallback added)
- [ ] Vercel env vars confirmed (user action in Vercel)
- [x] Live Status & Gedachten + Verbindingen & Integraties sections, Spotify Now Playing
- [ ] Spotify keys (SPOTIFY_CLIENT_ID/SECRET, PSP_ENCRYPTION_KEY) from user
