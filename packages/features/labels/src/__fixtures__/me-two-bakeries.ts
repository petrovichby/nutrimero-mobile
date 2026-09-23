// Recorded by scripts/record-label-fixtures.ts from a local nutrimero-api at 4a4356b332995fdcd326735f44de1cfd166f0c9c.
// O4 — a viewer in one bakery and admin of another. Do not edit by hand: re-record instead.
import type { paths } from "@nutrimero/core";

export const meTwoBakeries = {
  user: {
    id: "9a506db5-4b65-4cda-b598-5b2887f11a8c",
    email: "boris-mue4kmuz@fixtures.test",
    displayName: "boris",
    status: "active",
    preferences: {
      colorScheme: "system",
      language: null,
    },
  },
  memberships: [
    {
      id: "2fa08dd1-bedd-4f9a-a8d1-4a427ee764f0",
      companyId: "7b6b4da7-2de4-42c5-9e10-5ccb9bc0c65f",
      companyName: "Konditorei Boris",
      role: "admin",
      status: "active",
    },
    {
      id: "105bdff3-83a7-4b0c-9ad3-832352dab58d",
      companyId: "bdeaaa4d-f422-4b5f-9e7f-515ac5a672e3",
      companyName: "Bäckerei Anna",
      role: "viewer",
      status: "active",
    },
  ],
} satisfies paths["/api/v1/me"]["get"]["responses"][200]["content"]["application/json"];
