import { createApiClient } from "@nutrimero/core";
import { describe, expect, it } from "vitest";
import { offeredLabelTypes } from "../model/label-types";
import { issuedList, products as productsFixture, ruleSets } from "../test-support/fixtures";
import { loadIssued, loadIssuedForProduct, orderIssued } from "./issued";
import { loadOverview, loadProducts } from "./products";
import { loadRendering } from "./rendering";

const HEADERS = { "X-Company-Id": "00000000-0000-4000-8000-0000000000c1" };
const DATE = "Wed, 23 Sep 2026 14:05:00 GMT";

type Route = (url: URL) => Response;
function fakeApi(route: Route) {
  const seen: { path: string; query: string; company: string | null }[] = [];
  const client = createApiClient("https://api.test", {
    fetch: async (request) => {
      const url = new URL(request.url);
      seen.push({
        path: url.pathname,
        query: url.search,
        company: request.headers.get("X-Company-Id"),
      });
      return route(url);
    },
  });
  return { client, seen };
}
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", Date: DATE },
  });

describe("loaders (online only, FR-021)", () => {
  it("loads the first page, then the rest in parallel, up to the bound", async () => {
    const [row] = productsFixture.products;
    const { client, seen } = fakeApi((url) => {
      const offset = Number(url.searchParams.get("offset"));
      const rows = Array.from({ length: 200 }, (_, index) => ({
        ...row,
        id: `p-${offset + index}`,
      }));
      return json(200, { ...productsFixture, products: rows, total: 1234, offset });
    });
    const result = await loadProducts(client, HEADERS);
    expect(result.ok && result.value.bound).toEqual({ bounded: true, loaded: 1000, total: 1234 });
    expect(seen.map((call) => call.query)).toEqual([
      "?limit=200&offset=0",
      "?limit=200&offset=200",
      "?limit=200&offset=400",
      "?limit=200&offset=600",
      "?limit=200&offset=800",
    ]);
    expect(new Set(seen.map((call) => call.company))).toEqual(new Set([HEADERS["X-Company-Id"]]));
  });

  it("classifies a lost bakery so the session can purge it", async () => {
    const { client } = fakeApi(() =>
      json(409, { error: { code: "COMPANY_ARCHIVED", details: {} } }),
    );
    const result = await loadOverview(client, HEADERS);
    expect(!result.ok && result.error.kind).toBe("companyArchived");
  });

  it("a thrown fetch is the network, not an empty list", async () => {
    const client = createApiClient("https://api.test", {
      fetch: async () => {
        throw new TypeError("Network request failed");
      },
    });
    const result = await loadProducts(client, HEADERS);
    expect(!result.ok && result.error.kind).toBe("network");
  });

  it("asks for the rendering in the chosen label language", async () => {
    const { client, seen } = fakeApi(() => json(200, { gaps: [] }));
    await loadRendering(client, HEADERS, "prod-1", "eu1_counter_card", "de-DE");
    expect(seen[0]).toMatchObject({
      path: "/api/v1/products/prod-1/labels/eu1_counter_card",
      query: "?language=de-DE",
    });
  });

  it("reads issued labels once per offered rule-set, with no hardcoded regions (R7)", async () => {
    const offered = offeredLabelTypes(ruleSets).map((item) => item.id);
    const { client, seen } = fakeApi((url) =>
      json(200, url.pathname.includes("/eu1_counter_card/") ? issuedList : { items: [] }),
    );
    const result = await loadIssuedForProduct(client, HEADERS, "prod-1", offered);
    expect(seen).toHaveLength(offered.length);
    expect(result.ok && result.value.map((item) => item.status)).toEqual(
      orderIssued(issuedList.items).map((item) => item.status),
    );
  });

  it("orders active first within a label type and language", () => {
    const statuses = orderIssued(issuedList.items)
      .filter((item) => item.language === "de")
      .map((item) => item.status);
    expect(statuses[0]).toBe("active");
  });

  it("returns the server's Date with the single issued read, for the verdict's check time", async () => {
    const { client } = fakeApi(() => json(200, { id: "i1", differsFromCurrent: false }));
    const result = await loadIssued(client, HEADERS, "i1");
    expect(result.ok && result.serverDate).toBe(DATE);
  });
});
