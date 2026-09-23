import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * CONSTITUTION XII, MADE MECHANICAL.
 *
 * PORTED FROM nutrimero-web's `src/no-suppressions.test.ts` (itself a port of
 * nutrimero-api's `src/no-suppressions.spec.ts`, #34): the same walk, the same
 * comment reader, the same code reader. One rule in three repositories gets one
 * instrument shape. The differences are few and each is forced:
 *
 *   - the walk covers `apps/`, `packages/` and `scripts/`, because this is a
 *     monorepo and every workspace is under the quality gate;
 *   - `.todo(` joins the hollowed forms, because XII names it;
 *   - the denominator floor is the file count at port time (the web's 50 would
 *     fail a young repository for the wrong reason). Raise it as the tree grows;
 *     never lower it.
 *
 * It is not a substitute for the dual owner + coordinator sign-off. A marker
 * that has genuinely been approved arrives with that sign-off recorded in the
 * PR, and whoever exempts it edits this file deliberately and says so. What it
 * removes is the possibility of one arriving QUIETLY.
 *
 * THE PATTERNS ARE ASSEMBLED RATHER THAN SPELLED OUT, for the api's reason: a
 * scanner that names them literally is itself a file containing them, and a
 * scanner with an exemption for itself is one edit away from useless.
 */
const MARKERS = [
  ["biome", "ignore"].join("-"),
  `@${["ts", "expect", "error"].join("-")}`,
  `@${["ts", "ignore"].join("-")}`,
  `@${["ts", "nocheck"].join("-")}`,
];

/** Hollowed tests: skipped, focused, placeholder, or marked as expected-to-fail. */
const HOLLOWED = ["skip", "only", "fixme", "todo"].flatMap((word) =>
  ["it", "test", "describe"].map((runner) => `${runner}.${word}(`),
);

/**
 * Silencing casts: a cast that makes the compiler assert something
 * the value is not.
 */
const CASTS: [label: string, pattern: RegExp][] = [
  ["as", "unknown", "as"],
  ["as", "any"],
].map((words) => [words.join(" "), new RegExp(`\\b${words.join("\\s+")}\\b`)]);

/**
 * The comment text of a file, and nothing else — the api's reader, unchanged.
 *
 * A marker only suppresses anything when the compiler or the linter reads it
 * as a comment, so a marker held as a scanner's subject (in a string or a
 * regex) is not an offence, and prose ABOUT a cast is not a cast.
 */
function commentsOf(source: string): string {
  const out: string[] = [];
  let inBlock = false;
  for (const line of source.split("\n")) {
    if (inBlock) {
      const close = line.indexOf("*/");
      out.push(close === -1 ? line : line.slice(0, close));
      if (close !== -1) inBlock = false;
      continue;
    }
    const block = line.indexOf("/*");
    const inline = line.indexOf("//");
    if (block !== -1 && (inline === -1 || block < inline)) {
      const close = line.indexOf("*/", block + 2);
      if (close === -1) {
        out.push(line.slice(block));
        inBlock = true;
      } else {
        out.push(line.slice(block, close));
      }
      continue;
    }
    if (inline !== -1) out.push(line.slice(inline));
  }
  return out.join("\n");
}

/**
 * The complement: a file's code with its comments removed.
 *
 * WHY A CAST NEEDS THE OTHER HALF. A marker is live only as a comment; a cast
 * is live only as code. The comment reader above cannot see a cast at all, and
 * a raw-text check convicts every comment that explains why a cast was
 * removed. So each pattern is read where it can actually do something.
 */
function codeOf(source: string): string {
  const out: string[] = [];
  let inBlock = false;
  for (const line of source.split("\n")) {
    let rest = line;
    let kept = "";
    while (rest.length > 0) {
      if (inBlock) {
        const close = rest.indexOf("*/");
        if (close === -1) break;
        rest = rest.slice(close + 2);
        inBlock = false;
        continue;
      }
      const block = rest.indexOf("/*");
      const inline = rest.indexOf("//");
      if (inline !== -1 && (block === -1 || inline < block)) {
        kept += rest.slice(0, inline);
        break;
      }
      if (block === -1) {
        kept += rest;
        break;
      }
      kept += rest.slice(0, block);
      rest = rest.slice(block + 2);
      inBlock = true;
    }
    out.push(kept);
  }
  return out.join("\n");
}

function sourceFiles(root: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(root)) {
    if (SKIPPED_DIRS.has(entry) || entry.startsWith(".")) continue;
    const full = path.join(root, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.(ts|tsx|mts|mjs|js)$/.test(full) && !full.endsWith(".d.ts")) out.push(full);
  }
  return out;
}

/** Build output and installed code are not ours to police. */
const SKIPPED_DIRS = new Set(["node_modules", "dist", "coverage"]);

const ROOT = path.resolve(__dirname, "..");

/** Files at port time (2026-09-23): 11. Raise with the tree; never lower. */
const DENOMINATOR_FLOOR = 11;

describe("Constitution XII: the tree carries no suppression", () => {
  // Every workspace under the quality gate, and the scripts that run beside them.
  const files = ["apps", "packages", "scripts"].flatMap((dir) => sourceFiles(path.join(ROOT, dir)));
  const relative = (file: string) => path.relative(ROOT, file);

  it("finds files to check, so a broken walk cannot pass this vacuously", () => {
    expect(files.length).toBeGreaterThanOrEqual(DENOMINATOR_FLOOR);
  });

  it("carries no suppression marker", () => {
    const offenders: string[] = [];
    for (const file of files) {
      if (file === __filename) continue;
      const comments = commentsOf(readFileSync(file, "utf8"));
      for (const marker of MARKERS) {
        if (comments.includes(marker)) offenders.push(`${relative(file)}: ${marker}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("carries no skipped, focused, todo or fixme test", () => {
    const offenders: string[] = [];
    for (const file of files) {
      if (file === __filename) continue;
      const source = readFileSync(file, "utf8");
      for (const form of HOLLOWED) {
        if (source.includes(form)) offenders.push(`${relative(file)}: ${form}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("carries no silencing cast", () => {
    const offenders: string[] = [];
    for (const file of files) {
      if (file === __filename) continue;
      const code = codeOf(readFileSync(file, "utf8")).split("\n");
      code.forEach((line, index) => {
        for (const [label, pattern] of CASTS) {
          if (pattern.test(line)) offenders.push(`${relative(file)}:${index + 1}: ${label}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });
});
