// The native half of @nutrimero/core: adapters that need React Native modules. Apps import these
// at wiring time; everything else imports the platform-free "@nutrimero/core".
export { fileInstallMarker } from "./device-store/install-marker-file";
export { secureStoreAdapter } from "./device-store/secure-store-adapter";
