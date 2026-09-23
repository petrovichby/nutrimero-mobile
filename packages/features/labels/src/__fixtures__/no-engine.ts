// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at 4a4356b332995fdcd326735f44de1cfd166f0c9c.
// O9 — a region without a label engine. Do not edit by hand: re-record instead.
import type { paths } from "@nutrimero/core";

export const noEngine = {
  ruleSetId: "usa_packaging",
  language: "en",
  engine: null,
  sections: [],
  text: "",
  gaps: [
    {
      kind: "not_recorded",
      datum: {
        type: "no_engine",
        region: "usa",
      },
      route: null,
    },
  ],
  notices: [],
  figures: [],
  symbolIds: [],
} satisfies paths["/api/v1/products/{id}/labels/{ruleSetId}"]["get"]["responses"][200]["content"]["application/json"];
