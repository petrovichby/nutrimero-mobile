// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at 4a4356b332995fdcd326735f44de1cfd166f0c9c.
// O9 — EU1 packaging in en-US, with nutrition. Do not edit by hand: re-record instead.
import type { paths } from "@nutrimero/core";

export const packagingEnUS = {
  ruleSetId: "eu1_packaging",
  language: "en",
  engine: "eu",
  sections: [
    {
      kind: "heading",
      runs: [
        {
          text: "ingredients: ",
          emphasis: false,
        },
      ],
    },
    {
      kind: "lines",
      runs: [
        {
          text: "wheat flour",
          emphasis: true,
        },
        {
          text: "; ",
          emphasis: false,
        },
        {
          text: "hazelnuts",
          emphasis: true,
        },
      ],
    },
    {
      kind: "nutrition",
      heading: [
        {
          text: "Nutrition declaration",
          emphasis: false,
        },
      ],
      basis: [
        {
          text: "per 100 g",
          emphasis: false,
        },
      ],
      rows: [
        {
          nutrientId: 1,
          runs: [
            {
              text: "energy",
              emphasis: false,
            },
          ],
          ofWhich: false,
          values: [
            {
              rounded: "1362",
              unit: "kJ",
              source: "1362",
              rule: "energy",
            },
            {
              rounded: "326",
              unit: "kcal",
              source: "1362",
              rule: "energy",
            },
          ],
        },
        {
          nutrientId: 2,
          runs: [
            {
              text: "fat",
              emphasis: false,
            },
          ],
          ofWhich: false,
          values: [
            {
              rounded: "31",
              unit: "g",
              source: "31.2",
              rule: "macronutrient",
            },
          ],
        },
        {
          nutrientId: 3,
          runs: [
            {
              text: "of which: ",
              emphasis: false,
            },
            {
              text: "saturates",
              emphasis: false,
            },
          ],
          ofWhich: true,
          values: [
            {
              rounded: "2.5",
              unit: "g",
              source: "2.4935",
              rule: "fatty_acid",
            },
          ],
        },
        {
          nutrientId: 6,
          runs: [
            {
              text: "carbohydrate",
              emphasis: false,
            },
          ],
          ofWhich: false,
          values: [
            {
              rounded: "5.3",
              unit: "g",
              source: "5.34",
              rule: "macronutrient",
            },
          ],
        },
        {
          nutrientId: 7,
          runs: [
            {
              text: "of which: ",
              emphasis: false,
            },
            {
              text: "sugars",
              emphasis: false,
            },
          ],
          ofWhich: true,
          values: [
            {
              rounded: "4.2",
              unit: "g",
              source: "4.2185",
              rule: "macronutrient",
            },
          ],
        },
        {
          nutrientId: 11,
          runs: [
            {
              text: "protein",
              emphasis: false,
            },
          ],
          ofWhich: false,
          values: [
            {
              rounded: "6.2",
              unit: "g",
              source: "6.16",
              rule: "macronutrient",
            },
          ],
        },
        {
          nutrientId: 12,
          runs: [
            {
              text: "salt",
              emphasis: false,
            },
          ],
          ofWhich: false,
          values: [
            {
              rounded: "< 0.01",
              unit: "g",
              source: "0.004",
              rule: "salt",
            },
          ],
        },
      ],
    },
  ],
  text: "ingredients: wheat flour; hazelnuts",
  gaps: [],
  notices: [],
  figures: [
    {
      at: "nutrition:1:kJ",
      source: "1362",
      rounded: "1362",
      rule: "energy",
    },
    {
      at: "nutrition:1:kcal",
      source: "1362",
      rounded: "326",
      rule: "energy",
    },
    {
      at: "nutrition:2:g",
      source: "31.2",
      rounded: "31",
      rule: "macronutrient",
    },
    {
      at: "nutrition:3:g",
      source: "2.4935",
      rounded: "2.5",
      rule: "fatty_acid",
    },
    {
      at: "nutrition:6:g",
      source: "5.34",
      rounded: "5.3",
      rule: "macronutrient",
    },
    {
      at: "nutrition:7:g",
      source: "4.2185",
      rounded: "4.2",
      rule: "macronutrient",
    },
    {
      at: "nutrition:11:g",
      source: "6.16",
      rounded: "6.2",
      rule: "macronutrient",
    },
    {
      at: "nutrition:12:g",
      source: "0.004",
      rounded: "< 0.01",
      rule: "salt",
    },
  ],
  symbolIds: [1, 2, 9, 10],
} satisfies paths["/api/v1/products/{id}/labels/{ruleSetId}"]["get"]["responses"][200]["content"]["application/json"];
