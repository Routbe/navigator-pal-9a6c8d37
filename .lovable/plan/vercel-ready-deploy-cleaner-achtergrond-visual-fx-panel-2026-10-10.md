# Vercel-ready deploy + cleaner "Achtergrond & Visual FX" panel

## Part 1 — Make GitHub → Vercel deploys work
1. Run a full production build the way Vercel does it (Vercel server preset) and fix every error or warning that would break it (server-only code leaking into the browser, Node-only packages, missing route files).
2. Smoke-test the built server locally: home page, a profile page, sign-in page, the public health check and the sign-in providers list must all load.
3. Check every environment variable the code reads against `ENVIRONMENT.md` / `.env.example`; add anything missing, and mark which ones are required on Vercel (DATABASE_URL with the `rout_app` role, BETTER_AUTH_SECRET, BETTER_AUTH_URL / NEXT_PUBLIC_APP_URL, storage and email keys).
4. Add a short "Deploy to Vercel" checklist to `ENVIRONMENT.md`: build settings, which variables to paste, running the database update script once before each release.
5. Replace the deprecated `.inputValidator()` calls the build warns about only if the installed framework version supports the new name (otherwise leave them, they still work).

## Part 2 — Background & Visual FX refactor (Design & styling)
Final layout of the section:

```text
Achtergrond & Visual FX
  ROUT-presets (cards)                 <- only 1-click styling
  [ Achtergrond aanpassen  (switch) ]
  -- when ON, smoothly expands: --
    Achtergrondtype: Volg thema | Effen kleur | Gradient | Eigen afbeelding
    Colour pickers with hex input
    Gradient direction (only for Gradient): top->bottom, left->right, diagonals, radial
    Achtergrondstijl (texture grid: Effen, Subtiel raster, Dot matrix, Hoogtelijnen...)
    Pagina bezoek effect (Confetti, Vallende sterren, Matrix...)
  Banner (unchanged, stays outside)
```

Behaviour:
- The "Themapreset" list is removed entirely; ROUT-presets are the single source.
- Switch OFF: only the preset cards are visible.
- Clicking a ROUT-preset applies it and turns the switch OFF, collapsing the block.
- Existing profiles keep their current look: textures and visit effects already chosen still show on the page even when the switch is off.

## Technical details
- `ProfileThemePicker.tsx`: delete the `PROFILE_THEMES` grid; move `VisitEffectPicker` and the `BACKGROUND_STYLES` grid inside the gated block of `DesignWallpaperSection`.
- `DesignTabEditor.tsx`: switch row placed directly under the preset cards; `applyPreset` also sets `backgroundCustom=false`; expand animation via existing collapsible/accordion pattern, reduced-motion respected.
- New pref `wallpaperGradientDirection` (normalized server-side in `parseDisplayPrefs`, default = current look) used by `gradientCss`.
- Tests: preset click sets custom OFF; unknown/missing direction falls back to the default.
- Vercel check: `VERCEL=1` production build + local run of the output.
