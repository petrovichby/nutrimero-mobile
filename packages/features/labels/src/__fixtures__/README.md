# Label desk fixtures

Recorded by `scripts/record-label-fixtures.ts` from a **local** nutrimero-api at
`4a4356b332995fdcd326735f44de1cfd166f0c9c` (`contract/SOURCE`), seeded with `fid:import`. Never from production.
Recorded 2026-09-23.

The company is built through the api's own routes over real FID corpus rows:

| Product | Composition | Label types | Covers |
|---|---|---|---|
| Haselnussbrot (HB-500) | wheat flour 600 g + hazelnuts 400 g | eu1_counter_card | complete grid; counter-card renderings (en-US, de-DE); issued: active, superseded (after an upstream change), withdrawn |
| Nussecke (NE-120) | wheat flour 500 g + hazelnuts 500 g | eu1_packaging, usa_packaging | P-02 Additives gap; packaging rendering with nutrition; no-engine rendering |
| Saisonbrot (SB-001) | none | eu1_counter_card | no-composition gaps |

A second person belongs to both bakeries (the /me fixture).

Each module is typed with `satisfies` against the generated contract types.
