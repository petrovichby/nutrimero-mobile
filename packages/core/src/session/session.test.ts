import { describe, expect, it, vi } from "vitest";
import { createApiClient } from "../api/client";
import type { paths } from "../api/generated/schema";
import { createMemoryAdapter } from "../device-store/adapter";
import { createMemoryMarker } from "../device-store/install-marker";
import { BASE_URL, createFakeApi, errorBody, type Handler, json } from "../test-support/fake-api";
import { SESSION_KEYS } from "./keys";
import { createSession } from "./session";

type Me = paths["/api/v1/me"]["get"]["responses"][200]["content"]["application/json"];
type Tokens = paths["/api/v1/auth/login"]["post"]["responses"][200]["content"]["application/json"];

const ANNA = "00000000-0000-4000-8000-00000000000a";
const BORIS = "00000000-0000-4000-8000-00000000000b";
const BAKERY = "00000000-0000-4000-8000-0000000000c1";
const SECOND = "00000000-0000-4000-8000-0000000000c2";

function me(userId: string, companies: readonly string[]): Me {
  return {
    user: {
      id: userId,
      email: "baker@example.test",
      displayName: null,
      status: "active",
      preferences: { colorScheme: "system", language: null },
    },
    memberships: companies.map((companyId, index) => ({
      id: `00000000-0000-4000-8000-00000000010${index}`,
      companyId,
      companyName: `Bakery ${index}`,
      role: "viewer",
      status: "active",
    })),
  };
}

function tokens(suffix: string): Tokens {
  return {
    accessToken: `access-${suffix}`,
    refreshToken: `refresh-${suffix}`,
    expiresIn: 900,
    tokenType: "Bearer",
    preferences: { colorScheme: "system", language: null },
  };
}

function setup(
  routes: Record<string, Handler | Handler[]>,
  stored: Record<string, string> = {},
  markerPresent = true,
) {
  const api = createFakeApi(routes);
  const store = createMemoryAdapter(stored);
  const marker = createMemoryMarker(markerPresent);
  const session = createSession({
    client: createApiClient(BASE_URL, { fetch: api.fetch }),
    store,
    marker,
  });
  return { api, store, marker, session };
}

const signedInAs = (userId: string, company: string | null = BAKERY) => ({
  [SESSION_KEYS.accessToken]: "access-old",
  [SESSION_KEYS.refreshToken]: "refresh-old",
  [SESSION_KEYS.userId]: userId,
  ...(company === null ? {} : { [SESSION_KEYS.activeCompanyId]: company }),
});

