import type { Middleware } from "openapi-fetch";

export interface AuthMiddlewareDeps {
  /** The current in-memory access token, or null when signed out. */
  accessToken(): string | null;
  /** Single-flight token refresh; resolves true when a new access token is in place. */
  refreshTokens(): Promise<boolean>;
}

const AUTH_PATHS = "/api/v1/auth/";

/**
 * Bearer auth plus one retry after a refresh on 401 (002 contracts/session-core.md). The company
 * header is not injected here: the generated types make `X-Company-Id` a required parameter on
 * every company-scoped operation, so callers pass `session.companyHeaders()` and the compiler
 * enforces it.
 *
 * Only GETs are retried: a replayed write is never silent, and every read the desk makes is a GET.
 */
export function createAuthMiddleware(deps: AuthMiddlewareDeps): Middleware {
  const retryable = new Map<string, Request>();

  return {
    onRequest({ request, schemaPath, id }) {
      if (schemaPath.startsWith(AUTH_PATHS)) {
        return request;
      }
      if (!request.headers.has("Authorization")) {
        const token = deps.accessToken();
        if (token !== null) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      }
      if (request.method === "GET") {
        retryable.set(id, request.clone());
      }
      return request;
    },

    async onResponse({ response, schemaPath, id, options }) {
      const original = retryable.get(id);
      retryable.delete(id);
      if (response.status !== 401 || original === undefined || schemaPath.startsWith(AUTH_PATHS)) {
        return response;
      }
      if (!(await deps.refreshTokens())) {
        return response;
      }
      const token = deps.accessToken();
      if (token === null) {
        return response;
      }
      const headers = new Headers(original.headers);
      headers.set("Authorization", `Bearer ${token}`);
      return options.fetch(new Request(original, { headers }));
    },

    onError({ id }) {
      retryable.delete(id);
    },
  };
}
