import { evaluateRequestMatch } from "@/lib/cookies/request-match";
import type { EffectiveCookie } from "@/types/cookie";
import { describe, expect, it } from "vitest";

const now = new Date("2026-01-01T00:00:00Z");

function baseCookie(overrides: Partial<EffectiveCookie> = {}): EffectiveCookie {
  return {
    name: "session",
    value: "abc123",
    host: "app.example.com",
    hostOnly: true,
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    sameSiteSpecified: true,
    partitioned: false,
    ...overrides,
  };
}

describe("evaluateRequestMatch", () => {
  it("sends a cookie that matches every rule", () => {
    const result = evaluateRequestMatch({
      effective: baseCookie(),
      requestUrl: new URL("https://app.example.com/dashboard"),
      topLevelUrl: new URL("https://app.example.com/dashboard"),
      method: "GET",
      isTopLevelNavigation: false,
      now,
    });
    expect(result.sent).toBe(true);
  });

  it("does not send an expired cookie", () => {
    const result = evaluateRequestMatch({
      effective: baseCookie({ expiresAt: new Date("2025-01-01T00:00:00Z") }),
      requestUrl: new URL("https://app.example.com/dashboard"),
      topLevelUrl: new URL("https://app.example.com/dashboard"),
      method: "GET",
      isTopLevelNavigation: false,
      now,
    });
    expect(result.sent).toBe(false);
  });

  it("does not send a Secure cookie over HTTP", () => {
    const result = evaluateRequestMatch({
      effective: baseCookie(),
      requestUrl: new URL("http://app.example.com/dashboard"),
      topLevelUrl: new URL("http://app.example.com/dashboard"),
      method: "GET",
      isTopLevelNavigation: false,
      now,
    });
    expect(result.sent).toBe(false);
  });

  it("does not send a host-only cookie to a different host", () => {
    const result = evaluateRequestMatch({
      effective: baseCookie({ host: "app.example.com", hostOnly: true }),
      requestUrl: new URL("https://api.example.com/account"),
      topLevelUrl: new URL("https://api.example.com/account"),
      method: "GET",
      isTopLevelNavigation: false,
      now,
    });
    expect(result.sent).toBe(false);
  });

  it("does not send a cookie outside its Path", () => {
    const result = evaluateRequestMatch({
      effective: baseCookie({ path: "/docs" }),
      requestUrl: new URL("https://app.example.com/account"),
      topLevelUrl: new URL("https://app.example.com/account"),
      method: "GET",
      isTopLevelNavigation: false,
      now,
    });
    expect(result.sent).toBe(false);
  });

  it("blocks a Strict cookie on a cross-site request", () => {
    const result = evaluateRequestMatch({
      effective: baseCookie({
        hostOnly: false,
        domain: "example.com",
        sameSite: "strict",
      }),
      requestUrl: new URL("https://example.com/account"),
      topLevelUrl: new URL("https://other.com/page"),
      method: "GET",
      isTopLevelNavigation: true,
      now,
    });
    expect(result.sent).toBe(false);
  });

  it("allows a Lax cookie on a cross-site top-level GET navigation", () => {
    const result = evaluateRequestMatch({
      effective: baseCookie({
        hostOnly: false,
        domain: "example.com",
        sameSite: "lax",
      }),
      requestUrl: new URL("https://example.com/account"),
      topLevelUrl: new URL("https://other.com/page"),
      method: "GET",
      isTopLevelNavigation: true,
      now,
    });
    expect(result.sent).toBe(true);
  });

  it("allows a None cookie on a cross-site request", () => {
    const result = evaluateRequestMatch({
      effective: baseCookie({
        hostOnly: false,
        domain: "example.com",
        sameSite: "none",
      }),
      requestUrl: new URL("https://example.com/widget"),
      topLevelUrl: new URL("https://other.com/page"),
      method: "GET",
      isTopLevelNavigation: false,
      now,
    });
    expect(result.sent).toBe(true);
  });
});
