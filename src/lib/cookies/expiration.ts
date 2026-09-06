import type { Finding } from "@/types/cookie";
import { makeFinding } from "./finding";

export interface ExpirationResult {
  sessionCookie: boolean;
  expiresAt?: Date;
  findings: Finding[];
}

export function computeEffectiveExpiration(
  parsed: { expires?: Date; maxAge?: number },
  now: Date,
): ExpirationResult {
  const findings: Finding[] = [];

  if (parsed.maxAge !== undefined && parsed.expires !== undefined) {
    findings.push(
      makeFinding(
        "expiration/max-age-precedence",
        "info",
        "storage",
        "Max-Age takes precedence",
        "Both Expires and Max-Age were specified. Max-Age determines the effective lifetime; Expires is ignored.",
      ),
    );
  }

  if (parsed.maxAge !== undefined) {
    if (parsed.maxAge <= 0) {
      findings.push(
        makeFinding(
          "expiration/max-age-non-positive",
          "info",
          "storage",
          "Cookie deleted immediately",
          "Max-Age is zero or negative, so the browser deletes this cookie immediately instead of storing it.",
        ),
      );
      return { sessionCookie: false, expiresAt: new Date(0), findings };
    }

    return {
      sessionCookie: false,
      expiresAt: new Date(now.getTime() + parsed.maxAge * 1000),
      findings,
    };
  }

  if (parsed.expires !== undefined) {
    if (parsed.expires.getTime() <= now.getTime()) {
      findings.push(
        makeFinding(
          "expiration/expires-in-past",
          "info",
          "storage",
          "Cookie deleted immediately",
          "Expires is set to a date in the past, so the browser deletes this cookie immediately instead of storing it.",
        ),
      );
    }
    return { sessionCookie: false, expiresAt: parsed.expires, findings };
  }

  findings.push(
    makeFinding(
      "expiration/session-cookie",
      "info",
      "storage",
      "Session cookie",
      "No Expires or Max-Age was specified, so this cookie is deleted when the browsing session ends.",
    ),
  );
  return { sessionCookie: true, findings };
}

export function isExpired(expiresAt: Date | undefined, now: Date): boolean {
  if (!expiresAt) return false;
  return expiresAt.getTime() <= now.getTime();
}
