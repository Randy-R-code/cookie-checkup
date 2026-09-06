import { Card } from "@/components/ui/card";
import type { CookieSimulationResult } from "@/types/cookie";
import { Database } from "lucide-react";
import { EffectiveCookieTable } from "./effective-cookie";
import { FindingList } from "./finding-list";

const TITLE = (
  <span className="flex items-center gap-1.5">
    <Database aria-hidden="true" className="h-4 w-4" />
    Stored cookie
  </span>
);

export function StorageCard({ result }: { result: CookieSimulationResult }) {
  if (!result.acceptance.accepted) {
    return (
      <Card title={TITLE}>
        <p className="text-sm text-zinc-500">
          Not stored — the cookie was rejected.
        </p>
      </Card>
    );
  }

  if (!result.storage) return null;

  return (
    <Card title={TITLE}>
      <EffectiveCookieTable
        cookie={result.storage.cookie}
        sessionCookie={result.storage.sessionCookie}
        expiresAt={result.storage.expiresAt}
      />
      {result.storage.findings.length > 0 ? (
        <div className="mt-3">
          <FindingList findings={result.storage.findings} />
        </div>
      ) : null}
    </Card>
  );
}
