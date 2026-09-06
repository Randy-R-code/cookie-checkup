import { simulateCookie } from "@/lib/cookies/simulate";
import { describe, expect, it } from "vitest";

describe("simulateCookie", () => {
  it("A — a good session cookie is accepted, stored, sent, and JS-protected", () => {
    const result = simulateCookie({
      header: "session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax",
      setContext: {
        sourceUrl: "https://app.example.com/login",
        source: "http-header",
        now: new Date("2026-01-01T00:00:00Z"),
      },
      requestContext: {
        requestUrl: "https://app.example.com/dashboard",
        topLevelUrl: "https://app.example.com/dashboard",
        method: "GET",
        isTopLevelNavigation: false,
        now: new Date("2026-01-01T00:00:00Z"),
      },
    });

    expect(result.parsing.success).toBe(true);
    expect(result.acceptance.accepted).toBe(true);
    expect(result.storage?.sessionCookie).toBe(true);
    expect(result.request?.sent).toBe(true);
    expect(result.javascript?.accessible).toBe(false);
  });

  it("B — SameSite=None without Secure is rejected end to end", () => {
    const result = simulateCookie({
      header: "session=abc123; Path=/; HttpOnly; SameSite=None",
      setContext: {
        sourceUrl: "https://app.example.com/login",
        source: "http-header",
      },
    });

    expect(result.acceptance.accepted).toBe(false);
    expect(result.storage).toBeUndefined();
    expect(result.request).toBeUndefined();
    expect(result.javascript).toBeUndefined();
  });

  it("C — a host-only cookie is not sent to a different host", () => {
    const result = simulateCookie({
      header: "session=abc123; Path=/; Secure",
      setContext: {
        sourceUrl: "https://app.example.com",
        source: "http-header",
      },
      requestContext: {
        requestUrl: "https://api.example.com",
        topLevelUrl: "https://api.example.com",
        method: "GET",
        isTopLevelNavigation: false,
      },
    });

    expect(result.acceptance.accepted).toBe(true);
    expect(result.storage?.cookie.hostOnly).toBe(true);
    expect(result.request?.sent).toBe(false);
  });

  it("D — HttpOnly still allows the request but blocks JavaScript", () => {
    const result = simulateCookie({
      header: "session=abc123; Path=/; Secure; HttpOnly",
      setContext: {
        sourceUrl: "https://app.example.com/login",
        source: "http-header",
      },
      requestContext: {
        requestUrl: "https://app.example.com/login",
        topLevelUrl: "https://app.example.com/login",
        method: "GET",
        isTopLevelNavigation: false,
      },
    });

    expect(result.request?.sent).toBe(true);
    expect(result.javascript?.accessible).toBe(false);
  });

  it("returns a parsing failure without throwing for malformed input", () => {
    const result = simulateCookie({
      header: "Secure; HttpOnly",
      setContext: {
        sourceUrl: "https://app.example.com/login",
        source: "http-header",
      },
    });

    expect(result.parsing.success).toBe(false);
    expect(result.acceptance.accepted).toBe(false);
  });

  it("returns an acceptance error instead of throwing for an invalid source URL", () => {
    const result = simulateCookie({
      header: "session=abc123",
      setContext: {
        sourceUrl: "not-a-url",
        source: "http-header",
      },
    });

    expect(result.acceptance.accepted).toBe(false);
  });
});
