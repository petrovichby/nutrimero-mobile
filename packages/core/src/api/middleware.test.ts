import { describe, expect, it, vi } from "vitest";
import { BASE_URL, createFakeApi, errorBody, json } from "../test-support/fake-api";
import { createApiClient } from "./client";
import { createAuthMiddleware } from "./middleware";

const COMPANY = { "X-Company-Id": "00000000-0000-4000-8000-00000000000c" };

function setup(routes: Parameters<typeof createFakeApi>[0], refreshes = [true]) {
  const api = createFakeApi(routes);
  const client = createApiClient(BASE_URL, { fetch: api.fetch });
  let token: string | null = "old";
  const refreshTokens = vi.fn(async () => {
    const ok = refreshes.shift() ?? false;
    if (ok) token = "new";
    return ok;
  });
  client.use(createAuthMiddleware({ accessToken: () => token, refreshTokens }));
  return { api, client, refreshTokens };
}

describe("the auth middleware", () => {
  it("sends the bearer token on api calls, and none on auth calls", async () => {
    const { api, client } = setup({
      "GET /api/v1/products": () => json(200, { items: [], total: 0 }),
      "POST /api/v1/auth/logout": () => json(204, undefined),
    });
    await client.GET("/api/v1/products", { params: { header: COMPANY } });
    await client.POST("/api/v1/auth/logout", { body: { refreshToken: "r" } });
    expect(api.calls.map((call) => call.authorization)).toEqual(["Bearer old", null]);
  });

  it("keeps an explicit Authorization header (sign-in's in-memory token)", async () => {
    const { api, client } = setup({ "GET /api/v1/me": () => json(200, {}) });
    await client.GET("/api/v1/me", { headers: { Authorization: "Bearer pending" } });
    expect(api.calls[0]?.authorization).toBe("Bearer pending");
  });

  it("refreshes once on 401 and retries the GET with the new token", async () => {
    const { api, client, refreshTokens } = setup({
      "GET /api/v1/products": [
        () => json(401, errorBody("TOKEN_INVALID")),
        () => json(200, { items: [], total: 0 }),
      ],
    });
    const { data, response } = await client.GET("/api/v1/products", {
      params: { header: COMPANY },
    });
    expect(response.status).toBe(200);
    expect(data).toEqual({ items: [], total: 0 });
    expect(refreshTokens).toHaveBeenCalledOnce();
    expect(api.calls.map((call) => call.authorization)).toEqual(["Bearer old", "Bearer new"]);
  });

  it("returns the 401 when the refresh fails, without a retry", async () => {
    const { api, client } = setup(
      { "GET /api/v1/products": () => json(401, errorBody("TOKEN_INVALID")) },
      [false],
    );
    const { response } = await client.GET("/api/v1/products", { params: { header: COMPANY } });
    expect(response.status).toBe(401);
    expect(api.calls).toHaveLength(1);
  });

  it("never replays a write after a 401", async () => {
    const { api, client, refreshTokens } = setup({
      "POST /api/v1/products": () => json(401, errorBody("TOKEN_INVALID")),
    });
    const { response } = await client.POST("/api/v1/products", {
      params: { header: COMPANY },
      body: { name: "Roggenbrot" },
    });
    expect(response.status).toBe(401);
    expect(refreshTokens).not.toHaveBeenCalled();
    expect(api.calls).toHaveLength(1);
  });
});
