// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at 4a4356b332995fdcd326735f44de1cfd166f0c9c.
// O8 — EU1 counter card, complete. Do not edit by hand: re-record instead.
import type { paths } from "@nutrimero/core";

export const gridCounterCardComplete = {
  productId: "3fadf1be-e604-4194-9cdd-ec0f5b48e3aa",
  incomplete: false,
  currentAsOf: "2026-09-23",
  ruleSets: [
    {
      ruleSetId: "eu1_counter_card",
      region: "eu1",
      cells: [
        {
          category: "allergens",
          required: true,
          complete: true,
          gaps: [],
        },
        {
          category: "additives",
          required: false,
          complete: false,
          gaps: [
            {
              kind: "cannot_be_held",
              datum: {
                type: "additives",
              },
              target: {
                type: "system",
              },
              occurrences: [
                {
                  path: [],
                },
              ],
            },
          ],
        },
        {
          category: "nutrition",
          required: false,
          complete: false,
          gaps: [
            {
              kind: "not_recorded",
              datum: {
                type: "nutrient_values",
              },
              target: {
                type: "fid_ingredient",
                fidId: "389D858",
              },
              occurrences: [
                {
                  path: [
                    {
                      recipeId: "f7b2e13a-3d4f-427e-b21f-27fc1401bca7",
                      componentLocalId: "C001",
                    },
                  ],
                },
              ],
            },
            {
              kind: "not_recorded",
              datum: {
                type: "nutrient",
                nutrientId: 1,
                coverage: {
                  coveredGrams: "600",
                  uncoveredGrams: "600",
                },
              },
              target: {
                type: "product",
                productId: "3fadf1be-e604-4194-9cdd-ec0f5b48e3aa",
              },
              occurrences: [
                {
                  path: [],
                },
              ],
            },
            {
              kind: "not_recorded",
              datum: {
                type: "nutrient",
                nutrientId: 2,
                coverage: {
                  coveredGrams: "600",
                  uncoveredGrams: "600",
                },
              },
              target: {
                type: "product",
                productId: "3fadf1be-e604-4194-9cdd-ec0f5b48e3aa",
              },
              occurrences: [
                {
                  path: [],
                },
              ],
            },
            {
              kind: "not_recorded",
              datum: {
                type: "nutrient",
                nutrientId: 3,
                coverage: {
                  coveredGrams: "600",
                  uncoveredGrams: "600",
                },
              },
              target: {
                type: "product",
                productId: "3fadf1be-e604-4194-9cdd-ec0f5b48e3aa",
              },
              occurrences: [
                {
                  path: [],
                },
              ],
            },
            {
              kind: "not_recorded",
              datum: {
                type: "nutrient",
                nutrientId: 6,
                coverage: {
                  coveredGrams: "600",
                  uncoveredGrams: "600",
                },
              },
              target: {
                type: "product",
                productId: "3fadf1be-e604-4194-9cdd-ec0f5b48e3aa",
              },
              occurrences: [
                {
                  path: [],
                },
              ],
            },
            {
              kind: "not_recorded",
              datum: {
                type: "nutrient",
                nutrientId: 7,
                coverage: {
                  coveredGrams: "600",
                  uncoveredGrams: "600",
                },
              },
              target: {
                type: "product",
                productId: "3fadf1be-e604-4194-9cdd-ec0f5b48e3aa",
              },
              occurrences: [
                {
                  path: [],
                },
              ],
            },
            {
              kind: "not_recorded",
              datum: {
                type: "nutrient",
                nutrientId: 11,
                coverage: {
                  coveredGrams: "600",
                  uncoveredGrams: "600",
                },
              },
              target: {
                type: "product",
                productId: "3fadf1be-e604-4194-9cdd-ec0f5b48e3aa",
              },
              occurrences: [
                {
                  path: [],
                },
              ],
            },
            {
              kind: "not_recorded",
              datum: {
                type: "nutrient",
                nutrientId: 12,
                coverage: {
                  coveredGrams: "600",
                  uncoveredGrams: "600",
                },
              },
              target: {
                type: "product",
                productId: "3fadf1be-e604-4194-9cdd-ec0f5b48e3aa",
              },
              occurrences: [
                {
                  path: [],
                },
              ],
            },
          ],
        },
        {
          category: "ingredients",
          required: false,
          complete: true,
          gaps: [],
        },
        {
          category: "food_symbols",
          required: false,
          complete: false,
          gaps: [
            {
              kind: "not_recorded",
              datum: {
                type: "region_rule",
              },
              target: {
                type: "region",
                region: "eu1",
              },
              occurrences: [
                {
                  path: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} satisfies paths["/api/v1/products/{id}/declarations"]["get"]["responses"][200]["content"]["application/json"];
