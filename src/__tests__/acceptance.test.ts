import { evaluateAcceptance } from "@/lib/cookies/acceptance";
import { parseSetCookie } from "@/lib/cookies/parse-set-cookie";
import type { CookieSource } from "@/types/cookie";
import { describe, expect, it } from "vitest";

function accept(
  header: string,
  ctx?: Partial<{
    sourceHostname: string;
    sourcePathname: string;
    isSecureOrigin: boolean;
    source: CookieSource;
  }>,
) {
  const parsed = parseSetCookie(header);
  if (!parsed.cookie) throw new Error("expected a parsed cookie");
  return evaluateAcceptance(parsed.cookie, {
    sourceHostname: "app.example.com",
    sourcePathname: "/login",
    isSecureOrigin: true,
    source: "http-header",
    ...ctx,
  });
}

describe("evaluateAcceptance", () => {
  it("accepts a well-formed secure session cookie", () => {
    const result = accept(
      "session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax",
    );
    expect(result.accepted).toBe(true);
  });

  it("allows Secure over HTTPS", () => {
    const result = accept("session=abc123; Secure", { isSecureOrigin: true });
    expect(result.accepted).toBe(true);
  });

  it("blocks Secure over HTTP", () => {
    const result = accept("session=abc123; Secure", { isSecureOrigin: false });
    expect(result.accepted).toBe(false);
  });

  it("rejects SameSite=None without Secure", () => {
    const result = accept("session=abc123; HttpOnly; SameSite=None");
    expect(result.accepted).toBe(false);
    expect(
      result.findings.some(
        (f) => f.id === "acceptance/samesite-none-requires-secure",
      ),
    ).toBe(true);
  });

  it("accepts SameSite=None with Secure", () => {
    const result = accept("session=abc123; Secure; SameSite=None");
    expect(result.accepted).toBe(true);
  });

  it("rejects Partitioned without Secure", () => {
    const result = accept("session=abc123; Partitioned");
    expect(result.accepted).toBe(false);
  });

  it("accepts Partitioned with Secure", () => {
    const result = accept("session=abc123; Secure; SameSite=None; Partitioned");
    expect(result.accepted).toBe(true);
  });

  it("rejects a Domain unrelated to the source host", () => {
    const result = accept("session=abc123; Domain=other-site.com");
    expect(result.accepted).toBe(false);
  });

  it("accepts a Domain that is a parent of the source host", () => {
    const result = accept("session=abc123; Domain=example.com");
    expect(result.accepted).toBe(true);
  });

  it("rejects an invalid __Host- cookie with a Domain attribute", () => {
    const result = accept(
      "__Host-session=abc123; Domain=example.com; Path=/; Secure",
    );
    expect(result.accepted).toBe(false);
  });

  it("accepts a valid __Host- cookie", () => {
    const result = accept(
      "__Host-session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax",
    );
    expect(result.accepted).toBe(true);
  });
});
