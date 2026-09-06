import type { ParsedCookie, SameSiteValue } from "@/types/cookie";

export interface CookieBuilderFields {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: string;
  maxAge: string;
  sameSite: SameSiteValue | "";
  secure: boolean;
  httpOnly: boolean;
  partitioned: boolean;
}

export function builderFieldsFromParsedCookie(
  cookie?: ParsedCookie,
): CookieBuilderFields {
  return {
    name: cookie?.name ?? "",
    value: cookie?.value ?? "",
    domain: cookie?.domain ?? "",
    path: cookie?.path ?? "",
    expires: cookie?.expires ? cookie.expires.toUTCString() : "",
    maxAge: cookie?.maxAge !== undefined ? String(cookie.maxAge) : "",
    sameSite: cookie?.sameSite ?? "",
    secure: cookie?.secure ?? false,
    httpOnly: cookie?.httpOnly ?? false,
    partitioned: cookie?.partitioned ?? false,
  };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function serializeCookie(fields: CookieBuilderFields): string {
  const parts = [`${fields.name}=${fields.value}`];

  if (fields.domain) parts.push(`Domain=${fields.domain}`);
  if (fields.path) parts.push(`Path=${fields.path}`);
  if (fields.expires) parts.push(`Expires=${fields.expires}`);
  if (fields.maxAge) parts.push(`Max-Age=${fields.maxAge}`);
  if (fields.sameSite) parts.push(`SameSite=${capitalize(fields.sameSite)}`);
  if (fields.secure) parts.push("Secure");
  if (fields.httpOnly) parts.push("HttpOnly");
  if (fields.partitioned) parts.push("Partitioned");

  return parts.join("; ");
}
