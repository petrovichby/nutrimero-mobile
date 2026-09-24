# Density evidence — 004 (gate-1 Q1 and Q2)

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

| | Rows |
|---|---|
| AI-derived volume rows in the draft set | **53** |
| Confirmed | **36** |
| Disputed | **13** |
| Unconfirmed | **4** |
| Inconsistent ingredients (published rows > 5 % apart) | **10** — all explained below, with suggested picks |

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
6. **Piece weights** (Markus's 2026-09-03 table, 2,010 rows) are not in this file: whether that
   delivery is the one M34 disclosed as AI-generated is an open question to the api lane (004
   plan, gate-2 item 4b). If it is, they need the same proof.

Research copies (not committed): the FAO Density DB xlsx, USDA SR Legacy / FNDDS / Foundation CSV
extracts, HERR 41, Norway's and Finland's measure tables, and the King Arthur chart text, kept in
the lane's scratchpad for the api lane on request.
