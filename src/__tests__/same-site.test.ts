import { evaluateSameSite, isSameSiteUrl } from "@/lib/cookies/same-site";
import { describe, expect, it } from "vitest";

describe("isSameSiteUrl", () => {
  it("treats different subdomains of the same registrable domain as same-site", () => {
    expect(
      isSameSiteUrl(
        new URL("https://app.example.com"),
        new URL("https://api.example.com"),
      ),
    ).toBe(true);
  });

  it("treats different registrable domains as cross-site", () => {
    expect(
      isSameSiteUrl(
        new URL("https://example.com"),
        new URL("https://other.com"),
      ),
    ).toBe(false);
  });

  it("treats a scheme difference as cross-site (schemeful same-site)", () => {
    expect(
      isSameSiteUrl(
        new URL("http://example.com"),
        new URL("https://example.com"),
      ),
    ).toBe(false);
  });

  it("falls back to exact hostname match for hosts without a public suffix", () => {
    expect(
      isSameSiteUrl(
        new URL("http://localhost:3000"),
        new URL("http://localhost:4000"),
      ),
    ).toBe(true);
    expect(
      isSameSiteUrl(new URL("http://127.0.0.1"), new URL("http://localhost")),
    ).toBe(false);
  });
});

describe("evaluateSameSite", () => {
  it("allows Strict for a same-site request", () => {
    const result = evaluateSameSite({
      sameSite: "strict",
      isSameSite: true,
      method: "GET",
      isTopLevelNavigation: true,
    });
    expect(result.allowed).toBe(true);
  });

  it("blocks Strict for a cross-site request", () => {
    const result = evaluateSameSite({
      sameSite: "strict",
      isSameSite: false,
      method: "GET",
      isTopLevelNavigation: true,
    });
    expect(result.allowed).toBe(false);
  });

  it("allows Lax for a same-site request", () => {
    const result = evaluateSameSite({
      sameSite: "lax",
      isSameSite: true,
      method: "POST",
      isTopLevelNavigation: false,
    });
    expect(result.allowed).toBe(true);
  });

  it("allows Lax for an eligible cross-site top-level GET navigation", () => {
    const result = evaluateSameSite({
      sameSite: "lax",
      isSameSite: false,
      method: "GET",
      isTopLevelNavigation: true,
    });
    expect(result.allowed).toBe(true);
  });

  it("blocks Lax for a cross-site POST", () => {
    const result = evaluateSameSite({
      sameSite: "lax",
      isSameSite: false,
      method: "POST",
      isTopLevelNavigation: true,
    });
    expect(result.allowed).toBe(false);
  });

  it("blocks Lax for a cross-site GET that is not a top-level navigation", () => {
    const result = evaluateSameSite({
      sameSite: "lax",
      isSameSite: false,
      method: "GET",
      isTopLevelNavigation: false,
    });
    expect(result.allowed).toBe(false);
  });

  it("allows None for a cross-site request", () => {
    const result = evaluateSameSite({
      sameSite: "none",
      isSameSite: false,
      method: "GET",
      isTopLevelNavigation: false,
    });
    expect(result.allowed).toBe(true);
  });
});
