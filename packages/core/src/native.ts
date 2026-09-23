/**
 * `@nutrimero/core/native` — the platform adapters, which import native Expo modules and so
 * cannot load under Node. Apps import them from here at their composition root; everything
 * else, tests included, imports the Node-loadable main entry.
 */
export { fileInstallMarker } from "./device-store/install-marker-file";
export { secureStoreAdapter } from "./device-store/secure-store-adapter";
