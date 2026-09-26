/**
 * Pro Baker's version, kept locally in apps/pro-baker/version.json (eas.json
 * `appVersionSource: "local"`): a semver `version` for the stores' marketing version, and one
 * `build` number that app.config.ts writes to both ios.buildNumber and android.versionCode.
 * The build number starts at 1 and only ever rises (docs/RELEASING.md).
 */

export interface AppVersion {
  readonly version: string;
  readonly build: number;
}

export const BUMP_KINDS = ["build", "patch", "minor", "major"] as const;
export type BumpKind = (typeof BUMP_KINDS)[number];

const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function isSemver(version: string): boolean {
  return SEMVER.test(version);
}

export function isBuildNumber(build: unknown): build is number {
  return typeof build === "number" && Number.isSafeInteger(build) && build >= 1;
}

export function isBumpKind(kind: string): kind is BumpKind {
  return (BUMP_KINDS as readonly string[]).includes(kind);
}

/** The next version: the build number always rises by one; semver rises only when asked. */
export function bump(current: AppVersion, kind: BumpKind): AppVersion {
  const parts = SEMVER.exec(current.version);
  if (!parts || !isBuildNumber(current.build)) {
    throw new Error(`Not a valid version: ${JSON.stringify(current)}`);
  }
  const [major, minor, patch] = parts.slice(1).map(Number) as [number, number, number];
  const version =
    kind === "major"
      ? `${major + 1}.0.0`
      : kind === "minor"
        ? `${major}.${minor + 1}.0`
        : kind === "patch"
          ? `${major}.${minor}.${patch + 1}`
          : current.version;
  return { version, build: current.build + 1 };
}
