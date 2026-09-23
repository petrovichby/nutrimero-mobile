import { describe, expect, it } from "vitest";
import {
  counterCardDeDE,
  counterCardEnUS,
  noEngine,
  packagingEnUS,
} from "../test-support/fixtures";
import { renderingView, textOf } from "./rendering";

describe("the label preview view (FR-010, FR-013, SC-003)", () => {
  it.each([
    ["counter card de-DE", counterCardDeDE],
    ["counter card en-US", counterCardEnUS],
    ["packaging en-US", packagingEnUS],
  ])("%s: the displayed blocks read exactly as the api's text", (_, rendering) => {
    expect(textOf(renderingView(rendering))).toBe(rendering.text);
  });

  it("passes every run through untouched, emphasis included", () => {
    const view = renderingView(counterCardDeDE);
    const runs = view.blocks.flatMap((block) => (block.kind === "nutrition" ? [] : block.runs));
    const apiRuns = counterCardDeDE.sections.flatMap((section) =>
      "runs" in section ? section.runs : [],
    );
    expect(runs).toEqual(apiRuns);
    expect(runs.filter((run) => run.emphasis).length).toBeGreaterThan(0);
  });

  it("keeps the nutrition table as the api's structured rows, rounded and source figures intact", () => {
    const view = renderingView(packagingEnUS);
    const table = view.blocks.find((block) => block.kind === "nutrition");
    const apiTable = packagingEnUS.sections.find((section) => section.kind === "nutrition");
    expect(table?.kind === "nutrition" && table.table).toBe(apiTable);
  });

  it("groups heading and lines into one paragraph, as the api's text does", () => {
    expect(renderingView(packagingEnUS).blocks.map((block) => block.kind)).toEqual([
      "ingredients",
      "nutrition",
    ]);
    expect(renderingView(counterCardEnUS).blocks.map((block) => block.kind)).toEqual(["statement"]);
  });

  it("a region without an engine has no text and says so", () => {
    const view = renderingView(noEngine);
    expect(view.noEngine).toBe(true);
    expect(view.blocks).toEqual([]);
    expect(textOf(view)).toBe("");
  });
});
