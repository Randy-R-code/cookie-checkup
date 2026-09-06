"use client";

import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { CookiePreset } from "@/data/presets";
import { simulateCookie } from "@/lib/cookies/simulate";
import { decodeScenario } from "@/lib/share/decode-scenario";
import {
  buildShareableScenario,
  encodeScenario,
} from "@/lib/share/encode-scenario";
import type {
  CookieRequestContextInput,
  CookieSetContextInput,
} from "@/types/cookie";
import { useMemo, useState } from "react";
import { CookieBuilder } from "./cookie-builder";
import { CookieHeaderInput } from "./cookie-header-input";
import { FindingList } from "./finding-list";
import { JavascriptAccess } from "./javascript-access";
import { Lifecycle } from "./lifecycle";
import { Presets } from "./presets";
import { RequestContextForm } from "./request-context-form";
import { RequestResult } from "./request-result";
import { SetContextForm } from "./set-context-form";
import { StorageCard } from "./storage-card";

const DEFAULT_HEADER = "session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax";

const DEFAULT_SET_CONTEXT: CookieSetContextInput = {
  sourceUrl: "https://app.example.com/login",
  source: "http-header",
};

const DEFAULT_REQUEST_CONTEXT: CookieRequestContextInput = {
  requestUrl: "https://app.example.com/dashboard",
  topLevelUrl: "https://app.example.com/dashboard",
  method: "GET",
  isTopLevelNavigation: false,
};

// This component is only ever mounted client-side (see page.tsx), so reading
// the URL hash here at initial state time is safe and hydration-mismatch-free.
function readSharedScenario() {
  return decodeScenario(window.location.hash.slice(1));
}

export function CookieWorkspace() {
  const [rawHeader, setRawHeader] = useState(
    () => readSharedScenario()?.header ?? DEFAULT_HEADER,
  );
  const [setContext, setSetContext] = useState(
    () => readSharedScenario()?.setContext ?? DEFAULT_SET_CONTEXT,
  );
  const [requestContext, setRequestContext] = useState(
    () => readSharedScenario()?.requestContext ?? DEFAULT_REQUEST_CONTEXT,
  );
  const [mode, setMode] = useState<"raw" | "builder">("raw");
  const [copiedLink, setCopiedLink] = useState(false);

  const result = useMemo(
    () => simulateCookie({ header: rawHeader, setContext, requestContext }),
    [rawHeader, setContext, requestContext],
  );

  function reset() {
    setRawHeader(DEFAULT_HEADER);
    setSetContext(DEFAULT_SET_CONTEXT);
    setRequestContext(DEFAULT_REQUEST_CONTEXT);
    setMode("raw");
  }

  function applyPreset(preset: CookiePreset) {
    setRawHeader(preset.header);
    setSetContext(preset.setContext);
    setRequestContext(preset.requestContext);
    setMode("raw");
  }

  async function copyShareLink() {
    const scenario = buildShareableScenario(
      rawHeader,
      setContext,
      requestContext,
    );
    const encoded = encodeScenario(scenario);
    window.history.replaceState(null, "", `#${encoded}`);
    await navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card title="Cookie configuration">
            <div className="mb-3 flex items-center justify-between gap-3">
              <SegmentedControl
                label="Input mode"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "raw", label: "Raw header" },
                  { value: "builder", label: "Builder" },
                ]}
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  {copiedLink ? "Link copied!" : "Copy link"}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Reset
                </button>
              </div>
            </div>
            {mode === "raw" ? (
              <CookieHeaderInput
                value={rawHeader}
                onChange={setRawHeader}
                findings={result.parsing.findings}
              />
            ) : (
              <CookieBuilder
                cookie={result.parsing.cookie}
                onChange={setRawHeader}
              />
            )}
            <p className="mt-2 text-xs text-zinc-500">
              Copy link includes the values you configure below — nothing is
              sent to a server.
            </p>
          </Card>
          <Card title="Cookie set from">
            <SetContextForm value={setContext} onChange={setSetContext} />
          </Card>
          <Card title="Request context">
            <RequestContextForm
              value={requestContext}
              onChange={setRequestContext}
            />
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card title="Lifecycle">
            <Lifecycle result={result} />
          </Card>
          <div aria-live="polite" className="sr-only">
            {result.acceptance.accepted ? "Cookie accepted" : "Cookie rejected"}
          </div>
          <StorageCard result={result} />
          <RequestResult result={result} />
          <JavascriptAccess result={result} />
          {result.acceptance.findings.length > 0 ? (
            <Card title="Acceptance findings">
              <FindingList findings={result.acceptance.findings} />
            </Card>
          ) : null}
        </div>
      </div>
      <Presets onSelect={applyPreset} />
    </div>
  );
}
