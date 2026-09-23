import { describe, expect, it } from "vitest";
import { ENTITLEMENT_SOURCE, stubEntitlementPort } from "./entitlement";
import sourceFile from "./source.json";

describe("the entitlement port before the api serves one (002 R9)", () => {
  it("says it has no answer, for either subject", async () => {
    expect(
      await stubEntitlementPort.answer({ kind: "company", companyId: "c" }, "pro.labelDesk"),
    ).toBe("unavailable");
    expect(await stubEntitlementPort.answer({ kind: "user", userId: "u" }, "home.plus")).toBe(
      "unavailable",
    );
  });

  it("declares itself a stub, which is what blocks the store build", () => {
    expect(sourceFile.source).toBe("stub");
    expect(ENTITLEMENT_SOURCE).toBe("stub");
  });
});
