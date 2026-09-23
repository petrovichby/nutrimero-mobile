/**
 * ADR 0001 condition 3: Keychain items survive uninstall on iOS; a file in the app's document
 * directory does not. Its absence at launch means "fresh install" (or a restore to a device that
 * never ran us), and every key we own is cleared before any read.
 */
export interface InstallMarker {
  exists(): Promise<boolean>;
  write(): Promise<void>;
}

export function createMemoryMarker(present = false): InstallMarker & { present(): boolean } {
  let written = present;
  return {
    async exists() {
      return written;
    },
    async write() {
      written = true;
    },
    present() {
      return written;
    },
  };
}
