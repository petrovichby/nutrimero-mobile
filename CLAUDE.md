# nutrimero-mobile — agent instructions

Paid mobile apps (Nutrimero Home Baker / Nutrimero Pro Baker) for the Nutrimero platform.
Status: ideation/pre-spec — see `README.md` and `nutrimero-docs/mobile/IDEATION.md` (the founding
analysis; treat its "decided" items as settled).

## Workflow

- **Features follow the spec-kit flow** (same as `nutrimero-api`/`nutrimero-web`):
  `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` →
  `/speckit-implement`. Specs live under `specs/NNN-name/`. Every plan must pass the
  Constitution Check against `.specify/memory/constitution.md`.
- **All UI design, redesign, review, and polish work goes through the `impeccable` skill**
  (bundled in `.claude/skills/impeccable`). Invoke it before designing screens or components,
  and for UX critique passes. Design tokens: lime `#b9bf05` / navy `#1b1f58`; visual authority
  chain: `nutrimero-design` (concept) → this repo's future `docs/DESIGN.md` (binding).
- The constitution is a gate, not advice. Do not amend it while implementing a feature.

## Hard rules (mirror the constitution)

- API types are generated from `contract/openapi.json` — never hand-written. Missing endpoints
  are `nutrimero-api` work first.
- Allergen/nutrition statements come only from FID data joins — never from LLM output.
- No user-facing hardcoded strings (locales: en, de, lt).
- No secrets in the app bundle; entitlements are decided server-side.
- Dietary/allergen profile stays device-local unless a spec explicitly introduces consented sync.
- Git workflow (owner's ruling, 2026-09-23): lanes COMMIT their own work and OPEN PRs on their
  lane branches. Lanes never merge and never push to `main` — merges are the owner's or the
  coordinator's, on the owner's merge word, after the coordinator's sweep (the api/web PR
  discipline applies: CI green, no suppressions, honest PR bodies).

## Related repos

`nutrimero-api` (backend + contract) · `nutrimero-web` (web client, i18n catalog shape) ·
`nutrimero-docs` (product truth, migration plan) · `nutrimero-design` (design corpus, tokens).