describe("sign-in (FR-001, FR-001a)", () => {
  it("reads identity with the new token in memory, then persists and picks the only bakery", async () => {
    const { api, store, session } = setup({
      "POST /api/v1/auth/login": () => json(200, tokens("1")),
      "GET /api/v1/me": () => json(200, me(ANNA, [BAKERY])),
    });
    const result = await session.signIn("baker@example.test", "pw");

    expect(result).toEqual({
      ok: true,
      state: { status: "signedIn", userId: ANNA, activeCompanyId: BAKERY },
    });
    expect(api.calls[1]?.authorization).toBe("Bearer access-1");
    expect(store.snapshot()).toEqual({
      [SESSION_KEYS.accessToken]: "access-1",
      [SESSION_KEYS.refreshToken]: "refresh-1",
      [SESSION_KEYS.userId]: ANNA,
      [SESSION_KEYS.activeCompanyId]: BAKERY,
    });
    expect(session.companyHeaders()).toEqual({ "X-Company-Id": BAKERY });
  });

  it("writes nothing to the device when identity cannot be read", async () => {
    const { store, session } = setup({
      "POST /api/v1/auth/login": () => json(200, tokens("1")),
      "GET /api/v1/me": () => json(500, errorBody("INTERNAL_ERROR")),
    });
    const result = await session.signIn("baker@example.test", "pw");
    expect(result.ok).toBe(false);
    expect(store.snapshot()).toEqual({});
    expect(session.state()).toEqual({ status: "signedOut" });
  });

  it("classifies a refused login and a missing network", async () => {
    const refused = setup({
      "POST /api/v1/auth/login": () => json(401, errorBody("AUTHENTICATION_FAILED")),
    });
    expect(await refused.session.signIn("a@b.test", "x")).toMatchObject({
      ok: false,
      error: { kind: "unauthorized", code: "AUTHENTICATION_FAILED" },
    });

    const offline = setup({
      "POST /api/v1/auth/login": () => {
        throw new TypeError("Network request failed");
      },
    });
    expect(await offline.session.signIn("a@b.test", "x")).toMatchObject({
      ok: false,
      error: { kind: "network" },
    });
  });

  it("the same person keeps device data and their chosen bakery", async () => {
    const { session } = setup(
      {
        "POST /api/v1/auth/login": () => json(200, tokens("2")),
        "GET /api/v1/me": () => json(200, me(ANNA, [BAKERY, SECOND])),
      },
      signedInAs(ANNA, SECOND),
    );
    const wiper = vi.fn(async () => undefined);
    session.registerWiper("pro.savedLabels", wiper);

    await session.signIn("baker@example.test", "pw");
    expect(wiper).not.toHaveBeenCalled();
    expect(session.state()).toEqual({ status: "signedIn", userId: ANNA, activeCompanyId: SECOND });
  });

  it("a different person wipes everything before anything is persisted for them", async () => {
    const { store, session } = setup(
      {
        "POST /api/v1/auth/login": () => json(200, tokens("boris")),
        "GET /api/v1/me": () => json(200, me(BORIS, [BAKERY, SECOND])),
      },
      signedInAs(ANNA),
    );
    const seen: Record<string, string>[] = [];
    session.registerWiper("pro.savedLabels", async () => {
      seen.push(store.snapshot());
    });

    await session.signIn("boris@example.test", "pw");
    // The wiper ran with Anna's session already gone and Boris's not yet written.
    expect(seen).toEqual([{ [SESSION_KEYS.pendingWipe]: "1" }]);
    // Two bakeries and no carried-over choice: Boris chooses.
    expect(session.state()).toEqual({ status: "signedIn", userId: BORIS, activeCompanyId: null });
    expect(() => session.companyHeaders()).toThrow();
  });

  it("no stored account counts as a different account (ADR 0002: restored backup)", async () => {
    const { session } = setup(
      {
        "POST /api/v1/auth/login": () => json(200, tokens("1")),
        "GET /api/v1/me": () => json(200, me(ANNA, [BAKERY])),
      },
      {},
    );
    const wiper = vi.fn(async () => undefined);
    session.registerWiper("pro.savedLabels", wiper);
    await session.signIn("baker@example.test", "pw");
    expect(wiper).toHaveBeenCalledOnce();
  });

  it("refuses to sign in over an incomplete wipe", async () => {
    const { store, session } = setup(
      {
        "POST /api/v1/auth/login": () => json(200, tokens("boris")),
        "GET /api/v1/me": () => json(200, me(BORIS, [BAKERY])),
      },
      signedInAs(ANNA),
    );
    session.registerWiper("pro.savedLabels", async () => {
      throw new Error("locked");
    });
    expect(await session.signIn("boris@example.test", "pw")).toEqual({
      ok: false,
      error: { kind: "wipeIncomplete", failed: ["pro.savedLabels"] },
    });
    expect(await store.get(SESSION_KEYS.accessToken)).toBeNull();
    expect(await store.get(SESSION_KEYS.pendingWipe)).toBe("1");
  });
});

describe("restore at launch (ADR 0001 condition 3, plan R10)", () => {
  it("clears orphaned keys on a fresh install before reading them", async () => {
    const { session, marker, store } = setup({}, signedInAs(ANNA), false);
    const wiper = vi.fn(async () => undefined);
    session.registerWiper("home.deviceData", wiper);

    expect(await session.restore()).toEqual({ status: "signedOut" });
    expect(wiper).toHaveBeenCalledOnce();
    expect(marker.present()).toBe(true);
    expect(store.snapshot()).toEqual({});
  });

  it("resumes a wipe left pending by a crash", async () => {
    const { session } = setup({}, { ...signedInAs(ANNA), [SESSION_KEYS.pendingWipe]: "1" });
    const wiper = vi.fn(async () => undefined);
    session.registerWiper("pro.savedLabels", wiper);
    expect(await session.restore()).toEqual({ status: "signedOut" });
    expect(wiper).toHaveBeenCalledOnce();
  });

  it("restores a stored session, or an expired one when only the person remains", async () => {
    const live = setup({}, signedInAs(ANNA));
    expect(await live.session.restore()).toEqual({
      status: "signedIn",
      userId: ANNA,
      activeCompanyId: BAKERY,
    });
    expect(live.session.accessToken()).toBe("access-old");

    const expired = setup({}, { [SESSION_KEYS.userId]: ANNA });
    expect(await expired.session.restore()).toEqual({ status: "expired", userId: ANNA });
  });
});

