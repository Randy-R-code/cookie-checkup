import type { FindingSeverity } from "@/types/cookie";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

const CONFIG: Record<
  FindingSeverity,
  { Icon: typeof CheckCircle2; className: string }
> = {
  success: {
    Icon: CheckCircle2,
    className: "text-emerald-600 dark:text-emerald-400",
  },
  info: { Icon: Info, className: "text-sky-600 dark:text-sky-400" },
  warning: {
    Icon: AlertTriangle,
    className: "text-amber-600 dark:text-amber-400",
  },
  error: { Icon: XCircle, className: "text-red-600 dark:text-red-400" },
};

export function StatusIcon({ severity }: { severity: FindingSeverity }) {
  const { Icon, className } = CONFIG[severity];
  return (
    <Icon
      aria-hidden="true"
      className={`mt-0.5 h-4 w-4 shrink-0 ${className}`}
    />
  );
}
