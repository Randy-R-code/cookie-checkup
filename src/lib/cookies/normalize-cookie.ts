import type { EffectiveCookie, Finding, ParsedCookie } from "@/types/cookie";
import type { DomainValidation } from "./domain-match";
import { makeFinding } from "./finding";
import { computeDefaultPath } from "./path-match";

const SENSITIVE_NAME_PATTERN = /(session|auth|token|jwt|sid|login)/i;

export interface NormalizeContext {
  sourceHostname: string;
  sourcePathname: string;
  domainValidation: DomainValidation;
}

export function buildEffectiveCookie(
  cookie: ParsedCookie,
  ctx: NormalizeContext,
): { cookie: Omit<EffectiveCookie, "expiresAt">; findings: Finding[] } {
  const findings: Finding[] = [];
  const hostOnly = ctx.domainValidation.hostOnly;
  const path = cookie.path ?? computeDefaultPath(ctx.sourcePathname);
  const sameSiteSpecified = cookie.sameSite !== undefined;
  const sameSite = cookie.sameSite ?? "lax";

  if (hostOnly) {
    findings.push(
      makeFinding(
        "storage/host-only",
        "info",
        "scope",
        "Host-only cookie",
        `No Domain attribute was specified, so this cookie is scoped only to ${ctx.sourceHostname}.`,
      ),
    );
  } else {
    findings.push(
      makeFinding(
        "storage/domain-cookie",
        "info",
        "scope",
        "Domain cookie",
        `This cookie is available to ${ctx.domainValidation.effectiveDomain} and all of its subdomains.`,
      ),
    );
  }

  if (!cookie.path) {
    findings.push(
      makeFinding(
        "storage/default-path",
        "info",
        "storage",
        "Default path computed",
        `No Path attribute was specified. The effective path is ${path}, derived from the request path.`,
      ),
    );
  }

  if (!sameSiteSpecified) {
    findings.push(
      makeFinding(
        "storage/samesite-default",
        "info",
        "compatibility",
        "SameSite defaulted to Lax",
        "SameSite was not specified. CookieCheckup evaluates it using the modern Lax-by-default behavior.",
      ),
    );
  } else if (sameSite === "none") {
    findings.push(
      makeFinding(
        "storage/samesite-none",
        "warning",
        "security",
        "Cookie can be sent cross-site",
        "SameSite=None allows this cookie to be sent in cross-site requests. Make sure that is intentional.",
      ),
    );
  }

  const looksSensitive = SENSITIVE_NAME_PATTERN.test(cookie.name);

  if (looksSensitive && !cookie.httpOnly) {
    findings.push(
      makeFinding(
        "storage/advice-httponly",
        "warning",
        "security",
        "Consider HttpOnly",
        `"${cookie.name}" looks like a session or authentication cookie but is readable by JavaScript. Consider adding HttpOnly.`,
      ),
    );
  }

  if (looksSensitive && !cookie.secure) {
    findings.push(
      makeFinding(
        "storage/advice-secure",
        "warning",
        "security",
        "Consider Secure",
        `"${cookie.name}" looks like a session or authentication cookie but does not require HTTPS. Consider adding Secure.`,
      ),
    );
  }

  const qualifiesForHost =
    hostOnly &&
    path === "/" &&
    cookie.secure &&
    !cookie.name.startsWith("__Host-") &&
    !cookie.name.startsWith("__Secure-");

  if (qualifiesForHost) {
    findings.push(
      makeFinding(
        "storage/advice-host-prefix",
        "info",
        "security",
        "Eligible for the __Host- prefix",
        `This cookie already meets the requirements of the __Host- prefix. Renaming it to __Host-${cookie.name} would make that guarantee explicit and enforced by the browser.`,
      ),
    );
  }

  if (looksSensitive && cookie.httpOnly && cookie.secure && hostOnly) {
    findings.push(
      makeFinding(
        "storage/advice-good-config",
        "success",
        "security",
        "Solid session cookie configuration",
        `"${cookie.name}" is Secure, HttpOnly, and host-only — a strong configuration for a session-like cookie.`,
      ),
    );
  }

  const effective: Omit<EffectiveCookie, "expiresAt"> = {
    name: cookie.name,
    value: cookie.value,
    host: ctx.sourceHostname,
    domain: ctx.domainValidation.effectiveDomain,
    hostOnly,
    path,
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    sameSite,
    sameSiteSpecified,
    partitioned: cookie.partitioned,
  };

  return { cookie: effective, findings };
}
