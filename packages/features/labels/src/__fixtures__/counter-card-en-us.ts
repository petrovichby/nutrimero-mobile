// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at 4a4356b332995fdcd326735f44de1cfd166f0c9c.
// O9 — EU1 counter card in en-US. Do not edit by hand: re-record instead.
import type { paths } from "@nutrimero/core";

export const counterCardEnUS = {
  ruleSetId: "eu1_counter_card",
  language: "en",
  engine: "eu",
  sections: [
    {
      kind: "statement",
      runs: [
        {
          text: "contains: ",
          emphasis: false,
        },
        {
          text: "Cereals containing gluten",
          emphasis: true,
        },
        {
          text: ", ",
          emphasis: false,
        },
        {
          text: "wheat",
          emphasis: true,
        },
        {
          text: ", ",
          emphasis: false,
        },
        {
          text: "Nuts",
          emphasis: true,
        },
        {
          text: ", ",
          emphasis: false,
        },
        {
          text: "almonds",
          emphasis: true,
        },
        {
          text: ", ",
          emphasis: false,
        },
        {
          text: "hazelnuts",
          emphasis: true,
        },
      ],
    },
  ],
  text: "contains: Cereals containing gluten, wheat, Nuts, almonds, hazelnuts",
  gaps: [],
  notices: [],
  figures: [],
  symbolIds: [],
} satisfies paths["/api/v1/products/{id}/labels/{ruleSetId}"]["get"]["responses"][200]["content"]["application/json"];
