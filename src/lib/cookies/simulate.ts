import type { CookieScenario, CookieSimulationResult } from "@/types/cookie";
import { evaluateAcceptance } from "./acceptance";
import { computeEffectiveExpiration } from "./expiration";
import { makeFinding } from "./finding";
import { evaluateJavascriptAccess } from "./js-access";
import { buildEffectiveCookie } from "./normalize-cookie";
import { parseSetCookie } from "./parse-set-cookie";
import { evaluateRequestMatch } from "./request-match";

function parseAbsoluteUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

export function simulateCookie(
  scenario: CookieScenario,
): CookieSimulationResult {
  const parsing = parseSetCookie(scenario.header);

  const sourceUrl = parseAbsoluteUrl(scenario.setContext.sourceUrl);
  if (!sourceUrl) {
    return {
      parsing,
      acceptance: {
        accepted: false,
        findings: [
          makeFinding(
            "acceptance/invalid-source-url",
            "error",
            "syntax",
            "Invalid source URL",
            "The URL the cookie is set from must be a valid absolute URL, e.g. https://app.example.com/login.",
          ),
        ],
      },
    };
  }

  if (!parsing.success || !parsing.cookie) {
    return { parsing, acceptance: { accepted: false, findings: [] } };
  }

  const cookie = parsing.cookie;
  const now = scenario.setContext.now ?? new Date();
  const isSecureOrigin = sourceUrl.protocol === "https:";

  const acceptance = evaluateAcceptance(cookie, {
    sourceHostname: sourceUrl.hostname,
    sourcePathname: sourceUrl.pathname,
    isSecureOrigin,
    source: scenario.setContext.source,
  });

  const result: CookieSimulationResult = { parsing, acceptance };

  if (!acceptance.accepted) {
    return result;
  }

  const { cookie: effectiveBase, findings: normalizeFindings } =
    buildEffectiveCookie(cookie, {
      sourceHostname: sourceUrl.hostname,
      sourcePathname: sourceUrl.pathname,
      domainValidation: acceptance.domainValidation,
    });

  const expiration = computeEffectiveExpiration(
    { expires: cookie.expires, maxAge: cookie.maxAge },
    now,
  );

  const effectiveCookie = { ...effectiveBase, expiresAt: expiration.expiresAt };

  result.storage = {
    cookie: effectiveCookie,
    sessionCookie: expiration.sessionCookie,
    expiresAt: expiration.expiresAt,
    findings: [...normalizeFindings, ...expiration.findings],
  };

  result.javascript = evaluateJavascriptAccess(effectiveCookie);

  if (scenario.requestContext) {
    const requestUrl = parseAbsoluteUrl(scenario.requestContext.requestUrl);
    const topLevelUrl = parseAbsoluteUrl(scenario.requestContext.topLevelUrl);

    if (!requestUrl || !topLevelUrl) {
      result.request = {
        sent: false,
        findings: [
          makeFinding(
            "request/invalid-url",
            "error",
            "syntax",
            "Invalid request context URL",
            "The request URL and top-level URL must both be valid absolute URLs.",
          ),
        ],
      };
    } else {
      result.request = evaluateRequestMatch({
        effective: effectiveCookie,
        requestUrl,
        topLevelUrl,
        method: scenario.requestContext.method,
        isTopLevelNavigation: scenario.requestContext.isTopLevelNavigation,
        now: scenario.requestContext.now ?? now,
      });
    }
  }

  return result;
}
