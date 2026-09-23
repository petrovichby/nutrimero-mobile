import type { ApiClient } from "../api/client";
import { type ClassifiedError, classifyResponseError, classifyThrown } from "../api/errors";
import type { paths } from "../api/generated/schema";
import { createAuthMiddleware } from "../api/middleware";
import { assertValidKey, type DeviceStoreAdapter } from "../device-store/adapter";
import { ensureFreshInstallWiped } from "../device-store/fresh-install";
import type { InstallMarker } from "../device-store/install-marker";
import { SESSION_KEYS, SESSION_OWN_KEYS } from "./keys";
import { createWipeSequence, type Wiper } from "./wipe";

type MeResponse = paths["/api/v1/me"]["get"]["responses"][200]["content"]["application/json"];
export type Membership = MeResponse["memberships"][number];

export type SessionState =
  | { readonly status: "signedOut" }
  | {
      readonly status: "signedIn";
      readonly userId: string;
      readonly activeCompanyId: string | null;
    }
  | { readonly status: "expired"; readonly userId: string };

export type SessionError =
  | ClassifiedError
  | { readonly kind: "wipeIncomplete"; readonly failed: readonly string[] };

export type SignInResult =
  | { readonly ok: true; readonly state: SessionState }
  | { readonly ok: false; readonly error: SessionError };

export type CompanyLossReason = "archived" | "membershipLost";
export type MembershipLostListener = (event: {
  companyId: string;
  reason: CompanyLossReason;
}) => void | Promise<void>;

export interface Session {
  /** Launch: fresh-install clear → resume a pending wipe → load the stored session. Before any read. */
  restore(): Promise<SessionState>;
  signIn(email: string, password: string): Promise<SignInResult>;
  signOut(): Promise<void>;
  state(): SessionState;
  subscribe(listener: (state: SessionState) => void): () => void;
  memberships(): readonly Membership[];
  chooseCompany(companyId: string): Promise<void>;
  /** For every company-scoped call; the generated types require the header. */
  companyHeaders(): { "X-Company-Id": string };
  /** O4: re-reads memberships and reports every company no longer actively held. */
  refreshMemberships(): Promise<{ ok: true } | { ok: false; error: SessionError }>;
  /** Called by features on `companyArchived` / `membershipLost` errors from company reads. */
  reportCompanyUnavailable(companyId: string, reason: CompanyLossReason): Promise<void>;
  onMembershipLost(listener: MembershipLostListener): () => void;
  registerWiper(name: string, wiper: Wiper): () => void;
  /**
   * A device-preference key only the reinstall-orphan clear removes (ADR 0001 condition 3) —
   * never sign-out, erase or an app's own reset. Register at start-up, before `restore()`.
   */
  registerFreshInstallOnlyKey(key: string): () => void;
  /** Single-flight; true when a fresh access token is in place. */
  refreshTokens(): Promise<boolean>;
  accessToken(): string | null;
}

