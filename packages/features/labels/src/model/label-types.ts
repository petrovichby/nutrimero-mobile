import type { Message } from "./gap-sentence";
import type { RuleSet, RuleSetList } from "./types";

/** Label types a baker can choose: active and offered (background rule-sets are not offered). */
export function offeredLabelTypes(list: RuleSetList): readonly RuleSet[] {
  return list.items.filter((item) => item.status === "active" && item.availability === "offered");
}

/**
 * FR-025: display names come from the app catalogs keyed by rule-set id (the api serves names in
 * en-US only); a rule-set the catalogs do not know falls back to the api's own name.
 */
export function labelTypeName(
  ruleSet: Pick<RuleSet, "id" | "name">,
  hasKey: (key: string) => boolean,
): { readonly message: Message } | { readonly apiName: string } {
  const key = `labels.labelType.${ruleSet.id}`;
  return hasKey(key) ? { message: { key, params: {} } } : { apiName: ruleSet.name ?? ruleSet.id };
}
