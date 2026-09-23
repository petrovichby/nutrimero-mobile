// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at 4a4356b332995fdcd326735f44de1cfd166f0c9c.
// O7. Do not edit by hand: re-record instead.
import type { paths } from "@nutrimero/core";

export const declarationsOverview = {
  items: [
    {
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
    },
    {
      productId: "f4c232d8-2831-44af-9505-caf3c6878401",
      incomplete: true,
      currentAsOf: "2026-09-23",
      ruleSets: [
        {
          ruleSetId: "eu1_packaging",
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
              required: true,
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
              required: true,
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
                          recipeId: "44f6ea16-3d4e-44e5-ba56-13e6e11cff10",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
              required: true,
              complete: true,
              gaps: [],
            },
            {
              category: "food_symbols",
              required: true,
              complete: true,
              gaps: [],
            },
          ],
        },
        {
          ruleSetId: "usa_packaging",
          region: "usa",
          cells: [
            {
              category: "allergens",
              required: true,
              complete: true,
              gaps: [],
            },
            {
              category: "additives",
              required: true,
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
              required: true,
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
                          recipeId: "44f6ea16-3d4e-44e5-ba56-13e6e11cff10",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                    nutrientId: 10,
                    coverage: null,
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                    nutrientId: 40,
                    coverage: null,
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
                      coveredGrams: "500",
                      uncoveredGrams: "500",
                    },
                  },
                  target: {
                    type: "product",
                    productId: "f4c232d8-2831-44af-9505-caf3c6878401",
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
              required: true,
              complete: false,
              gaps: [
                {
                  kind: "not_recorded",
                  datum: {
                    type: "region_rule",
                  },
                  target: {
                    type: "region",
                    region: "usa",
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
              category: "food_symbols",
              required: true,
              complete: true,
              gaps: [],
            },
          ],
        },
      ],
    },
    {
      productId: "10f1563b-ca4b-4fec-b079-5e2e43710826",
      incomplete: true,
      currentAsOf: "2026-09-23",
      ruleSets: [
        {
          ruleSetId: "eu1_counter_card",
          region: "eu1",
          cells: [
            {
              category: "allergens",
              required: true,
              complete: false,
              gaps: [
                {
                  kind: "not_recorded",
                  datum: {
                    type: "composition",
                  },
                  target: {
                    type: "product",
                    productId: "10f1563b-ca4b-4fec-b079-5e2e43710826",
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
              category: "additives",
              required: false,
              complete: false,
              gaps: [
                {
                  kind: "not_recorded",
                  datum: {
                    type: "composition",
                  },
                  target: {
                    type: "product",
                    productId: "10f1563b-ca4b-4fec-b079-5e2e43710826",
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
                    type: "composition",
                  },
                  target: {
                    type: "product",
                    productId: "10f1563b-ca4b-4fec-b079-5e2e43710826",
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
              complete: false,
              gaps: [
                {
                  kind: "not_recorded",
                  datum: {
                    type: "composition",
                  },
                  target: {
                    type: "product",
                    productId: "10f1563b-ca4b-4fec-b079-5e2e43710826",
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
              category: "food_symbols",
              required: false,
              complete: false,
              gaps: [
                {
                  kind: "not_recorded",
                  datum: {
                    type: "composition",
                  },
                  target: {
                    type: "product",
                    productId: "10f1563b-ca4b-4fec-b079-5e2e43710826",
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
    },
  ],
  total: 3,
  limit: 200,
  offset: 0,
} satisfies paths["/api/v1/declarations"]["get"]["responses"][200]["content"]["application/json"];
