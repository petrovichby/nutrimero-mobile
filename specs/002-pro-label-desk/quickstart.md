# Quickstart — validating 002 Pro Baker Label desk

This is a validation guide, not an implementation guide. It proves the spec's stories end to
end once implementation lands.

## Prerequisites

- The Home lane's contract-sync PR merged (api `4a4356b`): `contract/openapi.json` carries O1–O11
  (`contracts/api-consumption.md`), and `pnpm contract:generate` produces no diff.
- The ADRs for the secure token store, the saved-labels store and navigation are ruled (plan,
  XI stops).
- The design-mobile lane's Label desk pass is approved (screen inventory 1–9).
- A `nutrimero-api` instance (staging or local) with a fixture company:
  - Member accounts: **A** (editor) and **B** (viewer). Account **C** belongs to a second company.
  - Product **P1** assigned `eu1_counter_card`, complete.
  - Product **P2** assigned `eu1_packaging`. Its Additives cell is `cannot_be_held` (P-02).
  - Product **P3** with no assignments.
  - On P1, one counter card issued on the web in **de-DE**, and one in **lt-LT**.

## Automated (CI)

```bash
pnpm quality          # lint → check → typecheck → Vitest → both bundles
```

The Vitest suites must include:
- the pinned facts P1–P6
- the label-language set citing its proofs (R1)
- the wipe ordering and pending-wipe resume (R10)
- the filter bound (R2)
- gap-sentence coverage for every gap kind in the fixtures (SC-002)
- rendering equality: runs joined equal `text` for every offered language's fixtures (SC-003)
- a test that the saved-label store has no verdict field (R8)

## Manual scenarios (tablet, then phone)

| # | Steps | Expected |
|---|---|---|
| Q1 | Sign in as A | The product list shows P1 "EU counter card — ready", P2 "EU packaging — not issuable yet", P3 "no label types assigned" (US1) |
| Q2 | Open P2 | Grid: the Additives cell reads "not yet possible in Nutrimero", distinct from fixable gaps; every other gap is a sentence (US1-5/6) |
| Q3 | Open P1 → preview → de-DE | Text equals the api response; emphasis on the marked runs; VoiceOver announces the emphasis (US2) |
| Q4 | Open the language picker with the UI in Lithuanian | It offers exactly the owner's languages that are proven: en-US and de-DE today, and hu-HU, lt-LT, pl-PL once cited. Never mt-MT, never be-BY. The default is lt-LT once it is offered, else en-US (R1) |
| Q5 | P1 → issued → the de-DE label, online | Frozen text, status, issued-by/at, "Matches current data" with the check time (US3) |
| Q6 | On the web, edit P1's recipe so the rendering changes; reopen Q5 | "Current data would print a different label"; no diff highlighting (US3-3) |
| Q7 | Open the lt-LT issued label | Displays in full (frozen); the verdict comes from the api (US3) |
| Q8 | Airplane mode; relaunch | Opens to Saved labels showing both P1 labels, "status as of …", and "Match check needs a connection"; the list, grid and preview show the offline state (US4) |
| Q9 | Back online; withdraw the de-DE label on the web; foreground the app | The saved label shows "withdrawn" with who and when (US4-4) |
| Q10 | Sign out | Nothing is saved on the device (SC-006) |
| Q11 | Sign in as A, open labels, sign out without wiping (simulate a crash mid-wipe), relaunch | The wipe resumes before any read (R10) |
| Q12 | Sign in as A, then sign in as C | A's saved labels are gone before C's first read (FR-001a) |
| Q13 | Sign in as B (viewer) | Identical to Q1–Q8 (US1-7) |
| Q14 | Archive the company on the web while the desk is open | "Company archived" message, switch offered, that company's saved labels deleted (US5-3) |
| Q15 | Fixture company with 1,200 products | The filter works over 1,000; the bound line reads "first 1,000 of 1,200" (R2) |
| Q16 | VoiceOver + TalkBack pass over screens 1–9 in all seven UI languages (en, de, hu, lt, be, pl, uk) at 1.3× text; external keyboard on the tablet | SC-007, FR-026 |
