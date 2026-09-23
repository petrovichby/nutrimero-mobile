# Feature Specification: Pro Baker Label desk

**Feature Branch**: `lane/pro-baker` (spec directory `specs/002-pro-label-desk/`)

**Created**: 2026-09-23

**Status**: Gate 1 PASSED with rulings (coordinator, 2026-09-23) — see Clarifications

**Input**: Coordinator assignment "002-pro-label-desk": the read-only Label desk on tablet —
products, the declarations grid, the label preview, and the issued-label match check (the api
serves `differsFromCurrent`; the app renders it, never computes it). Constitution 1.0.0 governs.

**Rulings this spec stands on** (owner, relayed by the coordinator, 2026-09-23): labels and
declarations are **Pro, tier Essential**; IDEATION §5.3 governs pricing; costing is fenced until an
api feature series exists; the Production tab leaves the binding nav until a production-plan
entity is specced; **Hobby is simply absent from the Pro app**; the contract update is the Home
lane's task, delivered as its own contract-sync PR (seam notice 2026-09-23; this feature consumes it); issued labels are this feature's one
offline cache, everything else is online-only; tier gating renders server entitlement state only.

**Sources, in authority order**: constitution 1.0.0 · `nutrimero-docs/mobile/IDEATION.md` ·
`docs/DESIGN.md` (binding; Pro temperament, tablet-first) · `nutrimero-api` specs 015–019 and
`openapi.json` at `origin/main` `4a4356b` · `docs/pro-baker/CAPABILITY-MAP.md`. **No Pro design
corpus exists**: the Screen inventory below is the design-mobile lane's input, and no screen is
built before that lane's pass is approved.

## Scope

**In**: sign-in to an existing Nutrimero account and choosing the acting bakery (company); the
product list with label readiness; a product's declarations grid with every gap named; the label
preview for a product × rule-set × label language; a product's issued labels and the match check
of one issued label against current data; saved issued labels viewable offline; tier state
rendered from the server; en/de/lt; tablet-first layout degrading to phone.

**Out** (each named so it is not silently assumed): **every write** — issuing, withdrawing,
assigning or unassigning rule-sets, ingredient-list choices, article compositions, product or
recipe edits (these stay on the web platform in this feature); account registration, invitation
acceptance and join requests; password recovery in-app; member/team management; printing, PDF or
sharing a label; barcode scanning; costing, ordering, production (fenced/unspecced); Floor Mode;
paywall and purchase flows; push notifications; analytics; any offline copy of products, grids or
previews.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — See which products are ready for which label (Priority: P1)

A bakery owner opens Pro Baker on the office tablet. After signing in, they see their bakery's
products, each with a readiness summary per assigned label type (e.g. "EU counter card — ready",
"EU packaging — not issuable yet"). They open a product and see its declarations grid: for
each assigned label type, the five categories (allergens, additives, nutrition, ingredients, food
symbols), whether each is required and whether it is complete — and for every incomplete cell,
exactly what is missing and where.

**Why this priority**: This is the desk's question — "which of my products can carry which label,
and what is stopping the rest" — and it is fully served by the api today. It also carries the
shared-core groundwork (session, company context, roles, named gaps) every later Pro feature
needs.

**Independent Test**: Sign in to a company with at least one product assigned to
`eu1_counter_card` and one assigned to `eu1_packaging`; confirm the list shows both products with
per-label-type readiness, and that opening each shows the grid with every incomplete cell's gaps
named in the UI language.

**Acceptance Scenarios**:

1. **Given** a signed-in member of exactly one company, **When** the desk opens, **Then** it shows
   that company's active products, each with its product number (if any), name, and a readiness
   summary per active assigned label type.
2. **Given** a member of several companies, **When** they sign in, **Then** they choose the bakery
   to work in before the list appears, and can switch bakery later from the desk.
3. **Given** a product with no assigned label types, **Then** its row says so plainly and the
   product still opens (the preview does not require an assignment).
4. **Given** a product's grid, **Then** every label type shows its region and five category cells,
   each stating required / not required and complete / incomplete in text and glyph (never color
   alone).
