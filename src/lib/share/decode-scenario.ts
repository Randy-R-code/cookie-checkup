import type {
  CookieRequestContextInput,
  CookieSetContextInput,
  RequestMethod,
} from "@/types/cookie";
import { fromBase64Url } from "./base64url";
import type { ShareableScenario } from "./encode-scenario";

const REQUEST_METHODS: RequestMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
];

export interface DecodedScenario {
  header: string;
  setContext: CookieSetContextInput;
  requestContext: CookieRequestContextInput;
}

function isShareableScenario(value: unknown): value is ShareableScenario {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;

  return (
    candidate.version === 1 &&
    typeof candidate.header === "string" &&
    typeof candidate.setUrl === "string" &&
    (candidate.setSource === "http-header" ||
      candidate.setSource === "javascript") &&
    typeof candidate.requestUrl === "string" &&
    typeof candidate.topLevelUrl === "string" &&
    REQUEST_METHODS.includes(candidate.method as RequestMethod) &&
    typeof candidate.isTopLevelNavigation === "boolean"
  );
}

export function decodeScenario(encoded: string): DecodedScenario | undefined {
  try {
    const parsed: unknown = JSON.parse(fromBase64Url(encoded));
    if (!isShareableScenario(parsed)) return undefined;

    return {
      header: parsed.header,
      setContext: { sourceUrl: parsed.setUrl, source: parsed.setSource },
      requestContext: {
        requestUrl: parsed.requestUrl,
        topLevelUrl: parsed.topLevelUrl,
        method: parsed.method,
        isTopLevelNavigation: parsed.isTopLevelNavigation,
      },
    };
  } catch {
    return undefined;
  }
}
