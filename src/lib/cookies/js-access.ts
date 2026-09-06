import type { EffectiveCookie, Finding } from "@/types/cookie";
import { makeFinding } from "./finding";

export interface JavascriptAccessResult {
  accessible: boolean;
  findings: Finding[];
}

export function evaluateJavascriptAccess(
  effective: Pick<EffectiveCookie, "httpOnly">,
): JavascriptAccessResult {
  if (effective.httpOnly) {
    return {
      accessible: false,
      findings: [
        makeFinding(
          "javascript/protected",
          "success",
          "javascript",
          "Protected from JavaScript",
          "document.cookie cannot read this cookie because HttpOnly is set. It can still be attached to matching requests.",
        ),
      ],
    };
  }

  return {
    accessible: true,
    findings: [
      makeFinding(
        "javascript/readable",
        "warning",
        "javascript",
        "Readable by JavaScript",
        "document.cookie can read this cookie because HttpOnly is not set.",
      ),
    ],
  };
}
