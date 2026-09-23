// Core's native-free modules by path; see home-store.test.ts.
import { createApiClient } from "@nutrimero/core/src/api/client";
import { createMemoryAdapter } from "@nutrimero/core/src/device-store/adapter";
import { createMemoryMarker } from "@nutrimero/core/src/device-store/install-marker";
import { SESSION_KEYS } from "@nutrimero/core/src/session/keys";
import { createSession } from "@nutrimero/core/src/session/session";
import { BASE_URL, createFakeApi, json } from "@nutrimero/core/src/test-support/fake-api";
import { describe, expect, it } from "vitest";
import { createHomeStore } from "./home-store";
import { HOME_KEYS } from "./keys";
import { registerHomeWiper } from "./register";

const HOME_DATA = {
  [HOME_KEYS.units]: '"imperial"',
  [HOME_KEYS.dietaryProfile]: '["nutAllergy"]',
  [HOME_KEYS.pantrySeed]: '["fid-1"]',
  [HOME_KEYS.onboarding]:
    '{"steps":{"units":"answered","diet":"answered","pantry":"answered"},"completed":true}',
};

function setUp(stored: Record<string, string>, markerPresent: boolean) {
  const api = createFakeApi({ "POST /api/v1/auth/logout": () => json(204, undefined) });
  const adapter = createMemoryAdapter(stored);
  const session = createSession({
    client: createApiClient(BASE_URL, { fetch: api.fetch }),
    store: adapter,
    marker: createMemoryMarker(markerPresent),
  });
  const home = createHomeStore(adapter);
  registerHomeWiper(session, home);
  return { api, adapter, session };
}

describe("Home's wiper in the session's wipe sequence", () => {
  it("is cleared by the reinstall-orphan clear when registered before restore()", async () => {
    // iOS Keychain survived the uninstall; the document-directory marker did not.
    const { adapter, session } = setUp(HOME_DATA, false);
    await session.restore();
    expect(adapter.snapshot()).toEqual({});
  });

  it("survives restore() on a known install", async () => {
    const { adapter, session } = setUp(HOME_DATA, true);
    await session.restore();
    expect(adapter.snapshot()).toEqual(HOME_DATA);
  });

  it("makes no api call on a signed-out launch (001: zero network requests)", async () => {
    const { api, session } = setUp(HOME_DATA, false);
    expect((await session.restore()).status).toBe("signedOut");
    expect(api.calls).toEqual([]);
  });

  it("is cleared on sign-out (FR-011)", async () => {
    const { adapter, session } = setUp(
      {
        ...HOME_DATA,
        [SESSION_KEYS.accessToken]: "a",
        [SESSION_KEYS.refreshToken]: "r",
        [SESSION_KEYS.userId]: "00000000-0000-4000-8000-00000000000a",
      },
      true,
    );
    await session.restore();
    await session.signOut();
    expect(adapter.snapshot()).toEqual({});
  });

  it("resumes an interrupted wipe on the next launch", async () => {
    const { adapter, session } = setUp({ ...HOME_DATA, [SESSION_KEYS.pendingWipe]: "1" }, true);
    await session.restore();
    expect(adapter.snapshot()).toEqual({});
  });
});
