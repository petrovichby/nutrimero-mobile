import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * ADR 0001 condition 3, read from source (boot.ts loads native modules, so it cannot be imported
 * here): every data wiper in Home Baker's boot is registered before `session.restore()`, so the
 * reinstall-orphan clear reaches it. The composition itself is tested in
 * apps/home-baker/src/boot-timers.test.ts.
 */
const boot = readFileSync(
  path.resolve(import.meta.dirname, "../apps/home-baker/src/boot.ts"),
  "utf8",
);

describe("Home Baker boot order", () => {
  it.each(["registerHomeWiper(session,", "registerTimersWiper(session,"])(
    "%s comes before session.restore()",
    (call) => {
      const registered = boot.indexOf(call);
      expect(registered).toBeGreaterThan(-1);
      expect(boot.indexOf("session.restore()")).toBeGreaterThan(registered);
    },
  );
});
