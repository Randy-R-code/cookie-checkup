import type { RequestMethod, SameSiteValue } from "@/types/cookie";
import { getDomain } from "tldts";

export function getRegistrableDomain(hostname: string): string | null {
  return getDomain(hostname);
}

// Schemeful same-site: same registrable domain AND same scheme.
export function isSameSiteUrl(urlA: URL, urlB: URL): boolean {
  if (urlA.protocol !== urlB.protocol) return false;

  const domainA = getRegistrableDomain(urlA.hostname);
  const domainB = getRegistrableDomain(urlB.hostname);

  if (!domainA || !domainB) {
    return urlA.hostname.toLowerCase() === urlB.hostname.toLowerCase();
  }

  return domainA === domainB;
}

export interface SameSiteDecision {
  allowed: boolean;
  reason: string;
}

export function evaluateSameSite(params: {
  sameSite: SameSiteValue;
  isSameSite: boolean;
  method: RequestMethod;
  isTopLevelNavigation: boolean;
}): SameSiteDecision {
  const { sameSite, isSameSite, method, isTopLevelNavigation } = params;

  if (isSameSite) {
    return { allowed: true, reason: "The request is same-site." };
  }

  if (sameSite === "none") {
    return {
      allowed: true,
      reason: "SameSite=None allows the cookie in cross-site requests.",
    };
  }

  if (sameSite === "strict") {
    return {
      allowed: false,
      reason: "SameSite=Strict blocks this cross-site request.",
    };
  }

  const isEligibleLaxNavigation = isTopLevelNavigation && method === "GET";
  if (isEligibleLaxNavigation) {
    return {
      allowed: true,
      reason: "SameSite=Lax allows this cross-site top-level GET navigation.",
    };
  }

  return {
    allowed: false,
    reason:
      "SameSite=Lax blocks this cross-site request because it is not a top-level GET navigation.",
  };
}
