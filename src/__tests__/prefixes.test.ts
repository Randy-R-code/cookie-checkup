import { validateCookiePrefix } from "@/lib/cookies/prefixes";
import { describe, expect, it } from "vitest";

const base = {
  domainSpecified: false,
  effectivePath: "/",
  isSecureOrigin: true,
  source: "http-header" as const,
};

describe("validateCookiePrefix", () => {
  it("is valid for a name with no recognized prefix", () => {
    const result = validateCookiePrefix({
      ...base,
      name: "session",
      secure: false,
      httpOnly: false,
    });
    expect(result.valid).toBe(true);
    expect(result.prefix).toBeUndefined();
  });

  describe("__Secure-", () => {
    it("is valid with Secure on a secure origin", () => {
      const result = validateCookiePrefix({
        ...base,
        name: "__Secure-session",
        secure: true,
        httpOnly: false,
      });
      expect(result.valid).toBe(true);
    });

    it("is invalid without Secure", () => {
      const result = validateCookiePrefix({
        ...base,
        name: "__Secure-session",
        secure: false,
        httpOnly: false,
      });
      expect(result.valid).toBe(false);
    });
  });

  describe("__Host-", () => {
    it("is valid with Secure, no Domain, and Path=/", () => {
      const result = validateCookiePrefix({
        ...base,
        name: "__Host-session",
        secure: true,
        httpOnly: false,
      });
      expect(result.valid).toBe(true);
    });

    it("is invalid with a Domain attribute", () => {
      const result = validateCookiePrefix({
        ...base,
        name: "__Host-session",
        secure: true,
        httpOnly: false,
        domainSpecified: true,
      });
      expect(result.valid).toBe(false);
    });

    it("is invalid with a non-root Path", () => {
      const result = validateCookiePrefix({
        ...base,
        name: "__Host-session",
        secure: true,
        httpOnly: false,
        effectivePath: "/account",
      });
      expect(result.valid).toBe(false);
    });
  });

  describe("__Http-", () => {
    it("is valid with Secure, HttpOnly, and http-header source", () => {
      const result = validateCookiePrefix({
        ...base,
        name: "__Http-session",
        secure: true,
        httpOnly: true,
      });
      expect(result.valid).toBe(true);
    });

    it("is invalid without HttpOnly", () => {
      const result = validateCookiePrefix({
        ...base,
        name: "__Http-session",
        secure: true,
        httpOnly: false,
      });
      expect(result.valid).toBe(false);
    });

    it("is invalid when set from JavaScript", () => {
      const result = validateCookiePrefix({
        ...base,
        name: "__Http-session",
        secure: true,
        httpOnly: true,
        source: "javascript",
      });
      expect(result.valid).toBe(false);
    });
  });

  describe("__Host-Http-", () => {
    it("is valid when every requirement is satisfied", () => {
      const result = validateCookiePrefix({
        ...base,
        name: "__Host-Http-session",
        secure: true,
        httpOnly: true,
      });
      expect(result.valid).toBe(true);
    });

    it("is invalid with a Domain attribute", () => {
      const result = validateCookiePrefix({
        ...base,
        name: "__Host-Http-session",
        secure: true,
        httpOnly: true,
        domainSpecified: true,
      });
      expect(result.valid).toBe(false);
    });
  });
});
