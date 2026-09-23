import { describe, expect, it } from "vitest";
import { errorBody } from "../test-support/fake-api";
import { classifyResponseError, classifyThrown } from "./errors";

describe("the error classifier (002 pinned fact P5)", () => {
  it.each([
    [401, "TOKEN_INVALID", "unauthorized"],
    [403, "INSUFFICIENT_ROLE", "insufficientRole"],
    [404, "NOT_FOUND", "notFound"],
    [409, "COMPANY_ARCHIVED", "companyArchived"],
    [403, "MEMBERSHIP_REQUIRED", "membershipLost"],
    [403, "MEMBERSHIP_NOT_ACTIVE", "membershipLost"],
    [400, "COMPANY_CONTEXT_REQUIRED", "companyContextRequired"],
    [409, "DECLARATION_INCOMPLETE", "conflict"],
    [422, "VALIDATION_FAILED", "validation"],
    [429, "RATE_LIMITED", "rateLimited"],
    [500, "INTERNAL_ERROR", "server"],
  ])("status %i with %s is %s", (status, code, kind) => {
    const classified = classifyResponseError(status, errorBody(code, { ruleSetId: "x" }));
    expect(classified).toEqual({ kind, status, code, details: { ruleSetId: "x" } });
  });

  it("a plain not-found is never a lost company: only the membership codes are", () => {
    expect(classifyResponseError(404, errorBody("NOT_FOUND")).kind).toBe("notFound");
  });

  it("falls back to the status when the body is not the contract's envelope", () => {
    expect(classifyResponseError(503, "<html>")).toEqual({
      kind: "server",
      status: 503,
      code: null,
      details: {},
    });
    expect(classifyResponseError(401, { error: { code: "SOMETHING_NEW" } }).kind).toBe(
      "unauthorized",
    );
    expect(classifyResponseError(418, null).kind).toBe("unknown");
  });

  it("a thrown fetch is the network", () => {
    expect(classifyThrown().kind).toBe("network");
  });
});
