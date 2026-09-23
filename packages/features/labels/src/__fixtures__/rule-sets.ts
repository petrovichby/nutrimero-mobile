// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at 4a4356b332995fdcd326735f44de1cfd166f0c9c.
// O5 — the seeded rule-sets. Do not edit by hand: re-record instead.
import type { paths } from "@nutrimero/core";

export const ruleSets = {
  items: [
    {
      id: "au_nz_counter_card",
      name: "Australia/New Zealand counter card",
      region: "au_nz",
      categories: ["allergens"],
      nutrientIds: [],
      symbolIds: [],
      availability: "background",
      status: "active",
      provenance: {
        source:
          "fid_allergens.au_nz_ref, the reference layer's own legal list; background per M54c",
        method: "DERIVED",
        confidence: "LOW",
        comment:
          "provisional — derived by lane 1 from the named artifact, replaced by Markus's delivery (delivery request 2026-09-13)",
      },
    },
    {
      id: "canada_counter_card",
      name: "Canada counter card",
      region: "canada",
      categories: ["allergens"],
      nutrientIds: [1, 2, 3, 6, 7, 10, 11, 40, 41],
      symbolIds: [],
      availability: "offered",
      status: "active",
      provenance: {
        source:
          "M23 'Shop (only allergens)', applied to Canada (rules sheet row 17); nutrition list FOR INFORMATION (not required) per M58 (Markus, 2026-09-14: grey-and-complete option C), provisionally canada_packaging's list (coordinator's reading)",
        method: "DERIVED",
        confidence: "LOW",
        comment:
          "provisional — derived by lane 1 from the named artifact, replaced by Markus's delivery (delivery request 2026-09-13); nutrition list provisional (M58)",
      },
    },
    {
      id: "canada_packaging",
      name: "Canada packaging",
      region: "canada",
      categories: ["allergens", "additives", "nutrition", "ingredients", "food_symbols"],
      nutrientIds: [1, 2, 3, 6, 7, 10, 11, 40, 41],
      symbolIds: [1, 2, 9, 10],
      availability: "offered",
      status: "active",
      provenance: {
        source:
          "Logic_of_declaration_with_regions.xlsx, rules sheet row 17 (Canada 'R': as the USA); carbohydrate added by M56e (Markus, 2026-09-14: confirmed an omission); ingredients required per M59a (Markus, 2026-09-15: 'we definitely need these for every country for packaged goods')",
        method: "DERIVED",
        confidence: "LOW",
        comment:
          "provisional — derived by lane 1 from the named artifact, replaced by Markus's delivery (delivery request 2026-09-13); carbohydrate added per M56e; ingredients per M59a",
      },
    },
    {
      id: "eu1_counter_card",
      name: "Shop counter card",
      region: "eu1",
      categories: ["allergens"],
      nutrientIds: [1, 2, 3, 6, 7, 11, 12],
      symbolIds: [],
      availability: "offered",
      status: "active",
      provenance: {
        source:
          "M23 'Shop (only allergens)' (Markus, 2026-09-02); name from M55; nutrition list FOR INFORMATION (not required) per M58 (Markus, 2026-09-14: grey-and-complete option C), provisionally eu1_packaging's list (coordinator's reading)",
        method: "DERIVED",
        confidence: "MEDIUM",
        comment:
          "provisional — derived by lane 1 from the named artifact, replaced by Markus's delivery (delivery request 2026-09-13); nutrition list provisional (M58)",
      },
    },
    {
      id: "eu1_packaging",
      name: "EU packaging",
      region: "eu1",
      categories: ["allergens", "additives", "nutrition", "ingredients", "food_symbols"],
      nutrientIds: [1, 2, 3, 6, 7, 11, 12],
      symbolIds: [1, 2, 9, 10],
      availability: "offered",
      status: "active",
      provenance: {
        source:
          "labeling-completeness-model.md, 'Required declaration info' example (Markus, 2026-08-30); nutrients corrected by M56a (Markus, 2026-09-14: 'No Fibre in Standard-EU'); name from M55; ingredients required per M59a (Markus, 2026-09-15: 'we definitely need these for every country for packaged goods')",
        method: "DERIVED",
        confidence: "MEDIUM",
        comment:
          "provisional — derived by lane 1 from the named artifact, replaced by Markus's delivery (delivery request 2026-09-13); fibre removed per M56a; ingredients per M59a",
      },
    },
    {
      id: "eu2_counter_card",
      name: "EU2 counter card",
      region: "eu2",
      categories: ["allergens"],
      nutrientIds: [1, 2, 3, 6, 7, 11, 12],
      symbolIds: [],
      availability: "offered",
      status: "active",
      provenance: {
        source:
          "M23 'Shop (only allergens)', applied to EU2 (rules sheet row 15); nutrition list FOR INFORMATION (not required) per M58 (Markus, 2026-09-14: grey-and-complete option C), provisionally eu2_packaging's list (coordinator's reading)",
        method: "DERIVED",
        confidence: "LOW",
        comment:
          "provisional — derived by lane 1 from the named artifact, replaced by Markus's delivery (delivery request 2026-09-13); nutrition list provisional (M58)",
      },
    },
    {
      id: "eu2_packaging",
      name: "EU2 packaging",
      region: "eu2",
      categories: ["allergens", "additives", "nutrition", "ingredients", "food_symbols"],
      nutrientIds: [1, 2, 3, 6, 7, 11, 12],
      symbolIds: [1, 2, 9, 10],
      availability: "offered",
      status: "active",
      provenance: {
        source:
          "Logic_of_declaration_with_regions.xlsx, rules sheet row 15 (EU2 'R'); categories as EU packaging; ingredients required per M59a (Markus, 2026-09-15: 'we definitely need these for every country for packaged goods')",
        method: "DERIVED",
        confidence: "LOW",
        comment:
          "provisional — derived by lane 1 from the named artifact, replaced by Markus's delivery (delivery request 2026-09-13); ingredients per M59a",
      },
    },
    {
      id: "japan_counter_card",
      name: "Japan counter card",
      region: "japan",
      categories: ["allergens"],
      nutrientIds: [],
      symbolIds: [],
      availability: "background",
      status: "active",
      provenance: {
        source:
          "fid_allergens.japan_ref, the reference layer's own legal list; background per M54c",
        method: "DERIVED",
        confidence: "LOW",
        comment:
          "provisional — derived by lane 1 from the named artifact, replaced by Markus's delivery (delivery request 2026-09-13)",
      },
    },
    {
      id: "south_korea_counter_card",
      name: "South Korea counter card",
      region: "south_korea",
      categories: ["allergens"],
      nutrientIds: [],
      symbolIds: [],
      availability: "background",
      status: "active",
      provenance: {
        source:
          "fid_allergens.south_korea_ref, the reference layer's own legal list; background per M54c",
        method: "DERIVED",
        confidence: "LOW",
        comment:
          "provisional — derived by lane 1 from the named artifact, replaced by Markus's delivery (delivery request 2026-09-13)",
      },
    },
    {
      id: "usa_counter_card",
      name: "USA counter card",
      region: "usa",
      categories: ["allergens"],
      nutrientIds: [1, 2, 3, 6, 7, 10, 11, 40, 41],
      symbolIds: [],
      availability: "offered",
      status: "active",
      provenance: {
        source:
          "M23 'Shop (only allergens)', applied to the USA (rules sheet row 16); nutrition list FOR INFORMATION (not required) per M58 (Markus, 2026-09-14: grey-and-complete option C), provisionally usa_packaging's list (coordinator's reading)",
        method: "DERIVED",
        confidence: "LOW",
        comment:
          "provisional — derived by lane 1 from the named artifact, replaced by Markus's delivery (delivery request 2026-09-13); nutrition list provisional (M58)",
      },
    },
    {
      id: "usa_packaging",
      name: "USA packaging",
      region: "usa",
      categories: ["allergens", "additives", "nutrition", "ingredients", "food_symbols"],
      nutrientIds: [1, 2, 3, 6, 7, 10, 11, 40, 41],
      symbolIds: [1, 2, 9, 10],
      availability: "offered",
      status: "active",
      provenance: {
        source:
          "Logic_of_declaration_with_regions.xlsx, rules sheet row 16 (USA 'R': energy, fat, saturates, trans fat, sugars, fibre, protein, sodium); carbohydrate added by M56e (Markus, 2026-09-14: confirmed an omission); ingredients required per M59a (Markus, 2026-09-15: 'we definitely need these for every country for packaged goods')",
        method: "DERIVED",
        confidence: "LOW",
        comment:
          "provisional — derived by lane 1 from the named artifact, replaced by Markus's delivery (delivery request 2026-09-13); carbohydrate added per M56e; ingredients per M59a",
      },
    },
  ],
  total: 11,
  limit: 50,
  offset: 0,
} satisfies paths["/api/v1/fid/declaration-rule-sets"]["get"]["responses"][200]["content"]["application/json"];
