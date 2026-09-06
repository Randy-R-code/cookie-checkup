"use client";

import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { simulateCookie } from "@/lib/cookies/simulate";
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

export function CookieWorkspace() {
  const [rawHeader, setRawHeader] = useState(DEFAULT_HEADER);
  const [setContext, setSetContext] = useState(DEFAULT_SET_CONTEXT);
  const [requestContext, setRequestContext] = useState(DEFAULT_REQUEST_CONTEXT);
  const [mode, setMode] = useState<"raw" | "builder">("raw");

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

  return (
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
            <button
              type="button"
              onClick={reset}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Reset
            </button>
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
  );
}
