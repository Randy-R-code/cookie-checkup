import type { Finding, ParsedCookie, SameSiteValue } from "@/types/cookie";
import { makeFinding } from "./finding";

export interface ParseSetCookieResult {
  success: boolean;
  cookie?: ParsedCookie;
  findings: Finding[];
}

const KNOWN_ATTRIBUTES = new Set([
  "domain",
  "path",
  "expires",
  "max-age",
  "secure",
  "httponly",
  "samesite",
  "partitioned",
]);

const SAME_SITE_VALUES: SameSiteValue[] = ["strict", "lax", "none"];

export function parseSetCookie(header: string): ParseSetCookieResult {
  const findings: Finding[] = [];
  const withoutPrefix = header.replace(/^\s*set-cookie\s*:/i, "");
  const trimmed = withoutPrefix.trim();

  if (!trimmed) {
    findings.push(
      makeFinding(
        "parse/empty-header",
        "error",
        "syntax",
        "Empty Set-Cookie header",
        "There is nothing to parse. Provide at least a name=value pair.",
      ),
    );
    return { success: false, findings };
  }

  const segments = trimmed.split(";");
  const firstSegment = segments[0] ?? "";
  const equalsIndex = firstSegment.indexOf("=");

  if (equalsIndex === -1) {
    findings.push(
      makeFinding(
        "parse/missing-name-value",
        "error",
        "syntax",
        "Missing name/value pair",
        `"${firstSegment.trim()}" is not a valid name=value pair.`,
      ),
    );
    return { success: false, findings };
  }

  const name = firstSegment.slice(0, equalsIndex).trim();
  const value = firstSegment.slice(equalsIndex + 1).trim();

  if (!name) {
    findings.push(
      makeFinding(
        "parse/empty-name",
        "error",
        "syntax",
        "Empty cookie name",
        "The cookie name cannot be empty.",
      ),
    );
    return { success: false, findings };
  }

  const cookie: ParsedCookie = {
    name,
    value,
    secure: false,
    httpOnly: false,
    partitioned: false,
    unknownAttributes: [],
  };

  const seenAttributes = new Set<string>();

  for (const rawAttribute of segments.slice(1)) {
    const attribute = rawAttribute.trim();
    if (!attribute) continue;

    const attributeEquals = attribute.indexOf("=");
    const attributeName =
      attributeEquals === -1
        ? attribute
        : attribute.slice(0, attributeEquals).trim();
    const attributeValue =
      attributeEquals === -1
        ? undefined
        : attribute.slice(attributeEquals + 1).trim();
    const lowerName = attributeName.toLowerCase();

    if (KNOWN_ATTRIBUTES.has(lowerName)) {
      if (seenAttributes.has(lowerName)) {
        findings.push(
          makeFinding(
            `parse/duplicate-${lowerName}`,
            "warning",
            "syntax",
            `Duplicate ${attributeName} directive`,
            `"${attributeName}" was specified more than once. The first occurrence is used and later ones are ignored.`,
          ),
        );
        continue;
      }
      seenAttributes.add(lowerName);
    }

    switch (lowerName) {
      case "domain": {
        if (!attributeValue) {
          findings.push(
            makeFinding(
              "parse/empty-domain",
              "warning",
              "syntax",
              "Empty Domain value",
              "The Domain directive has no value and is ignored.",
            ),
          );
          break;
        }
        cookie.domain = attributeValue;
        break;
      }
      case "path": {
        if (!attributeValue) {
          findings.push(
            makeFinding(
              "parse/empty-path",
              "warning",
              "syntax",
              "Empty Path value",
              "The Path directive has no value and is ignored.",
            ),
          );
          break;
        }
        cookie.path = attributeValue;
        break;
      }
      case "expires": {
        const parsedDate = attributeValue
          ? new Date(attributeValue)
          : undefined;
        if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
          findings.push(
            makeFinding(
              "parse/invalid-expires",
              "warning",
              "syntax",
              "Invalid Expires value",
              `"${attributeValue ?? ""}" could not be parsed as a date and is ignored.`,
            ),
          );
          break;
        }
        cookie.expires = parsedDate;
        break;
      }
      case "max-age": {
        const parsedMaxAge = attributeValue ? Number(attributeValue) : NaN;
        if (!attributeValue || Number.isNaN(parsedMaxAge)) {
          findings.push(
            makeFinding(
              "parse/invalid-max-age",
              "warning",
              "syntax",
              "Invalid Max-Age value",
              `"${attributeValue ?? ""}" is not a valid number and is ignored.`,
            ),
          );
          break;
        }
        cookie.maxAge = parsedMaxAge;
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        const normalized = attributeValue?.toLowerCase() as
          | SameSiteValue
          | undefined;
        if (!normalized || !SAME_SITE_VALUES.includes(normalized)) {
          findings.push(
            makeFinding(
              "parse/invalid-samesite",
              "warning",
              "syntax",
              "Unrecognized SameSite value",
              `"${attributeValue ?? ""}" is not Strict, Lax, or None. SameSite is treated as unspecified.`,
            ),
          );
          break;
        }
        cookie.sameSite = normalized;
        break;
      }
      case "partitioned": {
        cookie.partitioned = true;
        break;
      }
      default: {
        cookie.unknownAttributes.push({
          name: attributeName,
          value: attributeValue,
        });
        break;
      }
    }
  }

  return { success: true, cookie, findings };
}
