# Curated set per market — DRAFT for the owner's confirmation (004 FR-018, FR-026)

Drafted 2026-09-24 by the Home lane from FID's seed files at nutrimero-api `4a4356b` (= `contract/SOURCE`),
one entry per concept (where FID holds duplicates, the staple or the entry with the most rows); the 13
staples included. **Not yet confirmed** — the owner is ruling this list and the ten picks.

**Every volume and piece row is an AI-delivered claim** (api lane finding, 2026-09-24): the sources FID
records — "USDA FDC via iForge", Health Canada CNF, Fineli, FAO/INFOODS, "OpenAI category estimate" — are
source strings inside Markus's M30 density file, and the "AI-assisted" rows are M34's; both deliveries
were disclosed as AI-generated. Piece weights are Markus's M28 table, method undisclosed. A row counts only
once it is **verified against its named record, or confirmed by two independent published sources within
5 %** — the evidence is in `density-evidence.md`.

**183 ingredients** — volume: **114 verified**, **10 pick (owner ruling)**, **44 no verified volume**, **15 no volume data**. Pieces: 16 ingredients carry
piece rows; **one row is confirmed** (pear, large) and one only as a peeled weight (banana, medium) — no
screen shows a piece weight until more are verified.

Status: **verified** = the value(s) the app may show (g/ml, per FID form); **pick** = one of the ten
inconsistencies, suggested pick in `density-evidence.md` §B, owner ruling; **no verified volume** = rows
exist but none passed — the ingredient shows no volume conversion; **no volume data** = FID has no row.


## Per market (owner's ruling, 2026-09-25)

The market is the **device region** (spec FR-024). The set is a **market-neutral core** plus national flour
classes; every market-scoped value will come from the api's units-and-density change (FR-025).

