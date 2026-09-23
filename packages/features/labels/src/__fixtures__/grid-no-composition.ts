// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at 4a4356b332995fdcd326735f44de1cfd166f0c9c.
// O8 — a product with no composition. Do not edit by hand: re-record instead.
import type { paths } from "@nutrimero/core";

export const gridNoComposition = {
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
} satisfies paths["/api/v1/products/{id}/declarations"]["get"]["responses"][200]["content"]["application/json"];