5. **Given** an incomplete cell, **Then** each gap the api reports is shown as a sentence naming
   the missing datum and where it sits (e.g. "Nutrition: energy not recorded — Wheat flour T550,
   in Dough"), grouped when the api groups occurrences.
6. **Given** a cell the api reports as *cannot be held* (today: Additives, by design — PARKED
   P-02), **Then** it reads as "not yet possible in Nutrimero", distinct from "missing data you
   can add". (P-02 is cited in this spec, not shown to users.)
7. **Given** a viewer-role member, **Then** the desk behaves identically (every capability here is
   a read).

---

### User Story 2 — Preview the label text in a chosen language (Priority: P1)

The owner picks a product, a label type and a label language (e.g. German for the DACH counter,
Lithuanian for the Vilnius shop) and reads the label text exactly as the api renders it: the
ingredient list with allergen emphasis, QUID, additive categories and origins; the nutrition table
(rounded per EU guidance) for packaging; the allergen statement for counter cards. Anything the
api cannot render is named, not hidden.

**Why this priority**: The preview is what the baker will copy onto a card or check against a
printer proof; it turns the grid's "ready" into the actual words. Counter cards are the
guaranteed path (see FR-018).

**Independent Test**: For a complete product, open the `eu1_counter_card` preview in de-DE and
lt-LT; confirm the text matches the api's rendering run for run, emphasis included, and that a
product with a missing label term shows the gap instead of substituting another language.

**Acceptance Scenarios**:

1. **Given** a product and an EU label type, **When** the preview opens, **Then** it shows the
   api's sections in order — heading, ingredient lines, statements, nutrition table — with
   emphasised runs rendered emphasised (bold, and announced as emphasised to screen readers).
2. **Given** the nutrition section, **Then** every value shows the api's rounded figure and unit;
   the full-precision source figure and the rounding rule are reachable per value.
3. **Given** the label language selector, **Then** it lists the EU label languages and the preview
   re-renders in the chosen one; the label language is independent of the app's UI language.
4. **Given** the api reports gaps or notices for the rendering, **Then** they are listed with the
   preview (e.g. "No German term recorded for …"), and the preview never fills a gap with text
   from another language or source.
5. **Given** a non-EU label type (e.g. USA packaging), **Then** the preview states that no label
   engine exists for that region yet and shows no text.
6. **Given** the rendering carries food-symbol identifiers, **Then** the symbols are shown by their
   localized names from reference data, with a note that symbol wording is not part of the
   rendered text.

---

### User Story 3 — Check a printed label still matches (Priority: P2)

A pack printed three weeks ago sits on the counter. The owner opens the product's issued labels,
picks the one for that label type and language, and sees its frozen text, who issued it and when,
its status (active, superseded, withdrawn), and — when online — the api's answer to "does today's
data still produce this exact text?".

**Why this priority**: This is what issuing exists for (019: "a printed pack stays confirmable").
It depends on labels having been issued on the web, so it is second to stories 1–2.

**Independent Test**: Issue a counter card on the web, open it in the desk (match: yes); change an
upstream recipe so the rendering changes; reopen online (match: no); confirm the desk shows the
api's answer and marks no differences of its own.

**Acceptance Scenarios**:

1. **Given** a product, **When** its issued labels are opened, **Then** they are listed per label
   type and language with status, issued-by and issued-at, active first.
2. **Given** an issued label opened online, **Then** it shows its frozen text exactly as issued and
   a match verdict from the api: "Matches current data" or "Current data would print a different
   label", with the time the check ran.
3. **Given** a verdict of "differs", **Then** the desk can show the current preview beside the
   frozen text for the user to compare, and states that reissuing happens on the web — the desk
   does not highlight or compute differences itself.
4. **Given** a superseded or withdrawn issued label, **Then** its status, and for withdrawn ones
   who withdrew it and when, are shown prominently above the text.

---

### User Story 4 — Saved labels on the floor with no signal (Priority: P2)

The shop tablet loses Wi-Fi. The owner opens the desk and finds "Saved labels": every issued label
the desk has loaded for this bakery, readable in full, each marked with when its status was last
confirmed. Nothing else pretends to work.

**Why this priority**: Constitution VIII — the issued label is the feature's one safe offline
cache (immutable by design). The rest of the desk is online-only, stated.

**Independent Test**: Open two issued labels online; enable airplane mode; relaunch; confirm both
are readable under "Saved labels" with their frozen text and "status as of" time, and that the
product list, grid and preview show an offline state instead of stale data.

**Acceptance Scenarios**:

1. **Given** issued labels loaded online, **When** the desk starts offline, **Then** it opens to
   Saved labels, grouped by product, readable in full.
2. **Given** a saved label offline, **Then** its status reads "as of ‹time›" and the match verdict
   reads "Match check needs a connection" — never a verdict carried over from an earlier check.
3. **Given** offline, **When** the user opens products, a grid or a preview, **Then** an offline
   state explains it needs a connection, with a retry; nothing is served from a stale copy.
4. **Given** the connection returns, **When** Saved labels is visible or the app is foregrounded,
   **Then** statuses refresh and newly superseded or withdrawn labels update in place.

---

### User Story 5 — Tier state and leaving the device clean (Priority: P3)

The desk shows whether the bakery's Pro plan includes the Label desk, as the server says. Signing
out, or losing membership of a bakery, removes that bakery's saved labels from the tablet.

**Why this priority**: Constitution VII (entitlements server-side) and B2B data confidentiality
(IDEATION §12.1: bakery data is commercially confidential). Low frequency, required for release.

**Independent Test**: Sign out and confirm no saved label remains; sign in as a member whose
membership was then deactivated, go online, and confirm that bakery's saved labels are gone.

**Acceptance Scenarios**:

1. **Given** the server reports the bakery's plan includes the desk, **Then** the desk is usable;
   **given** it reports it does not, **Then** the desk shows a plain statement of what the plan
   lacks with real previews of what the desk does, and a decline path of equal weight — no
   purchase flow in this feature.
2. **Given** sign-out, **Then** all saved labels and session data for every bakery are deleted from
   the device before the sign-in screen appears.
3. **Given** the api reports the member no longer belongs to a bakery (or the bakery is archived),
   **Then** that bakery's saved labels are deleted and the user is told why.

---

### Edge Cases

- **Role downgraded mid-session**: nothing changes — every action is a read.
- **Bakery archived** while in use: reads return "company archived"; the desk says so and offers
  the bakery switch; saved labels for it are deleted (US5).
- **Product archived** between list and detail: detail shows "this product was archived" and
  returns to the list.
- **Retired label type**: it silently disappears from the grid (api behavior); an issued label for
  it stays viewable.
- **Product with no composition**: every required cell shows the no-composition gap; preview shows
  the api's gaps and no text.
- **Packaging label types**: every packaging label type requires Additives, and that cell is
  *cannot be held* by design (016 FR-018, kept by 017's amendment, SC-007 — recorded as
  `nutrimero-docs` PARKED **P-02**). So no product is packaging-ready and no packaging label can be
  issued today. The grid shows the Additives cell per US1 scenario 6. The preview
  still renders the other sections with the gap listed. This feature has no path that expects
  packaging to become issuable (FR-018).
- **Label language without a recorded term**: gap shown; never a fallback language.
- **Very long ingredient lists** (deep sub-recipes): preview scrolls; sections keep headings
  visible; no truncation of legal text.
- **Many issued labels** (unpaged in the api): the list stays usable at 100+ items per product.
- **German UI at 1.3× text**: grid cells and gap sentences wrap, never clip meaning.
- **Session expired**: the next read re-authenticates silently via refresh; if refresh fails, the
  sign-in screen appears. Saved labels remain readable after re-sign-in **only as the same
  person**; a sign-in by a different account performs the FR-022 wipe first (FR-001a).
- **Storage full / cache write fails**: online use is unaffected; Saved labels shows what it could
  keep and says it could not save the rest.
- **Clock skew**: "as of" and "checked at" times display in device time zone from server
  timestamps, not device-generated ones where the server supplies them.

## Requirements *(mandatory)*

### Functional Requirements

**Session & bakery**

- **FR-001**: The desk MUST let an existing Nutrimero account sign in with email and password, and
  sign out; registration, invitation acceptance and password recovery are not offered in-app — the
  sign-in screen points to nutrimero.org for them.
- **FR-001a**: When an account signs in on a device that holds another account's session data or
  saved labels, the FR-022 wipe MUST complete before anything is read for the new account.
- **FR-001b**: Sign-in, sign-out and bakery choice are shared session capability (not Pro-only).
  Sign-out and account erase MUST delete the session layer's own data and then invoke every wiper
  the app has registered, so each app decides what else goes (this honours Home 001's FR-011/012
  as a contract; the Pro app registers the saved-labels wiper).
- **FR-002**: After sign-in the desk MUST act in exactly one bakery at a time; a member of several
  bakeries MUST choose one, and MUST be able to switch from within the desk. The last chosen bakery
  is remembered on the device.
- **FR-003**: The desk MUST NOT consult or display the company's Hobby Mode toggles; Pro behaves
  the same whatever their value. This stands on a verified api fact: `declarationsEnabled` lives in
  the company record only and gates no route (016 FR-039, OQ-38); the plan's contract check pins it
  so an api change surfaces through the drift gate.

**Products & readiness**

- **FR-004**: The desk MUST list the bakery's active products with name, product number (if any)
  and, for each active assigned label type, a readiness summary taken from the api's declarations
  (ready, or the count of incomplete required categories).
- **FR-005**: The list MUST let the user find a product by name or number by filtering the loaded
  list on the device (gate 1, Q3-A), within a stated bound: the plan names how many pages the desk
  loads before filtering and what the user sees past that bound. Server-side search replaces this
  when `/products?q=` ships (B2).

**Declarations grid**

- **FR-006**: A product's grid MUST show, per assigned label type, its region and all five
  categories with *required* and *complete* each stated in text and glyph.
- **FR-007**: Every gap the api reports MUST be rendered as a localized sentence built from the
  gap's kind, datum and location — never dropped, summarized away, or replaced by a generic
  "incomplete".
- **FR-008**: Gaps of kind *cannot be held* MUST be visually and verbally distinct from gaps the
  bakery can fix by recording data.
- **FR-009**: The grid MUST show the api's "current as of" date.

**Label preview**

- **FR-010**: The preview MUST render the api's label rendering for product × label type × label
  language, section by section and run by run, applying emphasis exactly where the api marks it,
  and MUST NOT alter, reorder, join, translate or re-round any text or figure.
- **FR-011**: Label language MUST be selectable independently of UI language. The list offered MUST
  be only languages whose support can be proven from a source the plan names; the api's `language`
  parameter is a free string (no enum, no listing endpoint), so until the api serves such a list
  (ask B11), the desk offers only languages an api rendering test proves, each with its citation
  (gate 2: en-US, de-DE and mt-MT; lt-LT enters when B11b lands) — never a hardcoded list of 24. The default is the label language last used on the device, else the one
  matching the UI language when offered, else en-US.
- **FR-012**: Nutrition values MUST show the api's rounded figure and unit; each value's
  full-precision source figure and rounding rule MUST be reachable from it.
- **FR-013**: Rendering gaps and notices MUST be listed with the preview; a region without a label
  engine MUST be stated as such with no text shown.
- **FR-014**: Allergen emphasis, allergen statements and nutrition figures MUST come only from the
  api's rendering (Constitution IV); the desk MUST contain no path that derives or supplements them.

**Issued labels & match check**

- **FR-015**: For a product, the desk MUST list issued labels per label type and language with
  status, issued-by and issued-at, active first, including superseded and withdrawn ones.
- **FR-016**: An opened issued label MUST show its frozen text exactly as stored, plus its status
  (and withdrawal details when withdrawn).
- **FR-017**: The match verdict MUST be the api's `differsFromCurrent` answer for that issued label
  from a read made at viewing time, shown with the time of the check. The desk MUST NOT compute,
  infer or cache-forward a verdict; offline, the verdict reads "needs a connection".
- **FR-018**: Label types MUST be presented exactly as the api reports them: counter-card label
  types (allergens only) are the supported path and MUST be fully supported. Packaging label
  types are refused by design today (PARKED **P-02**: Additives is *cannot be held*, 016 FR-018).
  They appear in the grid and preview with the gaps the api reports, and their readiness reads
  "not issuable yet — additives can't be recorded in Nutrimero yet". The desk MUST NOT offer,
  promise or design for any path to packaging becoming issuable within this feature. Unblocking
  P-02 is a separate, future feature.

**Offline (Constitution VIII)**

- **FR-019**: Every issued label the desk loads MUST be saved on the device, per bakery, and be
  readable offline in full under Saved labels.
  *Proposed amendment (ADR 0002, pending the coordinator's word):* "…unless the device clears
  them under storage pressure, which the desk states". On iOS, SDK 57 offers no backup-exclusion
  path outside the caches directory.
- **FR-020**: Saved labels MUST show the time their status was last confirmed by the api; statuses
  MUST refresh automatically on foreground and on reconnect.
- **FR-021**: Products, grids and previews are online-only: offline they MUST show an offline state
  with retry, and MUST NOT be served from any saved copy.
- **FR-022**: On sign-out, account erase, or sign-in by a different account (FR-001a), all saved
  labels and session data MUST be deleted from the device; when
  the api reports loss of membership or bakery archival, that bakery's saved labels MUST be
  deleted. Saved labels MUST be excluded from OS-level cloud/device backups.

**Tier (Constitution VII)**

- **FR-023**: Whether the bakery's plan includes the desk MUST come from the server's entitlement
  answer; the app MUST NOT decide it. A plan without the desk shows a plain, non-blurred
  explanation with a decline path of equal weight; no purchase flow ships here. While the api
  serves no entitlement answer, the desk is usable under a **persistent, non-dismissible**
  "Plan status not available from the server" banner, and **the store build fails** until a
  server-backed answer exists (gate 1 Q2-A; gate 2 G2-Q1-A).

**Navigation, language, accessibility**

- **FR-024**: Pro navigation MUST follow DESIGN.md as amended by the owner's ruling (no Production
  tab); the desk's entry point is set by the design pass; unbuilt destinations show an honest
  empty state.
- **FR-025**: Every app string MUST come from the en/de/lt catalogs (Constitution IX). Label text,
  product names and ingredient designations come from the api as rendered; label-type display
  names come from the app catalogs keyed by label-type identifier (the api serves names in en-US
  only), falling back to the api name.
- **FR-026**: Every screen MUST meet DESIGN.md's accessibility gate (44pt targets, role/label/state
  on every control, color never alone, 1.3× text, VoiceOver + TalkBack audited) and support an
  external keyboard on tablet.
