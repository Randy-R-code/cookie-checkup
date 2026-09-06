import type { FindingSeverity } from "@/types/cookie";
import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";

const CONFIG: Record<
  FindingSeverity,
  { Icon: typeof CircleCheck; className: string }
> = {
  success: {
    Icon: CircleCheck,
    className: "text-emerald-600 dark:text-emerald-400",
  },
  info: { Icon: Info, className: "text-sky-600 dark:text-sky-400" },
  warning: {
    Icon: TriangleAlert,
    className: "text-amber-600 dark:text-amber-400",
  },
  error: { Icon: CircleX, className: "text-red-600 dark:text-red-400" },
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
