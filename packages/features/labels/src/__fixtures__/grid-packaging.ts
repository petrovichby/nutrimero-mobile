// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at 4a4356b332995fdcd326735f44de1cfd166f0c9c.
// O8 — EU1 packaging (Additives cannot_be_held, PARKED P-02) and USA packaging. Do not edit by hand: re-record instead.
import type { paths } from "@nutrimero/core";

export const gridPackaging = {
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
} satisfies paths["/api/v1/products/{id}/declarations"]["get"]["responses"][200]["content"]["application/json"];
