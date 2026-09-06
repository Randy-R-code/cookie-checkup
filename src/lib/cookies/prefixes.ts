import type { CookieSource, Finding } from "@/types/cookie";
import { makeFinding } from "./finding";

export type CookiePrefix = "__Secure-" | "__Host-" | "__Http-" | "__Host-Http-";

export interface PrefixValidation {
  prefix?: CookiePrefix;
  valid: boolean;
  findings: Finding[];
}

function detectPrefix(name: string): CookiePrefix | undefined {
  if (name.startsWith("__Host-Http-")) return "__Host-Http-";
  if (name.startsWith("__Host-")) return "__Host-";
  if (name.startsWith("__Http-")) return "__Http-";
  if (name.startsWith("__Secure-")) return "__Secure-";
  return undefined;
}

export function validateCookiePrefix(params: {
  name: string;
  secure: boolean;
  httpOnly: boolean;
  domainSpecified: boolean;
  effectivePath: string;
  isSecureOrigin: boolean;
  source: CookieSource;
}): PrefixValidation {
  const prefix = detectPrefix(params.name);
  if (!prefix) {
    return { valid: true, findings: [] };
  }

  const findings: Finding[] = [];
  const requiresHost = prefix === "__Host-" || prefix === "__Host-Http-";
  const requiresHttpOnly = prefix === "__Http-" || prefix === "__Host-Http-";
  const isForwardLooking = prefix === "__Http-" || prefix === "__Host-Http-";

  if (!params.isSecureOrigin || !params.secure) {
    findings.push(
      makeFinding(
        `prefix/${prefix}-requires-secure`,
        "error",
        "security",
        `${prefix} requires Secure`,
        `Cookies named with the ${prefix} prefix must be set with the Secure attribute from a secure (HTTPS) origin.`,
      ),
    );
  }

  if (requiresHttpOnly && !params.httpOnly) {
    findings.push(
      makeFinding(
        `prefix/${prefix}-requires-httponly`,
        "error",
        "security",
        `${prefix} requires HttpOnly`,
        `Cookies named with the ${prefix} prefix must be set with the HttpOnly attribute.`,
      ),
    );
  }

  if (requiresHttpOnly && params.source !== "http-header") {
    findings.push(
      makeFinding(
        `prefix/${prefix}-requires-http-header`,
        "error",
        "security",
        `${prefix} must be set via an HTTP header`,
        `Cookies named with the ${prefix} prefix must be created through an HTTP Set-Cookie response header, not JavaScript.`,
      ),
    );
  }

  if (requiresHost && params.domainSpecified) {
    findings.push(
      makeFinding(
        `prefix/${prefix}-forbids-domain`,
        "error",
        "security",
        `${prefix} forbids Domain`,
        `Cookies named with the ${prefix} prefix must not specify a Domain attribute; they are host-bound.`,
      ),
    );
  }

  if (requiresHost && params.effectivePath !== "/") {
    findings.push(
      makeFinding(
        `prefix/${prefix}-requires-root-path`,
        "error",
        "security",
        `${prefix} requires Path=/`,
        `Cookies named with the ${prefix} prefix must have an effective Path of /.`,
      ),
    );
  }

  if (findings.length === 0) {
    findings.push(
      makeFinding(
        `prefix/${prefix}-satisfied`,
        "success",
        "security",
        `${prefix} requirements satisfied`,
        requiresHost
          ? `This cookie is host-bound: it is scoped to a single host with no Domain attribute and Path=/.`
          : `This cookie meets the requirements of the ${prefix} prefix.`,
      ),
    );
  }

  if (isForwardLooking) {
    findings.push(
      makeFinding(
        `prefix/${prefix}-compatibility`,
        "info",
        "compatibility",
        `${prefix} has limited browser support`,
        `${prefix} is a forward-looking prefix and is not yet implemented by every browser. Treat this evaluation as the intended behavior, not a compatibility guarantee.`,
      ),
    );
  }

  return {
    prefix,
    valid: findings.every((f) => f.severity !== "error"),
    findings,
  };
}