| Market | Set | Household units | Eggs |
|---|---|---|---|
| **DE, AT, CH** | core **+ the 13 German Type flours** (below) | cup 250 ml, tsp 5, tbsp 15 | EU grades once the api defines them (FR-007a) |
| **HU, PL, LT** | core; national flour classes are **api-lane gaps** (below) — no equivalences | cup 250 ml, tsp 5, tbsp 15 | EU grades once defined |
| **US** (later) | core **+ US flour names** (all-purpose, bread, cake, self-rising, high-gluten — marked **US market only** in the tables) | US cup 236.59 ml, stick | US classes (FID's current values are minimums, §D) |
| any other region, or none | core only (QM1) | cup 250 ml, tsp 5, tbsp 15 | **no egg grades** (QM1 — e.g. BY and UA grade eggs differently) |

The **core** is the 183 draft ingredients below minus the five US flour names: **178**. US units chosen in
onboarding switch on the US cup and the stick in any market but do not change the set.

### DE / AT / CH — the 13 German Type flours (by weight only, FR-027)

| FID id | Name (FID) | Volume rows | Status |
|---|---|---|---|
| `19D72A1` | Weizenmehl Type 405 | 1 — US proxy ("mapped to all-purpose flour") | by weight only — no Type-specific source (evidence §F) |
| `7A62E03` | Weizenmehl Type 550 | 1 — US proxy ("mapped to all-purpose flour") | by weight only |
| `0F6655E` | Weizenmehl Type 812 | 1 — US proxy ("mapped to whole-wheat flour") | by weight only |
| `03C3B96` | Weizenmehl Type 1050 | 1 — US proxy ("mapped to whole wheat flour") | by weight only |
| `92CF3A9` | Weizenmehl Type 1600 | 1 — US proxy ("mapped to whole wheat flour") | by weight only |
| `4E14641` | Dinkelmehl Type 630 | 0 | by weight only |
| `3FB1F22` | Dinkelmehl Type 812 | 0 — **FID base name is "Dinkelmehl Type plant1brand"**, no English name | by weight only; name defect to the api lane |
| `0B1DE1B` | Dinkelmehl Type 1050 | 0 | by weight only |
| `0CD2A0C` | Roggenmehl Type 815 | 0 | by weight only |
| `45A9FD5` | Roggenmehl Type 997 | 0 | by weight only |
| `856BFDD` | Roggenmehl Type 1150 | 0 | by weight only |
| `2EA1812` | Roggenmehl Type 1370 | 0 | by weight only |
| `043D35E` | Roggenmehl Type 1740 | 0 | by weight only |

FID's Hungarian names for the Weizen types are written with underscores ("búzaliszt_405_típus") — a name
defect for the api lane.

### HU, PL, LT — national flour classes FID lacks (gaps for the api lane; no equivalences)

Each country's own classes, as its standard and retail bags state them. **No class is mapped onto another
country's class** (FR-026) — where Lithuanian codes reuse the numerals of German Types, that is a labelling
fact, not an equivalence. No class-specific volume weight was found in any of the three countries.

**Hungary** — Magyar Élelmiszerkönyv (Codex Alimentarius Hungaricus) irányelv **2-201 "Malomipari
termékek"**, 2nd edition, 2019 (PDF March 2020, elelmiszerlanc.kormany.hu); ash % m/m on dry matter. Letters:
grain (B búza, R rozs, D durum, T tönkölybúza) + milling (L liszt, F fogós, D dara); number = ash.

| Grain | Class | Local name | Definition (MÉ 2-201/2020) |
|---|---|---|---|
| wheat | **BL 55** | búzafinomliszt | ash ≤ 0.60 (§1.1) |
| wheat | **BL 80** | fehér búzakenyérliszt | ash 0.61–0.88 (§1.2) |
| wheat | **BL 112** | félfehér búzakenyérliszt | ash 0.89–1.18 (§1.3) |
| wheat | **BFF 55** | búzarétesliszt | coarser grain; ash ≤ 0.55 (§1.5) |
| wheat | BTL 50 | tésztaipari búzaliszt | ash ≤ 0.50 (§1.6) |
| wheat | BGL | Graham-liszt | ash 1.50–2.20 (§1.7) |
| wheat | BTKL | teljes kiőrlésű búzaliszt | ash 1.50–2.20 (§1.8) |
| durum | DSL / DTD | durumbúza simaliszt / tésztaipari durumbúzadara | (§1.10–1.11) |
| spelt | TBL 80 / TBL 200 | fehér / teljes kiőrlésű tönkölybúzaliszt | ash 0.61–0.88 / 1.50–2.20 (§2.1–2.2) |
| rye | RL 60 / RL 90 / RL 125 / RTKL | fehér / világos / sötét / teljes kiőrlésű rozsliszt | ash ≤ 0.65 / 0.66–0.98 / 0.99–1.35 / ≥ 1.36 (§3.1–3.4) |

Trade labels outside the codex also appear on bags: RL-190, BF 55.

**Poland** — **PN-A-74022:2003** (wheat) and **PN-A-74032:2002** (rye), current in the PKN catalogue, voluntary;
typ = ash % × 1000. Ranges from pl.wikipedia "Mąka" (the standard texts were not read — paywalled).

| Grain | Typ (bag) | Local name | Ash (as sourced) |
|---|---|---|---|
| wheat | **450** | tortowa | ≤ 0.50 % |
| wheat | **500** | wrocławska / krupczatka | market type; not in the reported PN list |
| wheat | **550** | luksusowa | 0.51–0.58 % |
| wheat | 650 | — | 0.59–0.69 % |
| wheat | **750** | chlebowa | 0.70–0.78 % |
| wheat | 1050 | — | 0.79–1.20 % |
| wheat | 1400 | sitkowa | 1.21–1.60 % |
| wheat | **1850** | graham | 1.61–2.00 % |
| wheat | **2000** | razowa | ≤ 2.00 % |
| rye | 500 / 580 / 720 / 1150 / 1400 / **2000** | — / jasna / … / razowa | ≤ 0.58 / market type / 0.59–0.78 / 0.79–1.31 / 1.31–1.60 / ≤ 2.00 % |
| spelt | 700 / 1100 / 2000 (and others) | orkiszowa jasna / chlebowa / razowa | no Polish standard found |

**Lithuania** — **LST 1133:2003** as named by lt.wikipedia "Miltai" (not confirmed in the national catalogue —
provisional). Number = ash; letter = gluten band (A → G, 33 % → 18 %); grade words on bags (a. r. / aukščiausios
rūšies, pirmos rūšies, ekstra). Ranges from Malsena's product specifications.

| Grain | Class on bags | Local name | Definition (as sourced) |
|---|---|---|---|
| wheat | **405 D** (EKSTRA) | kvietiniai miltai a. r. EKSTRA | ash 0.35–0.45 %, gluten 25–26 % |
| wheat | **550 D / 550 C** | aukščiausios rūšies / tradiciniai | ash 0.55–0.62 %, gluten 25–27 / 28–30 % |
| wheat | **812 D / 812 C** | pirmos rūšies | ash 0.64–0.90 % |
| wheat | viso / pilno grūdo | viso grūdo kvietiniai miltai | ash 1.50–1.90 % |
| rye | šviesūs (600 / 700 / 815), 997, 1150, 1370, 1740 / 1800, viso grūdo | šviesūs / vidutiniai / tamsūs ruginiai | ash 0.67–0.80 … 1.50–1.80 %; retail shows mostly "viso grūdo" and "šviesūs", unnumbered |
| spelt | šviesūs / pilno grūdo | speltų miltai | no type given |

## Flours & meals

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `389D858` | wheat flour | 3 | 1 | **pick** | CNF 0.528 | — |  |
| `969E29F` | all purpose flour | 2 | 2 | verified | powder: 0.528 | — | · **US market only** |
| `582A6A6` | bread flour | 1 | 0 | no verified volume |  | — | · **US market only** |
| `72328B4` | cake flour | 1 | 1 | verified | powder: 0.482 | — | · **US market only** |
| `5785F9B` | self-rising flour | 1 | 1 | verified | powder: 0.528 | — | · **US market only** |
| `0BD5AB1` | high gluten flour | 1 | 0 | no verified volume |  | — | · **US market only** |
| `5C31635` | durum flour | 1 | 0 | no verified volume |  | — |  |
| `70BF7A9` | wholemeal wheat flour | 2 | 1 | verified | powder: 0.550 | — |  |
| `5124A4E` | spelt flour | 1 | 0 | no verified volume |  | — |  |
| `249843A` | green spelt flour | 1 | 0 | no verified volume |  | — |  |
| `207D0B1` | emmer wheat flour | 1 | 0 | no verified volume |  | — |  |
| `2D515EB` | einkorn wholemeal flour | 1 | 0 | no verified volume |  | — |  |
| `06C84DD` | rye flour | 2 | 2 | **pick** | USDA 0.431 | — |  |
| `6A0F476` | wholemeal rye flour | 1 | 0 | no verified volume |  | — |  |
| `8AF892A` | barley flour | 1 | 1 | verified | powder: 0.550 | — |  |
| `108FD92` | buckwheat flour | 2 | 2 | **pick** | USDA 0.507 | — |  |
| `494F110` | oat flour | 1 | 1 | verified | powder: 0.440 | — |  |
| `4A1C787` | rice flour | 2 | 2 | **pick** | USDA 0.668 or HERR 41 0.630 (owner) | — |  |
| `623BE7D` | brown rice flour | 1 | 1 | verified | powder: 0.668 | — |  |
| `631E984` | corn flour | 2 | 1 | **pick** | USDA 0.4945 | — |  |
| `21C7B98` | chickpea flour | 1 | 1 | verified | powder: 0.389 | — |  |
| `847932F` | almond flour | 1 | 1 | verified | powder: 0.406 | — |  |
| `14B516A` | degreased almond flour | 1 | 0 | no verified volume |  | — |  |
| `0C12CC1` | millet flour | 2 | 2 | **pick** | USDA 0.503 (SR 119 g) | — |  |
| `31AAB6F` | quinoa flour | 1 | 1 | verified | powder: 0.473 | — |  |
| `8A2BF40` | sorghum flour | 1 | 1 | verified | powder: 0.575 | — |  |
| `604C980` | teff flour | 1 | 1 | verified | powder: 0.592 | — |  |
| `7EC180E` | tapioca flour | 1 | 0 | no verified volume |  | — |  |
| `0829EF9` | semolina | 2 | 1 | verified | granules: 1.000 | — |  |
| `2F7A71F` | cornmeal | 1 | 1 | verified | meal: 0.634 | — | grind-dependent (weak) |
| `5C1D633` | polenta | 1 | 1 | verified | meal: 0.689 | — |  |

## Grains, flakes & brans

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `6B83483` | rolled oat | 1 | 0 | no verified volume |  | — |  |
| `955771D` | gluten free rolled oats | 1 | 0 | no verified volume |  | — |  |
| `250B810` | oat | 1 | 1 | verified | flakes: 0.380 | — |  |
| `29EDE71` | oat bran | 1 | 1 | verified | flakes: 0.600 | — |  |
| `82963D1` | wheat bran | 1 | 1 | verified | flakes: 0.200 | — |  |

## Starches & thickeners

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `3B304CE` | cornstarch | 4 | 4 | verified | powder: 0.533–0.550 | — |  |
| `87FA108` | potato starch | 4 | 1 | **pick** | KA 0.642 or Norway/KTL 0.70 (owner) | — |  |
| `6EE785F` | tapioca starch | 1 | 0 | no verified volume |  | — |  |
| `30CD9C8` | xanthan gum | 1 | 0 | no verified volume |  | — |  |

## Sugars

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `4BEC221` | sugar | 6 | 5 | **pick** | CNF/USDA 0.845 | — |  |
| `5CD04A8` | brown sugar | 3 | 1 | verified | granules: 0.613 | — | unpacked measure — recipes mean packed |
| `88BB32C` | light brown sugar | 1 | 1 | verified | granules: 0.613 | — | unpacked measure — recipes mean packed |
| `409F577` | dark brown sugar | 1 | 1 | verified | granules: 0.613 | — | unpacked measure — recipes mean packed |
| `4AB12BB` | muscovado sugar | 1 | 0 | no verified volume |  | — |  |
| `91299F5` | turbinado sugar | 1 | 1 | verified | granules: 0.930 | — | matches demerara; USDA turbinado cup disagrees |
| `087292B` | powdered sugar | 3 | 3 | verified | powder: 0.500–0.507 | — |  |

## Syrups & honey

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `185FB6F` | honey | 5 | 5 | verified | viscous_liquid: 1.400–1.437 | — |  |
| `5FA9C36` | maple syrup | 1 | 1 | verified | viscous_liquid: 1.319 | — |  |
| `7A20C3B` | golden syrup | 1 | 0 | no verified volume |  | — |  |
| `5A30CC4` | corn syrup | 1 | 1 | verified | viscous_liquid: 1.386 | — | dark corn syrup (light is 1.441) |
| `0CEF8B8` | glucose syrup | 1 | 0 | no verified volume |  | — |  |
| `0F87C17` | molasses | 2 | 1 | verified | viscous_liquid: 1.386 | — |  |
| `37CEF2D` | dark molasses | 1 | 1 | verified | viscous_liquid: 1.386 | — | value copied from dark corn syrup; molasses sources agree within 5 % |
| `5153BCA` | black treacle | 1 | 0 | no verified volume |  | — |  |
| `4C48839` | agave syrup | 3 | 3 | verified | viscous_liquid: 1.400–1.420 | — |  |
| `1D5E134` | date syrup | 1 | 1 | verified | viscous_liquid: 1.300 | — |  |
| `468EF91` | rice syrup | 1 | 0 | no verified volume |  | — |  |
| `51CFBFE` | invert sugar syrup | 1 | 0 | no verified volume |  | — |  |
| `5E0CA71` | sugar syrup | 1 | 0 | no verified volume |  | — |  |
| `423344F` | sugar beet syrup | 1 | 0 | no verified volume |  | — |  |

## Fats & oils

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `61CAB80` | butter | 3 | 3 | verified | whole: 0.933–0.950 | — |  |
| `8840F49` | lard | 1 | 1 | verified | whole: 0.950 | — |  |
| `8A98970` | coconut oil | 1 | 1 | verified | liquid: 0.921 | — |  |
| `583192D` | vegetable oil | 1 | 1 | verified | liquid: 0.921 | — |  |
| `694C698` | sunflower oil | 2 | 2 | verified | liquid: 0.900–0.921 | — |  |
| `73F3050` | rapeseed oil | 2 | 2 | verified | liquid: 0.900–0.921 | — |  |
| `5E169B3` | canola oil | 1 | 1 | verified | liquid: 0.921 | — |  |
| `5B00E77` | olive oil | 3 | 3 | verified | liquid: 0.900–0.913 | — |  |
| `75757A3` | extra virgin olive oil | 2 | 1 | verified | liquid: 0.913 | — |  |
| `037D782` | peanut oil | 2 | 2 | verified | liquid: 0.900–0.921 | — |  |
| `8AE3D9F` | walnut oil | 1 | 1 | verified | liquid: 0.921 | — |  |
| `0FD6C82` | hazelnut oil | 1 | 1 | verified | liquid: 0.921 | — |  |

## Dairy & eggs

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `06CB219` | milk | 4 | 3 | verified | liquid: 1.000–1.031 | — |  |
| `243FE45` | whole milk | 2 | 2 | verified | liquid: 1.031 | — |  |
| `0F967E1` | low-fat milk | 2 | 2 | verified | liquid: 1.031 | — |  |
| `667BFED` | skimmed milk | 2 | 2 | verified | liquid: 1.031–1.036 | — |  |
| `55CD18B` | buttermilk | 3 | 3 | verified | liquid: 1.000–1.036 | — |  |
| `1C42BB3` | heavy cream | 4 | 4 | verified | liquid: 1.000–1.006 | — |  |
| `60999CF` | sour cream | 4 | 3 | **pick** | Fineli 1.00 | — |  |
| `6B43198` | creme fraiche | 3 | 3 | verified | viscous_liquid: 1.000 | — |  |
| `921F9E2` | yogurt | 3 | 2 | verified | viscous_liquid: 1.000–1.036 | — |  |
| `5E4C940` | greek yogurt | 1 | 1 | verified | viscous_liquid: 1.036 | — |  |
| `1FF5882` | Quark | 2 | 0 | no verified volume |  | — |  |
| `0B2945A` | cream cheese | 2 | 2 | verified | paste: 0.980–0.981 | — |  |
| `931F878` | mascarpone | 1 | 0 | no verified volume |  | — |  |
| `0C98DF8` | ricotta | 1 | 1 | verified | crumbled: 1.040 | — |  |
| `5E2B552` | condensed milk | 1 | 1 | verified | viscous_liquid: 1.293 | — |  |
| `3BAEE3B` | sweetened condensed milk | 1 | 1 | verified | viscous_liquid: 1.293 | — |  |
| `4BE30FD` | evaporated skim milk | 1 | 1 | verified | liquid: 1.065 | — |  |
| `6DDD90B` | goat milk | 3 | 3 | verified | liquid: 1.000–1.031 | — |  |
| `14A64E9` | egg | 1 | 1 | verified | liquid: 1.027 | none confirmed |  |
| `649BE19` | egg white | 1 | 1 | verified | liquid: 1.027 | — |  |
| `5D48DEE` | egg yolk | 1 | 1 | verified | liquid: 1.027 | — |  |
| `30909F3` | duck egg | 0 | 0 | no volume data |  | none confirmed |  |
| `4E8C8BD` | quail egg | 0 | 0 | no volume data |  | none confirmed |  |

## Plant milks

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `2B8A64D` | almond milk | 1 | 1 | verified | liquid: 1.014 | — |  |
| `753964D` | soy milk | 2 | 2 | verified | liquid: 1.000–1.014 | — |  |
| `7E00FDD` | rice milk | 1 | 1 | verified | liquid: 1.014 | — |  |
| `1D2A681` | coconut milk | 2 | 2 | verified | liquid: 0.955–1.000 | — | USDA record disagrees with itself; true ≈ 1.01 |

## Leaveners & salt

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `42D1774` | dried yeast | 1 | 0 | no verified volume |  | — |  |
| `1BE98C5` | baking soda | 1 | 1 | verified | powder: 0.930 | — |  |
| `8E9D4D5` | cream of tartar | 1 | 0 | no verified volume |  | — |  |
| `007BBC5` | salt | 3 | 3 | verified | granules: 1.200–1.250 | — |  |
| `57D1791` | kosher salt | 1 | 0 | no verified volume |  | — |  |
| `92D40D1` | rock salt | 1 | 1 | verified | granules: 1.250 | — |  |

## Cocoa & chocolate

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `5CDA2A6` | cocoa powder | 5 | 5 | **pick** | CNF/USDA 0.363 | — |  |
| `761F94E` | dark cocoa powder | 1 | 0 | no verified volume |  | — |  |
| `53E711F` | black cocoa powder | 1 | 1 | verified | powder: 0.364 | — |  |
| `799A3C7` | fat-reduced cocoa powder | 1 | 1 | verified | powder: 0.364 | — |  |
| `16FA35A` | cocoa nib | 1 | 0 | no verified volume |  | — |  |
| `15D6AF4` | chocolate chips | 1 | 1 | verified | chips: 0.719 | — |  |
| `8BCCFFE` | milk chocolate chips | 1 | 0 | no verified volume |  | — |  |
| `5E47AA1` | mini semi-sweet chocolate chips | 1 | 1 | verified | chips: 0.719 | — |  |
| `4DE140E` | chocolate hazelnut spread | 1 | 1 | verified | paste: 1.268 | — |  |

## Nuts

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `22F4A0C` | almond | 1 | 1 | verified | whole: 0.604 | — |  |
| `4D82451` | roasted almond | 2 | 1 | verified | whole: 0.583 | — |  |
| `31B7417` | hazelnut | 1 | 1 | verified | whole: 0.571 | — |  |
| `8E25269` | roasted hazelnut | 1 | 0 | no verified volume |  | — |  |
| `4B65D8F` | walnut | 5 | 5 | verified | whole: 0.423; pieces: 0.507; ground: 0.338; chopped: 0.495 | — | per cut: halves / pieces / chopped / ground |
| `2DF77A0` | walnut halves | 2 | 2 | verified | whole: 0.423 | — |  |
| `32FE0D3` | pecan | 1 | 1 | verified | whole: 0.418 | — |  |
| `82B3E4B` | pistachio | 1 | 1 | verified | whole: 0.520 | — |  |
| `78F4C41` | cashew | 1 | 1 | verified | whole: 0.579 | — |  |
| `14F0BFD` | peanut | 2 | 2 | verified | whole: 0.600–0.617 | — |  |
| `63787F7` | coconut | 0 | 0 | no volume data |  | none confirmed |  |
| `4A98AC4` | shredded coconut | 1 | 1 | verified | shredded: 0.359 | — |  |
| `34B2820` | coconut flakes | 1 | 1 | verified | flakes: 0.254 | — |  |
| `14B34D9` | peanut butter | 2 | 1 | verified | paste: 1.091 | — |  |
| `523D0AF` | almond butter | 1 | 1 | verified | paste: 1.082 | — |  |

## Seeds

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `0BC0823` | poppy seed | 2 | 2 | verified | whole: 0.592–0.600 | — |  |
| `4CAED1B` | sesame seed | 2 | 2 | verified | whole: 0.600–0.609 | — |  |
| `6D78BD7` | black sesame seed | 1 | 1 | verified | whole: 0.609 | — |  |
| `155CC61` | sunflower seed | 1 | 1 | verified | whole: 0.592 | — |  |
| `0E1F75F` | pumpkin seed | 2 | 1 | verified | whole: 0.545 | — |  |
| `50E3FE8` | chia seed | 2 | 0 | no verified volume |  | — |  |
| `8F6ECEF` | flaxseed | 2 | 1 | verified | whole: 0.667 | — |  |
| `2E26184` | sesame tahini | 1 | 1 | verified | paste: 1.014 | — |  |

## Dried fruit

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `6D27AD3` | raisins | 2 | 2 | verified | whole: 0.600–0.613 | — |  |
| `6C62B39` | dried cranberry | 1 | 0 | no verified volume |  | — |  |
| `855901D` | dried apricot | 1 | 1 | verified | chopped: 0.549 | — |  |
| `0D193FB` | dates | 0 | 0 | no volume data |  | none confirmed |  |
| `8CAF08F` | fig | 0 | 0 | no volume data |  | none confirmed |  |
| `917A5B2` | dried figs | 1 | 1 | verified | chopped: 0.630 | — |  |

## Fresh & frozen fruit

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `5C1AE0D` | apple | 1 | 1 | verified | diced: 0.528 | none confirmed |  |
| `8648FEE` | banana | 2 | 2 | verified | sliced: 0.634; mashed: 0.951 | medium as *peeled* weight only; others not confirmed |  |
| `358876D` | blueberries | 1 | 1 | verified | whole: 0.626 | — |  |
| `147D6C1` | raspberries | 1 | 1 | verified | whole: 0.520 | — |  |
| `3BF1425` | cranberries | 1 | 1 | verified | whole: 0.423 | — |  |
| `3B4A108` | rhubarb | 0 | 0 | no volume data |  | none confirmed |  |
| `4DBD686` | pear | 0 | 0 | no volume data |  | large only (230 g); others not confirmed |  |
| `6DD8AD6` | plum | 0 | 0 | no volume data |  | none confirmed |  |
| `56156C0` | sour cherries | 0 | 0 | no volume data |  | none confirmed |  |
| `6D4BDC1` | lemon | 0 | 0 | no volume data |  | none confirmed |  |
| `8BE7328` | lime | 0 | 0 | no volume data |  | none confirmed |  |
| `58ED733` | orange | 0 | 0 | no volume data |  | none confirmed |  |
| `5AEAE3B` | pumpkin puree | 1 | 1 | verified | puree: 1.036 | — |  |
| `3D8656E` | applesauce | 1 | 1 | verified | puree: 1.031 | — |  |
| `1FB350E` | zucchini | 1 | 1 | verified | grated: 0.524 | none confirmed |  |

## Jams & spreads

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `297059A` | apricot jam | 1 | 1 | verified | paste: 1.353 | — |  |
| `6EB27D3` | raspberry jam | 1 | 0 | no verified volume |  | — |  |
| `2A05047` | strawberry jam | 1 | 0 | no verified volume |  | — |  |
| `7E6C458` | cherry jam | 1 | 0 | no verified volume |  | — |  |
| `3AB810C` | plum jam | 1 | 0 | no verified volume |  | — |  |
| `5F64A33` | red currant jam | 1 | 0 | no verified volume |  | — |  |

## Spices & flavourings

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `97C70C4` | cinnamon | 1 | 0 | no verified volume |  | — |  |
| `1C21A47` | nutmeg | 1 | 0 | no verified volume |  | — |  |
| `7CE00B7` | ginger powder | 2 | 0 | no verified volume |  | — |  |
| `18EB3EA` | cloves | 1 | 0 | no verified volume |  | — |  |
| `1453BB3` | vanilla extract | 1 | 1 | verified | liquid: 0.879 | — |  |
| `8EF56E8` | orange blossom water | 1 | 0 | no verified volume |  | — |  |
| `634D851` | rose water | 1 | 0 | no verified volume |  | — |  |
| `1376D93` | coffee | 1 | 1 | verified | liquid: 1.002 | — |  |

## Liquids

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `38FE5B0` | water | 1 | 1 | verified | liquid: 1.002 | — |  |
| `765AEF5` | lemon juice | 1 | 1 | verified | liquid: 1.031 | — |  |
| `664D222` | lime juice | 1 | 1 | verified | liquid: 1.031 | — |  |
| `95C096D` | orange juice | 1 | 1 | verified | liquid: 1.048 | — |  |
| `88D30B3` | apple juice | 1 | 1 | verified | liquid: 1.040 | — |  |
| `518D487` | rum | 1 | 1 | verified | liquid: 0.950 | — |  |
| `2CEF5BE` | dark rum | 1 | 1 | verified | liquid: 0.950 | — |  |

## Staples (no FID rows yet)

| FID id | Name (FID base name) | Volume rows (claims) | Passed | Status | Value (g/ml) | Pieces | Note |
|---|---|---|---|---|---|---|---|
| `588D661` | dry yeast | 0 | 0 | no volume data |  | — |  |
| `569480A` | vanilla sugar | 0 | 0 | no volume data |  | — |  |
| `4B24CC7` | dark chocolate | 0 | 0 | no volume data |  | — |  |

## Not in the draft — FID has no volume or piece data (to the api lane)

**Baking powder** (not in FID at all), **gelatine**, **marzipan**, **vanilla sugar** (staple `569480A`),
**dark chocolate** (staple `4B24CC7`), **dry yeast** (staple `588D661` — a separate `dried yeast` `42D1774` has
one row, disputed), **cardamom**, **candied peel**, **whipping / double cream** (only `heavy cream`),
**sultanas**, **pearl sugar**, **ground almonds/hazelnuts**, **oat milk**, **macadamia**, **prunes**,
**strawberries**, **allspice**, **anise**, **instant coffee**. The three staples without rows stay in the set
(names, no measures).

## FID duplicates noticed (to the api lane)

`powdered sugar` / `icing sugar` / `confectioners sugar`; `semolina` / `semolina flour`; `hazelnut` /
`hazelnuts`; `cornstarch` / `corn starch`; `raspberry` / `raspberries`; `blueberry` / `blueberries`;
`cranberry` / `cranberries`; `salt` / `table salt`. The draft carries one entry per concept.
