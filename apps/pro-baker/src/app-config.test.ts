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

  it("refuses the store profile while entitlements are the stub", () => {
    expect(() => assertReleasable("store", "stub")).toThrow(/Store build refused/);
  });

  it("allows internal and development builds, and a store build once the source is the server", () => {
    expect(() => assertReleasable("internal", "stub")).not.toThrow();
    expect(() => assertReleasable(undefined, "stub")).not.toThrow();
    expect(() => assertReleasable("store", "server")).not.toThrow();
  });

  it("the real config fails to evaluate under the store profile today", () => {
    vi.stubEnv("EAS_BUILD_PROFILE", "store");
    expect(() => config(context)).toThrow(/Store build refused/);
  });

  it("evaluates otherwise, with Android backup off", () => {
    vi.stubEnv("EAS_BUILD_PROFILE", "internal");
    const evaluated = config(context);
    expect(evaluated.android?.allowBackup).toBe(false);
    expect(evaluated.ios?.bundleIdentifier).toBe("org.nutrimero.probaker");
  });
});
