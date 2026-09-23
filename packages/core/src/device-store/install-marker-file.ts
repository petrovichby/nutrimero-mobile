import { File, Paths } from "expo-file-system";
import type { InstallMarker } from "./install-marker";

const MARKER_NAME = "nutrimero.install-marker";

/** The document-directory file ADR 0001 condition 3 names; removed by uninstall. */
export const fileInstallMarker: InstallMarker = {
  async exists() {
    return new File(Paths.document, MARKER_NAME).exists;
  },
  async write() {
    const marker = new File(Paths.document, MARKER_NAME);
    if (!marker.exists) {
      marker.create();
    }
  },
};
