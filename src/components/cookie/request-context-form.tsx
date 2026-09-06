"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import type { CookieRequestContextInput, RequestMethod } from "@/types/cookie";

const METHODS: RequestMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export function RequestContextForm({
  value,
  onChange,
}: {
  value: CookieRequestContextInput;
  onChange: (value: CookieRequestContextInput) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Request URL" htmlFor="request-url">
        <TextInput
          id="request-url"
          value={value.requestUrl}
          onChange={(event) =>
            onChange({ ...value, requestUrl: event.target.value })
          }
          placeholder="https://api.example.com/account"
        />
      </Field>
      <Field label="Top-level page" htmlFor="top-level-url">
        <TextInput
          id="top-level-url"
          value={value.topLevelUrl}
          onChange={(event) =>
            onChange({ ...value, topLevelUrl: event.target.value })
          }
          placeholder="https://app.example.com/dashboard"
        />
      </Field>
      <Field label="Method" htmlFor="request-method">
        <Select
          id="request-method"
          value={value.method}
          onChange={(event) =>
            onChange({ ...value, method: event.target.value as RequestMethod })
          }
        >
          {METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </Select>
      </Field>
      <div className="flex items-end">
        <Checkbox
          id="top-level-navigation"
          label="Top-level navigation"
          checked={value.isTopLevelNavigation}
          onChange={(checked) =>
            onChange({ ...value, isTopLevelNavigation: checked })
          }
        />
      </div>
    </div>
  );
}
