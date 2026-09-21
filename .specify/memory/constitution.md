# nutrimero-mobile Constitution

**Version:** 0.1.0 (draft — pending ratification) · **Applies to:** every feature, every agent, every PR

These principles are **gates**, not advice. Every `/speckit-plan` MUST include a Constitution Check
table verifying each one. A violation is either fixed or documented in that plan's *Complexity
Tracking* section with the simpler alternative that was rejected and why.

Amendments require a version bump here and a note in the amendment log at the bottom. Agents MUST
NOT amend this file as a side effect of implementing a feature.

Founding context: `NUTRIMERO-MOBILE-IDEATION.md` (repo root). Product truth:
`~/Projects/nutrimero-docs/PRODUCT.md`. Sibling constitutions: `nutrimero-api`, `nutrimero-web`.

---

## I — The stack is settled

React Native + Expo · TypeScript strict · pnpm workspaces monorepo · Biome (lint + format) ·
Vitest (unit) · EAS (build/submit/update). Decided 2026-09-21 (ideation doc §6); the Flutter
question is closed. Changing any of these requires a superseding ADR (`docs/adr/`), not a decision
buried in a feature plan.

## II — Contract consumer, never contract author

The API contract is `contract/openapi.json`, synced from `nutrimero-api` (same drift-gate pattern
as `nutrimero-web`). All API types are generated (`openapi-typescript`); the client is
`openapi-fetch`. Hand-written API request/response types are forbidden. If mobile needs an endpoint
that doesn't exist, the work happens in `nutrimero-api` first — no client-side workarounds that
fake missing server capabilities.

## III — Core + vertical packs

The monorepo shape is `apps/home-baker`, `apps/pro-baker`, `packages/core`, `packages/ui`,
`packages/features/*`. Apps are thin (branding, config, feature flags); every capability lives in a
shared package. A feature implemented inside an `apps/` directory that a second vertical would want
has failed this gate. Baking is the first vertical, not the architecture.

## IV — Allergen and nutrition data comes only from FID joins

No user-facing allergen or nutrition statement may originate from LLM output, hand-typed strings,
or heuristics — only from FID reference data via the API. This is an architectural invariant with
tests, not a guideline (liability rationale: ideation doc §12.3, EU PLD 2024/2853). LLM-generated
recipe text is always labeled as AI-generated (EU AI Act Art. 50).

## V — Honest provenance

Every recipe image carries `media.origin` (`real_photo | ai_illustration`) and renders its
provenance badge. AI imagery is illustration-style only, never photorealistic. Affiliate links are
always visibly disclosed. No dark patterns in paywalls or cancellation flows.

## VI — Privacy by architecture

The dietary/allergen profile is **device-local** until a consented-sync feature is explicitly
specced (GDPR Art. 9 — ideation doc §12.1). No personal identifiers in LLM prompts. No ad-tech or
non-EU-hosted analytics SDKs. Per-user data (pantry, own recipes, tool cupboard) must join the
`/me/erase` deletion cascade, verified by test.

## VII — Entitlements are server-side

Plan state, LLM quotas, exclusive-content access, and the Founders' Lifetime cap live in the API's
entitlements service and are enforced server-side. The client renders entitlement state; it never
decides it. No API keys or secrets ship in the app bundle.

## VIII — Offline is read-only, and first-class

Recipes and reference data must be viewable offline (kitchen/bakery-floor use is the core context).
v1 offline is a read-only cache with delta sync (`updated_since` + tombstones); offline *editing*
with conflict resolution is out of scope until explicitly specced. A feature that breaks with no
network needs a stated offline behavior in its spec.

## IX — Multilingual from day one

No hardcoded user-facing strings. Message catalogs follow the `nutrimero-web` shape (JSON, key
parity enforced by test). Launch locales: en, de, lt. Units and currency formatting go through
shared formatters in `packages/core`, never inline.

## X — Design derives from the token system

UI is built from `packages/ui` components driven by the Nutrimero token set (lime `#b9bf05` / navy
`#1b1f58`; source of truth in `nutrimero-design`/`nutrimero-web`). Accessibility is a gate, not a
polish item (European Accessibility Act): accessibility labels, contrast, and touch-target minimums
ship with the component, not after it. UI design and review work goes through the `impeccable`
skill (see `CLAUDE.md`).

## XI — Stop conditions

A plan that wants a new category of dependency (state library, database/sync engine, analytics SDK,
payment SDK), a new top-level package, or any deviation from I–X stops and proposes an ADR first.

---

## Amendment log

- 0.1.0 (2026-09-21) — initial draft distilled from the mobile ideation session; pending
  ratification by Aliaksandr.
