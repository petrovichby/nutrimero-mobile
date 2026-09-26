import type { ConfigContext } from "expo/config";
import { afterEach, describe, expect, it, vi } from "vitest";
import config, { assertReleasable } from "../app.config";

const context: ConfigContext = {
  projectRoot: ".",
  staticConfigPath: null,
  packageJsonPath: null,
  config: {},
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
