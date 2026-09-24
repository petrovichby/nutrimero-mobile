// The native half of @nutrimero/core: adapters that need React Native modules. Apps import these
// at wiring time; everything else imports the platform-free "@nutrimero/core".
//
// FIRST: the forced Intl polyfills (ADR 0001). Importing this entry — which each app does first,
// before i18n starts — installs them as a side effect.
import "./intl-polyfill";

export { fileInstallMarker } from "./device-store/install-marker-file";
export { secureStoreAdapter } from "./device-store/secure-store-adapter";
