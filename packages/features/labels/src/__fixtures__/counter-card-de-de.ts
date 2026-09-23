// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at 4a4356b332995fdcd326735f44de1cfd166f0c9c.
// O9 — EU1 counter card in de-DE. Do not edit by hand: re-record instead.
import type { paths } from "@nutrimero/core";

export const counterCardDeDE = {
  ruleSetId: "eu1_counter_card",
  language: "de",
  engine: "eu",
  sections: [
    {
      kind: "statement",
      runs: [
        {
          text: "Enthält: ",
          emphasis: false,
        },
        {
          text: "Glutenhaltiges Getreide",
          emphasis: true,
        },
        {
          text: ", ",
          emphasis: false,
        },
        {
          text: "Weizen",
          emphasis: true,
        },
        {
          text: ", ",
          emphasis: false,
        },
        {
          text: "Schalenfrüchte",
          emphasis: true,
        },
        {
          text: ", ",
          emphasis: false,
        },
        {
          text: "Mandeln",
          emphasis: true,
        },
        {
          text: ", ",
          emphasis: false,
        },
        {
          text: "Haselnüsse",
          emphasis: true,
        },
      ],
    },
  ],
  text: "Enthält: Glutenhaltiges Getreide, Weizen, Schalenfrüchte, Mandeln, Haselnüsse",
  gaps: [],
  notices: [],
  figures: [],
  symbolIds: [],
} satisfies paths["/api/v1/products/{id}/labels/{ruleSetId}"]["get"]["responses"][200]["content"]["application/json"];
