import { describe, expect, it } from "vitest";
import type { View } from "../model/item";
import { alertsFor } from "./alerts";

const ended = (id: string): View => ({
  id,
  kind: "timer",
  name: id,
  status: "done",
  secondsLeft: null,
  endsAt: 0,
  stage: null,
});

describe("no alert over the item's own screen (18c, a46f00c8)", () => {
  it("drops the alert for the item whose screen is open", () => {
    expect(alertsFor([ended("a")], "a")).toEqual([]);
  });

  it("keeps it everywhere else, including a different item ending on that screen", () => {
    expect(alertsFor([ended("a")], null)).toEqual([ended("a")]);
    expect(alertsFor([ended("a"), ended("b")], "a")).toEqual([ended("b")]);
  });
});
