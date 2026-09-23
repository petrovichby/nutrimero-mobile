import sourceFile from "./source.json";

/** What the server says about a plan (Constitution VII): the app renders it, never decides it. */
export type EntitlementAnswer = "included" | "not_included" | "unavailable";

/** Pro plans are per bakery (IDEATION §5.3); Home plans are per person (§7). */
export type EntitlementSubject =
  | { readonly kind: "company"; readonly companyId: string }
  | { readonly kind: "user"; readonly userId: string };

export interface EntitlementPort {
  answer(subject: EntitlementSubject, feature: string): Promise<EntitlementAnswer>;
}

export type EntitlementSource = "stub" | "server";

/**
 * `stub` until the api serves entitlements (ask B8). The Pro store build profile refuses to
 * evaluate its config while this reads `stub` (002 G2-Q1): the release block is mechanical.
 * The value lives in `source.json` so the build-time config can read it without TypeScript.
 */
export const ENTITLEMENT_SOURCE: EntitlementSource =
  sourceFile.source === "server" ? "server" : "stub";

/** The only implementation until B8: there is no server answer, so it says so. */
export const stubEntitlementPort: EntitlementPort = {
  async answer() {
    return "unavailable";
  },
};
