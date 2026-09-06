import { ImageResponse } from "next/og";

export const alt =
  "CookieCheckup — Check, visualize, and understand how browsers handle your cookies.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const COOKIE_ICON_PATHS = [
  "M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5",
  "M8.5 8.5v.01",
  "M16 15.5v.01",
  "M12 12v.01",
  "M11 17v.01",
  "M7 14v.01",
];

function CookieMark() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fafafa"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {COOKIE_ICON_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function CheckBadge() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 26,
        borderRadius: 999,
        border: "1.5px solid #10b981",
        background: "rgba(16,185,129,0.15)",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#34d399"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
  );
}

function LifecycleStep({
  label,
  checked,
}: {
  label: string;
  checked?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        border: "1px solid #27272a",
        borderRadius: 10,
        padding: "14px 22px",
        fontSize: 22,
        color: "#e4e4e7",
        background: "#18181b",
      }}
    >
      {checked ? <CheckBadge /> : null}
      <span>{label}</span>
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#09090b",
        padding: 64,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <CookieMark />
          <span style={{ fontSize: 40, fontWeight: 700, color: "#fafafa" }}>
            CookieCheckup
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 26,
            color: "#a1a1aa",
            lineHeight: 1.4,
          }}
        >
          <span>Check, visualize, and understand</span>
          <span>how browsers handle your cookies.</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <LifecycleStep label="Set-Cookie" />
          <span style={{ fontSize: 22, color: "#52525b" }}>→</span>
          <LifecycleStep label="Accepted" checked />
          <span style={{ fontSize: 22, color: "#52525b" }}>→</span>
          <LifecycleStep label="Stored" checked />
          <span style={{ fontSize: 22, color: "#52525b" }}>→</span>
          <LifecycleStep label="Sent" checked />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 18, color: "#71717a", letterSpacing: 1 }}>
            SameSite · Secure · HttpOnly · Domain · Path
          </span>
          <span style={{ fontSize: 16, color: "#52525b" }}>
            Open-source developer tool
          </span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
