"use client";

import dynamic from "next/dynamic";

// CookieCheckup is a purely client-side simulator (it reads and writes the
// URL hash for scenario sharing), so it is excluded from server rendering.
const CookieWorkspace = dynamic(
  () => import("./cookie-workspace").then((mod) => mod.CookieWorkspace),
  { ssr: false },
);

export function CookieWorkspaceLoader() {
  return <CookieWorkspace />;
}
