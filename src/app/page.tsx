import { CookieWorkspace } from "@/components/cookie/cookie-workspace";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            See what your browser does with a cookie.
          </h1>
          <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
            Paste a Set-Cookie header, simulate the browser context, and
            understand whether the cookie is accepted, stored, sent, or exposed
            to JavaScript.
          </p>
        </div>
        <CookieWorkspace />
      </main>
      <Footer />
    </div>
  );
}
