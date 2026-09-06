import { StatusIcon } from "@/components/ui/status-icon";
import type { Finding } from "@/types/cookie";

export function FindingList({ findings }: { findings: Finding[] }) {
  if (findings.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2.5">
      {findings.map((finding) => (
        <li key={finding.id} className="flex gap-2">
          <StatusIcon severity={finding.severity} />
          <div className="text-sm">
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {finding.title}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              {finding.message}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
