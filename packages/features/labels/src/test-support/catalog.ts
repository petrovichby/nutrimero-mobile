import { messages } from "@nutrimero/core";

/** True when `key` (e.g. "labels.gap.kind.not_recorded") names a string in the en catalog. */
export function hasEnKey(key: string): boolean {
  let node: unknown = messages.en;
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null || !(part in node)) {
      return false;
    }
    node = Reflect.get(node, part);
  }
  return typeof node === "string";
}
