# Feature Specification: Home Baker first run (shell)

**Feature Branch**: `lane/home-baker` (spec directory `specs/001-home-first-run/`)

**Created**: 2026-09-23

**Status**: Gate 1 PASSED 2026-09-23 (coordinator) — with the split and rulings recorded below

**Input**: Coordinator assignment "001-home-first-run": the path from cold install to a usable
recipes home — splash, the three onboarding steps (units, dietary profile, pantry), and the recipes
landing in Constitution VIII's shape. Constitution 1.0.0 governs.

**Sources, in authority order**: `nutrimero-docs/mobile/IDEATION.md` (decided items settled) ·
approved corpus `nutrimero-design:mobile/home-baker` — `00-splash` **as amended by DESIGN.md
0.5.0** (see Dependencies), `07-onboarding-units`, `07-onboarding-diet`, `07-onboarding-pantry`,
`01-recipes` (+ `-dark`, `-de`) and `NOTES.md` · `docs/DESIGN.md` (binding) · `PRODUCT.md`.

## Gate 1 record

- **The split.** The contract check (below) found no operation the Home Baker app can call
  without a session, and no published recipe catalog. 001 is therefore the **first-run shell**:
  splash, the three onboarding steps, the device store and every wipe rule, the tab shell with
  honest empty states, and the Recipes tab's connect-once / offline / empty states. The
  **populated** recipes home and its populated offline cache move to **003-recipes-home**, gated
  on the api catalog series (A1–A7), which the owner schedules. 001 converges and merges as done
  on its own.
- **Q1 → (A)**: anonymous first run; no account, no sign-in UI.
- **Q2 → (A)**: the pantry seed is device-only, under the same wipe rules as the dietary profile,
  migrated when the api's per-user scope exists.
- **Q3 → (A)**, conditions in FR-014–FR-017: onboarding completes with no network, from a
  script-produced FID snapshot shipped with the app. No runtime FID refresh in 001.
- **Dietary mapping** (option → FID) is **ruled by the owner** (correction to gate 1,
  2026-09-23; not a Markus item): the conservative default is the ruling, and it builds in 001 —
  see FR-018.
- With Q1 + Q3, 001 makes **no** api calls at all (A8 is zero for this feature).

## Scope

**In**: splash hand-off on every launch; the three onboarding steps on first launch (each
skippable); the device-local dietary profile, units preference and pantry seed; the FID
reference snapshot that onboarding reads; the wipe rules (sign-out, erase, local reset); the
bottom tab bar with honest empty states; the Recipes tab in its connect-once state; the seven UI locales (Constitution IX 1.1.0:
en, de, hu, lt, be, pl, uk); the in-app interface-language choice (FR-026; IX 1.2.0).

**Out** (named so nothing is silently assumed): the populated recipes home, featured drop,
category filter and populated offline cache (→ 003); recipe detail and baking mode (`02`,
`02b`); search; Builder / Shopping / Pantry management screens (`03`–`05`); paywall and
purchases (`06`); account sign-up/sign-in; any api call, including runtime FID refresh; server
sync of onboarding data; push notifications; analytics.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — From cold install to the Recipes tab (Priority: P1)

A home baker installs the app and opens it. They see the Home Baker cover, answer (or skip)
three short questions, and land on the Recipes tab, which tells them honestly that recipes
download once a connection and the catalog are available.

