/**
 * tokens-generate — packages/ui design tokens from the binding documents (Constitution X,
 * DESIGN.md 0.5.0 colors-note):
 *
 *   - docs/DESIGN.md frontmatter: colors-mobile, colors-home (Home Baker's own ramp),
 *     typography, rounded, spacing, touch-targets;
 *   - docs/design-sources/web-design.frontmatter.yaml: nutrimero-web's colors / colors-dark,
 *     which Pro Baker inherits verbatim (snapshot kept by `pnpm design:sync`).
 *
 * The output is written in the repository's Biome style, so the committed file can be compared
 * byte for byte with a fresh render (scripts/tokens-generate.test.ts — the drift gate).
 *
 * Usage: pnpm tokens:generate
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const OUTPUT = path.join(ROOT, "packages/ui/src/tokens.generated.ts");

type Value = string | number | boolean | readonly Value[] | { readonly [key: string]: Value };
type Tree = { readonly [key: string]: Value };

export interface Sources {
  readonly designMd: string;
  readonly webFrontmatter: string;
  readonly webSource: string;
}

export function readSources(root = ROOT): Sources {
  const read = (relative: string) => readFileSync(path.join(root, relative), "utf8");
  return {
    designMd: read("docs/DESIGN.md"),
    webFrontmatter: read("docs/design-sources/web-design.frontmatter.yaml"),
    webSource: read("docs/design-sources/SOURCE").trim(),
  };
}

function frontmatterOf(markdown: string): string {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(markdown);
  if (!match?.[1]) throw new Error("docs/DESIGN.md has no frontmatter");
  return match[1];
}

function isTree(value: unknown): value is Tree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function tree(value: unknown, name: string): Tree {
  if (!isTree(value)) throw new Error(`frontmatter "${name}" is missing or not a map`);
  return value;
}

const camel = (key: string) => key.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());

/** Kebab keys to camelCase, recursively; scalars unchanged. */
function camelTree(value: unknown): Value {
  if (Array.isArray(value)) return value.map(camelTree);
  if (isTree(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [camel(k), camelTree(v)]));
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  throw new Error(`unsupported frontmatter value: ${String(value)}`);
}

/** A typography role as React Native text style numbers (em letter-spacing → points). */
function textRole(role: Tree): Tree {
  const fontSize = Number(role.fontSize);
  const out: Record<string, Value> = { fontSize };
  if (role.fontWeight !== undefined) out.fontWeight = String(role.fontWeight);
  if (role.lineHeight !== undefined) out.lineHeight = Number(role.lineHeight);
  if (typeof role.letterSpacing === "string" && role.letterSpacing.endsWith("em")) {
    out.letterSpacing = Math.round(fontSize * Number.parseFloat(role.letterSpacing) * 100) / 100;
  }
  if (role.fontVariant !== undefined) out.fontVariant = [String(role.fontVariant)];
  return out;
}

export function buildTokens(sources: Sources): Tree {
  const design = tree(parse(frontmatterOf(sources.designMd)), "DESIGN.md");
  const web = tree(parse(sources.webFrontmatter), "web DESIGN.md");
  const typography = tree(design.typography, "typography");

  const roles: Record<string, Value> = {};
  const faces: Record<string, Value> = {};
  for (const [name, value] of Object.entries(typography)) {
    if (isTree(value) && "fontSize" in value) roles[camel(name)] = textRole(value);
    else if (name === "floor-mode-scale") roles.floorModeScale = Number(value);
    else faces[camel(name)] = camelTree(value);
  }

  return {
    pro: {
      light: camelTree(tree(web.colors, "web colors")),
      dark: camelTree(tree(web["colors-dark"], "web colors-dark")),
    },
    home: camelTree(tree(design["colors-home"], "colors-home")),
    mobile: camelTree(tree(design["colors-mobile"], "colors-mobile")),
    type: roles,
    faces,
    rounded: camelTree(tree(design.rounded, "rounded")),
    spacing: camelTree(tree(design.spacing, "spacing")),
    touchTargets: camelTree(tree(design["touch-targets"], "touch-targets")),
  };
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

/** Serializes in Biome's style: expanded objects, double quotes, trailing commas, 2-space indent. */
function literal(value: Value, depth: number): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `[${value.map((item) => literal(item, depth)).join(", ")}]`;
  const pad = "  ".repeat(depth + 1);
  const lines = Object.entries(value).map(
    ([key, item]) =>
      `${pad}${IDENTIFIER.test(key) ? key : JSON.stringify(key)}: ${literal(item, depth + 1)},`,
  );
  return `{\n${lines.join("\n")}\n${"  ".repeat(depth)}}`;
}

export function renderTokens(sources: Sources): string {
  const design = tree(parse(frontmatterOf(sources.designMd)), "DESIGN.md");
  const version = String(design.status ?? "").split(/\s/)[0];
  return `// GENERATED by scripts/tokens-generate.mts — DO NOT EDIT. A hand edit is a suppression-class
// violation (Constitution XII); change docs/DESIGN.md or run \`pnpm design:sync\`, then
// \`pnpm tokens:generate\`.
// Sources: docs/DESIGN.md ${version} frontmatter; ${sources.webSource}.
export const generatedTokens = ${literal(buildTokens(sources), 0)} as const;
`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(OUTPUT, renderTokens(readSources()));
  console.log(`✓ ${path.relative(ROOT, OUTPUT)}`);
}
