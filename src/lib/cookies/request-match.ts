import type { EffectiveCookie, Finding, RequestMethod } from "@/types/cookie";
import { domainMatchesRequest } from "./domain-match";
import { isExpired } from "./expiration";
import { makeFinding } from "./finding";
import { pathMatches } from "./path-match";
import { evaluateSameSite, isSameSiteUrl } from "./same-site";

export interface RequestMatchInput {
  effective: EffectiveCookie;
  requestUrl: URL;
  topLevelUrl: URL;
  method: RequestMethod;
  isTopLevelNavigation: boolean;
  now: Date;
}

export interface RequestMatchResult {
  sent: boolean;
  findings: Finding[];
}

export function evaluateRequestMatch(
  input: RequestMatchInput,
): RequestMatchResult {
  const {
    effective,
    requestUrl,
    topLevelUrl,
    method,
    isTopLevelNavigation,
    now,
  } = input;
  const findings: Finding[] = [];

  const expired = isExpired(effective.expiresAt, now);
  if (expired) {
    findings.push(
      makeFinding(
        "request/expired",
        "error",
        "request",
        "Cookie has expired",
        "The cookie is not sent because its effective lifetime has already ended.",
      ),
    );
  } else {
    findings.push(
      makeFinding(
        "request/not-expired",
        "success",
        "request",
        "Cookie is not expired",
        "The cookie has not reached its effective expiration.",
      ),
    );
  }

  let secureOk = true;
  if (effective.secure) {
    secureOk = requestUrl.protocol === "https:";
    findings.push(
      secureOk
        ? makeFinding(
            "request/secure-satisfied",
            "success",
            "request",
            "HTTPS satisfies Secure",
            "The request uses HTTPS, which satisfies the Secure attribute.",
          )
        : makeFinding(
            "request/secure-blocked",
            "error",
            "request",
            "Request is not secure",
            "The cookie requires Secure, but the request does not use HTTPS.",
          ),
    );
  }

  const domainOk = domainMatchesRequest(effective, requestUrl.hostname);
  findings.push(
    domainOk
      ? makeFinding(
          "request/domain-matches",
          "success",
          "request",
          "Host matches cookie scope",
          effective.hostOnly
            ? `${requestUrl.hostname} matches the host-only cookie.`
            : `${requestUrl.hostname} matches Domain=${effective.domain}.`,
        )
      : makeFinding(
          "request/domain-mismatch",
          "error",
          "request",
          "Host does not match cookie scope",
          effective.hostOnly
            ? `The cookie is host-only for ${effective.host}, but the request targets ${requestUrl.hostname}.`
            : `${requestUrl.hostname} is outside Domain=${effective.domain}.`,
        ),
  );

  const pathOk = pathMatches(effective.path, requestUrl.pathname);
  findings.push(
    pathOk
      ? makeFinding(
          "request/path-matches",
          "success",
          "request",
          "Path matches",
          `${requestUrl.pathname} matches Path=${effective.path}.`,
        )
      : makeFinding(
          "request/path-mismatch",
          "error",
          "request",
          "Path does not match",
          `The cookie is not sent because ${requestUrl.pathname} is outside Path=${effective.path}.`,
        ),
  );

  const sameSite = isSameSiteUrl(requestUrl, topLevelUrl);
  const decision = evaluateSameSite({
    sameSite: effective.sameSite,
    isSameSite: sameSite,
    method,
    isTopLevelNavigation,
  });
  findings.push(
    decision.allowed
      ? makeFinding(
          "request/samesite-allowed",
          "success",
          "request",
          "SameSite allows this request",
          decision.reason,
        )
      : makeFinding(
          "request/samesite-blocked",
          "error",
          "request",
          "SameSite blocks this request",
          decision.reason,
        ),
  );

  const sent = !expired && secureOk && domainOk && pathOk && decision.allowed;

  return { sent, findings };
}