**Why this priority**: This is the activation path (IDEATION §11.2 #10). The shell, navigation
and every first-run decision must exist before any content can land in it.

**Independent Test**: On a fresh install, launch, skip all three steps, confirm the Recipes tab
appears in its connect-once state with the tab bar; relaunch, confirm the cover goes straight to
the Recipes tab.

**Acceptance Scenarios**:

1. **Given** a fresh install, **When** the app launches, **Then** the Home Baker cover is shown
   only as long as startup requires, then onboarding step 1 appears.
2. **Given** any onboarding step, **When** the user taps Skip, **Then** they move to the next
   step (or the Recipes tab after the last) and the skipped answer stays at its default.
3. **Given** onboarding finished or skipped, **Then** the Recipes tab shows its masthead and the
   connect-once state: an illustrated empty state, one sentence, one action.
4. **Given** onboarding was completed or skipped once, **When** the app launches again, **Then**
   it goes from the cover straight to the Recipes tab.
5. **Given** the tab bar, **Then** it shows Recipes · Builder · Shopping · Pantry · More with
   labels; Builder, Shopping and Pantry show an honest illustrated empty state with one action
   back to Recipes.

---

### User Story 2 — Tell the app what to watch for, privately (Priority: P1)

On the second step the baker marks dietary needs (Gluten-free, Lactose-free, Nut allergy,
Egg-free, Vegan, Vegetarian). The screen says plainly that the profile stays on the device.

**Why this priority**: The sharpest liability and privacy edge in the product (Constitution IV,
VI). Its storage and wipe rules must be right before any feature reads the profile.

**Independent Test**: Select "Nut allergy" and "Vegan", relaunch, confirm the selection persists
on the device; confirm the app made no network request at any point; confirm the profile is
absent from a device backup.

**Acceptance Scenarios**:

1. **Given** the dietary step, **Then** it shows the six options as selectable cards with glyph
   and text, the "Stays on your device" statement and the "always check your product labels"
   disclaimer.
2. **Given** selections are made, **When** the user continues, **Then** the profile is stored on
   the device only.
3. **Given** the user skipped this step, **Then** the profile is empty.

---

### User Story 3 — Choose units and seed the pantry in thirty seconds (Priority: P2)

On the first step the baker picks Metric or Imperial and sees how recipes will read. On the third
step they tap the staples on their baking shelf; a counter confirms how many are in the pantry.

**Why this priority**: Units and pantry feed later features (recipe detail, Builder, Shopping);
capturing them at first run is cheap and is the moment the pantry comp promises.

**Independent Test**: With no network from install onward, choose Imperial and tap eight
staples; relaunch; confirm both choices persist and staple names appear in the device language.

**Acceptance Scenarios**:

1. **Given** the units step, **When** Metric or Imperial is selected, **Then** the example
   conversions update to that system; Metric is preselected.
2. **Given** the pantry step, **Then** it shows the 14 staples of `07-onboarding-pantry`, named
   in the user's language from the FID snapshot, and the counter reads "N items in your pantry so
   far".
3. **Given** staples were tapped, **When** the user taps "Done — show what I can bake", **Then**
   the selection is saved on the device and the Recipes tab appears.
4. **Given** no network since install, **Then** all three steps complete normally.

---

### User Story 4 — Forget me on this device (Priority: P2)

A baker sharing a tablet with family wants their dietary profile and pantry gone from it.

**Why this priority**: Constitution VI — data that never leaves the device must still be
removable from it. It also fixes, now, the wipe contract the future auth feature must honor.

**Independent Test**: Complete onboarding with a profile and pantry, use "Clear my data on this
device" in More, confirm the app returns to onboarding step 1 and nothing remains.

**Acceptance Scenarios**:

1. **Given** saved onboarding data, **When** the user confirms "Clear my data on this device",
   **Then** the dietary profile, units choice, pantry seed and onboarding marker are deleted and
   the app restarts first run.
2. **Given** the confirmation step, **Then** it names what will be deleted and offers Cancel at
   **the same size** as the confirm action (amended 2026-09-24: the owner approved design-mobile's
   sheet layout; its copy comes from design-mobile).

---

### Edge Cases

- **Language**: an in-app choice (FR-026), when set, decides; otherwise the device language selects
  one of the seven UI locales (en, de, hu, lt, be, pl, uk); any other → en (Constitution IX 1.2.0,
  rule 1 — unchanged by the in-app choice, which only overrides it). **be and uk render in their ruled Cyrillic faces** (design G-2: Onest for
  UI text, Yeseva One for stamps; ADR 0001 *Fonts*) once those faces are vendored (phase 3c);
  until then a be or uk device renders en. German remains the long-word stress test at 1.3× text
  size (`01-recipes-de` is the parity witness for the masthead, tab labels and shell strings); pl,
  be and uk are in the stress set, be and uk with their string widths measured in Onest (Cyrillic
  widths behave differently from Latin).
- **Dark scheme**: onboarding, the Recipes tab and empty states follow the OS scheme (per
  `01-recipes-dark`); the cover and illustration plates are scheme-fixed.
- **Interrupted onboarding**: app killed mid-flow → next launch resumes at the first unfinished
  step; answers already given are kept.
- **Changing answers later**: no editor ships in 001; "Clear my data" plus re-onboarding is the
  path until a settings feature exists.
- **No recipes to evaluate yet**: 001 builds and tests the fit evaluation (FR-018) but shows no
  fit flags — there are no recipes until 003, which displays them.
- **Snapshot staple missing a locale name**: shows the en FID name — today the expected case for
  lt, pl, be and uk until api `feat/021`'s translation run is imported (FR-017's temporary
  fallback); a missing staple fails the build (FR-017), never the user.
