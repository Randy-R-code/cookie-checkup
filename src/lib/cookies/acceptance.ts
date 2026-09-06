import type { CookieSource, Finding, ParsedCookie } from "@/types/cookie";
import { validateSettingDomain, type DomainValidation } from "./domain-match";
import { makeFinding } from "./finding";
import { computeDefaultPath } from "./path-match";
import { validateCookiePrefix } from "./prefixes";
import { validateCookieNameValue } from "./validate-cookie";

export interface AcceptanceContext {
  sourceHostname: string;
  sourcePathname: string;
  isSecureOrigin: boolean;
  source: CookieSource;
}

export interface AcceptanceResult {
  accepted: boolean;
  findings: Finding[];
  domainValidation: DomainValidation;
}

const LOCALHOST_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

export function evaluateAcceptance(
  cookie: ParsedCookie,
  ctx: AcceptanceContext,
): AcceptanceResult {
  const findings: Finding[] = [];

  findings.push(...validateCookieNameValue(cookie.name, cookie.value));

  const domainValidation = validateSettingDomain(
    ctx.sourceHostname,
    cookie.domain,
  );

  if (!domainValidation.valid) {
    findings.push(
      makeFinding(
        "acceptance/invalid-domain",
        "error",
        "scope",
        "Domain is not valid for this origin",
        domainValidation.reason === "public-suffix"
          ? `Domain=${cookie.domain} is a public suffix and cannot be used to scope a cookie.`
          : `Domain=${cookie.domain} is not the source host (${ctx.sourceHostname}) or one of its parent domains.`,
      ),
    );
  } else if (cookie.domain) {
    findings.push(
      makeFinding(
        "acceptance/valid-domain",
        "success",
        "scope",
        "Domain is valid for this origin",
        `Domain=${domainValidation.effectiveDomain} is compatible with the source host ${ctx.sourceHostname}.`,
      ),
    );
  }

  if (cookie.secure && !ctx.isSecureOrigin) {
    findings.push(
      makeFinding(
        "acceptance/secure-requires-secure-origin",
        "error",
        "security",
        "Secure requires a secure origin",
        "This cookie was set with Secure over an insecure (HTTP) connection, so the browser rejects it.",
      ),
    );

    if (LOCALHOST_HOSTNAMES.has(ctx.sourceHostname.toLowerCase())) {
      findings.push(
        makeFinding(
          "acceptance/localhost-secure-context",
          "info",
          "compatibility",
          "Localhost may behave differently",
          "Modern browsers often treat localhost as a secure context even over HTTP. Real-world behavior may differ from this simulation.",
        ),
      );
    }
  }

  if (cookie.sameSite === "none" && !cookie.secure) {
    findings.push(
      makeFinding(
        "acceptance/samesite-none-requires-secure",
        "error",
        "security",
        "SameSite=None requires Secure",
        "SameSite=None was specified without Secure, so the browser rejects this cookie.",
      ),
    );
  }

  if (cookie.partitioned && !cookie.secure) {
    findings.push(
      makeFinding(
        "acceptance/partitioned-requires-secure",
        "error",
        "security",
        "Partitioned requires Secure",
        "Partitioned was specified without Secure, so the browser rejects this cookie.",
      ),
    );
  }

  const effectivePath = cookie.path ?? computeDefaultPath(ctx.sourcePathname);
  const prefixValidation = validateCookiePrefix({
    name: cookie.name,
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    domainSpecified: Boolean(cookie.domain),
    effectivePath,
    isSecureOrigin: ctx.isSecureOrigin,
    source: ctx.source,
  });
  findings.push(...prefixValidation.findings);

  const accepted = findings.every((finding) => finding.severity !== "error");

  return { accepted, findings, domainValidation };
}
