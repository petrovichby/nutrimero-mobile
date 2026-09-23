/** ADR 0001 condition 6: the session layer's namespace in the shared device store. */
export const SESSION_KEYS = {
  accessToken: "nutrimero.session.accessToken",
  refreshToken: "nutrimero.session.refreshToken",
  userId: "nutrimero.session.userId",
  activeCompanyId: "nutrimero.session.activeCompanyId",
  pendingWipe: "nutrimero.session.pendingWipe",
} as const;

/** Everything the session owns and clears itself; `pendingWipe` is cleared last, separately. */
export const SESSION_OWN_KEYS: readonly string[] = [
  SESSION_KEYS.accessToken,
  SESSION_KEYS.refreshToken,
  SESSION_KEYS.userId,
  SESSION_KEYS.activeCompanyId,
];