- **Storage write fails**: the user is told the answer could not be saved and may continue;
  onboarding is re-offered on next launch.
- **Reduce Motion**: splash exit and step transitions become instant cuts.

## Requirements *(mandatory)*

### Functional Requirements

**Launch & splash**

- **FR-001**: The app MUST show the Home Baker cover **as the DESIGN.md 0.5.0-amended corpus
  draws it** (real logo, owner-approved — D-5), not today's `00-splash` file. The static native
  splash MUST be the cover's cream field, so there is no flash of any other color.
- **FR-002**: The cover MUST be held only while startup work is pending, never for a fixed
  duration; its loader is announced once as "Loading".
- **FR-003**: First launch goes from the cover to onboarding step 1; later launches to the
  Recipes tab.

**Onboarding**

- **FR-004**: Onboarding MUST be three steps, Units → Dietary profile → Pantry, each with Skip, a
  primary action in the bottom half, and a working system back.
- **FR-005**: Units MUST offer Metric (preselected) and Imperial, with live example conversions,
  stored on the device.
- **FR-006**: The dietary step MUST offer exactly Gluten-free, Lactose-free, Nut allergy,
  Egg-free, Vegan, Vegetarian (multi-select), each with its owned diet/allergen glyph in the
  "-free" (strike) form where applicable and a text label, plus the device-local statement and
  the product-label disclaimer.
- **FR-007**: The pantry step MUST present the 14 staples of `07-onboarding-pantry`, each
  identified by its FID ingredient and named from the FID snapshot in the user's language, with a
  live count, stored on the device. A staple whose name the snapshot lacks in the UI locale is
  shown in English (the temporary fallback under FR-017).
- **FR-008**: Onboarding MUST be recorded as completed when the last step is finished or skipped,
  and resume at the first unfinished step if interrupted.

**Privacy and wipe (Constitution VI)**

- **FR-009**: The dietary profile and pantry seed MUST be stored only on the device, never sent
  to any server or included in any request, log or crash report, and MUST be excluded from
  OS-level cloud/device backups.
- **FR-010**: Any later matching against the profile MUST happen on the device (binding on 003
  and every consumer).
- **FR-011 (sign-out)**: When sign-in exists and a user signs out, the app MUST delete the
  dietary profile, pantry seed and units choice from the device and return to first run. 001 has
  no sign-in; this is the binding contract the future auth feature implements.
- **FR-012 (erase)**: When a user erases their account from the app, the app MUST perform the
  FR-011 deletion regardless of the server's response. The server-side erase cascade belongs to
  the future auth/profile feature.
- **FR-013 (local reset)**: More MUST offer "Clear my data on this device", with a confirmation
  naming what is deleted, removing everything in FR-011 plus the onboarding marker (and, once
  003 exists, the cached collection).

**FID reference snapshot (Constitution IV, gate-1 ruling Q3)**

- **FR-014**: The snapshot MUST be produced by a script from the api's own contract-typed
  responses — never hand-typed — and MUST cover exactly the 14 staples and the allergen/dietary
  vocabulary the six dietary options map to, in all seven UI locales.
- **FR-015**: The snapshot MUST carry, in its header, the api commit it was taken at.
- **FR-016**: The app MUST NOT refresh FID data at runtime in 001 (no session exists to do it
  with) until a guest-read policy exists.
- **FR-017**: A test MUST prove every staple's FID id resolves in the snapshot and MUST assert its
  names in all seven UI locales. en, de and hu MUST be present; **lt, pl, be and uk are marked
  "pending translation run"** rather than failing the build while the fallback below stands. Any
  other missing locale fails the test and is ruled (owner); nothing is ever filled by hand.
  **Temporary fallback (coordinator ruling 2026-09-23; tied to api `feat/021`)**: FID ingredient
  names in **lt, pl, be and uk** arrive by the api's machine-translation run (`feat/021`, after
  `fix/002` and S1). Until that run is imported, the snapshot has no names in those four locales,
  and a staple whose name is missing in the UI locale is shown **in English** — never hand-filled.
  When the run lands, the snapshot is regenerated and this clause is retired with its own dated
  entry.
  A hand edit to the snapshot is a suppression-class violation (Constitution XII).