export interface SessionDeps {
  client: ApiClient;
  store: DeviceStoreAdapter;
  marker: InstallMarker;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export function createSession({ client, store, marker }: SessionDeps): Session {
  const wipe = createWipeSequence(store, SESSION_OWN_KEYS, SESSION_KEYS.pendingWipe);
  const freshInstallOnlyKeys = new Set<string>();
  const stateListeners = new Set<(state: SessionState) => void>();
  const lossListeners = new Set<MembershipLostListener>();

  let current: SessionState = { status: "signedOut" };
  let tokens: Tokens | null = null;
  let known: readonly Membership[] = [];
  let refreshing: Promise<boolean> | null = null;

  function setState(next: SessionState): void {
    current = next;
    for (const listener of stateListeners) {
      listener(next);
    }
  }

  async function persistTokens(next: Tokens): Promise<void> {
    tokens = next;
    await store.set(SESSION_KEYS.accessToken, next.accessToken);
    await store.set(SESSION_KEYS.refreshToken, next.refreshToken);
  }

  async function setActiveCompany(companyId: string | null): Promise<void> {
    if (companyId === null) {
      await store.delete(SESSION_KEYS.activeCompanyId);
    } else {
      await store.set(SESSION_KEYS.activeCompanyId, companyId);
    }
    if (current.status === "signedIn") {
      setState({ ...current, activeCompanyId: companyId });
    }
  }

  async function emitLoss(companyId: string, reason: CompanyLossReason): Promise<void> {
    for (const listener of lossListeners) {
      await listener({ companyId, reason });
    }
    if (current.status === "signedIn" && current.activeCompanyId === companyId) {
      await setActiveCompany(null);
    }
  }

  async function runWipe(): Promise<{ complete: boolean; failed: readonly string[] }> {
    const outcome = await wipe.run();
    tokens = null;
    known = [];
    setState({ status: "signedOut" });
    return outcome;
  }

  async function fetchMe(
    bearer?: string,
  ): Promise<{ ok: true; me: MeResponse } | { ok: false; error: ClassifiedError }> {
    try {
      const { data, error, response } = await client.GET("/api/v1/me", {
        headers: bearer === undefined ? undefined : { Authorization: `Bearer ${bearer}` },
      });
      if (data !== undefined) {
        return { ok: true, me: data };
      }
      return { ok: false, error: classifyResponseError(response.status, error) };
    } catch {
      return { ok: false, error: classifyThrown() };
    }
  }

  function activeMemberships(me: MeResponse): readonly Membership[] {
    return me.memberships.filter((membership) => membership.status === "active");
  }

  async function doRefresh(): Promise<boolean> {
    if (tokens === null) {
      return false;
    }
    try {
      const { data, response } = await client.POST("/api/v1/auth/refresh", {
        body: { refreshToken: tokens.refreshToken },
      });
      if (data !== undefined) {
        await persistTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        return true;
      }
      if (response.status === 401 && current.status === "signedIn") {
        // The refresh token is spent: the person must sign in again. `userId` and the active
        // company stay, so re-signing-in as the same person keeps saved data (spec edge case).
        tokens = null;
        await store.delete(SESSION_KEYS.accessToken);
        await store.delete(SESSION_KEYS.refreshToken);
        setState({ status: "expired", userId: current.userId });
      }
      return false;
    } catch {
      return false; // offline: not an expiry
    }
  }

  const session: Session = {
    async restore() {
      await ensureFreshInstallWiped(marker, () => wipe.run(), {
        store,
        keys: [...freshInstallOnlyKeys],
      });
      if (await wipe.isPending()) {
        await wipe.run();
      }
      const [accessToken, refreshToken, userId, activeCompanyId] = await Promise.all([
        store.get(SESSION_KEYS.accessToken),
        store.get(SESSION_KEYS.refreshToken),
        store.get(SESSION_KEYS.userId),
        store.get(SESSION_KEYS.activeCompanyId),
      ]);
      if (userId === null) {
        tokens = null;
        setState({ status: "signedOut" });
      } else if (accessToken === null || refreshToken === null) {
        tokens = null;
        setState({ status: "expired", userId });
      } else {
        tokens = { accessToken, refreshToken };
        setState({ status: "signedIn", userId, activeCompanyId });
      }
      return current;
    },

    async signIn(email, password) {
      let issued: Tokens;
      try {
        const { data, error, response } = await client.POST("/api/v1/auth/login", {
          body: { email, password },
        });
        if (data === undefined) {
          return { ok: false, error: classifyResponseError(response.status, error) };
        }
        issued = { accessToken: data.accessToken, refreshToken: data.refreshToken };
      } catch {
        return { ok: false, error: classifyThrown() };
      }

      // Identity first, with the new token held in memory only: nothing is written to the
      // device until the account comparison (and any wipe) is done.
      const me = await fetchMe(issued.accessToken);
      if (!me.ok) {
        return { ok: false, error: me.error };
      }

      // FR-001a / ADR 0002: a different account, or **no stored account at all** (fresh install,
      // backup restored elsewhere), wipes before anything is read for the new account.
      const storedUserId = await store.get(SESSION_KEYS.userId);
      const samePerson = storedUserId !== null && storedUserId === me.me.user.id;
      const storedCompany = samePerson ? await store.get(SESSION_KEYS.activeCompanyId) : null;
      if (!samePerson) {
        const outcome = await runWipe();
        if (!outcome.complete) {
          return { ok: false, error: { kind: "wipeIncomplete", failed: outcome.failed } };
        }
      }

      await persistTokens(issued);
      await store.set(SESSION_KEYS.userId, me.me.user.id);
      known = activeMemberships(me.me);
      const only = known.length === 1 ? known[0] : undefined;
      const activeCompanyId =
        storedCompany !== null && known.some((m) => m.companyId === storedCompany)
          ? storedCompany
          : (only?.companyId ?? null);
      setState({ status: "signedIn", userId: me.me.user.id, activeCompanyId });
      await setActiveCompany(activeCompanyId);
      return { ok: true, state: current };
    },

    async signOut() {
      const refreshToken = tokens?.refreshToken ?? null;
      await runWipe();
      if (refreshToken !== null) {
        // Best effort (O3): the local wipe never waits on the network.
        client.POST("/api/v1/auth/logout", { body: { refreshToken } }).catch(() => undefined);
      }
    },

    state() {
      return current;
    },

    subscribe(listener) {
      stateListeners.add(listener);
      return () => stateListeners.delete(listener);
    },

    memberships() {
      return known;
    },

    async chooseCompany(companyId) {
      if (!known.some((membership) => membership.companyId === companyId)) {
        throw new Error("Not an active membership of the signed-in person");
      }
      await setActiveCompany(companyId);
    },

    companyHeaders() {
      if (current.status !== "signedIn" || current.activeCompanyId === null) {
        throw new Error("No bakery chosen: company-scoped reads need an active company");
      }
      return { "X-Company-Id": current.activeCompanyId };
    },

    async refreshMemberships() {
      const me = await fetchMe();
      if (!me.ok) {
        return { ok: false, error: me.error };
      }
      const active = activeMemberships(me.me);
      const held = new Set(active.map((membership) => membership.companyId));
      const previously = new Set(known.map((membership) => membership.companyId));
      if (current.status === "signedIn" && current.activeCompanyId !== null) {
        previously.add(current.activeCompanyId);
      }
      known = active;
      for (const companyId of previously) {
        if (!held.has(companyId)) {
          await emitLoss(companyId, "membershipLost");
        }
      }
      return { ok: true };
    },

    reportCompanyUnavailable(companyId, reason) {
      known = known.filter((membership) => membership.companyId !== companyId);
      return emitLoss(companyId, reason);
    },

    onMembershipLost(listener) {
      lossListeners.add(listener);
      return () => lossListeners.delete(listener);
    },

    registerFreshInstallOnlyKey(key) {
      freshInstallOnlyKeys.add(assertValidKey(key));
      return () => {
        freshInstallOnlyKeys.delete(key);
      };
    },

    registerWiper(name, wiper) {
      return wipe.register(name, wiper);
    },

    refreshTokens() {
      if (refreshing === null) {
        refreshing = doRefresh().finally(() => {
          refreshing = null;
        });
      }
      return refreshing;
    },

    accessToken() {
      return tokens?.accessToken ?? null;
    },
  };

  client.use(createAuthMiddleware(session));
  return session;
}
