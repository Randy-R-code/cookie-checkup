import { computeDefaultPath, pathMatches } from "@/lib/cookies/path-match";
import { describe, expect, it } from "vitest";

describe("computeDefaultPath", () => {
  it("uses the containing directory of the request path", () => {
    expect(computeDefaultPath("/docs/Web/HTTP/index.html")).toBe(
      "/docs/Web/HTTP/",
    );
  });

  it("returns / for a root path", () => {
    expect(computeDefaultPath("/")).toBe("/");
  });

  it("returns / for a single top-level segment", () => {
    expect(computeDefaultPath("/login")).toBe("/");
  });

  it("returns / for an empty path", () => {
    expect(computeDefaultPath("")).toBe("/");
  });
});

describe("pathMatches", () => {
  const cookiePath = "/docs";

  it("matches an identical path", () => {
    expect(pathMatches(cookiePath, "/docs")).toBe(true);
  });

  it("matches a path with a trailing slash", () => {
    expect(pathMatches(cookiePath, "/docs/")).toBe(true);
  });

  it("matches a nested path", () => {
    expect(pathMatches(cookiePath, "/docs/api")).toBe(true);
  });

  it("does not match the root path", () => {
    expect(pathMatches(cookiePath, "/")).toBe(false);
  });

  it("does not match a sibling path that merely shares a prefix", () => {
    expect(pathMatches(cookiePath, "/docsets")).toBe(false);
  });

  it("does not match an unrelated path", () => {
    expect(pathMatches(cookiePath, "/account")).toBe(false);
  });
});
