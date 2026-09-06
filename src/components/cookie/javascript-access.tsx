import { Card } from "@/components/ui/card";
import type { CookieSimulationResult } from "@/types/cookie";
import { Code } from "lucide-react";
import { FindingList } from "./finding-list";

const TITLE = (
  <span className="flex items-center gap-1.5">
    <Code aria-hidden="true" className="h-4 w-4" />
    JavaScript access
  </span>
);

export function JavascriptAccess({
  result,
}: {
  result: CookieSimulationResult;
}) {
  if (!result.javascript) return null;

  return (
    <Card title={TITLE}>
      <p
        className={`mb-3 text-sm font-semibold ${
          result.javascript.accessible
            ? "text-amber-600 dark:text-amber-400"
            : "text-emerald-600 dark:text-emerald-400"
        }`}
      >
        {result.javascript.accessible
          ? "document.cookie can read this cookie"
          : "Protected from document.cookie"}
      </p>
      <FindingList findings={result.javascript.findings} />
    </Card>
  );
}
