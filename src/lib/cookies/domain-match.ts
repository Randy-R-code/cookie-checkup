import type { EffectiveCookie } from "@/types/cookie";
import { parse } from "tldts";

export interface DomainValidation {
  valid: boolean;
  hostOnly: boolean;
  effectiveDomain?: string;
  reason?: "unrelated-domain" | "public-suffix";
}

export function normalizeDomain(domain: string): string {
  return domain.replace(/^\./, "").toLowerCase();
}

export function validateSettingDomain(
  sourceHostname: string,
  domainAttribute: string | undefined,
): DomainValidation {
  if (!domainAttribute) {
    return { valid: true, hostOnly: true };
  }

  const normalized = normalizeDomain(domainAttribute);
  const sourceLower = sourceHostname.toLowerCase();
  const isSourceItselfOrParent =
    sourceLower === normalized || sourceLower.endsWith(`.${normalized}`);

  if (!isSourceItselfOrParent) {
    return { valid: false, hostOnly: false, reason: "unrelated-domain" };
  }

  const suffixCheck = parse(normalized);
  if (!suffixCheck.domain) {
    return { valid: false, hostOnly: false, reason: "public-suffix" };
  }

  return { valid: true, hostOnly: false, effectiveDomain: normalized };
}

export function domainMatchesRequest(
  effective: Pick<EffectiveCookie, "hostOnly" | "host" | "domain">,
  requestHostname: string,
): boolean {
  const requestLower = requestHostname.toLowerCase();

  if (effective.hostOnly) {
    return requestLower === effective.host.toLowerCase();
  }

  const domain = (effective.domain ?? effective.host).toLowerCase();
  return requestLower === domain || requestLower.endsWith(`.${domain}`);
}
