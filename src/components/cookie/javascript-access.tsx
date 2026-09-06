import { Card } from "@/components/ui/card";
import type { CookieSimulationResult } from "@/types/cookie";
import { FindingList } from "./finding-list";

export function JavascriptAccess({
  result,
}: {
  result: CookieSimulationResult;
}) {
  if (!result.javascript) return null;

  return (
    <Card title="JavaScript access">
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
