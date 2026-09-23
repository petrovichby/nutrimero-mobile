/** ADR 0001 condition 6: Home's namespace in the shared device store. */
export const HOME_KEYS = {
  units: "nutrimero.home.units",
  dietaryProfile: "nutrimero.home.dietaryProfile",
  pantrySeed: "nutrimero.home.pantrySeed",
  onboarding: "nutrimero.home.onboarding",
} as const;

export const HOME_OWN_KEYS: readonly string[] = Object.values(HOME_KEYS);

/** The name Home's wiper is registered under in the session's wipe sequence. */
export const HOME_WIPER_NAME = "home.deviceData";
