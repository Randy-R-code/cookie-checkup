import type {
  CookieRequestContextInput,
  CookieSetContextInput,
} from "@/types/cookie";

export interface CookiePreset {
  id: string;
  name: string;
  description: string;
  header: string;
  setContext: CookieSetContextInput;
  requestContext: CookieRequestContextInput;
}

export const COOKIE_PRESETS: CookiePreset[] = [
  {
    id: "secure-session",
    name: "Secure session",
    description: "A well-configured session cookie.",
    header: "session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax",
    setContext: {
      sourceUrl: "https://app.example.com/login",
      source: "http-header",
    },
    requestContext: {
      requestUrl: "https://app.example.com/dashboard",
      topLevelUrl: "https://app.example.com/dashboard",
      method: "GET",
      isTopLevelNavigation: false,
    },
  },
  {
    id: "cross-site-cookie",
    name: "Cross-site cookie",
    description: "A third-party widget cookie sent across sites.",
    header: "widget_session=abc123; Path=/; Secure; HttpOnly; SameSite=None",
    setContext: {
      sourceUrl: "https://widgets.example.com/init",
      source: "http-header",
    },
    requestContext: {
      requestUrl: "https://widgets.example.com/track",
      topLevelUrl: "https://news.example/article",
      method: "GET",
      isTopLevelNavigation: false,
    },
  },
  {
    id: "invalid-samesite-none",
    name: "Invalid SameSite=None",
    description: "Rejected because Secure is missing.",
    header: "session=abc123; Path=/; HttpOnly; SameSite=None",
    setContext: {
      sourceUrl: "https://app.example.com/login",
      source: "http-header",
    },
    requestContext: {
      requestUrl: "https://app.example.com/dashboard",
      topLevelUrl: "https://app.example.com/dashboard",
      method: "GET",
      isTopLevelNavigation: false,
    },
  },
  {
    id: "host-bound-cookie",
    name: "Host-bound cookie",
    description: "A __Host- cookie, strictly scoped to a single host.",
    header: "__Host-session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax",
    setContext: {
      sourceUrl: "https://app.example.com/login",
      source: "http-header",
    },
    requestContext: {
      requestUrl: "https://app.example.com/dashboard",
      topLevelUrl: "https://app.example.com/dashboard",
      method: "GET",
      isTopLevelNavigation: false,
    },
  },
  {
    id: "invalid-host-prefix",
    name: "Invalid __Host-",
    description: "Rejected because __Host- forbids a Domain attribute.",
    header: "__Host-session=abc123; Domain=example.com; Path=/; Secure",
    setContext: {
      sourceUrl: "https://app.example.com/login",
      source: "http-header",
    },
    requestContext: {
      requestUrl: "https://app.example.com/dashboard",
      topLevelUrl: "https://app.example.com/dashboard",
      method: "GET",
      isTopLevelNavigation: false,
    },
  },
  {
    id: "path-scoped-cookie",
    name: "Path-scoped cookie",
    description: "A preference cookie limited to a specific section.",
    header: "preferences=compact; Path=/account; SameSite=Lax",
    setContext: {
      sourceUrl: "https://app.example.com/account/settings",
      source: "http-header",
    },
    requestContext: {
      requestUrl: "https://app.example.com/account/billing",
      topLevelUrl: "https://app.example.com/account/billing",
      method: "GET",
      isTopLevelNavigation: false,
    },
  },
  {
    id: "partitioned-example",
    name: "Partitioned example",
    description: "A CHIPS-style partitioned cookie for embedded widgets.",
    header: "widget=abc123; Path=/; Secure; SameSite=None; Partitioned",
    setContext: {
      sourceUrl: "https://widgets.example.com/init",
      source: "http-header",
    },
    requestContext: {
      requestUrl: "https://widgets.example.com/track",
      topLevelUrl: "https://news.example/article",
      method: "GET",
      isTopLevelNavigation: false,
    },
  },
];
