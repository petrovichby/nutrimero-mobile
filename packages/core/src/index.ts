export type { ApiClient, ApiClientOptions } from "./api/client";
export { createApiClient } from "./api/client";
export type { ApiErrorCode, ClassifiedError, ErrorKind } from "./api/errors";
export { classifyResponseError, classifyThrown } from "./api/errors";
export type { DeviceStoreAdapter } from "./device-store/adapter";
export {
  assertValidKey,
  assertWithinBudget,
  createMemoryAdapter,
  utf8ByteLength,
  VALUE_BUDGET_BYTES,
} from "./device-store/adapter";
export type { WipeOutcome } from "./device-store/fresh-install";
export { ensureFreshInstallWiped } from "./device-store/fresh-install";
export type { InstallMarker } from "./device-store/install-marker";
export { createMemoryMarker } from "./device-store/install-marker";
export { fileInstallMarker } from "./device-store/install-marker-file";
export { secureStoreAdapter } from "./device-store/secure-store-adapter";
export type {
  EntitlementAnswer,
  EntitlementPort,
  EntitlementSource,
  EntitlementSubject,
} from "./entitlements/entitlement";
export { ENTITLEMENT_SOURCE, stubEntitlementPort } from "./entitlements/entitlement";
export { LOCALES, type Locale, type MessageCatalog, messages } from "./i18n/messages";
export { SESSION_KEYS } from "./session/keys";
export type {
  CompanyLossReason,
  Membership,
  MembershipLostListener,
  Session,
  SessionDeps,
  SessionError,
  SessionState,
  SignInResult,
} from "./session/session";
export { createSession } from "./session/session";
export type { Wiper, WipeSequence } from "./session/wipe";
