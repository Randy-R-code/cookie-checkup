import { parseSetCookie } from "@/lib/cookies/parse-set-cookie";
import {
  builderFieldsFromParsedCookie,
  serializeCookie,
} from "@/lib/cookies/serialize-cookie";
import { describe, expect, it } from "vitest";

describe("serializeCookie", () => {
  it("serializes only the fields that are set", () => {
    const header = serializeCookie({
      name: "session",
      value: "abc123",
      domain: "",
      path: "/",
      expires: "",
      maxAge: "",
      sameSite: "lax",
      secure: true,
      httpOnly: true,
      partitioned: false,
    });

    expect(header).toBe(
      "session=abc123; Path=/; SameSite=Lax; Secure; HttpOnly",
    );
  });

  it("round-trips through the parser", () => {
    const original =
      "session=abc123; Domain=example.com; Path=/app; SameSite=Strict; Secure; HttpOnly";
    const parsed = parseSetCookie(original);
    const fields = builderFieldsFromParsedCookie(parsed.cookie);
    const serialized = serializeCookie(fields);
    const reparsed = parseSetCookie(serialized);

    expect(reparsed.cookie).toMatchObject({
      name: "session",
      value: "abc123",
      domain: "example.com",
      path: "/app",
      sameSite: "strict",
      secure: true,
      httpOnly: true,
    });
  });
});
