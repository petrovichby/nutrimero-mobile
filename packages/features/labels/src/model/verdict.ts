import type { IssuedLabel } from "./types";

/**
 * FR-017 / plan R8: the match verdict is the api's `differsFromCurrent`, from a read made while
 * viewing. It lives in component state only — the saved-label store has no field for it — and
 * offline it reads "needs a connection", never a verdict carried over.
 */
export type Verdict =
  | {
      readonly state: "matches" | "differs";
      readonly checkedAt: string;
      /** True when the response had no `Date` header and the device clock was used. */
      readonly deviceTime: boolean;
    }
  | { readonly state: "needsConnection" };

export function verdictOf(
  read: { readonly label: IssuedLabel; readonly serverDate: string | null } | null,
  now: () => Date = () => new Date(),
): Verdict {
  if (read === null) {
    return { state: "needsConnection" };
  }
  const deviceTime = read.serverDate === null;
  const checkedAt = new Date(read.serverDate ?? now().toUTCString()).toISOString();
  return {
    state: read.label.differsFromCurrent ? "differs" : "matches",
    checkedAt,
    deviceTime,
  };
}
