export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-zinc-500 sm:px-6">
        <p>
          Runs locally in your browser. Nothing you configure here is sent to a
          server.
        </p>
        <p>
          CookieCheckup uses a standards-oriented modern browser model.
          Browser-specific policies and experimental behavior may differ.
        </p>
      </div>
    </footer>
  );
}
