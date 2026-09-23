import { describe, expect, it } from "vitest";
import { issuedActive, issuedDrifted } from "../test-support/fixtures";
import { verdictOf } from "./verdict";

const SERVER_DATE = "Wed, 23 Sep 2026 14:05:00 GMT";

describe("the match verdict (FR-017, SC-004)", () => {
  it("is the api's answer from the read made while viewing", () => {
    expect(verdictOf({ label: issuedActive, serverDate: SERVER_DATE })).toEqual({
      state: "matches",
      checkedAt: "2026-09-23T14:05:00.000Z",
      deviceTime: false,
    });
    expect(verdictOf({ label: issuedDrifted, serverDate: SERVER_DATE }).state).toBe("differs");
  });

  it("offline there is no verdict — never one carried over", () => {
    expect(verdictOf(null)).toEqual({ state: "needsConnection" });
  });

  it("labels the device clock when the server sent no Date", () => {
    const verdict = verdictOf(
      { label: issuedActive, serverDate: null },
      () => new Date("2026-09-23T15:00:00Z"),
    );
    expect(verdict).toEqual({
      state: "matches",
      checkedAt: "2026-09-23T15:00:00.000Z",
      deviceTime: true,
    });
  });
});
