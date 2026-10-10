# ROUT Sovereign OS: integrations, smart profile and Pro/Verified popups

Everything from the message and both briefs, built in 6 phases. Each phase is tested before the next one starts. Integrations that need keys from outside services are built in full, but only switch on once those keys are entered (the "not set up yet" notice, as Spotify has today).

## Phase 1: Tidier studio (studio brief)
- The "Conversie Coach" accordion becomes a floating lightbulb button at the bottom right, showing the score (for example "15/100"). Clicking it opens a side panel with the tips.
- The top of the studio holds only page building: Basisinformatie, Live Status, Verbindingen, Links & Inhoudscomponenten, Favorieten.
- A new group at the bottom, "Geavanceerde Instellingen", holds Profiel-QR, Privacy & Openbaar Profiel and the Social share inspecteur.
- "+ Inhoudscomponent toevoegen" opens a component library in four groups: Standaard, Media, Interactie & Leads, Zakelijk & Web3.
- These work right away: Link, Socials, vCard, Matrix/Fediverse, plus the new Tekst/Koptekst, Scheidingslijn and Video embed.
- These show a polished "Binnenkort" state: Gallery, Audio player, Newsletter, Contact form block, Calendly.

## Phase 2: Context-aware profile
- A gear icon ("Context & Regels") next to every link and component sets two things:
  - **When to show it:** always, hide while in focus mode, or show only when live.
  - **Context:** Global, Professioneel or Sociaal.
- New profile setting "Pro/Social schakelaar": visitors get a neat switch at the top of the profile. Global items always show; the others follow the switch.
- The rules are applied on the server, so hidden items never reach the visitor.

## Phase 3: Pro and verification popups (layout only, no new payments)
- **Video block:** two tabs, "Plak Link (Gratis)" (YouTube, Vimeo or TikTok with a preview) and "Upload Bestand (Pro)" (a locked upload area).
- **"Upgrade naar ROUT Pro" popup:**
  - Features: Native Video Uploads, Geavanceerde Integraties, Eigen Domeinnaam, Geen ROUT Watermerk.
  - Price text: "Binnenkort beschikbaar voor €7,99 / maand".
  - The button "Zet mij op de wachtlijst" changes to "Toegevoegd". The waitlist is saved, one entry per member.
- **Small "PRO" pill** next to locked features: custom fonts, certain avatar frames, the upload tab.
- **Verification button** "Vraag Verificatie aan" next to the username in Basisinformatie:
  - It opens a popup with the "Founding Member Actie" banner: verified status now €3,99 instead of €99 setup.
  - The button inside continues to today's working verification checkout. Current prices and payment stay exactly as they are.

## Phase 4: Integrations that only need a username or link
Each card has a "Koppel" button that opens a small input window, plus a "Toon op profiel" switch. The public profile shows the result.
- **Last.fm** (username): now playing. Feeds the same "Nu aan het luisteren" card as Spotify.
- **GitHub** (username): latest public activity.
- **Letterboxd** (username): recently watched.
- **RSS / Blog feed** (any link): latest post.
- **Chess.com** (username): Blitz and Rapid rating.
- **Lichess** (username): rating and live game status.
- **WakaTime** (personal key, stored encrypted): "Coding Now" badge.
- **Local time and weather** (switch): uses the city already on the profile, with weather and sunrise/sunset from the free Open-Meteo service.
- **Order on the profile:** Spotify first, Last.fm if Spotify isn't playing, and every card shows the logo of its source.

## Phase 5: Integrations that need a login with the outside service
These are built in full, but only switch on once their keys are entered:
- **Discord:** activity such as "Speelt Valorant", on its own status card.
- **Strava:** latest run, ride or walk.
- **Google Fit:** step count or live workout badge, in a new "Fitness & Gezondheid" filter. Google has to review this permission before the public can use it.

## Phase 6: Automation and your own forms
- **Home Assistant / webhook card:**
  - Shows each member's private address for sending status updates, with a copy button, a reset button, and example messages for Home Assistant and Apple Shortcuts.
  - The address only accepts updates to that member's status.
- **Agenda status (.ics):** a calendar link under Live Status. During an event the status becomes "Bezig" or "Focus" with a matching text, and switches back automatically when the event ends.
- **Forms with your own webhook:**
  - Lead and contact forms get a "Webhook URL" field (Notion, Airtable, Make).
  - If one is set, entries go only there and ROUT saves nothing. If not, ROUT keeps saving them as it does now.

## What I will need from you (asked at the start of the relevant phase)
- **Last.fm:** a free API key from last.fm/api.
- **Discord:** Client ID and Secret from the Discord developer portal.
- **Strava:** Client ID and Secret from strava.com/settings/api.
- **Google Fit:** Google Client ID and Secret with the fitness permission switched on.
- **Spotify and the encryption key**, which are still open from before.
- None of the other integrations need keys.

## Technical details
- **New tables:**
  - db/69 already exists, so these start at db/70.
  - `user_integration_links` for username/URL providers (provider, handle_or_url, sealed secret for WakaTime, show_on_profile).
  - `pro_waitlist` (user_id unique, created_at).
  - `profile_ingest_tokens` (hashed token per user).
  - `user_calendar_feeds` (url, last_synced_at).
  - Every new table is granted to `rout_app`.
- **Link rules:** each link/block gets `visibility_rule` ('always_visible', 'hide_when_focus_mode', 'show_only_when_live') and `context_tag` ('global', 'professional', 'social'). They are filtered in the public profile server function.
- **Pro/Social switch:** a new `contextToggle` entry in `display_prefs`.
- **Outside data:**
  - All outside calls run on the server through the existing safe-fetch helper (only https, blocks local addresses, time-outs).
  - Results are cached about 60–300 seconds and the public endpoints are rate-limited.
  - RSS, Atom and ics are read with small parsers that work on the hosting platform.
- **Agenda status:** recalculated when the profile is viewed, plus an existing cron route.
- **Webhook address:** `/api/public/ingest/<token>`, which checks the token hash in the handler. It only updates status fields and is rate-limited.
- **Form webhooks:** form webhook URLs pass through the same safe-fetch checks. Entries are posted as JSON and never written to `lead_captures` when a webhook is set.
- **Login integrations:** Discord, Strava and Google Fit follow the Spotify setup (signed state, encrypted tokens, `api/public/<provider>/callback`). Their tiles show "not set up yet" until the keys exist.
- **Payments:** the Pro waitlist and verification popups don't change any payment code; verification reuses the current checkout and its prices.
- **Records and tests:**
  - New keys go into ENVIRONMENT.md and .env.example, and AGENTS.md gets the rules for link visibility and form webhooks.
  - Tests cover the visibility rules, the Pro/Social filter, the order of the music sources, the webhook-only form path and the calendar status.
