import { Cookie } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <Cookie aria-hidden="true" className="h-4 w-4" />
            CookieCheckup
          </span>
          <p className="text-xs text-zinc-500">
            Open-source browser cookie simulator.
          </p>
          <p className="text-xs text-zinc-500">
            <a
              href="https://github.com/Randy-R-code/cookie-checkup"
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              GitHub
            </a>{" "}
            · MIT License
          </p>
          <p className="text-xs text-zinc-500">
            Built by{" "}
            <a
              href="https://randy-code.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Randy-R-code
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-1 text-xs text-zinc-500 sm:max-w-sm sm:text-right">
          <p>
            Cookie simulations run locally in your browser. Nothing you
            configure here is sent to a server.
          </p>
          <p>
            Standards-oriented modern browser model — browser-specific policies
            and experimental behavior may differ.
          </p>
        </div>
      </div>
    </footer>
  );
}
