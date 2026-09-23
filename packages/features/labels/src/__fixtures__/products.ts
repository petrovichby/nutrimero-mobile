// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at 4a4356b332995fdcd326735f44de1cfd166f0c9c.
// O6. Do not edit by hand: re-record instead.
import type { paths } from "@nutrimero/core";

export const products = {
  products: [
    {
      id: "3fadf1be-e604-4194-9cdd-ec0f5b48e3aa",
      name: "Haselnussbrot",
      number: "HB-500",
      groupName: null,
      tags: [],
      status: "active",
      composition: {
        kind: "recipe",
        entryId: "11b928c4-1ca4-4a04-ae96-4abf153a64da",
        effectiveFrom: null,
        recipe: {
          id: "f7b2e13a-3d4f-427e-b21f-27fc1401bca7",
          version: 1,
          name: "Haselnussbrot",
          status: "active",
          namedVersionId: "f7b2e13a-3d4f-427e-b21f-27fc1401bca7",
        },
      },
    },
    {
      id: "f4c232d8-2831-44af-9505-caf3c6878401",
      name: "Nussecke",
      number: "NE-120",
      groupName: null,
      tags: [],
      status: "active",
      composition: {
        kind: "recipe",
        entryId: "8da247d9-1aab-4477-a817-19fd290fdecc",
        effectiveFrom: null,
        recipe: {
          id: "44f6ea16-3d4e-44e5-ba56-13e6e11cff10",
          version: 1,
          name: "Nussecke",
          status: "active",
          namedVersionId: "44f6ea16-3d4e-44e5-ba56-13e6e11cff10",
        },
      },
    },
    {
      id: "10f1563b-ca4b-4fec-b079-5e2e43710826",
      name: "Saisonbrot",
      number: "SB-001",
      groupName: null,
      tags: [],
      status: "active",
      composition: null,
    },
  ],
  total: 3,
  limit: 200,
  offset: 0,
  currentAsOf: "2026-09-23",
} satisfies paths["/api/v1/products"]["get"]["responses"][200]["content"]["application/json"];
