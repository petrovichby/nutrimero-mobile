# nutrimero-mobile

Paid mobile companions to the [Nutrimero](https://nutrimero.org) freeware food-knowledge platform.

Two apps, one codebase:

- **Nutrimero Home Baker** (B2C) — app-exclusive curated recipes, pantry-based recipe builder, shopping lists with EU retail prices and online cart handoff, baking calculators, tool cupboard.
- **Nutrimero Pro Baker** (B2B) — production-scaled recipes on the bakery floor (offline-first), recipe costing, wholesaler ordering, team roles, regional equipment-supplier directory.

App names are working titles pending trademark/store checks. Baking is the first of several planned verticals — the architecture is a shared core plus vertical feature packs.

## Status

**Bootstrapped, pre-feature.** Monorepo scaffold with quality gates in place; no product features
yet (feature work follows the spec-kit flow). The founding analysis lives in
[`nutrimero-docs/mobile/IDEATION.md`](../nutrimero-docs/mobile/IDEATION.md) — product portfolio, tier structure and pricing, tech-stack decision, content and imagery policy, price-data strategy, backend deltas, compliance brief, branding, risks, and phasing.

Key decisions already made (details and rationale in the ideation doc):

| Topic | Decision |
|---|---|
| Stack | React Native + Expo, TypeScript, same generated OpenAPI client as `nutrimero-web` |
| Structure | Expo monorepo: `apps/home-baker`, `apps/pro-baker`, `packages/core`, `packages/ui`, `packages/features` |
| Markets | DACH first (monetized), Lithuania as price-data pilot, then PL/CEE, Benelux/Nordics |
| Monetization | Home: free + Plus (€14.99/yr) + Premium (€34.99/yr) + Founders' Lifetime (€120 × 100); Pro: Essential (€24/mo) / Business (€59/mo) per bakery |
| Recipe builder | Hybrid: deterministic pantry matching (free) + metered LLM generation (Premium) |
| Imagery | AI illustrations only (never photorealistic), always labeled; real photos are the premium signal |

## Related repositories

| Repo | Role |
|---|---|
| `nutrimero-api` | NestJS backend, OpenAPI 3.1 contract (the mobile-readiness guarantee) |
| `nutrimero-web` | Next.js web client, source of the synced contract + i18n catalogs |
| `nutrimero-docs` | Product truth, migration plan (mobile specced in `MIGRATION_PLAN.md` §2.4) |
| `nutrimero-design` | Design corpus, tokens, and (future) mobile visual assets |

## Quickstart

```bash
pnpm install
pnpm contract:generate   # generate the typed client from contract/openapi.json (commit the result)
pnpm start:home          # Metro for Nutrimero Home Baker (or start:pro)
```

Quality gate (mirrors `nutrimero-web`): `pnpm quality` = lint → format/style check → typecheck →
unit tests → release-bundle export for both apps. CI (`.github/workflows/ci.yml`) additionally
enforces the contract drift gate (regenerates the client from the committed snapshot and fails on
diff) and a quickstart smoke job. `pnpm contract:sync` pulls a new snapshot from the sibling
`nutrimero-api` checkout's `origin/main` (not its working tree) and records the api commit in
`contract/SOURCE` — a deliberate, reviewable diff, never run by CI.

Layout: `apps/home-baker` + `apps/pro-baker` (thin Expo apps) · `packages/core` (generated API
client, i18n catalogs + parity test) · `packages/ui` (design tokens per `docs/DESIGN.md`).
Expo SDK 57 / React Native 0.86 / React 19.2 / TypeScript 6.0 / Biome 2.5 / Vitest 4, pnpm
workspaces with `node-linker=hoisted`.

## Prerequisites before code

1. API recipe domain, search, entitlements, and per-user resource scope (ideation doc §7).
2. Resolve the docs-vs-code state of API features 005–011.
3. Legal entity, Markus agreement, T&C/privacy set (§11–12).
4. Final app names past trademark/store checks; icon family (§13).
