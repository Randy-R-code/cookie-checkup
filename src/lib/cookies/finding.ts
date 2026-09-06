import type { Finding, FindingCategory, FindingSeverity } from "@/types/cookie";

export function makeFinding(
  id: string,
  severity: FindingSeverity,
  category: FindingCategory,
  title: string,
  message: string,
  technicalDetails?: string,
): Finding {
  return { id, severity, category, title, message, technicalDetails };
}
