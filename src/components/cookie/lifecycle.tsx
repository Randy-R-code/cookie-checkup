import type { CookieSimulationResult } from "@/types/cookie";
import { Check, Minus, X } from "lucide-react";

type StepStatus = "success" | "blocked" | "inactive";

interface Step {
  label: string;
  status: StepStatus;
  detail?: string;
}

const INACTIVE_TAIL: Step[] = [
  { label: "Stored", status: "inactive" },
  { label: "Request match", status: "inactive" },
  { label: "Sent", status: "inactive" },
  { label: "JS access", status: "inactive" },
];

function buildSteps(result: CookieSimulationResult): Step[] {
  const received: Step = { label: "Received", status: "success" };

  const parsed: Step = {
    label: "Parsed",
    status: result.parsing.success ? "success" : "blocked",
    detail: result.parsing.success
      ? undefined
      : result.parsing.findings[0]?.title,
  };

  if (!result.parsing.success) {
    return [
      received,
      parsed,
      { label: "Accepted", status: "inactive" },
      ...INACTIVE_TAIL,
    ];
  }

  const accepted: Step = {
    label: "Accepted",
    status: result.acceptance.accepted ? "success" : "blocked",
    detail: result.acceptance.accepted
      ? undefined
      : result.acceptance.findings.find(
          (finding) => finding.severity === "error",
        )?.title,
  };

  if (!result.acceptance.accepted) {
    return [received, parsed, accepted, ...INACTIVE_TAIL];
  }

  const stored: Step = { label: "Stored", status: "success" };

  const hasRequest = Boolean(result.request);
  const sent = result.request?.sent ?? false;
  const requestDetail = hasRequest
    ? result.request?.findings.find((finding) => finding.severity === "error")
        ?.title
    : undefined;

  const requestMatch: Step = {
    label: "Request match",
    status: !hasRequest ? "inactive" : sent ? "success" : "blocked",
    detail: requestDetail,
  };

  const sentStep: Step = {
    label: "Sent",
    status: !hasRequest ? "inactive" : sent ? "success" : "blocked",
  };

  const accessible = result.javascript?.accessible ?? false;
  const jsAccess: Step = {
    label: "JS access",
    status: accessible ? "success" : "blocked",
    detail: accessible ? undefined : "HttpOnly",
  };

  return [received, parsed, accepted, stored, requestMatch, sentStep, jsAccess];
}

const ICONS: Record<StepStatus, { Icon: typeof Check; className: string }> = {
  success: {
    Icon: Check,
    className:
      "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  blocked: {
    Icon: X,
    className:
      "border-red-500 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
  },
  inactive: {
    Icon: Minus,
    className:
      "border-zinc-300 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-600",
  },
};

export function Lifecycle({ result }: { result: CookieSimulationResult }) {
  const steps = buildSteps(result);

  return (
    <ol className="flex flex-col gap-2">
      {steps.map((step, index) => {
        const { Icon, className } = ICONS[step.status];
        return (
          <li key={step.label} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${className}`}
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">
              {index + 1}.
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {step.label}
            </span>
            {step.detail ? (
              <span className="text-zinc-500 dark:text-zinc-400">
                — {step.detail}
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
