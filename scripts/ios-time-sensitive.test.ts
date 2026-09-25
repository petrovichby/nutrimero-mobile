import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * 005 FR-010b (owner, 2026-09-25), made mechanical: timer notifications are Time Sensitive on iOS.
 * That takes both halves — the entitlement in the app config (without it iOS silently downgrades
 * the level) and the level on every scheduled request.
 */
const root = path.resolve(import.meta.dirname, "..");
const appConfig = JSON.parse(readFileSync(path.join(root, "apps/home-baker/app.json"), "utf8"));
const scheduler = readFileSync(
  path.join(root, "packages/features/timers/src/native/scheduler.ts"),
  "utf8",
);

describe("timer notifications are Time Sensitive on iOS (FR-010b)", () => {
  it("the Home app declares the Time Sensitive entitlement", () => {
    expect(
      appConfig.expo?.ios?.entitlements?.["com.apple.developer.usernotifications.time-sensitive"],
    ).toBe(true);
  });

  it("the scheduler asks for the time-sensitive level, and never for critical alerts", () => {
    expect(scheduler).toContain('interruptionLevel: "timeSensitive"');
    expect(scheduler).not.toContain('"critical"');
  });
});
