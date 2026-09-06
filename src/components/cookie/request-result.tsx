import { Card } from "@/components/ui/card";
import type { CookieSimulationResult } from "@/types/cookie";
import { FindingList } from "./finding-list";

export function RequestResult({ result }: { result: CookieSimulationResult }) {
  if (!result.request) return null;

  return (
    <Card title="Request">
      <p
        className={`mb-3 text-sm font-semibold ${
          result.request.sent
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {result.request.sent
          ? "Cookie will be sent"
          : "Cookie will NOT be sent"}
      </p>
      <FindingList findings={result.request.findings} />
    </Card>
  );
}
