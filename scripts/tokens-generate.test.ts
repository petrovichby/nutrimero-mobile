import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildTokens, OUTPUT, readSources, renderTokens } from "./tokens-generate.mts";

describe("generated design tokens (Constitution X)", () => {
  const sources = readSources();

  it("the committed file is exactly what the sources render (drift gate)", () => {
    expect(readFileSync(OUTPUT, "utf8")).toBe(renderTokens(sources));
  });

  it("names its sources, including the web commit Pro Baker's ramp was taken at", () => {
    const header = renderTokens(sources).split("\n").slice(0, 4).join("\n");
    const version = /^status: (\S+)/m.exec(sources.designMd)?.[1];
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(header).toContain(`docs/DESIGN.md ${version} frontmatter`);
    expect(header).toMatch(/nutrimero-web [0-9a-f]{40}/);
    expect(header).toContain("DO NOT EDIT");
  });

  it("carries Home Baker's own ramp and Pro Baker's inherited one", () => {
    const tokens = buildTokens(sources);
    expect(tokens).toMatchObject({
      home: {
        fixed: { action: "#dfa621", onAction: "#251a02", structure: "#7a3520" },
        light: { heading: "#6d2f1b", focusRing: "#1d62ed" },
        dark: { surface: "#201510", allergen: { bg: "#6f2725", ink: "#ffd7d6" } },
      },
      pro: { light: { primary: "#1b1f58", secondary: "#b9bf05" }, dark: { primary: "#bdc1ff" } },
      mobile: { appAccentHome: "#dfa621", appAccentPro: "#1b1f58" },
    });
  });

  it("converts typography to React Native units", () => {
    const { type } = buildTokens(sources);
    expect(type).toMatchObject({
      headlineLg: { fontSize: 28, fontWeight: "700", lineHeight: 36, letterSpacing: -0.28 },
      dataMono: { fontVariant: ["tabular-nums"] },
    });
  });
});
