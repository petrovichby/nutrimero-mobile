import { readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * 005 FR-013 (owner's F27 decision), made mechanical: the Home app never requests exact alarms.
 * Android 12+ grants exact scheduling only with SCHEDULE_EXACT_ALARM / USE_EXACT_ALARM; without them
 * DATE triggers are inexact, which is what the app's help text states.
 *
 * Two sources can add a permission to the built manifest: the app config, and a library's own
 * manifest or config plugin. So: the app config must not request either permission, and wherever
 * expo-notifications itself declares one, the app config must strip it with
 * `android.blockedPermissions` (gate 2 ruling). This test is the proof either way.
 */
const FORBIDDEN = ["android.permission.SCHEDULE_EXACT_ALARM", "android.permission.USE_EXACT_ALARM"];

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(path.join(root, "packages/features/timers/package.json"));
const notificationsRoot = path.dirname(require.resolve("expo-notifications/package.json"));

function filesUnder(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const full = path.join(directory, entry);
    return statSync(full).isDirectory() ? filesUnder(full) : [full];
  });
}

const librarySources = [
  ...filesUnder(path.join(notificationsRoot, "android", "src", "main")).filter((file) =>
    file.endsWith("AndroidManifest.xml"),
  ),
  ...filesUnder(path.join(notificationsRoot, "plugin", "build")).filter((file) =>
    file.endsWith(".js"),
  ),
];

const appConfig = JSON.parse(readFileSync(path.join(root, "apps/home-baker/app.json"), "utf8"));
const android = appConfig.expo?.android ?? {};
const requested: string[] = android.permissions ?? [];
const blocked: string[] = android.blockedPermissions ?? [];

describe("no exact alarms in the Home app (005 FR-013)", () => {
  it("reads the library sources it guards", () => {
    expect(librarySources.length).toBeGreaterThan(0);
  });

  it("the app config never requests an exact-alarm permission", () => {
    for (const permission of FORBIDDEN) {
      const short = permission.replace("android.permission.", "");
      expect(requested).not.toContain(permission);
      expect(requested).not.toContain(short);
    }
  });

  it("any exact-alarm permission expo-notifications declares is blocked by the app config", () => {
    for (const permission of FORBIDDEN) {
      const short = permission.replace("android.permission.", "");
      const declared = librarySources.some((file) => readFileSync(file, "utf8").includes(short));
      if (declared) {
        expect(blocked.includes(permission) || blocked.includes(short)).toBe(true);
      }
    }
  });
});
