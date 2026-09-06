import { parseSetCookie } from "@/lib/cookies/parse-set-cookie";
import { describe, expect, it } from "vitest";

describe("parseSetCookie", () => {
  it("parses a standard header", () => {
    const result = parseSetCookie(
      "session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax",
    );

    expect(result.success).toBe(true);
    expect(result.cookie).toMatchObject({
      name: "session",
      value: "abc123",
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });
  });

  it("accepts an optional Set-Cookie: prefix", () => {
    const result = parseSetCookie("Set-Cookie: session=abc123; Path=/");
    expect(result.success).toBe(true);
    expect(result.cookie?.name).toBe("session");
  });

  it("trims surrounding whitespace", () => {
    const result = parseSetCookie("  session = abc123 ; Path = / ");
    expect(result.cookie?.name).toBe("session");
    expect(result.cookie?.value).toBe("abc123");
    expect(result.cookie?.path).toBe("/");
  });

  it("treats attribute names case-insensitively", () => {
    const result = parseSetCookie(
      "session=abc123; SECURE; HttPOnly; sAMEsite=Strict",
    );
    expect(result.cookie?.secure).toBe(true);
    expect(result.cookie?.httpOnly).toBe(true);
    expect(result.cookie?.sameSite).toBe("strict");
  });

  it("parses boolean flags without values", () => {
    const result = parseSetCookie(
      "session=abc123; Secure; HttpOnly; Partitioned",
    );
    expect(result.cookie?.secure).toBe(true);
    expect(result.cookie?.httpOnly).toBe(true);
    expect(result.cookie?.partitioned).toBe(true);
  });

  it("returns a syntax error for malformed input with no name/value pair", () => {
    const result = parseSetCookie("Secure; HttpOnly");
    expect(result.success).toBe(false);
    expect(result.findings[0]?.severity).toBe("error");
  });

  it("returns a syntax error for an empty header", () => {
    const result = parseSetCookie("   ");
    expect(result.success).toBe(false);
  });

  it("keeps unknown attributes instead of discarding them", () => {
    const result = parseSetCookie("session=abc123; Priority=High; Foo=Bar");
    expect(result.cookie?.unknownAttributes).toEqual([
      { name: "Priority", value: "High" },
      { name: "Foo", value: "Bar" },
    ]);
  });

  it("flags duplicate known directives and keeps the first", () => {
    const result = parseSetCookie("session=abc123; Path=/a; Path=/b");
    expect(result.cookie?.path).toBe("/a");
    expect(result.findings.some((f) => f.id === "parse/duplicate-path")).toBe(
      true,
    );
  });

  it("parses Expires with commas", () => {
    const result = parseSetCookie(
      "session=abc123; Expires=Wed, 21 Oct 2026 07:28:00 GMT",
    );
    expect(result.cookie?.expires).toBeInstanceOf(Date);
    expect(result.cookie?.expires?.getUTCFullYear()).toBe(2026);
  });

  it("ignores an invalid Expires value", () => {
    const result = parseSetCookie("session=abc123; Expires=not-a-date");
    expect(result.cookie?.expires).toBeUndefined();
    expect(result.findings.some((f) => f.id === "parse/invalid-expires")).toBe(
      true,
    );
  });

  it("ignores an invalid Max-Age value", () => {
    const result = parseSetCookie("session=abc123; Max-Age=not-a-number");
    expect(result.cookie?.maxAge).toBeUndefined();
    expect(result.findings.some((f) => f.id === "parse/invalid-max-age")).toBe(
      true,
    );
  });

  it("flags an unrecognized SameSite value", () => {
    const result = parseSetCookie("session=abc123; SameSite=Weird");
    expect(result.cookie?.sameSite).toBeUndefined();
    expect(result.findings.some((f) => f.id === "parse/invalid-samesite")).toBe(
      true,
    );
  });
});
