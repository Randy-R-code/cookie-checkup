import { decodeScenario } from "@/lib/share/decode-scenario";
import {
  buildShareableScenario,
  encodeScenario,
} from "@/lib/share/encode-scenario";
import { describe, expect, it } from "vitest";

describe("scenario sharing", () => {
  it("round-trips a scenario through encode and decode", () => {
    const scenario = buildShareableScenario(
      "session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax",
      { sourceUrl: "https://app.example.com/login", source: "http-header" },
      {
        requestUrl: "https://app.example.com/dashboard",
        topLevelUrl: "https://app.example.com/dashboard",
        method: "GET",
        isTopLevelNavigation: false,
      },
    );

    const encoded = encodeScenario(scenario);
    const decoded = decodeScenario(encoded);

    expect(decoded).toEqual({
      header: scenario.header,
      setContext: { sourceUrl: scenario.setUrl, source: scenario.setSource },
      requestContext: {
        requestUrl: scenario.requestUrl,
        topLevelUrl: scenario.topLevelUrl,
        method: scenario.method,
        isTopLevelNavigation: scenario.isTopLevelNavigation,
      },
    });
  });

  it("produces a URL-safe string with no padding", () => {
    const scenario = buildShareableScenario(
      "session=abc123",
      { sourceUrl: "https://app.example.com", source: "http-header" },
      {
        requestUrl: "https://app.example.com",
        topLevelUrl: "https://app.example.com",
        method: "GET",
        isTopLevelNavigation: false,
      },
    );

    const encoded = encodeScenario(scenario);
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it("rejects garbage input safely instead of throwing", () => {
    expect(decodeScenario("not-valid-base64!!!")).toBeUndefined();
  });

  it("rejects a payload with a missing field", () => {
    const encoded = Buffer.from(
      JSON.stringify({ version: 1, header: "session=abc123" }),
    )
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    expect(decodeScenario(encoded)).toBeUndefined();
  });

  it("rejects an unsupported version", () => {
    const encoded = Buffer.from(
      JSON.stringify({
        version: 2,
        header: "session=abc123",
        setUrl: "https://app.example.com",
        setSource: "http-header",
        requestUrl: "https://app.example.com",
        topLevelUrl: "https://app.example.com",
        method: "GET",
        isTopLevelNavigation: false,
      }),
    )
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    expect(decodeScenario(encoded)).toBeUndefined();
  });
});
