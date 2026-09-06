import type { ReactNode } from "react";

export function Card({
  title,
  children,
  className,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 ${className ?? ""}`}
    >
      {title ? (
        <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