describe("sign-out (FR-022)", () => {
  it("wipes locally even when the server cannot be reached", async () => {
    const { api, store, session } = setup(
      {
        "POST /api/v1/auth/logout": () => {
          throw new TypeError("offline");
        },
      },
      signedInAs(ANNA),
    );
    await session.restore();
    const wiper = vi.fn(async () => undefined);
    session.registerWiper("pro.savedLabels", wiper);

    await session.signOut();
    expect(wiper).toHaveBeenCalledOnce();
    expect(store.snapshot()).toEqual({});
    expect(session.state()).toEqual({ status: "signedOut" });
    await vi.waitFor(() => expect(api.calls).toHaveLength(1));
    expect(api.calls[0]?.body).toEqual({ refreshToken: "refresh-old" });
  });
});

describe("token refresh", () => {
  it("is single-flight and persists the rotated pair", async () => {
    const { api, store, session } = setup(
      { "POST /api/v1/auth/refresh": () => json(200, tokens("rotated")) },
      signedInAs(ANNA),
    );
    await session.restore();
    const [a, b] = await Promise.all([session.refreshTokens(), session.refreshTokens()]);
    expect([a, b]).toEqual([true, true]);
    expect(api.calls).toHaveLength(1);
    expect(await store.get(SESSION_KEYS.refreshToken)).toBe("refresh-rotated");
    expect(session.accessToken()).toBe("access-rotated");
  });

  it("a spent refresh token expires the session but keeps the person", async () => {
    const { store, session } = setup(
      { "POST /api/v1/auth/refresh": () => json(401, errorBody("REFRESH_TOKEN_INVALID")) },
      signedInAs(ANNA),
    );
    await session.restore();
    expect(await session.refreshTokens()).toBe(false);
    expect(session.state()).toEqual({ status: "expired", userId: ANNA });
    expect(await store.get(SESSION_KEYS.userId)).toBe(ANNA);
    expect(await store.get(SESSION_KEYS.accessToken)).toBeNull();
  });

  it("offline is not an expiry", async () => {
    const { session } = setup(
      {
        "POST /api/v1/auth/refresh": () => {
          throw new TypeError("offline");
        },
      },
      signedInAs(ANNA),
    );
    await session.restore();
    expect(await session.refreshTokens()).toBe(false);
    expect(session.state().status).toBe("signedIn");
  });
});

describe("bakeries and membership loss (FR-002, FR-022)", () => {
  it("reports every bakery no longer held, and drops the active one", async () => {
    const { session } = setup(
      {
        "POST /api/v1/auth/login": () => json(200, tokens("1")),
        "GET /api/v1/me": [
          () => json(200, me(ANNA, [BAKERY, SECOND])),
          () => json(200, me(ANNA, [SECOND])),
        ],
      },
      signedInAs(ANNA),
    );
    await session.signIn("baker@example.test", "pw");
    const lost: unknown[] = [];
    session.onMembershipLost((event) => {
      lost.push(event);
    });

    expect(await session.refreshMemberships()).toEqual({ ok: true });
    expect(lost).toEqual([{ companyId: BAKERY, reason: "membershipLost" }]);
    expect(session.state()).toEqual({ status: "signedIn", userId: ANNA, activeCompanyId: null });
    expect(session.memberships().map((m) => m.companyId)).toEqual([SECOND]);
  });

  it("an archived bakery reported by a read is lost the same way", async () => {
    const { session } = setup({}, signedInAs(ANNA));
    await session.restore();
    const lost: unknown[] = [];
    session.onMembershipLost((event) => {
      lost.push(event);
    });
    await session.reportCompanyUnavailable(BAKERY, "archived");
    expect(lost).toEqual([{ companyId: BAKERY, reason: "archived" }]);
    expect(session.state()).toMatchObject({ activeCompanyId: null });
  });

  it("only an active membership can be chosen", async () => {
    const { session } = setup({
      "POST /api/v1/auth/login": () => json(200, tokens("1")),
      "GET /api/v1/me": () => json(200, me(ANNA, [BAKERY, SECOND])),
    });
    await session.signIn("baker@example.test", "pw");
    await session.chooseCompany(SECOND);
    expect(session.companyHeaders()).toEqual({ "X-Company-Id": SECOND });
    await expect(session.chooseCompany("00000000-0000-4000-8000-0000000000ff")).rejects.toThrow();
  });
});