- **FR-027**: Layouts MUST be tablet-first (list | detail split on a 13" tablet) and remain fully
  usable on a phone.

### Key Entities

- **Session** (device): the signed-in person, tokens, the chosen bakery. Deleted on sign-out.
- **Bakery** (server: company): id, name, the member's role, archived or not.
- **Product** (server): id, name, product number, active/archived.
- **Label type** (server reference: declaration rule-set): id, region, required categories,
  offered/background, active/retired.
- **Declarations grid** (server, computed per read, never saved): per product × assigned label
  type, five category cells with required, complete, gaps; "current as of".
- **Gap** (server): kind, datum, location path(s); rendered as a sentence.
- **Label rendering** (server, computed per read, never saved): sections of runs with emphasis,
  nutrition rows with rounded and source figures, gaps, notices, symbol ids, language.
- **Issued label** (server, immutable apart from status; saved on device): id, product, label type,
  language, frozen rendering and text, status, issued-by/at, withdrawn-by/at.
- **Match verdict** (server, per read, never saved): differs from current or not, with check time.
- **Entitlement answer** (server): whether the bakery's plan includes the desk.

## Screen inventory (input for the design-mobile lane)

1. **Sign-in** — email, password, link out for account/recovery; Pro world (navy/lime).
2. **Bakery chooser** — for members of several bakeries; also reachable as a switcher.
3. **Label desk: product list** — search, rows with per-label-type readiness; tablet left pane.
4. **Product: declarations grid** — label types × five categories, gap sentences, "current as of";
   tablet right pane.
5. **Label preview** — label type + language selectors, rendered sections, nutrition table with
   source/rule disclosure, gaps and notices panel, "no engine" state.
6. **Issued labels (per product)** — grouped by label type and language, status chips.
7. **Issued label detail + match check** — frozen text, status banner, verdict with check time,
   optional side-by-side with the current preview.
8. **Saved labels (offline)** — grouped by product, "status as of" per item.
9. **States**: offline, loading, empty (no products; no issued labels), bakery archived, plan does
   not include the desk (VII, no dark patterns), session expired.

Phone degradation of 3/4 and 5/7 (stacked navigation) is part of the same pass.

## Contract check (Constitution II) — what the desk needs vs. what the API serves

Checked against `nutrimero-api` `origin/main` `4a4356b` (104 paths). This repo's snapshot is stale
(56 paths); the Home lane syncs it in a standalone contract-sync PR, and this feature consumes that PR.

| # | Needed by | API status | Note |
|---|---|---|---|
| B1 | FR-001/002 | ✅ auth, `/me` with memberships, `X-Company-Id` | Existing 001 surface |
| B2 | FR-005 | ❌ `/products` has no text search (paged, filters `recipeId`/`purchasedItemId` only) | Ask: `q` on `/products`. Until then: see Q3 |
| B3 | FR-004/006/009 | ✅ `/declarations` (overview), `/products/{id}/declarations` | Computed per read |
| B4 | FR-006/025 | ✅ `/fid/declaration-rule-sets` | Names en-US only → app catalogs (FR-025) |
| B5 | FR-010–014 | ✅ `/products/{id}/labels/{ruleSetId}?language=` | Always 200 for a held product; gaps not errors |
| B6 | FR-015 | 🟡 `/products/{id}/labels/{ruleSetId}/issued` — per label type, unpaged, full payloads | A product's full history needs one read per label type; bounded by offered EU label types. Ask (non-blocking): per-product issued list or paging |
| B7 | FR-016/017 | ✅ `/issued-labels/{issuedId}` with `differsFromCurrent` | Verdict only on the single read (019 R9) |
| B8 | FR-023 | ❌ no entitlements service | Ask: per-company entitlement answer for Pro. The api service must model both scopes — per-user for Home (IDEATION §7), per-bakery for Pro (§5.3). Queued by the coordinator after api 020 P1 |
| B9 | FR-022 | ✅ `INSUFFICIENT_ROLE` / 404 / `COMPANY_ARCHIVED` refusals | Drives cache deletion |
| B10 | — | watch: api 020 (declaration name) in flight | May add the food name to renderings; the desk renders whatever sections arrive (FR-010) |
| B11 | FR-011 | ❌ no list of label languages; `language` is a free string (2–35 chars, default en-US) | Ask: a listing of languages the label vocabulary holds. Until then FR-011's proven-only list |
| B12 | FR-003 | ✅ (by absence) `declarationsEnabled` on the company schema only; no route gates on it | Pinned in the plan's contract check |

## Clarifications

### Gate 1 rulings — coordinator, 2026-09-23

- **Q1 → (A) approved.** 002 owns sign-in, sign-out and the bakery chooser/switcher as shared
  session capability in `packages/core`, announced to the Home lane through the coordinator before
  merge (III seam). Conditions: (1) the session layer honours Home's FR-011 wipe as a contract —
  core wipes its own data and calls app-registered wipers (FR-001b); (2) a sign-in by a different
  account performs the FR-022 wipe before anything is read (FR-001a); (3) the secure token store
  is judged at plan time under XI honestly — a new dependency category stops for an ADR.
- **Q2 → (A) approved as the build.** FR-023's states are built and render the server's answer;
  store release waits until the api serves one. (B), an internal-track pilot, is the owner's
  decision and is **not planned** until his word arrives. Entitlements must model per-user (Home)
  and per-bakery (Pro) scopes; this spec's per-company answer is the correct Pro-side statement.
- **Q3 → (A) approved** with a stated bound (FR-005). `q` on `/products` is queued on the api
  (small change on 015; branded-products already has `q`). B6 is queued as non-blocking.
- **Label languages**: no source exists for "24" — FR-011 rewritten to a proven-only list; ask B11.
- **FR-003** pinned to the verified fact (B12).

### Questions as carried to gate 1 (record)

**Q1 — Does 002 own sign-in and the bakery chooser?**
Default **(A) Yes, minimal**: email/password sign-in, sign-out, bakery chooser/switcher — built as
shared session capability in `packages/core` (announced to the Home lane per the III seam; Home's
001 explicitly has no sign-in and names FR-011 as the future auth contract, which this session
layer must honor). Alternatives: (B) a separate Pro "001-style" auth feature first, 002 waits on
it; (C) shared auth specced by the Home lane — Home has no need for it yet.

**Q2 — Tier gating while the api has no entitlements service.**
Default **(A) The desk is built with FR-023's states, and release waits for the entitlement
answer** — no client decision, no "ungated until later". Alternatives: (B) a pilot build (TestFlight/internal track, Markus's pilot bakeries) ships ungated, with no store release until
entitlements exist — the gate is the distribution channel, not the app; (C) block 002 entirely on
the api entitlements feature. (B) needs the owner's word that a distribution-gated pilot does not
breach VII.

**Q3 — Finding a product before `/products?q=` exists.**
Default **(A) Filter over the loaded list** (all active pages loaded, name/number filter on the
device) — a view over data already fetched, not a faked server capability — plus ask B2 raised to
the api lane. Alternative: (B) no search until B2 ships (list only, sorted by name).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From a signed-in launch, the owner can answer "is product X ready for the EU counter
  card, and if not, what is missing?" in under 30 seconds on a tablet.
- **SC-002**: 100% of gaps the api reports for a product's grid and preview appear in the desk as
  sentences; zero are dropped (verified against the api response for a fixture set).
- **SC-003**: For a fixture set of counter-card and packaging renderings in en-US, de-DE and lt-LT,
  the desk's displayed label text equals the api's `text` character for character, with emphasis
  on exactly the runs the api marks.
- **SC-004**: The match verdict shown always equals the api's answer from a read made while
  viewing; offline, zero verdicts are shown.
- **SC-005**: After one online viewing, 100% of loaded issued labels are readable offline in full,
  and Saved labels opens offline within 2 seconds.
- **SC-006**: After sign-out, zero saved labels or session data remain on the device.
- **SC-007**: Every screen in scope passes VoiceOver and TalkBack walkthroughs and renders without
  clipped meaning at 1.3× text in en, de and lt; zero user-facing strings outside the catalogs.

## Assumptions

- Accounts, bakeries, products, assignments and issued labels are created on the web platform;
  the desk reads them. Pilot bakeries use the web for every write in this feature.
- The label-language list is proven-only (FR-011); its source is named in the plan.
- Gap sentences are composed from catalog templates per gap kind with server-provided names
  (ingredient, recipe, nutrient) inserted — the app never invents gap content.
- Food-symbol wording is not part of the rendering (019 FR-018/035); the desk shows localized
  symbol names from reference data, labelled as such.
- The desk is an office/counter tool, not Floor Mode; it follows the Pro scheme (OS light/dark).
- Numbers from the api are shown as the api formats or supplies them; any display of
  full-precision figures uses the shared decimal formatter (no floating-point rounding).
- The Home lane's contract-sync PR lands before this feature's implementation; if it has
  not, implementation stops (II).
- Everything this feature adds under `packages/*` (session, company context, error handling,
  gap renderer, issued-label store, decimal formatting) is announced to the Home lane through the
  coordinator before merge (III seam). A local persistence engine for saved labels is a new
  dependency category and is raised as a XI stop at plan time.
