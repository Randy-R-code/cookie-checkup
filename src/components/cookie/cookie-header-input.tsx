"use client";

import type { Finding } from "@/types/cookie";
import { useState } from "react";
import { FindingList } from "./finding-list";

export function CookieHeaderInput({
  value,
  onChange,
  findings,
}: {
  value: string;
  onChange: (value: string) => void;
  findings: Finding[];
}) {
  const [copied, setCopied] = useState(false);
  const hasError = findings.some((finding) => finding.severity === "error");

  async function copyHeader() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="raw-header"
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >
          Set-Cookie header
        </label>
        <button
          type="button"
          onClick={copyHeader}
          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <textarea
        id="raw-header"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        spellCheck={false}
        aria-invalid={hasError}
        aria-describedby={
          findings.length > 0 ? "raw-header-findings" : undefined
        }
        placeholder="session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax"
        className="w-full resize-none rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 font-mono text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      {findings.length > 0 ? (
        <div id="raw-header-findings">
          <FindingList findings={findings} />
        </div>
      ) : null}
    </div>
  );
}
