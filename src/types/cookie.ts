export type SameSiteValue = "strict" | "lax" | "none";

export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type CookieSource = "http-header" | "javascript";

export interface ParsedCookie {
  name: string;
  value: string;

  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;

  secure: boolean;
  httpOnly: boolean;
  sameSite?: SameSiteValue;
  partitioned: boolean;

  unknownAttributes: Array<{
    name: string;
    value?: string;
  }>;
}

export interface CookieSetContextInput {
  sourceUrl: string;
  source: CookieSource;
  now?: Date;
}

export interface CookieRequestContextInput {
  requestUrl: string;
  topLevelUrl: string;
  method: RequestMethod;
  isTopLevelNavigation: boolean;
  now?: Date;
}

export interface CookieScenario {
  header: string;
  setContext: CookieSetContextInput;
  requestContext?: CookieRequestContextInput;
}

export type FindingSeverity = "info" | "success" | "warning" | "error";

export type FindingCategory =
  | "syntax"
  | "security"
  | "scope"
  | "storage"
  | "request"
  | "javascript"
  | "compatibility";

export interface Finding {
  id: string;
  severity: FindingSeverity;
  category: FindingCategory;
  title: string;
  message: string;
  technicalDetails?: string;
}

export interface EffectiveCookie {
  name: string;
  value: string;
  host: string;
  domain?: string;
  hostOnly: boolean;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: SameSiteValue;
  sameSiteSpecified: boolean;
  partitioned: boolean;
  expiresAt?: Date;
}

export interface CookieSimulationResult {
  parsing: {
    success: boolean;
    cookie?: ParsedCookie;
    findings: Finding[];
  };

  acceptance: {
    accepted: boolean;
    findings: Finding[];
  };

  storage?: {
    cookie: EffectiveCookie;
    sessionCookie: boolean;
    expiresAt?: Date;
    findings: Finding[];
  };

  request?: {
    sent: boolean;
    findings: Finding[];
  };

  javascript?: {
    accessible: boolean;
    findings: Finding[];
  };
}
