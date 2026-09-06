import {
  domainMatchesRequest,
  validateSettingDomain,
} from "@/lib/cookies/domain-match";
import { describe, expect, it } from "vitest";

describe("validateSettingDomain", () => {
  const source = "app.example.com";

  it("treats a missing Domain as host-only", () => {
    const result = validateSettingDomain(source, undefined);
    expect(result).toEqual({ valid: true, hostOnly: true });
  });

  it("accepts the registrable parent domain", () => {
    const result = validateSettingDomain(source, "example.com");
    expect(result.valid).toBe(true);
    expect(result.effectiveDomain).toBe("example.com");
  });

  it("accepts the source host itself as a Domain value", () => {
    const result = validateSettingDomain(source, "app.example.com");
    expect(result.valid).toBe(true);
  });

  it("normalizes a leading dot", () => {
    const result = validateSettingDomain(source, ".example.com");
    expect(result.valid).toBe(true);
    expect(result.effectiveDomain).toBe("example.com");
  });

  it("rejects a child of the source host", () => {
    const result = validateSettingDomain(source, "foo.app.example.com");
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("unrelated-domain");
  });

  it("rejects an unrelated domain", () => {
    const result = validateSettingDomain(source, "other-site.com");
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("unrelated-domain");
  });

  it("rejects a bare public suffix", () => {
    const result = validateSettingDomain("app.example.co.uk", "co.uk");
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("public-suffix");
  });
});

describe("domainMatchesRequest", () => {
  it("matches only the exact host for a host-only cookie", () => {
    const effective = { hostOnly: true, host: "app.example.com" };
    expect(domainMatchesRequest(effective, "app.example.com")).toBe(true);
    expect(domainMatchesRequest(effective, "api.example.com")).toBe(false);
    expect(domainMatchesRequest(effective, "example.com")).toBe(false);
  });

  it("matches the domain and every subdomain for a domain cookie", () => {
    const effective = {
      hostOnly: false,
      host: "app.example.com",
      domain: "example.com",
    };
    expect(domainMatchesRequest(effective, "example.com")).toBe(true);
    expect(domainMatchesRequest(effective, "app.example.com")).toBe(true);
    expect(domainMatchesRequest(effective, "api.example.com")).toBe(true);
    expect(domainMatchesRequest(effective, "other.com")).toBe(false);
  });
});
