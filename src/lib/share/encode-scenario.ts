import type {
  CookieRequestContextInput,
  CookieSetContextInput,
  RequestMethod,
} from "@/types/cookie";
import { toBase64Url } from "./base64url";

export interface ShareableScenario {
  version: 1;
  header: string;
  setUrl: string;
  setSource: "http-header" | "javascript";
  requestUrl: string;
  topLevelUrl: string;
  method: RequestMethod;
  isTopLevelNavigation: boolean;
}

export function buildShareableScenario(
  header: string,
  setContext: CookieSetContextInput,
  requestContext: CookieRequestContextInput,
): ShareableScenario {
  return {
    version: 1,
    header,
    setUrl: setContext.sourceUrl,
    setSource: setContext.source,
    requestUrl: requestContext.requestUrl,
    topLevelUrl: requestContext.topLevelUrl,
    method: requestContext.method,
    isTopLevelNavigation: requestContext.isTopLevelNavigation,
  };
}

export function encodeScenario(scenario: ShareableScenario): string {
  return toBase64Url(JSON.stringify(scenario));
}
