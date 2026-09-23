import { describe, expect, it } from "vitest";
import { createApiClient } from "../api/client";
import { createMemoryAdapter } from "../device-store/adapter";
import { createMemoryMarker } from "../device-store/install-marker";
import { BASE_URL, createFakeApi, json } from "../test-support/fake-api";
import { SESSION_KEYS } from "./keys";
import { createSession } from "./session";

const LANGUAGE = "nutrimero.device.uiLocale";
const SIGNED_IN = {
  [SESSION_KEYS.accessToken]: "access",
  [SESSION_KEYS.refreshToken]: "refresh",
  [SESSION_KEYS.userId]: "00000000-0000-4000-8000-00000000000a",
};

function setUp(stored: Record<string, string>, markerPresent: boolean) {
  const api = createFakeApi({ "POST /api/v1/auth/logout": () => json(204, undefined) });
  const store = createMemoryAdapter(stored);
  const marker = createMemoryMarker(markerPresent);
  const session = createSession({
    client: createApiClient(BASE_URL, { fetch: api.fetch }),
    store,
    marker,
  });
  session.registerFreshInstallOnlyKey(LANGUAGE);
  return { store, marker, session };
}

describe("a fresh-install-only key through the session (001 FR-027)", () => {
  it("survives sign-out", async () => {
    const { store, session } = setUp({ ...SIGNED_IN, [LANGUAGE]: '"uk"' }, true);
    await session.restore();
    await session.signOut();
    expect(store.snapshot()).toEqual({ [LANGUAGE]: '"uk"' });
  });

  it("survives a resumed wipe", async () => {
    const { store, session } = setUp({ [SESSION_KEYS.pendingWipe]: "1", [LANGUAGE]: '"uk"' }, true);
    await session.restore();
    expect(store.snapshot()).toEqual({ [LANGUAGE]: '"uk"' });
  });

  it("is cleared by the reinstall-orphan clear, before restore reads anything", async () => {
    const { store, marker, session } = setUp({ ...SIGNED_IN, [LANGUAGE]: '"uk"' }, false);
    expect((await session.restore()).status).toBe("signedOut");
    expect(store.snapshot()).toEqual({});
    expect(marker.present()).toBe(true);
  });

  it("refuses a key outside the store's alphabet", () => {
    const { session } = setUp({}, true);
    expect(() => session.registerFreshInstallOnlyKey("bad key")).toThrow();
  });
});
