import type { NutritionSection, Rendering, Run } from "./types";

/**
 * The preview's view of an api rendering (FR-010, FR-013, FR-014). Runs are passed through
 * untouched — never joined, reordered, translated, re-rounded or re-emphasised. Blocks mirror how
 * the api assembles `text`: the heading and the ingredient lines form one paragraph, a statement
 * forms another, and the nutrition table is structured rows outside `text`.
 */
export type Block =
  | { readonly kind: "ingredients"; readonly runs: readonly Run[] }
  | { readonly kind: "statement"; readonly runs: readonly Run[] }
  | { readonly kind: "nutrition"; readonly table: NutritionSection };

export interface RenderingView {
  readonly engine: Rendering["engine"];
  /** FR-013: a region without an engine shows that state and no text. */
  readonly noEngine: boolean;
  readonly blocks: readonly Block[];
}

export function renderingView(rendering: Rendering): RenderingView {
  const blocks: Block[] = [];
  let ingredients: Run[] | null = null;
  for (const section of rendering.sections) {
    // The contract types heading, lines and statement as one variant, so narrow on `runs`.
    if (!("runs" in section)) {
      blocks.push({ kind: "nutrition", table: section });
    } else if (section.kind === "statement") {
      blocks.push({ kind: "statement", runs: section.runs });
    } else {
      if (ingredients === null) {
        ingredients = [];
        blocks.push({ kind: "ingredients", runs: ingredients });
      }
      ingredients.push(...section.runs);
    }
  }
  return { engine: rendering.engine, noEngine: rendering.engine === null, blocks };
}

/**
 * The text the displayed blocks read as. It must equal the api's `text` exactly (SC-003); tests
 * hold it to that. Used for the accessibility label and copy — never as a replacement for runs.
 */
export function textOf(view: RenderingView): string {
  const paragraphs: string[] = [];
  for (const block of view.blocks) {
    if (block.kind !== "nutrition") {
      paragraphs.push(block.runs.map((run) => run.text).join(""));
    }
  }
  return paragraphs.join("\n");
}
