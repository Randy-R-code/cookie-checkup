"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import {
  builderFieldsFromParsedCookie,
  serializeCookie,
  type CookieBuilderFields,
} from "@/lib/cookies/serialize-cookie";
import type { ParsedCookie } from "@/types/cookie";

export function CookieBuilder({
  cookie,
  onChange,
}: {
  cookie?: ParsedCookie;
  onChange: (header: string) => void;
}) {
  const fields = builderFieldsFromParsedCookie(cookie);

  function update<K extends keyof CookieBuilderFields>(
    key: K,
    value: CookieBuilderFields[K],
  ) {
    onChange(serializeCookie({ ...fields, [key]: value }));
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Name" htmlFor="builder-name">
        <TextInput
          id="builder-name"
          value={fields.name}
          onChange={(event) => update("name", event.target.value)}
        />
      </Field>
      <Field label="Value" htmlFor="builder-value">
        <TextInput
          id="builder-value"
          value={fields.value}
          onChange={(event) => update("value", event.target.value)}
        />
      </Field>
      <Field
        label="Domain"
        htmlFor="builder-domain"
        hint="Leave empty for a host-only cookie"
      >
        <TextInput
          id="builder-domain"
          value={fields.domain}
          onChange={(event) => update("domain", event.target.value)}
          placeholder="example.com"
        />
      </Field>
      <Field
        label="Path"
        htmlFor="builder-path"
        hint="Leave empty to use the default path"
      >
        <TextInput
          id="builder-path"
          value={fields.path}
          onChange={(event) => update("path", event.target.value)}
          placeholder="/"
        />
      </Field>
      <Field
        label="Expires"
        htmlFor="builder-expires"
        hint="Leave empty for a session cookie"
      >
        <TextInput
          id="builder-expires"
          value={fields.expires}
          onChange={(event) => update("expires", event.target.value)}
          placeholder="Wed, 21 Oct 2026 07:28:00 GMT"
        />
      </Field>
      <Field
        label="Max-Age"
        htmlFor="builder-max-age"
        hint="In seconds, takes precedence over Expires"
      >
        <TextInput
          id="builder-max-age"
          type="number"
          value={fields.maxAge}
          onChange={(event) => update("maxAge", event.target.value)}
          placeholder="3600"
        />
      </Field>
      <Field label="SameSite" htmlFor="builder-samesite">
        <Select
          id="builder-samesite"
          value={fields.sameSite}
          onChange={(event) =>
            update(
              "sameSite",
              event.target.value as CookieBuilderFields["sameSite"],
            )
          }
        >
          <option value="">Unspecified</option>
          <option value="strict">Strict</option>
          <option value="lax">Lax</option>
          <option value="none">None</option>
        </Select>
      </Field>
      <div className="flex flex-col justify-end gap-2 sm:col-span-2 sm:flex-row sm:items-center sm:gap-6">
        <Checkbox
          id="builder-secure"
          label="Secure"
          checked={fields.secure}
          onChange={(checked) => update("secure", checked)}
        />
        <Checkbox
          id="builder-httponly"
          label="HttpOnly"
          checked={fields.httpOnly}
          onChange={(checked) => update("httpOnly", checked)}
        />
        <Checkbox
          id="builder-partitioned"
          label="Partitioned"
          checked={fields.partitioned}
          onChange={(checked) => update("partitioned", checked)}
        />
      </div>
    </div>
  );
}
