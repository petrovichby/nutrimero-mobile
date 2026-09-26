import type { ConfigContext } from "expo/config";
import { afterEach, describe, expect, it, vi } from "vitest";
import config from "../app.config";
import pkg from "../package.json";
import source from "../version.json";
import { bump, isBuildNumber, isSemver } from "./version.mjs";

const context: ConfigContext = {
  projectRoot: ".",
  staticConfigPath: null,
  packageJsonPath: null,
  config: {},
};

describe("the local version source (docs/RELEASING.md)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is a semver version and a positive integer build number", () => {
    expect(isSemver(source.version)).toBe(true);
    expect(isBuildNumber(source.build)).toBe(true);
    expect(pkg.version).toBe(source.version);
  });

  it("is what the config hands to both stores", () => {
    vi.stubEnv("EAS_BUILD_PROFILE", "development");
    const evaluated = config(context);
    expect(evaluated.version).toBe(source.version);
    expect(evaluated.ios?.buildNumber).toBe(String(source.build));
    expect(evaluated.android?.versionCode).toBe(source.build);
  });
});

describe("bump", () => {
  const current = { version: "1.4.2", build: 7 };

  it("always raises the build number, and semver only when asked", () => {
    expect(bump(current, "build")).toEqual({ version: "1.4.2", build: 8 });
    expect(bump(current, "patch")).toEqual({ version: "1.4.3", build: 8 });
    expect(bump(current, "minor")).toEqual({ version: "1.5.0", build: 8 });
    expect(bump(current, "major")).toEqual({ version: "2.0.0", build: 8 });
  });

  it("refuses a version that is not semver or a build number below 1", () => {
    expect(() => bump({ version: "1.4", build: 7 }, "build")).toThrow();
    expect(() => bump({ version: "1.4.2", build: 0 }, "build")).toThrow();
    expect(() => bump({ version: "1.4.2", build: 1.5 }, "build")).toThrow();
  });
});
