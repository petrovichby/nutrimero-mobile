import type { ConfigContext } from "expo/config";
import { afterEach, describe, expect, it, vi } from "vitest";
import config, { assertReleasable } from "../app.config";
import staticConfig from "../app.json";
import pkg from "../package.json";

// What Expo hands app.config.ts: app.json's `expo` object, the local version source.
const context: ConfigContext = {
  projectRoot: ".",
  staticConfigPath: null,
  packageJsonPath: null,
  config: staticConfig.expo,
};

describe("the store-release block (002 G2-Q1)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("refuses the production (store) profile while entitlements are the stub", () => {
    expect(() => assertReleasable("production", "stub")).toThrow(/Store build refused/);
  });

  it("allows development builds, and a production build once the source is the server", () => {
    expect(() => assertReleasable("development", "stub")).not.toThrow();
    expect(() => assertReleasable(undefined, "stub")).not.toThrow();
    expect(() => assertReleasable("production", "server")).not.toThrow();
  });

  it("the real config fails to evaluate under the production profile today", () => {
    vi.stubEnv("EAS_BUILD_PROFILE", "production");
    expect(() => config(context)).toThrow(/Store build refused/);
  });

  it("evaluates otherwise, with Android backup off", () => {
    vi.stubEnv("EAS_BUILD_PROFILE", "development");
    const evaluated = config(context);
    expect(evaluated.android?.allowBackup).toBe(false);
    expect(evaluated.ios?.bundleIdentifier).toBe("org.nutrimero.probaker");
  });
});

describe('the local version source (eas.json appVersionSource "local")', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("the config carries a semver version and one positive build number for both stores", () => {
    vi.stubEnv("EAS_BUILD_PROFILE", "development");
    const evaluated = config(context);
    expect(evaluated.version).toMatch(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
    const versionCode = evaluated.android?.versionCode;
    expect(Number.isSafeInteger(versionCode)).toBe(true);
    expect(versionCode).toBeGreaterThanOrEqual(1);
    expect(evaluated.ios?.buildNumber).toBe(String(versionCode));
  });

  it("the dynamic config keeps its own iOS and Android keys alongside the numbers", () => {
    vi.stubEnv("EAS_BUILD_PROFILE", "development");
    const evaluated = config(context);
    expect(evaluated.ios?.bundleIdentifier).toBe("org.nutrimero.probaker");
    expect(evaluated.android?.package).toBe("org.nutrimero.probaker");
    expect(evaluated.android?.allowBackup).toBe(false);
  });

  it("package.json carries the same version", () => {
    expect(pkg.version).toBe(staticConfig.expo.version);
  });
});