- **FR-018 (owner's ruling, 2026-09-23)**: The dietary option → FID mapping is: Gluten-free ⇒
  cereals containing gluten; Lactose-free ⇒ milk (incl. lactose); Nut allergy ⇒ tree nuts **and**
  peanuts; Egg-free ⇒ eggs; Vegan / Vegetarian ⇒ FID dietary facts. Fit evaluation, on the device:
  an allergen state of "contains" ⇒ **not fitting**; "unknown" or "depends on brand" ⇒ **check**,
  never fitting; only an explicit "does not contain" (or a satisfied dietary fact) fits. 001 builds
  the mapping and the evaluation with tests covering every option × state; 003 displays the result.

**Recipes tab (shell states)**

- **FR-019**: The Recipes tab MUST show its masthead and, while no catalog is available, the
  connect-once state: illustration, one sentence ("Recipes download the first time you're
  connected"), one action. It MUST NOT show placeholder or sample recipes.
- **FR-020**: *Moved to 003 at gate 2 (2026-09-23).* 001 makes no network calls and has no saved
  data or network-only actions; the `OfflineBanner` component ships in `packages/ui` with 001's
  shell components and is wired in 003.

**Shell, language, accessibility**

- **FR-021**: The bottom tab bar MUST show Recipes · Builder · Shopping · Pantry · More with
  labels always visible; unbuilt tabs show an illustrated empty state (one sentence, one action
  back to Recipes). More contains only "Language" (FR-026), "Clear my data on this device" (FR-013)
  and the app/version line.
- **FR-022**: Every user-facing string MUST come from the seven UI-locale catalogs (Constitution IX
  1.1.0: en, de, hu, lt, be, pl, uk), with key parity and per-locale plural coverage enforced by test,
  and Hermes' `Intl.PluralRules` verified on device for all seven. Translations are lane-authored
  and owner-reviewed; nothing machine-translated ships unreviewed.
- **FR-023**: Every screen in scope MUST meet DESIGN.md's accessibility gate: 44pt targets, role,
  label and state on every control, color never alone, layouts intact at 1.3× text size, and a
  VoiceOver + TalkBack audit before done.
- **FR-024**: Motion MUST follow `NOTES.md` for these screens (150–250 ms; Reduce Motion ⇒
  instant).
- **FR-025**: Home Baker colors MUST come from tokens that follow DESIGN.md (e.g. the home accent
  is butter gold `#dfa621`, not lime).

**Interface language (owner's ruling 2026-09-23; Constitution IX 1.2.0)**

- **FR-026**: More MUST offer "Language". It lists the seven UI locales **by their own names**
  (English, Deutsch, Magyar, Lietuvių, Беларуская, Polski, Українська), marks the current one, and
  shows the system's choice as the default ("System language — ‹name›"). Choosing a locale:
  - **overrides** the system language, and choosing the default removes the override;
  - **applies immediately**, without a restart — every visible string and the UI and stamp faces
    (G-1/G-2) switch in place;
  - **persists on the device** in the device store.
  Locale resolution takes the stored override first, then the device languages (FR-022's rule).
- **FR-027**: The language choice is a **device preference, not personal data**. It is **not** part
  of the FR-011 (sign-out), FR-012 (erase) or FR-013 ("Clear my data") wipes, which leave it in
  place. It is cleared only by the reinstall-orphan clear (ADR 0001 condition 3), so a fresh
  install starts from the system language.
- **FR-028 (pending design)**: The Language picker has **no corpus drawing**. The design-mobile lane
  draws it for the owner's walk, and it is built only after that. Until then the More tab's
  "Language" row is present as an **honest not-yet state** (visible, announced as not yet
  available, no dead end), and resolution already honours a stored override.

### Key Entities

- **Dietary profile** (device-only): the set of the six options chosen.
- **Units preference** (device-only): metric | imperial.
- **Interface-language preference** (device preference, FR-026/027): one of the seven UI locales,
  or absent (follow the system). Not personal data; outside the Home wiper; cleared on reinstall.
- **Pantry seed** (device-only in v1): set of FID ingredient ids; migrates to the server pantry
  when the api's per-user scope exists.
- **Onboarding state** (device-only): per-step completion and the completed marker.
- **FID reference snapshot** (shipped with the app): the 14 staples (id, localized names,
  dietary facts) and the allergen/dietary vocabulary the six options need, with the api commit it
  was taken at.

## Contract check (Constitution II)

Checked against this repo's snapshot (`contract/openapi.json`, 56 paths / 60 operations) and
`nutrimero-api` `origin/main` at `4a4356b` (104 paths / 122 operations, through feature 019).
**No operation is callable without a session; every FID read is bearer-secured; recipes are
company-scoped.** 001 makes no api calls at run time. The only api use is the snapshot script at
build time, against the contract-typed responses.

### Consumed by 003-recipes-home (api catalog series, owner-scheduled)

| # | 003 needs | Missing in the contract | API ask |
|---|---|---|---|
| A1 | the populated index | A published catalog the Home Baker app can read; today's recipes (013) are company-owned and need `X-Company-Id` + an access token | Published catalog, with its guest-read policy |
| A2 | rows, categories | Category, total time, difficulty on the summary; localized names | Summary fields, localized |
| A3 | provenance stamps | Image URL + `media.origin` (`real_photo \| ai_illustration`) | Media on recipes (IDEATION §3.3) |
| A4 | allergen glyphs, profile flags | Allergen states in the list (today per recipe only) | States on the summary or a batch read |
| A5 | tier chips | Visibility (`public \| app_exclusive`) + an entitlement answer | Visibility + entitlements (IDEATION §7) |
| A6 | featured drop | Drops (monthly collections) | Drop resource |
| A7 | populated offline cache | `updated_since` + tombstones | Delta sync (IDEATION §7) |

### Mobile-side, this repo

| # | What | Where |
|---|---|---|
| A9 | Sync `contract/openapi.json` to api `origin/main` `4a4356b`, regenerate `packages/core`, record the api commit | Own PR `chore/contract-sync` (gate-1 housekeeping), ahead of 001 |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user reaches the Recipes tab in its connect-once state from a cold
  install in under 60 seconds with skips, and under 2 minutes answering every step — with or
  without network.
- **SC-002**: Zero network requests are made by the app during first run and browsing of the
  shell (verified by inspecting all traffic).
- **SC-003**: The dietary profile and pantry seed are absent from device backups and from every
  log and crash report.
- **SC-004**: After "Clear my data on this device", zero onboarding data remains on the device.
- **SC-005**: Every staple resolves in the FID snapshot (build-time test) with names in en, de and hu,
  and in lt, pl, be and uk once api `feat/021` is imported (until then asserted as "pending
  translation run"); the snapshot names the api commit it came from.
- **SC-006**: Every screen in scope passes a VoiceOver and a TalkBack walkthrough and renders
  without clipped meaning at 1.3× text size in all seven UI locales (be and uk measured in Onest).
- **SC-007**: Zero user-facing strings outside the seven catalogs; the catalogs have identical
  key sets.

## Dependencies

- **api `feat/021`** (machine-translated FID ingredient names in lt, pl, be, uk; after `fix/002`
  and S1): not blocking. Until it is imported the pantry step shows those locales' staple names in
  English (FR-017's temporary fallback); on import, regenerate the snapshot and retire the fallback
  with a dated entry.
- **DESIGN.md 0.5.0** (design-mobile lane authors `mobile/AMENDMENTS.md` in nutrimero-design; the
  Home lane ports it into `docs/DESIGN.md` by PR, with the PRODUCT.md staleness the census found).
  The splash is re-drawn there (real logo, smaller, owner-approved first — D-5); FR-001 builds
  that version. Screens with no pending amendment build against 0.4.0.
- **chore/contract-sync** merged, so the snapshot script runs against current contract types.

## Assumptions

- Language follows the device (one of the seven, else en) unless the in-app choice (FR-026)
  overrides it. *Retired 2026-09-23 by the owner's ruling:* "no in-app language step — the corpus
  has none". There is still no language step in **onboarding** — the choice lives in More.
- No editor for profile/units/pantry in 001; clear-and-re-onboard is the stopgap.
- The 14 staples are curated content, identified by FID ingredient id.
- Everything added under `packages/*` (the onboarding feature package, shared components, the
  i18n runtime, the device store) is announced to the pro lane through the coordinator before
  merge (III seam; `packages/features/*` needs no ADR). Any new dependency category is read
  broadly under XI and raised at plan time as a stop.
