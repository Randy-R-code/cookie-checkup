import type { EffectiveCookie } from "@/types/cookie";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-zinc-100 py-1.5 text-sm last:border-0 dark:border-zinc-800">
      <dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="truncate font-mono text-zinc-900 dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}

export function EffectiveCookieTable({
  cookie,
  sessionCookie,
  expiresAt,
}: {
  cookie: EffectiveCookie;
  sessionCookie: boolean;
  expiresAt?: Date;
}) {
  const sameSiteLabel = `${cookie.sameSite.charAt(0).toUpperCase()}${cookie.sameSite.slice(1)}${
    cookie.sameSiteSpecified ? "" : " (default)"
  }`;

  return (
    <dl className="flex flex-col">
      <Row label="Name" value={cookie.name} />
      <Row label="Value" value={cookie.value} />
      <Row label="Host" value={cookie.host} />
      <Row
        label="Scope"
        value={cookie.hostOnly ? "Host-only" : `Domain (${cookie.domain})`}
      />
      <Row label="Path" value={cookie.path} />
      <Row label="Secure" value={cookie.secure ? "Yes" : "No"} />
      <Row label="HttpOnly" value={cookie.httpOnly ? "Yes" : "No"} />
      <Row label="SameSite" value={sameSiteLabel} />
      <Row
        label="Lifetime"
        value={sessionCookie ? "Session" : (expiresAt?.toUTCString() ?? "—")}
      />
      <Row label="Partitioned" value={cookie.partitioned ? "Yes" : "No"} />
    </dl>
  );
}
