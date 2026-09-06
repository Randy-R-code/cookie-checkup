"use client";

import { Field } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TextInput } from "@/components/ui/text-input";
import type { CookieSetContextInput } from "@/types/cookie";

export function SetContextForm({
  value,
  onChange,
}: {
  value: CookieSetContextInput;
  onChange: (value: CookieSetContextInput) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Field label="Cookie set from" htmlFor="set-source-url">
        <TextInput
          id="set-source-url"
          value={value.sourceUrl}
          onChange={(event) =>
            onChange({ ...value, sourceUrl: event.target.value })
          }
          placeholder="https://app.example.com/login"
        />
      </Field>
      <SegmentedControl
        label="Mechanism"
        value={value.source}
        onChange={(source) => onChange({ ...value, source })}
        options={[
          { value: "http-header", label: "HTTP Set-Cookie" },
          { value: "javascript", label: "document.cookie" },
        ]}
      />
    </div>
  );
}
