import type { Finding } from "@/types/cookie";
import { makeFinding } from "./finding";

const INVALID_NAME_CHARS = /[\x00-\x1F\x7F()<>@,;:\\"/[\]?={} \t]/;
const INVALID_VALUE_CHARS = /[\x00-\x1F\x7F,;\\"\s]/;

export function validateCookieNameValue(
  name: string,
  value: string,
): Finding[] {
  const findings: Finding[] = [];

  if (INVALID_NAME_CHARS.test(name)) {
    findings.push(
      makeFinding(
        "validate/invalid-name",
        "error",
        "syntax",
        "Invalid cookie name",
        `"${name}" contains characters that are not allowed in a cookie name.`,
      ),
    );
  }

  if (INVALID_VALUE_CHARS.test(value)) {
    findings.push(
      makeFinding(
        "validate/invalid-value",
        "error",
        "syntax",
        "Invalid cookie value",
        `The value of "${name}" contains characters that require quoting and are not allowed unquoted.`,
      ),
    );
  }

  return findings;
}
