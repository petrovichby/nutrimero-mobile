# Density evidence — 004 (gate-1 Q1 and Q2)

**Scope widened 2026-09-24 (coordinator, on the api lane's finding).** "USDA FDC via iForge" (858 rows) is a
source string *inside* Markus's M30 density file — the file M34 disclosed as AI-generated; the api never read
USDA. So **every** volume row is an AI-delivered claim until its named record is verified, and piece weights
(Markus's M28 table, method undisclosed) fall under the same rule. This file now covers every volume row of
every ingredient in the draft set (§A AI-labelled, §A2 USDA-claimed, §A3 CNF/Fineli), the ten
inconsistencies (§B — their picks stand), and the piece weights (§D); §E rolls it up per ingredient.

**Purpose.** Feeds the api's density overlays (gate-1 correction, 2026-09-24): the api defines the
choice rule and the resolved picks once for every reader; this file is the lane's evidence. It
covers the **draft** curated set (`curated-set-draft.md`, 183 ingredients, not yet confirmed) at
nutrimero-api `4a4356b` (= `contract/SOURCE`). Researched 2026-09-24 by the Home lane (web
research fanned out to four research agents; every value below is one a researcher read on the
cited page — spot-checked by the lane: USDA FDC 169640 honey, the King Arthur weight chart, CNF
5299/139 sour cream).

**Nothing here is a ruling.** Verdicts apply the owner's rule; "suggested picks" are suggestions
for the owner.

## Method

- **The rule (Q1).** An AI-derived FID row — source "OpenAI category estimate" or "markus
  2026-09-05 (AI-assisted, coordinator-reconciled)" (M34's re-delivery) — is **confirmed** only when
  at least **two independent published sources** agree with its value **within 5 %**; **disputed**
  when a reliable source differs by more than 5 % and at most one agrees; **unconfirmed** when fewer
  than two usable sources exist.
- **Sources, preferred first.** National food-composition tables with household measures (USDA
  FoodData Central SR Legacy / FNDDS portions; Health Canada CNF; Fineli; McCance & Widdowson;
  the Danish table; Norway's *Mål, vekt og porsjonsstørrelser*); the FAO/INFOODS Density Database
  v2.0 (each row keeps its original reference); USDA HERR 41 (1977) *Average Weight of a Measured
  Cup of Various Foods*; established baking references with published weight charts (King Arthur
  Baking, America's Test Kitchen, Bob's Red Mill labels); manufacturer specifications; peer-reviewed
  papers. Generic online converters are not sources.
- **Independence.** USDA-derived material counts as USDA once: Health Canada CNF volume rows are
  USDA cup weights re-expressed per 100 ml (e.g. 52.832 = 125 g / 236.59 ml), USDA Branded label
  records, FAO rows citing FNDDS or Stumbo & Weiss. Two pages of one publisher count once.
- **Units.** US cup 236.59 ml, tbsp 14.79 ml, tsp 4.93 ml, fl oz 29.57 ml for US sources; metric
  spoons 15 / 5 ml. Δ % = (source − FID) / FID. **KA** = King Arthur Baking ingredient weight chart,
  kingarthurbaking.com/learn/ingredient-weight-chart. **ATK** = America's Test Kitchen baking
  conversion chart. **FAO Density DB** = fao.org/fileadmin/templates/food_composition/documents/
  density_DB_v2_0_final-1__1_.xlsx, sheet "Density DB". **FSANZ** = foodstandards.gov.au
  npc-specific-gravities.pdf.
- **Caveat.** King Arthur weighs liquids at 8 oz (227 g) per cup by convention — liquid rows are
  confirmed by USDA and the Danish/FSANZ tables on their own.

## Summary

| Rows checked | Total | Passed (verified / confirmed) | Failed or open |
|---|---|---|---|
| §A — labelled AI ("OpenAI category estimate", M34 "AI-assisted") | 53 | 36 | 17 (13 disputed, 4 unconfirmed) |
| §A2 — "USDA FDC via iForge" claims | 146 | 107 (89 verified against the named USDA record, 18 confirmed by two sources) | 39 (disputed, unconfirmed or proxy) |
| §A3 — Health Canada CNF and Fineli claims | 54 | 46 verified | 8 right value, but a different food or variant |
| §A — FAO/INFOODS claims | 3 | — | all three are BiblioID KEN (unpublished) — excluded by the §B picks |
| §D — piece weights (M28) | 80 | 1 (pear, large) + 1 as a peeled weight (banana, medium) | 78 (38 disputed, 40 unconfirmed) |

**Per ingredient (§E):** of 183, **114** have a verified volume value, **10** await the owner's pick (§B),
**44** have rows but none passed (no volume conversion), **15** have no volume data.

## A. AI-derived rows (Q1)

| FID id | Ingredient | Form · state | FID row | FID g/ml | Source 1 (URL · locus · value → g/ml, Δ %) | Source 2 | Source 3 | Verdict |
|---|---|---|---|---|---|---|---|---|
| 4C48839 | agave syrup | VISCOUS_LIQUID · RAW | VMP001625 (5 ml = 7 g) | 1.400 | fdc.nal.usda.gov/portal-data/external/170277 · FDC 170277 "Sweetener, syrup, agave" — "1 tsp" 6.9 g → 1.400, 0.0 % (the record's "0.25 cup" 55 g → 0.93 contradicts it; treated as a USDA data error) | KA · "Agave syrup" ¼ cup = 84 g → 1.420, +1.4 % | — | CONFIRMED |
| 4C48839 | agave syrup | VISCOUS_LIQUID · RAW | VMP001626 (15 ml = 21 g) | 1.400 | FDC 170277 · "1 tsp" 6.9 g → 1.400, 0.0 % | KA · ¼ cup = 84 g → 1.420, +1.4 % | — | CONFIRMED |
| 88D30B3 | apple juice | LIQUID · RAW | VMP000376 (1000 ml = 1040 g) | 1.040 | fdc.nal.usda.gov/portal-data/external/173933 · FDC 173933 "Apple juice, canned or bottled, unsweetened" — "1 cup" 248 g → 1.048, +0.8 % | pmc.ncbi.nlm.nih.gov/articles/PMC9028955/ · Table 1, relative density d20/20 1.0491–1.0563 → +0.7 to +1.4 % (cites AIJN minimum 1.0400) | FAO · 1.0434 (USDA-derived, not counted) | CONFIRMED |
| 5CD04A8 | brown sugar | GRANULES · RAW | VMP001628 (5 ml = 3 g) | 0.600 | fdc.nal.usda.gov/portal-data/external/168833 · FDC 168833 "Sugars, brown" — "1 tsp unpacked" 3.0 g → 0.609, +1.4 %; same record "1 cup packed" 220 g → 0.930, +55 % | KA · "Brown sugar (dark or light, packed)" 1 cup = 213 g → 0.900, +50.0 % | americastestkitchen.com/how_tos/5490-baking-conversion-chart · "1 cup packed brown sugar = 198 g" → 0.837, +39.5 % | DISPUTED (the FID value is the *unpacked* measure; recipes mean packed) |
| 5CD04A8 | brown sugar | GRANULES · RAW | VMP001629 (15 ml = 9 g) | 0.600 | FDC 168833 · unpacked 0.609, +1.4 %; packed 0.930, +55 % | KA · packed 0.900, +50.0 % | ATK · packed 0.837, +39.5 % | DISPUTED (as above) |
| 61CAB80 | butter | WHOLE · RAW | VMP001632 (5 ml = 4.7 g) | 0.940 | fdc.nal.usda.gov/portal-data/external/173410 · FDC 173410 "Butter, salted" — "1 tbsp" 14.2 g → 0.960, +2.1 % (same in 173430 "Butter, without salt") | KA · "Butter" 8 tbsp (½ cup) = 113 g → 0.955, +1.6 % | FAO Density DB · "Butter" 0.911 (source "TB", a weak source) → −3.1 % | CONFIRMED |
| 61CAB80 | butter | WHOLE · RAW | VMP001633 (15 ml = 14 g) | 0.933 | FDC 173410 · "1 tbsp" 14.2 g → 0.960, +2.9 % | KA · ½ cup = 113 g → 0.955, +2.3 % | FAO · "Butter" 0.911 → −2.4 % | CONFIRMED |
| 97C5F19 | cane sugar | GRANULES · RAW | VMP001651 (5 ml = 4.2 g) | 0.840 | fdc.nal.usda.gov/portal-data/external/169655 · FDC 169655 "Sugars, granulated" — "1 tsp" 4.2 g → 0.852, +1.4 % ("1 cup" 200 g → 0.845) | KA · "Sugar (granulated white)" 1 cup = 198 g → 0.837, −0.4 % | FAO Density DB · "Sugar, white" 0.9 (RC) → +7.1 % | CONFIRMED |
| 97C5F19 | cane sugar | GRANULES · RAW | VMP001652 (15 ml = 12.5 g) | 0.833 | FDC 169655 · "1 cup" 200 g → 0.845, +1.4 % | KA · 1 cup = 198 g → 0.837, +0.4 % | FAO · "Sugar, white" 0.9 (RC) → +8.0 % | CONFIRMED |
| 50E3FE8 | chia seed | WHOLE · RAW | VMP001716 (15 ml = 10 g) | 0.667 | KA · "Chia seeds" ¼ cup = 37 g → 0.626, −6.2 % | bobsredmill.com/product/organic-chia-seed · label serving "2 Tbsp (26g)" → 0.879, +31.8 % | food-nutrition.canada.ca/api/canadian-nutrient-file/servingsize/?id=2511 · CNF 2511 "Seeds, chia seeds, dried" 15 ml = 10.804 g → 0.720, +8.0 % | DISPUTED |
| 18EB3EA | cloves | WHOLE · RAW | VMP001668 (5 ml = 2 g) | 0.400 | chefs-resources.com/…/dry-spice-yields/ · "Cloves, Whole" 3.00 oz per cup → 0.359, −10.1 % | (ground cloves only, form mismatch, not counted: FDC 171321 "Spices, cloves, ground" 1 tsp 2.1 g → 0.426) | — | UNCONFIRMED |
| 5CDA2A6 | cocoa powder | POWDER · RAW | VMP001634 (5 ml = 1.8 g) | 0.360 | fdc.nal.usda.gov/portal-data/external/169593 · FDC 169593 "Cocoa, dry powder, unsweetened" — "1 tbsp" 5.4 g → 0.365, +1.4 % ("1 cup" 86 g → 0.363, +1.0 %) | KA · "Cocoa (unsweetened)" ½ cup = 42 g → 0.355, −1.4 % | — | CONFIRMED |
| 5CDA2A6 | cocoa powder | POWDER · RAW | VMP001635 (15 ml = 5.4 g) | 0.360 | FDC 169593 · "1 tbsp" 5.4 g → 0.365, +1.4 % | KA · ½ cup = 42 g → 0.355, −1.4 % | — | CONFIRMED |
| 1D2A681 | coconut milk | LIQUID · RAW | VMP001707 (15 ml = 15 g) | 1.000 | fdc.nal.usda.gov/portal-data/external/170173 · FDC 170173 "Nuts, coconut milk, canned" — "1 tbsp" 15 g → 1.014, +1.4 % ("1 cup" 226 g → 0.955) | KA · "Coconut milk (canned, well shaken)" 1 cup = 241 g → 1.019, +1.9 % | FSANZ · "Coconut, milk" 1.01 → +1.0 % | CONFIRMED |
| 3B304CE | cornstarch | POWDER · RAW | VMP001643 (5 ml = 2.7 g) | 0.540 | fdc.nal.usda.gov/portal-data/external/169698 · FDC 169698 "Cornstarch" — "1 cup" 128 g → 0.541, +0.2 % | bobsredmill.com/product/corn-starch · label "1 Tbsp (8g)" → 0.541, +0.2 % | FAO Density DB · "Corn/maize starch, loosely packed" 0.54 (hypertextbook) → 0.0 %; dissent: KA ¼ cup = 28 g → 0.473, −12.3 % | CONFIRMED |
| 3B304CE | cornstarch | POWDER · RAW | VMP001644 (15 ml = 8 g) | 0.533 | FDC 169698 · 128 g/cup → 0.541, +1.4 % | Bob's Red Mill · 1 Tbsp 8 g → 0.541, +1.4 % | FAO loosely packed 0.54, +1.3 %; KA 0.473, −11.2 % | CONFIRMED |
| 6B43198 | creme fraiche | VISCOUS_LIQUID · RAW | VMP001724 (5 ml = 5 g) | 1.000 | FAO Density DB · "Cream, sour (crème fraiche about 18% fat)" 1.005 (Danish table) → +0.5 %; "…about 38% fat" 0.978, −2.2 % | KA · "Crème fraîche" ½ cup = 113 g → 0.955, −4.5 % | foodstandards.gov.au/…/npc-specific-gravities.pdf · FSANZ "Cream, sour" 1.01 → +1.0 % | CONFIRMED |
| 6B43198 | creme fraiche | VISCOUS_LIQUID · RAW | VMP001725 (15 ml = 15 g) | 1.000 | FAO/Danish table 1.005 / 0.978 | KA 0.955, −4.5 % | FSANZ 1.01, +1.0 % | CONFIRMED |
| 2CEF5BE | dark rum | LIQUID · RAW | VMP000510 (1000 ml = 950 g) | 0.950 | fdc.nal.usda.gov/portal-data/external/174817 · FDC 174817 "Alcoholic beverage, distilled, rum, 80 proof" — "1 fl oz" 27.8 g → 0.940, −1.1 % | FAO Density DB · "Spirits, 40% alcohol" 0.95 (McCance & Widdowson 6th) → 0.0 % | — | CONFIRMED (generic 40 % spirit, not dark rum specifically) |
| 1D5E134 | date syrup | VISCOUS_LIQUID · RAW | VMP000511 (1000 ml = 1300 g) | 1.300 | jast.modares.ac.ir/article-23-4268-en.pdf · Farahnaky et al., J. Agr. Sci. Tech., Table 3 — 25 °C: 65 °Brix 1.317 (+1.3 %), 72 °Brix 1.351 (+3.9 %) | fdc.nal.usda.gov/portal-data/external/600607 · USDA Branded "100% ORGANIC CALIFORNIA DATES SYRUP" — "1 Tbsp" 20.0 g → 1.352, +4.0 % | wholefoodsmarket.com (D'vash Organics date nectar label) · "1 tbsp (20g)" → 1.352, +4.0 % | CONFIRMED (at the low end; ≈ 72 °Brix syrups read 1.35) |
| 42D1774 | dried yeast | GRANULES · RAW | VMP001636 (15 ml = 9 g) | 0.600 | KA · "Yeast (instant)" 1 tbsp = 9 g → 0.609, +1.4 % | fdc.nal.usda.gov/portal-data/external/175043 · FDC 175043 "Leavening agents, yeast, baker's, active dry" — "1 tbsp" 12 g → 0.811, +35.2 % | redstaryeast.com/frequently-asked-questions/ · 7 g packet ≈ 2¼ tsp → 0.631, +5.2 % | DISPUTED (instant vs active dry) |
| 8F6ECEF | flaxseed | WHOLE · RAW | VMP001718 (15 ml = 10 g) | 0.667 | fdc.nal.usda.gov/portal-data/external/169414 · FDC 169414 "Seeds, flaxseed" — "1 tbsp, whole" 10.3 g → 0.696, +4.5 % | bobsredmill.com/product/brown-flaxseeds · label "3 Tbsp (31g)" → 0.699, +4.8 % | KA · "Flaxseed" ¼ cup = 35 g → 0.592, −11.2 % | CONFIRMED (marginal; sources cluster at ≈ 0.70) |
| 7CE00B7 | ginger powder | POWDER · RAW | VMP001662 (5 ml = 1.8 g) | 0.360 | fdc.nal.usda.gov/portal-data/external/170926 · FDC 170926 "Spices, ginger, ground" — "1 tsp" 1.8 g → 0.365, +1.4 % | chefs-resources.com/…/dry-spice-yields/ · "Ground ginger 0.70 tsp per gram" → 0.290, −19.5 % (culinary site) | — | UNCONFIRMED (only USDA agrees; the FID value may be copied from USDA) |
| 0CEF8B8 | glucose syrup | VISCOUS_LIQUID · RAW | VMP000058 (1000 ml = 1300 g) | 1.300 | lcl.dk/.0/pp-static/prodimages/Datablade/datablad_129411.pdf · Nordic Sugar spec "Glucose syrup 40 DE" PS_000380 — density (20 °C) approx 1.42 kg/l → +9.2 % | ingredion.com/…/GLOBE 42 DE Corn Syrup Glucose 011420 Technical Specification.pdf · 1.421 kg/l at 80 °F → +9.3 % | fdc.nal.usda.gov/portal-data/external/168837 · FDC 168837 "Syrups, corn, light" — "1 cup" 341 g → 1.441, +10.9 % (KA "Corn syrup" 1 cup = 312 g → 1.319 is the only near value) | DISPUTED (sources ≈ 1.42) |
| 1C42BB3 | heavy cream | LIQUID · RAW | VMP001730 (5 ml = 5 g) | 1.000 | fdc.nal.usda.gov/portal-data/external/170859 · FDC 170859 "Cream, fluid, heavy whipping" — "1 tbsp" 15.0 g → 1.014, +1.4 % ("1 cup, fluid" 238 g → 1.006) | FAO Density DB · "Cream, 38% fat" 0.984 (Danish table) → −1.6 % | KA · "Cream (heavy…)" 1 cup = 227 g → 0.959, −4.1 % | CONFIRMED |
| 1C42BB3 | heavy cream | LIQUID · RAW | VMP001731 (15 ml = 15 g) | 1.000 | FDC 170859 · +1.4 % | FAO · Danish table 0.984 → −1.6 % | KA → −4.1 % | CONFIRMED |
| 185FB6F | honey | VISCOUS_LIQUID · RAW | VMP001639 (5 ml = 7 g) | 1.400 | fdc.nal.usda.gov/portal-data/external/169640 · FDC 169640 "Honey" — "1 tbsp" 21 g → 1.420, +1.4 % ("1 cup" 339 g → 1.433, +2.3 %) *(spot-checked by the lane)* | KA · "Honey" 1 tbsp = 21 g → 1.420, +1.4 % | — | CONFIRMED |
| 185FB6F | honey | VISCOUS_LIQUID · RAW | VMP001640 (15 ml = 21 g) | 1.400 | FDC 169640 · "1 tbsp" 21 g → 1.420, +1.4 % | KA · 1 tbsp = 21 g → 1.420, +1.4 % | — | CONFIRMED |
| 51CFBFE | invert sugar syrup | VISCOUS_LIQUID · RAW | VMP000060 (1000 ml = 1300 g) | 1.300 | castlemalting.com/Publications/SugarProducts/InvertedSugar70JerryCan25kg.pdf · Belgosuc "Invert sugar 70%" (68–69 °Bx) — density 1.34 kg/dm³ at 20 °C → 1.340, +3.1 % | static1.squarespace.com/…/PDS-00-Medium+Invert.pdf · "Type 50 Medium Invert (77.0 Brix)" — 11.57 lb/gal at 68 °F, SG 1.3903 → 1.386, +6.6 % (supplier not named on the sheet) | — | DISPUTED (grade-dependent) |
| 06CB219 | milk | LIQUID · RAW | VMP001728 (15 ml = 15 g) | 1.000 | fdc.nal.usda.gov/portal-data/external/171265 · FDC 171265 "Milk, whole, 3.25%" — "1 tbsp" 15 g → 1.014, +1.4 % ("1 cup" 244 g → 1.031, +3.1 %) | FAO Density DB · "Milk, liquid, whole" 1.031 (Danish table) → +3.1 % | KA · "Milk (fresh)" 1 cup = 227 g → 0.959, −4.1 % (8-oz-per-cup convention) | CONFIRMED |
| 1C21A47 | nutmeg | GROUND · RAW | VMP001670 (5 ml = 2 g) | 0.400 | fdc.nal.usda.gov/portal-data/external/171326 · FDC 171326 "Spices, nutmeg, ground" — "1 tsp" 2.2 g → 0.446, +11.6 % | chefs-resources.com/…/dry-spice-yields/ · "Ground nutmeg 0.40 tsp per gram" → 0.507, +26.8 % | — | DISPUTED (sources higher) |
| 14F0BFD | peanut | WHOLE · RAW | VMP001720 (15 ml = 9 g) | 0.600 | fdc.nal.usda.gov/portal-data/external/172430 · FDC 172430 "Peanuts, all types, raw" — "1 cup" 146 g → 0.617, +2.9 % | KA · "Peanuts (whole, shelled)" 1 cup = 142 g → 0.600, 0.0 % | — | CONFIRMED |
| 0BC0823 | poppy seed | WHOLE · RAW | VMP001719 (15 ml = 9 g) | 0.600 | fdc.nal.usda.gov/portal-data/external/171330 · FDC 171330 "Spices, poppy seed" — "1 tbsp" 8.8 g → 0.595, −0.8 % | KA · "Poppy seeds" 2 tbsp = 18 g → 0.609, +1.4 % | — | CONFIRMED |
| 87FA108 | potato starch | POWDER · RAW | VMP001623 (5 ml = 3 g) | 0.600 | KA · "Potato starch" 1 cup = 152 g → 0.642, +7.1 % | bobsredmill.com/product/potato-starch · label "1 Tbsp (12g)" → 0.811, +35.2 % | none usable (no USDA SR entry; CNF "Potato flour" is a different product) | DISPUTED |
| 87FA108 | potato starch | POWDER · RAW | VMP001624 (15 ml = 9 g) | 0.600 | KA · 0.642, +7.1 % | Bob's Red Mill · 0.811, +35.2 % | — | DISPUTED |
| 087292B | powdered sugar | POWDER · RAW | VMP001649 (5 ml = 2.5 g) | 0.500 | fdc.nal.usda.gov/portal-data/external/169656 · FDC 169656 "Sugars, powdered" — "1 tsp" 2.5 g (also "cup unsifted" 120 g) → 0.507, +1.4 % | KA chart · "Confectioners' sugar (unsifted)" 1 cup = 113 g → 0.478, −4.5 % | FAO Density DB · "Sugar, powdered" 0.56 (ASI industrial bulk density) → 0.56, +12 % (not a kitchen measure) | CONFIRMED |
| 087292B | powdered sugar | POWDER · RAW | VMP001650 (15 ml = 7.5 g) | 0.500 | FDC 169656 · "cup unsifted" 120 g → 0.507, +1.4 %; same record's "tbsp unsifted" 8 g → 0.541, +8.2 % | KA · 1 cup = 113 g → 0.478, −4.5 % | — | CONFIRMED (USDA's tbsp portion alone would be +8.2 %) |
| 0E1F75F | pumpkin seed | WHOLE · RAW | VMP001722 (15 ml = 9 g) | 0.600 | fdc.nal.usda.gov/portal-data/external/170556 · FDC 170556 "Seeds, pumpkin and squash seed kernels, dried" — "1 cup" 129 g → 0.545, −9.1 % | KA · "Pumpkin seeds" ¼ cup = 40 g → 0.676, +12.7 % | Bob's Red Mill page 404 (not counted) | DISPUTED (sources either side, none within 5 %) |
| 1FF5882 | Quark | PASTE · RAW | VMP001727 (15 ml = 15 g) | 1.000 | none found (no USDA/FAO entry; Dr. Oetker has no quark row; Rambke 1972 "Untersuchungen über die Dichte von Quark" not readable, 403) | — | — | UNCONFIRMED |
| 6D27AD3 | raisins | WHOLE · DRIED | VMP001653 (15 ml = 9 g) | 0.600 | fdc.nal.usda.gov/portal-data/external/168165 · FDC 168165 "Raisins, dark, seedless" — "1 cup (not packed)" 145 g → 0.613, +2.1 % | KA · "Raisins (loose)" 1 cup = 149 g → 0.630, +4.96 % | — | CONFIRMED (KA just inside 5 %) |
| 468EF91 | rice syrup | VISCOUS_LIQUID · RAW | VMP000754 (1000 ml = 1300 g) | 1.300 | FSANZ · "Syrup, malted rice" 1.39 → +6.9 % | fdc.nal.usda.gov/portal-data/external/483312 · USDA Branded "ORGANIC BROWN RICE SYRUP" — "2 Tbsp" 42.0 g → 1.420, +9.2 % | Lundberg label has no gram weight (not usable) | DISPUTED (sources ≈ 1.39–1.42) |
| 518D487 | rum | LIQUID · RAW | VMP000777 (1000 ml = 950 g) | 0.950 | fdc.nal.usda.gov/portal-data/external/174817 · FDC 174817 "Alcoholic beverage, distilled, rum, 80 proof" — "1 fl oz" 27.8 g → 0.940, −1.0 % | FAO Density DB · "Spirits, 40% alcohol" 0.95 (McCance & Widdowson 6th) → 0.0 % | FAO · "Spirits, 45% alcohol (whiskey)" 0.939 (Danish table) → −1.2 % | CONFIRMED |
| 007BBC5 | salt | GRANULES · RAW | VMP001679 (5 ml = 6 g) | 1.200 | fdc.nal.usda.gov/portal-data/external/173468 · FDC 173468 "Salt, table" — "1 tsp" 6.0 g → 1.217, +1.4 % | KA · "Salt (table)" 1 tbsp = 18 g → 1.217, +1.4 % | FAO · "Salt, table" 1.217 (Stumbo & Weiss — USDA-derived, not counted) | CONFIRMED |
| 007BBC5 | salt | GRANULES · RAW | VMP001680 (15 ml = 18 g) | 1.200 | FDC 173468 · "1 tbsp" 18.0 g → 1.217, +1.4 % | KA · 1 tbsp = 18 g → 1.217, +1.4 % | — | CONFIRMED |
| 0829EF9 | semolina | GRANULES · RAW | VMP001637 (15 ml = 10 g) | 0.667 | KA · "Semolina Flour" 1 cup = 163 g → 0.689, +3.3 % | fdc.nal.usda.gov/portal-data/external/169715 · FDC 169715 "Semolina, enriched" — "1 cup" 167 g → 0.706, +5.9 % | bobsredmill.com/product/semolina-pasta-flour · "¼ cup (45g)" → 0.761, +14.1 %; FAO "Semolina, raw" 0.78 (RC), +17.0 % | DISPUTED (every source is higher) |
| 4CAED1B | sesame seed | WHOLE · RAW | VMP001723 (15 ml = 9 g) | 0.600 | fdc.nal.usda.gov/portal-data/external/170150 · FDC 170150 "Seeds, sesame seeds, whole, dried" — "1 tbsp" 9 g → 0.609, +1.4 % | KA · "Sesame seeds" ½ cup = 71 g → 0.600, 0.0 % | — | CONFIRMED |
| 60999CF | sour cream | VISCOUS_LIQUID · RAW | VMP001733 (15 ml = 15 g) | 1.000 | fdc.nal.usda.gov/portal-data/external/171257 · FDC 171257 "Cream, sour, cultured" — "1 cup" 230 g → 0.972, −2.8 % (same record's "1 tbsp" 12 g → −18.9 %) | FAO Density DB · "Cream, sour (crème fraiche ~18% fat)" 1.005 (Danish table) → +0.5 % | KA · "Sour cream" 1 cup = 227 g → 0.959, −4.1 % | CONFIRMED (USDA's tbsp portion conflicts) |
| 753964D | soy milk | LIQUID · RAW | VMP001729 (15 ml = 15 g) | 1.000 | fdc.nal.usda.gov/portal-data/external/175215 · FDC 175215 "Soymilk (all flavors), unsweetened…" — "1 cup" 243 g → 1.027, +2.7 % | FSANZ · "Soy beverage" 1.04 → +4.0 % | FAO "Soy drink" 1.08 (FNDDS, USDA family, not counted) | CONFIRMED |
| 4BEC221 | sugar | GRANULES · RAW | VMP001641 (5 ml = 4.2 g) | 0.840 | fdc.nal.usda.gov/portal-data/external/169655 · FDC 169655 "Sugars, granulated" — "1 tsp" 4.2 g → 0.852, +1.4 % ("1 cup" 200 g → 0.845) | KA · "Sugar (granulated white)" 1 cup = 198 g → 0.837, −0.4 % | ATK · "1 cup granulated (white) sugar = 198 g" → 0.837, −0.4 % | CONFIRMED |
| 4BEC221 | sugar | GRANULES · RAW | VMP001642 (15 ml = 12.5 g) | 0.833 | FDC 169655 · "1 cup" 200 g → 0.845, +1.4 % | KA · 198 g/cup → 0.837, +0.4 % | ATK · 198 g/cup → 0.837, +0.4 % | CONFIRMED |
| 423344F | sugar beet syrup | VISCOUS_LIQUID · RAW | VMP000836 (1000 ml = 1300 g) | 1.300 | grafschafter.de/service-kontakt/faq · producer: "hohe Dichte von 1,4 g … 100 ml … 140 g" → 1.40, +7.7 % | de.wikipedia.org/wiki/Zuckerrübensirup · "Dichte bei 20 °C: ca. 1,4 g/cm³" → +7.7 % | USDA molasses (proxy only) FDC 168820 1 cup 337 g → 1.424 | DISPUTED (sources ≈ 1.40) |
| 5E0CA71 | sugar syrup | VISCOUS_LIQUID · RAW | VMP000070 (1000 ml = 1300 g) | 1.300 | fdc.nal.usda.gov/portal-data/external/2710278 · FDC 2710278 FNDDS "Simple syrup" — "1 tablespoon" 20 g → 1.352, +4.0 % | USDA AMS sucrose conversion table (jblfoods.com/wp-content/uploads/2021/04/sucrose.pdf) — 1.299 at 62 °Brix, 1.232 at 50 °Brix, 1.329 at 66.7 °Brix (also USDA, not counted separately) | — | UNCONFIRMED (one independent publisher; concentration-dependent) |
| 921F9E2 | yogurt | VISCOUS_LIQUID · FERMENTED | VMP001732 (15 ml = 15 g) | 1.000 | fdc.nal.usda.gov/portal-data/external/171284 · FDC 171284 "Yogurt, plain, whole milk" — "1 cup (8 fl oz)" 245 g → 1.036, +3.6 % | FAO Density DB · "Yoghurt, plain, unsweetened" 1.031 (Danish table) → +3.1 % | KA · "Yogurt" 1 cup = 227 g → 0.959, −4.1 % | CONFIRMED |

### What the disputed and unconfirmed rows show

- **"OpenAI category estimate" syrups share one wrong value.** Glucose syrup, sugar beet syrup and
  rice syrup all carry 1.30 g/ml; manufacturer specifications, the producer and USDA put them at
  **1.39–1.44**. Date syrup (1.30) is confirmed but at the low end (≈ 72 °Brix syrups read 1.35).
  Invert sugar syrup and "sugar syrup" depend on their concentration (°Brix), which the ingredient
  does not state.
- **Brown sugar 0.60 g/ml is the *unpacked* measure** (USDA "1 cup unpacked" 145 g). Recipes mean
  packed (USDA 220 g, KA 213 g, ATK 198 g → 0.84–0.93): as a recipe conversion the row underweighs
  brown sugar by 35–55 %.
- **Dried yeast 0.60 is instant yeast** (KA 9 g/tbsp); active dry is 0.81 (USDA). The row should
  name its yeast.
- **Nutmeg (0.40), semolina (0.667), potato starch (0.60)** sit below every source; **pumpkin seed
  (0.60)** and **chia (0.667)** sit between sources that disagree with each other; **whole cloves**
  and **quark** have no usable published volume weight; **ginger** matches USDA exactly (1.8 g/tsp)
  — possibly copied from USDA, so USDA cannot also confirm it.
- **Internal USDA inconsistencies** noticed (not used): agave FDC 170277 ¼ cup = 55 g vs its tsp
  (1.40 g/ml); powdered sugar and sour cream tbsp portions disagree with their own cup portions.

## A2. "USDA FDC via iForge" rows — checked against the named USDA record

Checked against the USDA FoodData Central data itself (SR Legacy 2018-04, FNDDS 2024-10-31 and Foundation
2025-04-24 CSV downloads from fdc.nal.usda.gov; SR Legacy is the source whose gram weights FID's rows
reproduce). **VERIFIED** = a USDA record for this very food carries this value within 1 %. Rows with no such
record, or whose value is another food's ("proxy", "mapped to"), were put to the two-source test.

| FID id | Ingredient | FID row | FID g/ml | Named record check | Further sources | Verdict |
|---|---|---|---|---|---|---|
| `5153BCA` | black treacle | VMP000046 | 1.437 | no USDA treacle; nearest SR 168820 "Molasses" 337 g (a different food) | baking blog "1 cup 340 g" (weak); FSANZ "Syrup, treacle" 1.33 (−7.5 %) | DISPUTED (proxy) |
| `5CD04A8` | brown sugar | VMP000047 | 0.613 | SR 168833 "Sugars, brown" 1 cup unpacked 145 g (packed 220 g → 0.930) | — | VERIFIED (unpacked; recipes usually mean packed) |
| `409F577` | dark brown sugar | VMP000052 | 0.613 | SR 168833 unpacked 145 g | — | VERIFIED (unpacked) |
| `57D1791` | kosher salt | VMP000061 | 0.803 | no USDA kosher salt; table salt 292 g (+54 %) | KA Diamond Crystal 1 tbsp 8 g → 0.541 (−33 %); KA Morton 1 tbsp 16 g → 1.082 (+35 %) | DISPUTED (proxy; brand-dependent, matches neither) |
| `88BB32C` | light brown sugar | VMP000062 | 0.613 | SR 168833 unpacked 145 g | — | VERIFIED (unpacked) |
| `4AB12BB` | muscovado sugar | VMP000064 | 0.845 | no USDA record | India Tree (via whatsugar.com) 1 tsp 4 g → 0.812 (−4.0 %); same page packed cup 227 g → 0.960 | UNCONFIRMED |
| `087292B` | powdered sugar | VMP000065 | 0.507 | SR 169656 "Sugars, powdered" 1 cup unsifted 120 g | — | VERIFIED |
| `4BEC221` | sugar | VMP000069 | 0.845 | SR 169655 "Sugars, granulated" 1 cup 200 g | — | VERIFIED |
| `38FE5B0` | water | VMP000075 | 1.002 | SR 173647 "Beverages, water, tap, drinking" 8 fl oz 237 g | FSANZ "Water" 1; FAO water 20 °C 0.998 | VERIFIED |
| `634D851` | rose water | VMP000077 | 1.002 | proxy (water value); no rose-water record | none found | UNCONFIRMED (proxy; ≈ 1.00 plausible) |
| `6D78BD7` | black sesame seed | VMP000092 | 0.609 | SR 170150 "Seeds, sesame seeds, whole, dried" 144 g | — | VERIFIED (species level) |
| `50E3FE8` | chia seed | VMP000108 | 0.676 | no match; FNDDS 2707590 "Chia seeds" 168 g → 0.710 (+5.0 %) | KA ¼ cup 37 g → 0.626 (−7.5 %); BRM label → 0.879 (+30 %) | DISPUTED |
| `97C70C4` | cinnamon | VMP000111 | 0.558 | no match; SR 171320 "Spices, cinnamon, ground" 1 tsp 2.6 g → 0.528 (−5.4 %) | FAO "Cinnamon, powder" 0.56 (ASI); McCormick ¼ tsp 0.6 g → 0.487 (−12.7 %) | DISPUTED |
| `16FA35A` | cocoa nib | VMP000114 | 0.558 | no USDA record | KA cacao nibs 120 g → 0.507 (−9.1 %); Navitas label 1 tsp 3 g → 0.609 (+9.1 %) | DISPUTED |
| `1D2A681` | coconut milk | VMP000116 | 0.955 | SR 170173 "Nuts, coconut milk, canned" 1 cup 226 g (the same record's tbsp gives 1.014) | KA 241 g → 1.019; FSANZ 1.01 | VERIFIED (the USDA record disagrees with itself; true density ≈ 1.01) |
| `14A64E9` | egg | VMP000119 | 1.027 | SR 171287 "Egg, whole, raw, fresh" 1 cup (4.86 large eggs) 243 g | — | VERIFIED |
| `649BE19` | egg white | VMP000120 | 1.027 | SR 172183 "Egg, white, raw, fresh" 1 cup 243 g | — | VERIFIED |
| `5D48DEE` | egg yolk | VMP000121 | 1.027 | SR 172184 "Egg, yolk, raw, fresh" 1 cup 243 g | — | VERIFIED |
| `8F6ECEF` | flaxseed | VMP000126 | 0.634 | no match; SR 169414 "Seeds, flaxseed" 1 cup whole 168 g → 0.710 (+12 %) | KA ¼ cup 35 g → 0.592 (−6.7 %); BRM → 0.699; FAO 0.70 | DISPUTED |
| `6DDD90B` | goat milk | VMP000136 | 1.014 | plant-milk proxy; own SR 171278 "Milk, goat, fluid" 244 g → 1.031 (+1.7 %) | FSANZ cow/sheep/goat milk 1.03 (+1.5 %) | CONFIRMED (proxy) |
| `0BD5AB1` | high gluten flour | VMP000160 | 0.550 | "mapped to bread flour" but SR 168896 bread flour 137 g → 0.579; 130 g is in no USDA record | KA high-gluten 120 g → 0.507 (−7.7 %) | DISPUTED (proxy) |
| `06CB219` | milk | VMP000173 | 1.031 | SR 171265 "Milk, whole, 3.25%" 244 g | — | VERIFIED |
| `82B3E4B` | pistachio | VMP000185 | 0.520 | SR 170184 "Nuts, pistachio nuts, raw" 123 g | — | VERIFIED |
| `0BC0823` | poppy seed | VMP000187 | 0.592 | SR 171330 "Spices, poppy seed" 1 tbsp 8.8 g → 0.595 | — | VERIFIED |
| `0E1F75F` | pumpkin seed | VMP000190 | 0.545 | SR 170556 "Seeds, pumpkin and squash seed kernels, dried" 129 g | — | VERIFIED |
| `4CAED1B` | sesame seed | VMP000210 | 0.609 | SR 170150 144 g | — | VERIFIED |
| `155CC61` | sunflower seed | VMP000222 | 0.592 | SR 170562 "Seeds, sunflower seed kernels, dried" 140 g | — | VERIFIED |
| `91299F5` | turbinado sugar | VMP000233 | 0.930 | SR 170674 "Sugar, turbinado" 1 tsp 4.6 g → 0.933 (the same record's cup 202 g → 0.854) | KA demerara 220 g → 0.930; KA turbinado 180 g → 0.761 | VERIFIED (tsp only; 220 g matches demerara) |
| `1FB350E` | zucchini | VMP000254 | 0.524 | SR 169291 zucchini 1 cup chopped 124 g | KA shredded 121–150 g | VERIFIED (USDA "chopped", FID "grated") |
| `22F4A0C` | almond | VMP000255 | 0.604 | SR 170567 "Nuts, almonds" 1 cup whole 143 g | — | VERIFIED |
| `5C1AE0D` | apple | VMP000256 | 0.528 | SR 171688 "Apples, raw, with skin" 1 cup chopped 125 g | — | VERIFIED |
| `8648FEE` | banana (sliced) | VMP000258 | 0.634 | SR 173944 "Bananas, raw" 1 cup sliced 150 g | — | VERIFIED |
| `8648FEE` | banana (mashed) | VMP000259 | 0.951 | SR 173944 1 cup mashed 225 g | — | VERIFIED |
| `358876D` | blueberries | VMP000269 | 0.626 | SR 171711 "Blueberries, raw" 148 g | — | VERIFIED |
| `78F4C41` | cashew | VMP000274 | 0.579 | SR 170571 "Nuts, cashew nuts, dry roasted" 137 g | — | VERIFIED (roasted record) |
| `1376D93` | coffee | VMP000281 | 1.002 | SR 171890 "Beverages, coffee, brewed" 237 g | — | VERIFIED |
| `3BF1425` | cranberries | VMP000283 | 0.423 | SR 171722 "Cranberries, raw" 1 cup whole 100 g | — | VERIFIED |
| `31B7417` | hazelnut | VMP000292 | 0.571 | SR 170581 "Nuts, hazelnuts or filberts" 1 cup whole 135 g | — | VERIFIED |
| `250B810` | oat | VMP000305 | 0.380 | no match; SR 173904 oats 81 g → 0.342 (−10 %) | KA oats 89 g → 0.376 (−1.1 %); FAO rolled oats 0.30–0.38 | CONFIRMED (a King Arthur value, not USDA) |
| `14F0BFD` | peanut | VMP000310 | 0.617 | SR 172430 "Peanuts, all types, raw" 146 g | — | VERIFIED |
| `32FE0D3` | pecan | VMP000312 | 0.418 | SR 170182 "Nuts, pecans" 1 cup halves 99 g | — | VERIFIED |
| `147D6C1` | raspberries | VMP000320 | 0.520 | SR 167755 "Raspberries, raw" 123 g | — | VERIFIED |
| `4B65D8F` | walnut | VMP000339 | 0.423 | SR 170187 "Nuts, walnuts, english" 1 cup shelled (50 halves) 100 g | — | VERIFIED |
| `4C48839` | agave syrup | VMP000352 | 1.420 | SR 170277 1 tsp 6.9 g → 1.400 (−1.4 %) | KA ¼ cup 84 g (0 %); Madhava label 1 Tbsp 21 g (0 %) | CONFIRMED |
| `969E29F` | all purpose flour | VMP000358 | 0.528 | SR 168894 "Wheat flour, white, all-purpose, enriched, bleached" 125 g | — | VERIFIED |
| `847932F` | almond flour | VMP000360 | 0.406 | no almond-flour record; SR 170567 almonds ground 95 g → 0.402 (−1.1 %) | KA almond flour 96 g (0 %); dissent BRM 2 Tbsp 14 g → 0.473 | CONFIRMED (Bob's Red Mill disagrees) |
| `2B8A64D` | almond milk | VMP000362 | 1.014 | SR 168751 almond milk, sweetened, vanilla 240 g | — | VERIFIED |
| `53E711F` | black cocoa powder | VMP000403 | 0.364 | cocoa proxy; SR 169594 Dutch-process cocoa 86 g | KA Black Cocoa bag recipe ¾ cup 64 g → 0.361 | CONFIRMED (proxy) |
| `582A6A6` | bread flour | VMP000418 | 0.550 | no match; SR 168896 bread flour 137 g → 0.579 (+5.4 %) | KA bread flour 120 g → 0.507 (−7.7 %) | DISPUTED |
| `623BE7D` | brown rice flour | VMP000420 | 0.668 | SR 168898 "Rice flour, brown" 158 g | — | VERIFIED |
| `108FD92` | buckwheat flour | VMP000423 | 0.507 | SR 170687 "Buckwheat flour, whole-groat" 120 g | — | VERIFIED |
| `55CD18B` | buttermilk | VMP000428 | 1.036 | SR 172225 "Milk, buttermilk, fluid, whole" 245 g | — | VERIFIED |
| `72328B4` | cake flour | VMP000432 | 0.482 | no match; SR 169723 cake flour "unsifted, dipped" 137 g (+20 %) | ATK 113 g → 0.478 (−0.9 %); Swans Down ¼ cup 28 g → 0.473 (−1.8 %) | CONFIRMED |
| `5E169B3` | canola oil | VMP000434 | 0.921 | SR 172336 "Oil, canola" 218 g | — | VERIFIED |
| `21C7B98` | chickpea flour | VMP000451 | 0.389 | SR 174288 "Chickpea flour (besan)" 92 g | — | VERIFIED |
| `5CDA2A6` | cocoa powder | VMP000474 | 0.364 | SR 169593 86 g | — | VERIFIED |
| `34B2820` | coconut flakes | VMP000475 | 0.254 | no match (SR flaked sweetened 85 g) | KA unsweetened large flakes 60 g (0 %); BRM ¼ cup 15 g (0 %) | CONFIRMED |
| `8A98970` | coconut oil | VMP000476 | 0.921 | SR 171412 "Oil, coconut" 218 g | — | VERIFIED (liquid) |
| `5E2B552` | condensed milk | VMP000480 | 1.293 | SR 171275 306 g | — | VERIFIED |
| `631E984` | corn flour | VMP000483 | 0.495 | SR 169748 "Corn flour, whole-grain, white" 117 g | — | VERIFIED |
| `5A30CC4` | corn syrup | VMP000487 | 1.386 | SR 168836 "Syrups, corn, dark" 328 g (light 341 g → 1.441) | — | VERIFIED (dark corn syrup) |
| `2F7A71F` | cornmeal | VMP000489 | 0.634 | no match; SR degermed 157 g → 0.664 (+4.7 %) | KA Quaker cornmeal 156 g → 0.659 (+4.0 %); dissent KA whole cornmeal 138 g | CONFIRMED (weak; grind-dependent) |
| `3B304CE` | cornstarch | VMP000490 | 0.541 | SR 169698 "Cornstarch" 128 g | — | VERIFIED |
| `0B2945A` | cream cheese | VMP000496 | 0.981 | SR 173418 "Cheese, cream" 232 g | — | VERIFIED |
| `37CEF2D` | dark molasses | VMP000503 | 1.386 | no match — 328 g is SR 168836 *dark corn syrup*; SR 168820 molasses 337 g (+2.7 %) | FSANZ molasses 1.39 (+0.3 %); KA ¼ cup 85 g (+3.7 %) | CONFIRMED (number copied from dark corn syrup) |
| `761F94E` | dark cocoa powder | VMP000506 | 0.364 | cocoa proxy | only generic cocoa sources (ATK 85 g; KA 42 g/½ cup) | UNCONFIRMED (proxy) |
| `14B516A` | degreased almond flour | VMP000512 | 0.406 | mapped to almond flour; no USDA record | KetoDiet app 120 g → 0.507 (+25 %, weak) | DISPUTED (proxy) |
| `855901D` | dried apricot | VMP000517 | 0.550 | SR 173941 "Apricots, dried, sulfured, uncooked" 1 cup halves 130 g | KA diced ½ cup 64 g → 0.541 | VERIFIED (USDA "halves", FID "chopped") |
| `6C62B39` | dried cranberry | VMP000519 | 0.507 | no match; SR 171723 dried sweetened ¼ cup 40 g → 0.676 (+33 %) | KA ½ cup 57 g → 0.482 (−5.0 %) | DISPUTED |
| `917A5B2` | dried figs | VMP000520 | 0.630 | SR 174665 "Figs, dried, uncooked" 149 g | — | VERIFIED |
| `5C31635` | durum flour | VMP000541 | 0.706 | mapped to semolina SR 169715 167 g (a different product) | KA durum flour 124 g → 0.524 (−26 %) | DISPUTED (proxy) |
| `2D515EB` | einkorn wholemeal flour | VMP000543 | 0.541 | mapped to whole wheat, but 128 g is in no USDA record (whole-grain 120 g) | Jovial einkorn ⅓ cup 32 g → 0.406 (−25 %) | DISPUTED (proxy) |
| `207D0B1` | emmer wheat flour | VMP000545 | 0.541 | as einkorn | Bluebird Grain Farms emmer (label copy) ¼ cup 36 g → 0.609 (+12.5 %) | DISPUTED (proxy) |
| `4BE30FD` | evaporated skim milk | VMP000547 | 1.065 | FNDDS 2705401 "Milk, evaporated, fat free (skim)" 1 cup 252 g | — | VERIFIED |
| `75757A3` | extra virgin olive oil | VMP000550 | 0.913 | SR 171413 "Oil, olive, salad or cooking" 1 cup 216 g; Foundation 748608 extra virgin 0.907 | — | VERIFIED |
| `799A3C7` | fat-reduced cocoa powder | VMP000554 | 0.364 | SR 169593 "Cocoa, dry powder, unsweetened" 86 g (13.7 % fat — meets the EU fat-reduced definition) | KA ½ cup 42 g → 0.355 | VERIFIED |
| `7CE00B7` | ginger powder | VMP000574 | 0.406 | no USDA record gives 96 g; SR 170926 1 tsp 1.8 g → 0.365 (−10 %) | CNF 189 (USDA-derived) 0.367 | DISPUTED |
| `955771D` | gluten free rolled oats | VMP000575 | 0.380 | proxy (rolled oats); SR 173904 oats 81 g → 0.342 (−10 %) | BRM GF rolled oats ½ cup 48 g → 0.406 (+6.7 %); KA oats 89 g → 0.376 | DISPUTED (proxy) |
| `7A20C3B` | golden syrup | VMP000577 | 1.437 | no USDA record | FSANZ "Syrup, golden" 1.34 (−6.8 %) | DISPUTED |
| `5E4C940` | greek yogurt | VMP000587 | 1.036 | FNDDS 2705421 "Yogurt, Greek, … plain" 1 cup 245 g | — | VERIFIED |
| `249843A` | green spelt flour | VMP000588 | 0.550 | proxy (spelt flour); no USDA spelt flour | no source | UNCONFIRMED (proxy) |
| `0FD6C82` | hazelnut oil | VMP000596 | 0.921 | SR 171427 "Oil, hazelnut" 1 cup 218 g | — | VERIFIED |
| `1C42BB3` | heavy cream | VMP000597 | 1.006 | SR 170859 "Cream, fluid, heavy whipping" 238 g | — | VERIFIED |
| `185FB6F` | honey | VMP000601 | 1.437 | SR 169640 "Honey" 1 cup 339 g → 1.433 | — | VERIFIED |
| `765AEF5` | lemon juice | VMP000618 | 1.031 | SR 167747 "Lemon juice, raw" 244 g | — | VERIFIED |
| `664D222` | lime juice | VMP000626 | 1.031 | SR 168156 "Lime juice, raw" 242 g → 1.023 | — | VERIFIED |
| `0F967E1` | low-fat milk | VMP000634 | 1.031 | SR 170872 "Milk, lowfat, fluid, 1%" 244 g | — | VERIFIED |
| `5FA9C36` | maple syrup | VMP000649 | 1.319 | SR 169661 "Syrups, maple" 315 g → 1.331 (+0.96 %) | KA ½ cup 156 g (0 %); FSANZ 1.33 | VERIFIED |
| `931F878` | mascarpone | VMP000652 | 1.014 | no USDA record | KA 1 cup 227 g → 0.960 (−5.4 %) | DISPUTED (marginal) |
| `0C12CC1` | millet flour | VMP000657 | 0.507 | SR 172023 "Millet flour" 119 g → 0.503 | — | VERIFIED |
| `0F87C17` | molasses | VMP000661 | 1.386 | no USDA record gives 328 g; SR 168820 337 g (+2.7 %); FNDDS 2710283 320 g (−2.4 %) | FSANZ "Syrup, molasses" 1.39 (+0.3 %); KA ¼ cup 85 g (+3.7 %) | CONFIRMED |
| `494F110` | oat flour | VMP000677 | 0.440 | SR 169741 "Oat flour, partially debranned" 104 g | — | VERIFIED |
| `5B00E77` | olive oil | VMP000684 | 0.913 | SR 171413 216 g | — | VERIFIED |
| `8EF56E8` | orange blossom water | VMP000688 | 1.002 | proxy (water, SR 174158) | no source | UNCONFIRMED (proxy) |
| `95C096D` | orange juice | VMP000692 | 1.048 | SR 169098 "Orange juice, raw" 248 g | — | VERIFIED |
| `14B34D9` | peanut butter | VMP000707 | 1.091 | SR 174266 "Peanut butter, smooth style, with salt" 258 g | — | VERIFIED |
| `037D782` | peanut oil | VMP000708 | 0.921 | SR 171410 "Oil, peanut" 216 g → 0.913 (−0.9 %) | — | VERIFIED |
| `87FA108` | potato starch | VMP000728 | 0.643 | no USDA record (= King Arthur's figure) | KA 152 g (0 %); BRM 1 Tbsp 12 g → 0.812 (+26 %) | DISPUTED (mislabelled USDA) |
| `31AAB6F` | quinoa flour | VMP000735 | 0.473 | no USDA record | KA 110 g → 0.465 (−1.8 %); BRM ¼ cup 28 g → 0.473 (0 %) | CONFIRMED |
| `6D27AD3` | raisins | VMP000736 | 0.613 | SR 168165 "Raisins, dark, seedless" cup not packed 145 g | — | VERIFIED |
| `73F3050` | rapeseed oil | VMP000737 | 0.921 | SR 172336 "Oil, canola" 218 g | — | VERIFIED |
| `4A1C787` | rice flour | VMP000753 | 0.668 | SR 169714 "Rice flour, white, unenriched" 158 g | — | VERIFIED |
| `0C98DF8` | ricotta | VMP000757 | 1.040 | SR 170851 "Cheese, ricotta, whole milk" 246 g | — | VERIFIED |
| `4D82451` | roasted almond | VMP000758 | 0.604 | proxy (raw almonds SR 170567); roasted SR 170158 138 g → 0.583 (−3.5 %) | KA whole almonds 142 g → 0.600 (not roasted) | UNCONFIRMED (proxy) |
| `8E25269` | roasted hazelnut | VMP000760 | 0.571 | proxy (raw hazelnuts SR 170581) | KA hazelnuts 142 g (+5.2 %, not roasted) | UNCONFIRMED (proxy) |
| `6B83483` | rolled oat | VMP000772 | 0.380 | no USDA record gives 90 g; SR 173904 81 g (−10 %); FNDDS 80 g | KA 89 g (−1.1 %); FAO rolled oats 0.30–0.38 | DISPUTED (a King Arthur value labelled USDA) |
| `06C84DD` | rye flour | VMP000779 | 0.431 | SR 168886 "Rye flour, medium" 102 g | — | VERIFIED |
| `4A98AC4` | shredded coconut | VMP000801 | 0.359 | proxy: SR 170577 sweetened flaked 85 g; FNDDS 2707501 85 g | KA desiccated 85 g (0 %), sweetened shredded 85 g (0 %) | CONFIRMED (cut-dependent) |
| `667BFED` | skimmed milk | VMP000806 | 1.031 | FNDDS 2705388 "Milk, fat free (skim)" 244 g | — | VERIFIED |
| `8A2BF40` | sorghum flour | VMP000814 | 0.575 | no USDA record gives 136 g; SR 168943 whole-grain 121 g (−11 %) | KA 138 g (+1.5 %); BRM ¼ cup 35 g → 0.592 (+2.9 %) | CONFIRMED (contested by USDA) |
| `60999CF` | sour cream | VMP000816 | 0.972 | SR 171257 "Cream, sour, cultured" 230 g | — | VERIFIED |
| `753964D` | soy milk | VMP000819 | 1.014 | proxy; own record SR 172446 soymilk 243 g → 1.027 (+1.3 %) | FSANZ "Soy beverage" 1.04 (+2.5 %) | CONFIRMED (proxy) |
| `5124A4E` | spelt flour | VMP000823 | 0.550 | no USDA spelt flour | KA 99 g → 0.418 (−24 %); BRM ¼ cup 30 g → 0.507 (−7.7 %) | DISPUTED |
| `694C698` | sunflower oil | VMP000837 | 0.921 | SR 171017 "Oil, sunflower" 218 g | — | VERIFIED |
| `3BAEE3B` | sweetened condensed milk | VMP000854 | 1.293 | SR 171275 306 g | — | VERIFIED |
| `7EC180E` | tapioca flour | VMP000858 | 0.507 | no USDA record | BRM 4 tsp 10 g → 0.507 (0 %); KA 113 g → 0.478 (−5.8 %) | DISPUTED (marginal) |
| `6EE785F` | tapioca starch | VMP000859 | 0.507 | as tapioca flour | as tapioca flour | DISPUTED (marginal) |
| `604C980` | teff flour | VMP000861 | 0.592 | no USDA teff flour | KA 135 g (−3.6 %); BRM ¼ cup 35 g (0 %) | CONFIRMED |
| `1453BB3` | vanilla extract | VMP000894 | 0.879 | SR 173471 "Vanilla extract" 208 g | — | VERIFIED |
| `583192D` | vegetable oil | VMP000898 | 0.921 | SR 172370 "Oil, vegetable, soybean, refined" 218 g | — | VERIFIED |
| `2DF77A0` | walnut halves | VMP000907 | 0.423 | SR 170187 "Nuts, walnuts, english" cup shelled (50 halves) 100 g | — | VERIFIED |
| `8AE3D9F` | walnut oil | VMP000909 | 0.921 | SR 171030 "Oil, walnut" 218 g | — | VERIFIED |
| `243FE45` | whole milk | VMP000934 | 1.031 | SR 171265 "Milk, whole, 3.25%" 244 g | — | VERIFIED |
| `6A0F476` | wholemeal rye flour | VMP000937 | 0.431 | proxy (medium rye); own SR 168885 "Rye flour, dark" 128 g → 0.541 (+25.5 %) | KA pumpernickel 106 g (+3.9 %); BRM dark rye ¼ cup 30 g (+17.6 %) | DISPUTED (proxy) |
| `70BF7A9` | wholemeal wheat flour | VMP000938 | 0.541 | "mapped to whole wheat" but SR 168893 whole-grain 120 g → 0.507 (−6.3 %) | KA 113 g (−11.7 %); BRM (+12.5 %); FAO wholemeal 0.55 (+1.7 %) | DISPUTED |
| `921F9E2` | yogurt | VMP000944 | 1.036 | SR 171284 "Yogurt, plain, whole milk" 245 g | — | VERIFIED |
| `523D0AF` | almond butter | VMP000949 | 1.082 | SR 168588 almond butter 1 tbsp 16 g (cup 250 g → 1.057) | — | VERIFIED |
| `3D8656E` | applesauce | VMP000958 | 1.031 | SR 171695 "Applesauce, canned, unsweetened" 244 g | — | VERIFIED |
| `297059A` | apricot jam | VMP000959 | 1.353 | SR 170645 "Jams and preserves, apricot" 1 tbsp 20 g | — | VERIFIED |
| `7E6C458` | cherry jam | VMP001017 | 1.353 | proxy: SR 169641 generic jams 1 tbsp 20 g | Smucker's cherry preserves 1 Tbsp 20 g (label convention) | UNCONFIRMED (proxy) |
| `15D6AF4` | chocolate chips | VMP001030 | 0.719 | SR 169690 semisweet chocolate "cup chips" 170 g | KA 170 g (0 %) | VERIFIED |
| `4DE140E` | chocolate hazelnut spread | VMP001031 | 1.268 | no USDA record gives 300 g; SR 168000 2 tbsp 37 g → 1.251 (−1.3 %) | KA Nutella ½ cup 149 g (−0.7 %); CNF 5736 1.25 | CONFIRMED (contested) |
| `8E9D4D5` | cream of tartar | VMP001055 | 0.634 | no USDA record gives 150 g; SR 175041 1 tsp 3 g → 0.609 (−4.0 %) | CNF 4006 (USDA-derived) | UNCONFIRMED |
| `8BCCFFE` | milk chocolate chips | VMP001175 | 0.719 | proxy; own SR 167587 milk chocolate cup chips 168 g → 0.710 (−1.2 %) | CNF 4186 (= USDA) | UNCONFIRMED (proxy) |
| `5E47AA1` | mini semi-sweet chocolate chips | VMP001176 | 0.719 | proxy; own SR 167976 cup mini chips 173 g → 0.731 (+1.8 %) | KA mini chips 177 g (+4.1 %) | CONFIRMED (proxy) |
| `3AB810C` | plum jam | VMP001218 | 1.353 | proxy: SR 169641 generic jams | no plum source | UNCONFIRMED (proxy) |
| `5C1D633` | polenta | VMP001220 | 0.689 | no USDA record gives 163 g; SR 168867 cornmeal degermed 157 g (−3.7 %) | KA polenta 163 g (0 %) | CONFIRMED |
| `5AEAE3B` | pumpkin puree | VMP001227 | 1.036 | SR 168450 "Pumpkin, canned, without salt" 245 g | — | VERIFIED |
| `6EB27D3` | raspberry jam | VMP001230 | 1.353 | proxy: SR 169641 generic jams | Smucker's red raspberry 1 Tbsp 20 g (label convention) | UNCONFIRMED (proxy) |
| `5F64A33` | red currant jam | VMP001236 | 1.353 | proxy: SR 169641 generic jams | none | UNCONFIRMED (proxy) |
| `7E00FDD` | rice milk | VMP001246 | 1.014 | SR 171942 "Beverages, rice milk, unsweetened" 8 fl oz 240 g | — | VERIFIED |
| `5785F9B` | self-rising flour | VMP001272 | 0.528 | SR 168895 self-rising 125 g | — | VERIFIED |
| `2E26184` | sesame tahini | VMP001274 | 1.014 | SR 170189 tahini 1 tbsp 15 g | — | VERIFIED |
| `2A05047` | strawberry jam | VMP001298 | 1.353 | proxy: SR 169641 generic jams | Smucker's strawberry 1 Tbsp 20 g (label convention) | UNCONFIRMED (proxy) |
| `1BE98C5` | baking soda | VMP001341 | 0.930 | SR 175040 "Leavening agents, baking soda" 1 tsp 4.6 g → 0.933 | — | VERIFIED |
| `30CD9C8` | xanthan gum | VMP001342 | 0.634 | no USDA record | BRM 1 Tbsp 9 g → 0.609 (−4.0 %); no second source | UNCONFIRMED |

**What the USDA check shows.** Most claims hold — 89 rows reproduce an SR Legacy gram weight exactly, and many
"proxy" labels are wrong in the harmless direction (oils, milks, yogurt, juices, coffee match the
ingredient's *own* USDA record). The failures:
- **About ten "USDA" values are King Arthur's chart**, not USDA: polenta 163, potato starch 152, maple syrup
  312, chocolate chips 170, rolled oats ≈ 89; quinoa, teff and sorghum flour within 1.5–4 %.
- **Values from the wrong USDA food**: dark molasses (328 g = *dark corn syrup*); einkorn, emmer (128 g — USDA
  whole-grain wheat is 120 g); high-gluten flour (130 g — USDA bread flour is 137 g); durum flour (semolina's
  value; KA durum is 26 % lighter).
- **Values in no source**: 17 rows carry numbers no USDA record contains; several sit 5–13 % off every source
  (bread flour, flaxseed, chia, cocoa nibs, cinnamon); dried cranberries are 33 % below USDA.
- **Real proxies**: five fruit jams use generic "Jams and preserves" (US labels all print 20 g/tbsp — a label
  convention, not a measurement); roasted nuts use raw-nut records; rose and orange-blossom water use water;
  milk-chocolate chips use generic chips; green spelt and wholemeal rye use spelt and medium rye.
- **Brand-dependent**: kosher salt (190 g) matches neither Diamond Crystal (≈ 0.54) nor Morton (≈ 1.08).
- **USDA records that disagree with themselves**: coconut milk (cup 0.955 vs tbsp 1.014), turbinado sugar
  (tsp 0.933 vs cup 0.854), agave (¼ cup 55 g — impossible).
- **All brown-sugar rows are the unpacked cup** (0.613); recipes mean packed (USDA 0.930, KA 0.900).

## A3. Health Canada CNF and Fineli rows — checked against the named record

CNF read live through the serving-size API (food-nutrition.canada.ca/api/canadian-nutrient-file/servingsize/
?id=<code>); Fineli read live through a browser from fineli.fi/fineli/api/v1/foods/<id> (Cloudflare blocks
plain requests; the API does not report the release, so the "Release 18" label itself was not checked).
**Every one of the 54 claims resolves to a real record with exactly the stated value** — the supplier file did
not invent numbers here; the problems are which food a row was mapped to.

| FID id | Ingredient | FID row | Source claimed | FID g/ml | Record check | Verdict |
|---|---|---|---|---|---|---|
| 4BEC221 | sugar | VMP001346 | CNF | 0.845 | CNF 4318 "Sweets, sugars, granulated" · 100ml = 84.53 g → 0.845 | VERIFIED |
| 4BEC221 | sugar | VMP001563 | Fineli | 0.85 | Fineli 1 "Sugar" · dl = 85 g → 0.85 | VERIFIED |
| 6DDD90B | goat milk | VMP001383 | CNF | 1.031 | CNF 6353 "Milk, fluid, goat, unenriched, whole" · 100ml = 103.13 g | VERIFIED |
| 6DDD90B | goat milk | VMP001606 | Fineli | 1.00 | Fineli 604 "Milk, Goat Milk" · dl = 100 g | VERIFIED |
| 06CB219 | milk | VMP001382 | CNF | 1.031 | CNF 113 "Milk, fluid, whole, pasteurized, homogenized, 3.25% M.F." · 100ml = 103.13 g | VERIFIED |
| 06CB219 | milk | VMP001605 | Fineli | 1.00 | Fineli 600 "Milk, Raw Milk, 4.4 % Fat" · dl = 100 g | MAPPED-TO-OTHER-FOOD (raw farm milk; same density as Fineli's other milks) |
| 4B65D8F | walnut | VMP001368 | CNF | 0.423 | CNF 2590 "Nuts, walnuts, English or Persian, dried" · 100ml halves = 42.27 g | VERIFIED (halves only) |
| 4B65D8F | walnut | VMP001369 | CNF | 0.507 | CNF 2590 · 100ml pieces = 50.72 g | VERIFIED (pieces only) |
| 4B65D8F | walnut | VMP001370 | CNF | 0.338 | CNF 2590 · 100ml ground = 33.81 g | VERIFIED (ground only) |
| 4B65D8F | walnut | VMP001371 | CNF | 0.495 | CNF 2590 · 100ml chopped = 49.45 g | VERIFIED (chopped only) |
| 969E29F | all purpose flour | VMP001343 | CNF | 0.528 | CNF 4501 "Grains, wheat flour, white, all purpose, bleached" · 100ml = 52.83 g | VERIFIED |
| 108FD92 | buckwheat flour | VMP001590 | Fineli | 0.75 | Fineli 161 "Flour, Buckwheat, Whole Or Crushed Grains" · dl = 75 g | VERIFIED (groats-or-flour aggregate — see B) |
| 55CD18B | buttermilk | VMP001385 | CNF | 1.036 | CNF 124 "Milk, fluid, buttermilk, cultured, 1% M.F." · 100ml = 103.55 g | VERIFIED |
| 55CD18B | buttermilk | VMP001608 | Fineli | 1.00 | Fineli 613 "Sour Milk, Butter Milk" · dl = 100 g | VERIFIED |
| 5CDA2A6 | cocoa powder | VMP001345 | CNF | 0.363 | CNF 4223 "Sweets, cocoa, powder, unsweetened" · 100ml = 36.35 g | VERIFIED |
| 5CDA2A6 | cocoa powder | VMP001566 | Fineli | 0.40 | Fineli 20 "Cocoa Powder, Unsweetened" · dl = 40 g | VERIFIED |
| 3B304CE | cornstarch | VMP001567 | Fineli | 0.55 | Fineli 27 "Flour, Cornstarch, Cornflour" · dl = 55 g | VERIFIED |
| 0B2945A | cream cheese | VMP001390 | CNF | 0.980 | CNF 28 "Cheese, cream" · 100ml = 97.97 g | VERIFIED |
| 75757A3 | extra virgin olive oil | VMP001350 | CNF | 0.913 | CNF 422 "Vegetable oil, olive" · 100ml = 91.29 g | MAPPED-TO-OTHER-FOOD (generic olive oil; negligible difference) |
| 1C42BB3 | heavy cream | VMP001387 | CNF | 1.006 | CNF 138 "Cream, whipping, 35% M.F." · 100ml = 100.59 g | VERIFIED |
| 185FB6F | honey | VMP001348 | CNF | 1.432 | CNF 4294 "Sweets, honey, strained or extracted" · 100ml = 143.24 g | VERIFIED |
| 185FB6F | honey | VMP001565 | Fineli | 1.40 | Fineli 4 "Honey" · dl = 140 g | VERIFIED |
| 0F967E1 | low-fat milk | VMP001386 | CNF | 1.031 | CNF 63 "Milk, fluid, partly skimmed, 1% M.F." · 100ml = 103.13 g | VERIFIED |
| 0C12CC1 | millet flour | VMP001589 | Fineli | 0.80 | Fineli 160 "Flour, Millet, Whole Or Crushed Grains" · dl = 80 g | VERIFIED (grains-or-flour aggregate — see B) |
| 0F87C17 | molasses | VMP001395 | CNF | 1.386 | CNF 4300 "Sweets, molasses, blackstrap" · 100ml = 138.63 g | MAPPED-TO-OTHER-FOOD (blackstrap; CNF 4299 fancy molasses = 1.424, +2.8 %) |
| 5B00E77 | olive oil | VMP001349 | CNF | 0.913 | CNF 422 "Vegetable oil, olive" · 100ml = 91.29 g | VERIFIED |
| 5B00E77 | olive oil | VMP001597 | Fineli | 0.90 | Fineli 536 "Olive Oil" · dl = 90 g | VERIFIED |
| 14B34D9 | peanut butter | VMP001393 | CNF | 1.049 | CNF 6289 "Peanut butter, natural" · 100ml = 104.90 g | MAPPED-TO-OTHER-FOOD (natural; smooth CNF 3414/3399 = 1.091, +4.0 %) |
| 037D782 | peanut oil | VMP001598 | Fineli | 0.90 | Fineli 537 "Peanut Oil" · dl = 90 g | VERIFIED |
| 87FA108 | potato starch | VMP001591 | Fineli | 0.60 | Fineli 162 "Flour, Potato Starch, Potato Flour" · dl = 60 g | VERIFIED |
| 73F3050 | rapeseed oil | VMP001596 | Fineli | 0.90 | Fineli 535 "Rapeseed Oil" · dl = 90 g | VERIFIED |
| 4A1C787 | rice flour | VMP001594 | Fineli | 0.55 | Fineli 182 "Flour, Rice Flour, Rice Flake" · dl = 55 g | VERIFIED (flour-or-flake aggregate — see B) |
| 4D82451 | roasted almond | VMP001374 | CNF | 0.583 | CNF 2536 "Nuts, almonds, dry roasted, unblanched" · 100ml whole = 58.33 g | VERIFIED (whole) |
| 06C84DD | rye flour | VMP001573 | Fineli | 0.55 | Fineli 100 "Flour, Rye, Wholegrain Rye Flour" · dl = 55 g | VERIFIED (wholegrain) |
| 667BFED | skimmed milk | VMP001377 | CNF | 1.036 | CNF 114 "Milk, fluid, skim" · 100ml = 103.55 g | VERIFIED |
| 60999CF | sour cream | VMP001388 | CNF | 1.048 | CNF 5299 "Cream, sour, light" · 100ml = 104.82 g | MAPPED-TO-OTHER-FOOD (light; regular CNF 139/152 = 0.972, −7.2 %) |
| 60999CF | sour cream | VMP001609 | Fineli | 1.00 | Fineli 615 "Sour Cream, 10-12% Fat" · dl = 100 g | VERIFIED |
| 694C698 | sunflower oil | VMP001599 | Fineli | 0.90 | Fineli 540 "Sunflower Oil" · dl = 90 g | VERIFIED |
| 2DF77A0 | walnut halves | VMP001373 | CNF | 0.423 | CNF 2590 · 100ml halves = 42.27 g | VERIFIED |
| 243FE45 | whole milk | VMP001380 | CNF | 1.031 | CNF 113 · 100ml = 103.13 g | VERIFIED |
| 70BF7A9 | wholemeal wheat flour | VMP001576 | Fineli | 0.55 | Fineli 111 "Flour, Whole Wheat Flour, Graham Flour" · dl = 55 g | VERIFIED |
| 921F9E2 | yogurt | VMP001610 | Fineli | 1.00 | Fineli 619 "Yoghurt, Plain, 2.5% Fat, Low-Lactose" · dl = 100 g | MAPPED-TO-OTHER-FOOD (low-lactose; negligible difference) |
| 389D858 | wheat flour | VMP001344 | CNF | 0.528 | CNF 4501 · 100ml = 52.83 g | VERIFIED |
| 389D858 | wheat flour | VMP001575 | Fineli | 0.65 | Fineli 110 "Flour, Wheat Flour, Semi-Coarse" · dl = 65 g | MAPPED-TO-OTHER-FOOD (semi-coarse flour) |
| 007BBC5 | salt | VMP001569 | Fineli | 1.25 | Fineli 30 "Salt, Iodised" · dl = 125 g | VERIFIED |
| 92D40D1 | rock salt | VMP001572 | Fineli | 1.25 | Fineli 79 "Salt, Rock Salt, Without Iodine" · dl = 125 g | VERIFIED |
| 0829EF9 | semolina | VMP001577 | Fineli | 1.00 | Fineli 112 "Semolina" · dl = 100 g | VERIFIED |
| 82963D1 | wheat bran | VMP001580 | Fineli | 0.20 | Fineli 116 "Wheat Bran" · dl = 20 g | VERIFIED |
| 8AF892A | barley flour | VMP001583 | Fineli | 0.55 | Fineli 150 "Flour, Barley Flour" · dl = 55 g | VERIFIED |
| 29EDE71 | oat bran | VMP001593 | Fineli | 0.60 | Fineli 170 "Oat Bran" · dl = 60 g | VERIFIED |
| 61CAB80 | butter | VMP001595 | Fineli | 0.95 | Fineli 500 "Butter" · dl = 95 g | VERIFIED |
| 8840F49 | lard | VMP001602 | Fineli | 0.95 | Fineli 550 "Lard, Frying Fat" · dl = 95 g | VERIFIED |
| 1FF5882 | Quark | VMP001611 | Fineli | 1.00 | Fineli 622 "Quark, <0.5% Fat" · dl = 100 g | MAPPED-TO-OTHER-FOOD (lean quark) |
| 6B43198 | creme fraiche | VMP001612 | Fineli | 1.00 | Fineli 628 "Creme Fraiche, 28% Fat" · dl = 100 g | VERIFIED |

## B. Inconsistencies (Q2) — published rows more than 5 % apart

Researched by tracing every FID row to its original record. **Cross-cutting finding:** the Nordic
decilitre figures (Fineli, and its upstream KTL B3/2001 *Ruokamittoja*, and Norway) run 10–25 %
denser than US spooned-cup figures for the same flour; none of the Nordic sources states a filling
method (Norway says "levelled"), so the spread is plausibly variety plus scoop-versus-spoon, not
error. **HERR 41** (USDA 1977, n up to 510 per food, "spooned lightly, levelled") anchors the US
home-baking method.

| FID id | Ingredient | FID rows (source → g/ml) | What each row actually measures | Further sources | **Suggested pick (owner to rule)** |
|---|---|---|---|---|---|
| `389D858` | wheat flour | CNF 0.528 · FAO 0.58 · Fineli 0.65 | CNF 4501 all-purpose (= USDA SR FDC 168894, 125 g/cup); FAO row 391 is BiblioID **KEN** — unpublished Kenyan 2004 data, flour type and method unknown; Fineli food 110 is **semi-coarse** flour (*puolikarkea vehnäjauho*, 65 g/dl) | HERR 41 p. 13 all-purpose unsifted, spooned 126 g (0.533; dipped 143 g = 0.604; sifted 116 g = 0.490); KA 120 g (0.507), scooped "up to 160 g"; Norway white flour 55 g/dl (levelled) | **CNF 0.528** (all-purpose, spooned and levelled — HERR 41 within 1 %). Keep Fineli 0.65 only as a semi-coarse variety; drop FAO-KEN. |
| `4BEC221` | sugar | USDA 0.845 · CNF 0.845 · Fineli 0.85 · FAO 0.95 | the three agree; FAO row 528 is **KEN** (sugar type unknown) | HERR 41 granulated 196 g (0.828); KA 198 g (0.837); Norway 90 g/dl | **CNF/USDA 0.845** (= Fineli 0.85). Exclude FAO-KEN 0.95. |
| `06C84DD` | rye flour | USDA 0.431 · Fineli 0.55 | USDA light/medium rye (FDC 168886/168887, 102 g); Fineli wholegrain/fine rye by the dl (≈ US dark rye 0.541) | HERR 41 light rye spooned 101 g (0.427); KA 106 g (0.448); Norway 50–55 g/dl | **USDA 0.431** for generic/medium rye; Fineli 0.55 as wholegrain rye. |
| `108FD92` | buckwheat flour | USDA 0.507 · Fineli 0.75 | Fineli food 161 is "whole **or crushed grains**" (groats-or-flour aggregate) | KA 120 g (0.507); Norway 65 g/dl | **USDA 0.507**; Fineli is not a flour value. |
| `4A1C787` | rice flour | USDA 0.668 · Fineli 0.55 | USDA 158 g matches HERR 41's *brown* rice flour but SR applies it to white; Fineli food 182 is flour-**or-flake** | HERR 41 white rice flour spooned 149 g (0.630); KA white 142 g (0.600); Norway 70 g/dl | No clean FID row for white rice flour: **USDA 0.668**, or add HERR 41 white 0.630 — owner to choose. |
| `631E984` | corn flour | USDA 0.4945 · FAO 0.55 | USDA whole-grain yellow corn flour; FAO row 307 is **KEN** white maize flour | HERR 41 yellow corn flour spooned 117 g (0.4945, identical); UK "cornflour" means cornstarch — confirm FID's meaning | **USDA 0.4945**. |
| `0C12CC1` | millet flour | "USDA" 0.507 · Fineli 0.80 | SR FDC 172023 is **119 g/cup (0.503)**, not 120 — FID's figure matches no USDA record; Fineli food 160 is whole-or-crushed grains | KA whole millet 0.87 (grain) | **USDA corrected to 119 g/cup (0.503)**, cited FDC 172023. |
| `87FA108` | potato starch | "USDA FDC via iForge" 0.642 · Fineli 0.60 | **152 g/cup is not in USDA** (SR has no potato starch) — it equals the King Arthur chart exactly; Fineli food 162 = 60 g/dl, below its own upstream KTL (70) | Norway 70 g/dl (weighed, levelled); KTL 70 g/dl; HERR 41 potato *flour* 179 g (a different product) | **0.642 re-attributed to King Arthur**, or Norway/KTL 0.70 — owner to choose; the source label must be corrected either way. |
| `60999CF` | sour cream | USDA 0.972 · CNF 1.048 · Fineli 1.00 | **CNF 104.8 is CNF 5299 "Cream, sour, light"** — a different product (regular sour cream CNF 139/152 = 97.21, verified by the lane) | HERR 41 236 g (0.998); FNDDS 240 g (1.014); KA 227 g; Norway 100 g/dl (weighed); Danish 1.005 | **Fineli 1.00** (Norway, HERR 41, Danish table agree); re-link or drop the CNF light row. |
| `5CDA2A6` | cocoa powder | USDA/CNF 0.363 · Fineli 0.40 | US spooned vs Nordic dl (cocoa compacts easily: HERR 41 SD 8.9 g on 86 g) | HERR 41 86 g (0.3635); KA 0.355; Norway 50 g/dl | **CNF/USDA 0.363**. |


## D. Piece weights (Markus's M28 table, method undisclosed)

80 rows for 16 ingredients, 5 size classes each (PSC001 extra small … PSC005 extra large). No row names a
published record, so every row was put to the two-source test. Sources: USDA SR Legacy / FNDDS portions (local
CSVs); Health Canada CNF (fruit portions are USDA re-expressed — counted once with USDA); Norway
*Mål, vekt og porsjonsstørrelser for matvarer* (Mattilsynet/UiO/Helsedirektoratet 2015, IS-2286; gross and net
weights, pp. 12, 43–44; values footnoted "av" are USDA-derived and were not counted); Finland KTL B3/2001
*Ruokamittoja* ("Kappalepaino" per-piece column); USDA AMS Egg Grading Manual Table 5; CFIA Canadian Grade
Compendium Vol. 5 §5; EU Regulation (EC) No 589/2008 Art. 4(1). W = whole / in shell, E = edible portion.

| FID id | Ingredient | Size class | FID g | Source 1 | Source 2 | Verdict |
|---|---|---|---|---|---|---|
| `5C1AE0D` | apple | XS | 80 | SR 171688 "1 extra small (2-1/2" dia)" 101 (−20.8 %) | — | DISPUTED |
| `5C1AE0D` | apple | S | 120 | SR 171688 "1 small (2-3/4")" 149 (−19.5 %); FNDDS 2709215 "1 small" 165 | KTL Omena kuorineen small 130 W (−7.7 %); NO small gross 100 (+20 %) | DISPUTED |
| `5C1AE0D` | apple | M | 180 | SR 171688 "1 medium (3")" 182 (−1.1 %); FNDDS 200 (−10 %) | KTL medium 200 W (−10 %); NO medium 140 W (+28.6 %) | DISPUTED |
| `5C1AE0D` | apple | L | 230 | SR 171688 "1 large (3-1/4")" 223 (+3.1 %); FNDDS 242 (−5.0 %) | KTL large 280 W (−17.9 %); NO large 180 W (+27.8 %) | DISPUTED |
| `5C1AE0D` | apple | XL | 300 | FNDDS 2709215 "1 extra large" 295 (+1.7 %) | — | UNCONFIRMED |
| `8648FEE` | banana | XS | 70 | SR 173944 "1 extra small (<6")" 81 E (−13.6 %) | — | DISPUTED |
| `8648FEE` | banana | S | 100 | SR 173944 "1 small" 101 E (−1.0 %) | KTL Banaani kuorineen small 140 W (−28.6 %) | DISPUTED |
| `8648FEE` | banana | M | 120 | SR 173944 "1 medium" 118 E (+1.7 %) | NO net 120 E (0 %); but NO gross 180 W, KTL 190 W | CONFIRMED **as peeled weight only** |
| `8648FEE` | banana | L | 150 | SR 173944 "1 large" 136 E (+10.3 %) | KTL large 230 W | DISPUTED |
| `8648FEE` | banana | XL | 200 | SR 173944 "1 extra large (≥9")" 152 E (+31.6 %) | — | DISPUTED |
| `63787F7` | coconut | XS–XL | 500 / 700 / 1000 / 1400 / 1800 | M: NO Kokosnøtt gross 520 W (+92 %); SR 170169 "1 medium" 397 meat only | no source defines other classes | M DISPUTED; XS, S, L, XL UNCONFIRMED |
| `0D193FB` | dates | XS–XL | 6 / 8 / 10 / 15 / 24 | M: NO dried date 8 (+25 %), KTL 8 (+25 %), SR 171726 pitted 7.1; XL: SR 168191 Medjool 24 (variety, USDA only) | no source defines classes | M DISPUTED; others UNCONFIRMED |
| `30909F3` | duck egg | XS–XL | 50 / 60 / 70 / 80 / 90 | M: SR 172189 "1 egg" 70 (CNF 88 same number) | nothing independent | all UNCONFIRMED |
| `14A64E9` | egg | XS | 35 | US AMS Egg Grading Manual Table 5 peewee 15 oz/doz = 35.4 g in-shell **minimum** | CNF 125 pee wee 33.5 E | UNCONFIRMED |
| `14A64E9` | egg | S | 42 | US AMS small 42.5 min; CFIA small ≥ 42 | EU S < 53 (no point value); KTL small 53 W (−20.8 %) | DISPUTED |
| `14A64E9` | egg | M | 50 | US AMS medium 49.6 min; CFIA ≥ 49 | EU M 53–63 (50 is outside); KTL medium 63 (−20.6 %); NO raw egg 63 gross | DISPUTED |
| `14A64E9` | egg | L | 58 | US AMS large 56.7 min; CFIA ≥ 56 | EU L 63–73 (58 is outside); KTL large 73 (−20.5 %) | DISPUTED |
| `14A64E9` | egg | XL | 65 | US AMS XL 63.8 min; CFIA ≥ 63 | EU XL ≥ 73 (65 is outside) | DISPUTED |
| `4E8C8BD` | quail egg | XS–XL | 7 / 9 / 11 / 13 / 15 | M: SR 172191 "1 egg" 9 E (+22 %), KTL 10 (+10 %) | no classes defined | M DISPUTED; others UNCONFIRMED |
| `8CAF08F` | fig | S / M / L | 45 / 60 / 80 | SR 173021 small 40 (+12.5 %), medium 50 (+20 %), large 64 (+25 %); FNDDS "1 fig" 50 | — | DISPUTED (XS, XL UNCONFIRMED) |
| `6D4BDC1` | lemon | M | 100 | KTL Sitruuna kokonainen 120 W (−16.7 %) | NO gross 150 W (−33 %); SR 167746 58 E (edible) | DISPUTED (other classes UNCONFIRMED) |
| `8BE7328` | lime | M | 70 | SR 168155 "1 fruit (2" dia)" 67 (+4.5 %) | NO gross 80 W (−12.5 %) | DISPUTED (other classes UNCONFIRMED) |
| `58ED733` | orange | S / M / L | 140 / 180 / 230 | NO gross 150 / 250 / 350 W | KTL with peel 200 / 300 / 400 W; KTL peeled 140 / 190 / 220 | DISPUTED (FID tracks peeled weights; XS, XL UNCONFIRMED) |
| `4DBD686` | pear | S | 130 | KTL small 130 (0 %) | SR 169118 small 148 (−12.2 %) | DISPUTED |
| `4DBD686` | pear | M | 180 | SR 169118 medium 178 (+1.1 %) | KTL medium 190 (−5.3 %) | DISPUTED (marginal) |
| `4DBD686` | pear | L | 230 | SR 169118 "1 large" 230 (0 %) | KTL large 240 (−4.2 %) | **CONFIRMED** |
| `6DD8AD6` | plum | S / M / L | 45 / 60 / 80 | NO small 35, medium 55, large 110 | SR 169949 "1 fruit" 66; KTL 33 | DISPUTED (XS, XL UNCONFIRMED) |
| `3B4A108` | rhubarb | M | 70 | SR 167758 "1 stalk" 51 (+37 %) | NO per stalk gross 135, net 100 | DISPUTED (no source defines classes) |
| `56156C0` | sour cherries | M | 8 | NO "Moreller" gross 10 (−20 %) | generic cherry 7–8.2 | DISPUTED (no source defines classes) |
| `1FB350E` | zucchini | S / M / L | 180 / 250 / 350 | SR 169291 small 118, medium 196, large 323 | KTL 200 / 350 / 450; NO gross 300 | DISPUTED (XS, XL UNCONFIRMED) |

**What the piece check shows.**
- **1 of 80 confirmed** (pear, large: USDA 230 g, KTL 240 g); banana medium only as a *peeled* weight.
- **The egg classes are US/Canadian minimums, not typical eggs.** FID's 35 / 42 / 50 / 58 / 65 g equal the USDA
  AMS in-shell *minimum* weight per dozen ÷ 12 (peewee … extra large) and the CFIA minimums. Under the EU grades
  our German and Lithuanian users buy by (Reg. 589/2008: S < 53, M 53–63, L 63–73, XL ≥ 73 g), FID's "medium"
  50 g egg is an EU **small** and its "large" 58 g an EU **medium**; the Nordic tables agree with the EU (KTL
  53 / 63 / 73 g; Norway 63 g gross).
- **Whole and edible weights are mixed**: banana and citrus track peeled weights although the rows say
  "whole-piece"; coconut "medium" (1000 g) is about twice any published whole coconut (Norway 520 g gross).
- **Size classes nobody defines**: no source defines extra small / extra large for most of these, and rhubarb
  and sour cherries are only ever published as one unclassed value — a five-class ladder has no basis there.
  Duck (70 g) and quail (9 g) eggs exist only as single USDA values.

## E. Per ingredient

The roll-up (which rows passed, and the value the app may show per FID form) is the status column of
`curated-set-draft.md`. In short: **114 verified**, **10 pick (owner)**, **44 no verified volume** (the
wheat-variety flours — bread, high-gluten, spelt, green spelt, einkorn, emmer, durum, wholemeal rye; every
syrup except honey, maple and agave; the fruit jams; the ground spices; oats; quark; mascarpone; dried yeast;
kosher salt; cream of tartar; xanthan; rose and orange-blossom water), **15 no volume data**. Where an
ingredient has several passing rows for one form, they agree within 5 % — no new inconsistency arose.

## F. German Type flours (DE/AT/CH, FR-026/FR-027)

FID holds all 13 (`19D72A1` Weizenmehl Type 405, `7A62E03` 550, `0F6655E` 812, `03C3B96` 1050, `92CF3A9`
1600; `4E14641` Dinkelmehl Type 630, `3FB1F22` 812, `0B1DE1B` 1050; `0CD2A0C` Roggenmehl Type 815, `45A9FD5`
997, `856BFDD` 1150, `2EA1812` 1370, `043D35E` 1740). Only the five Weizen types carry a volume row each, and
every one is a **US proxy** — "USDA FDC via iForge", *"1 US cup, mapped to all-purpose flour"* (405, 550: 125 g
→ 0.528) or *"mapped to whole wheat flour"* (812, 1050, 1600: 128 g → 0.541). Those are the invented
equivalences FR-026 forbids; they do not count. The Dinkel and Roggen types carry no volume row.

**Type-specific research (2026-09-25): none of the 13 is confirmed.** No published source measured a
household volume (Tasse, EL, TL, dl) for a *named* German Type:

| Type | Type-specific sources found | Verdict |
|---|---|---|
| Weizen 405, 550 | MOLLET silo bulk-density table (silo.tips … mollet-schuettgueter), "Weizenmehl (405-630) 0,55 – 0,60 kg/l" — industrial bulk density for a *range* of Types, not a household measure; herdheld.de "Type 405/550: 120–125 g pro Cup" — a US-recipe mapping (the forbidden equivalence); streusel.ch "Weissmehl Type 400 und 550, 1 EL gestrichen 7 g" — the *Swiss* Type 550 | UNCONFIRMED (sources ≈ 11 % apart, neither a household measure) |
| Weizen 812, 1050 | MOLLET "Weizenmehl (812-1200) 0,45 – 0,55"; herdheld "Type 1050 ≈ US bread flour" (forbidden mapping) | UNCONFIRMED |
| Weizen 1600 | none naming the Type | UNCONFIRMED |
| Dinkel 630 | fddb.info portion list "gestr. EL (10 g)" — a template default fddb applies to every flour | UNCONFIRMED |
| Dinkel 812, 1050 | none | UNCONFIRMED |
| Roggen 815, 997, 1150, 1370, 1740 | MOLLET "Roggenmehl 0,47 – 0,55" (no Type); fddb template defaults | UNCONFIRMED |

**Generic German, Austrian and Swiss household values** (they name no Type, so they cannot confirm one — and they
disagree with each other): Verband Deutscher Mühlen (mein-mehl.de, "Maße, Einheiten und Messhilfen") Mehl TL
4 g, EL 12 g → 0.80; Dr. Oetker (oetker.de, "Mengenangaben beim Backen umrechnen") level EL 7 g → 0.47; Swissmilk
TL 3 g, level EL 10 g → 0.60–0.67; gutekueche.at 250 ml Becher 140 g → 0.56; Fini's Feinstes (AT) 1 cup 130 g →
0.55. A level Esslöffel of Mehl ranges from 7 g to 12 g across these tables.

**Consequence.** In DE/AT/CH the 13 Type flours are in the set and show **by weight only** (FR-027) until a
mill, the Verband Deutscher Mühlen or a documented measurement protocol publishes Type-specific volume
weights, and the api admits them. For the api lane: drop the US-proxy rows for the Weizen types; fix
`3FB1F22`'s base name ("Dinkelmehl Type plant1brand", no English name) and the Hungarian Weizen names written
with underscores ("búzaliszt_405_típus").

## C. For the api lane — data problems the research found

1. **Mislabelled provenance.** Potato starch's "USDA FDC via iForge" 152 g/cup is King Arthur's
   figure, not USDA's; millet flour's 120 g/cup matches no USDA record (SR has 119 g). What did the
   iForge import actually read?
2. **Wrong product linked.** Sour cream's CNF row is *light* sour cream (CNF 5299). Fineli rows for
   buckwheat, millet and rice are groats/flakes-or-flour aggregates, not flours.
3. **Unpublished outliers rated HIGH.** The FAO rows FID uses for wheat flour, sugar and corn flour
   come from BiblioID **KEN** (Kenyan 2004 child-nutrition project, unpublished, variety and
   method unstated).
4. **The "OpenAI category estimate" syrup value (1.30)** is low for glucose, sugar beet and rice
   syrup (sources 1.39–1.44).
5. **Brown sugar's AI rows are the unpacked measure**; recipes mean packed.
6. **Piece weights** (§D): the egg classes are US minimums, not EU grades; whole and edible weights are
   mixed; most size classes have no published basis. 1 of 80 rows in the set is confirmed.
7. **"USDA FDC via iForge" is not USDA** (§A2): about ten values are King Arthur's; some come from the wrong
   USDA food (dark molasses = dark corn syrup); 17 carry numbers no USDA record contains; "proxy" labels
   are both over- and under-applied.
9. **German Type flours** (§F): the five Weizen values are US proxies (forbidden equivalences); the Dinkel and
   Roggen types have no volume row; no Type-specific published volume weight exists — the types show by
   weight only. Name defects: `3FB1F22` "Dinkelmehl Type plant1brand"; Hungarian Weizen names with
   underscores. **HU, PL, LT flour classes are absent from FID** — listed per country in
   `curated-set-draft.md`, with their standards (MÉ 2-201/2020; PN-A-74022:2003, PN-A-74032:2002;
   LST 1133:2003), and no equivalences.
8. **Mappings** (§A3): CNF and Fineli values are genuine, but eight rows are mapped from another variant
   (light sour cream, semi-coarse flour, raw 4.4 % milk, blackstrap molasses, natural peanut butter, lean
   quark, low-lactose yogurt, generic olive oil for extra virgin).

Research copies (not committed): the FAO Density DB xlsx, USDA SR Legacy / FNDDS / Foundation CSV
extracts, HERR 41, Norway's and Finland's measure tables, and the King Arthur chart text, kept in
the lane's scratchpad for the api lane on request.
