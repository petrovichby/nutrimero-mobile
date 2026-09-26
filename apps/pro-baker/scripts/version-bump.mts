/**
 * version-bump — raises Pro Baker's build number (always) and its semver (on request), writes
 * version.json and package.json, and commits the two files. Tagging is not done here: the
 * `pro-baker@<version>` tag goes on main at release (docs/RELEASING.md).
 *
 * Usage: pnpm --filter pro-baker version:bump [build|patch|minor|major]   (default: build)
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type AppVersion, BUMP_KINDS, bump, isBumpKind } from "../src/version.mts";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERSION_FILE = path.join(APP, "version.json");
const PACKAGE_FILE = path.join(APP, "package.json");

const kind = process.argv[2] ?? "build";
if (!isBumpKind(kind)) {
  console.error(`Unknown bump "${kind}". Use one of: ${BUMP_KINDS.join(", ")}.`);
  process.exit(1);
}

const git = (...args: string[]) => execFileSync("git", args, { cwd: APP, encoding: "utf8" });

if (git("status", "--porcelain", "--", VERSION_FILE, PACKAGE_FILE).trim() !== "") {
  console.error(
    "version.json or package.json has uncommitted changes; commit or discard them first.",
  );
  process.exit(1);
}

const current = JSON.parse(readFileSync(VERSION_FILE, "utf8")) as AppVersion;
const next = bump(current, kind);

writeFileSync(VERSION_FILE, `${JSON.stringify(next, null, 2)}\n`);
const pkg = JSON.parse(readFileSync(PACKAGE_FILE, "utf8")) as Record<string, unknown>;
writeFileSync(PACKAGE_FILE, `${JSON.stringify({ ...pkg, version: next.version }, null, 2)}\n`);

const message = `chore(pro-baker): version ${next.version} (build ${next.build})`;
git("commit", "--quiet", "-m", message, "--", VERSION_FILE, PACKAGE_FILE);
console.log(`${current.version} (build ${current.build}) → ${next.version} (build ${next.build})`);
console.log(`Committed: ${message}`);
