/**
 * 002 contracts/api-consumption.md — the pinned facts. Most are type-level: `tsc` (the typecheck
 * gate) fails when the regenerated contract changes one of them, so an api change surfaces in CI
 * through the drift gate, never through a user. P5 (every error code classified) is enforced by
 * the exhaustive `Record` in errors.ts.
 */
import { describe, expectTypeOf, it } from "vitest";
import type { paths } from "./generated/schema";

type Ok<P extends keyof paths, M extends "get" | "post"> = paths[P][M] extends {
  responses: { 200: { content: { "application/json": infer Body } } };
}
  ? Body
  : never;

/** A key that is a literal name, not an index signature (`Record<string, …>` names nothing). */
type Literal<K> = K extends string ? (string extends K ? never : K) : never;

/** Every literal property name reachable anywhere inside T. */
type DeepKeys<T> = T extends readonly (infer Item)[]
  ? DeepKeys<Item>
  : T extends object
    ? { [K in keyof T]-?: Literal<K> | DeepKeys<T[K]> }[keyof T]
    : never;

type Label = Ok<"/api/v1/products/{id}/labels/{ruleSetId}", "get">;
type IssuedList = Ok<"/api/v1/products/{id}/labels/{ruleSetId}/issued", "get">;
type IssuedOne = Ok<"/api/v1/issued-labels/{issuedId}", "get">;

type DeskReads =
  | Ok<"/api/v1/fid/declaration-rule-sets", "get">
  | Ok<"/api/v1/products", "get">
  | Ok<"/api/v1/declarations", "get">
  | Ok<"/api/v1/products/{id}/declarations", "get">
  | Label
  | IssuedList
  | IssuedOne;

describe("pinned contract facts", () => {
  it("P1: the label language is a free string (no enum yet — FR-011 stays bundled data)", () => {
    type Query = NonNullable<
      paths["/api/v1/products/{id}/labels/{ruleSetId}"]["get"]["parameters"]["query"]
    >;
    expectTypeOf<Query["language"]>().toEqualTypeOf<string | undefined>();
  });

  it("P2: no response the desk reads carries the declarations toggle (FR-003)", () => {
    expectTypeOf<
      "declarationsEnabled" extends DeepKeys<DeskReads> ? true : false
    >().toEqualTypeOf<false>();
    expectTypeOf<
      "declarations_enabled" extends DeepKeys<DeskReads> ? true : false
    >().toEqualTypeOf<false>();
  });

  it("P3: only the single issued-label read carries the match verdict", () => {
    expectTypeOf<IssuedOne>().toHaveProperty("differsFromCurrent");
    expectTypeOf<
      "differsFromCurrent" extends DeepKeys<IssuedList> ? true : false
    >().toEqualTypeOf<false>();
  });

  it("P4: a rendering names its gaps and may have no engine, rather than failing", () => {
    expectTypeOf<Label>().toHaveProperty("gaps");
    expectTypeOf<null>().toMatchTypeOf<Label["engine"]>();
  });
});
