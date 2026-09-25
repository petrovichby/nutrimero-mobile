// Platform-free: importable from tests and Node scripts. The native adapters live in
// "@nutrimero/core/native" so nothing here pulls in React Native.
export type { ApiClient, ApiClientOptions } from "./api/client";
export { createApiClient } from "./api/client";
export type { ApiErrorCode, ClassifiedError, ErrorKind } from "./api/errors";
export { classifyResponseError, classifyThrown } from "./api/errors";
export type { components, paths } from "./api/generated/schema";
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
export {
  createDevicePreferences,
  DEVICE_PREFERENCE_KEYS,
  type DevicePreferences,
  registerDevicePreferences,
} from "./device-store/preferences";
export type {
  EntitlementAnswer,
  EntitlementPort,
  EntitlementSource,
  EntitlementSubject,
} from "./entitlements/entitlement";
export { ENTITLEMENT_SOURCE, stubEntitlementPort } from "./entitlements/entitlement";
export { FALLBACK_LOCALE, RENDERED_LOCALES, resolveLocale } from "./i18n/locale";
export { LOCALES, type Locale, type MessageCatalog, messages } from "./i18n/messages";
export {
  EXPECTED_PLURAL_CATEGORIES,
  type PluralCategoriesOf,
  pluralRuleMismatches,
} from "./i18n/plural";
export { createTranslator, type Translator } from "./i18n/translator";
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
export {
  celsiusFromFahrenheit,
  convertByFactor,
  fahrenheitFromCelsius,
  gramsFromOunces,
  ouncesFromGrams,
  roundToStep,
} from "./units/convert";
export { foldForSearch } from "./units/fold";
export {
  formatMeasure,
  formatMeasureRange,
  formatNumber,
  formatPoundsOunces,
  formatSpokenAmount,
  type MeasureKind,
} from "./units/format";
export { type FractionKind, type PracticalFraction, toPracticalFraction } from "./units/fraction";
export { parseAmount } from "./units/parse";
