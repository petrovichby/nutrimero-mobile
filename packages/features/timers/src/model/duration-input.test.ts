import { describe, expect, it } from "vitest";
import { split, stepped, typed } from "./duration-input";
import { MAX_SECONDS } from "./stage";

describe("New timer's duration input (17, b0dade59)", () => {
  it("splits a duration into hours, minutes and seconds", () => {
    expect(split(0)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    expect(split(3725)).toEqual({ hours: 1, minutes: 2, seconds: 5 });
  });

  it("steps each unit by one, rolling over and borrowing, inside 0 … 48 h", () => {
    expect(stepped(0, "minutes", 1)).toBe(60);
    expect(stepped(0, "seconds", 1)).toBe(1);
    expect(stepped(59 * 60, "minutes", 1)).toBe(3600);
    expect(stepped(3600, "minutes", -1)).toBe(59 * 60);
    expect(stepped(0, "hours", -1)).toBe(0);
    expect(stepped(MAX_SECONDS, "seconds", 1)).toBe(MAX_SECONDS);
  });

  it("takes typed digits for one unit, caps minutes and seconds at 59 and the whole at 48 h", () => {
    expect(typed(0, "minutes", "2")).toBe(120);
    expect(typed(120, "seconds", "30")).toBe(150);
    expect(typed(0, "minutes", "75")).toBe(59 * 60);
    expect(typed(0, "hours", "99")).toBe(MAX_SECONDS);
    expect(typed(3725, "hours", "")).toBe(125);
    expect(typed(0, "seconds", "4a")).toBe(4);
  });
});
