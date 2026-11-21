import Link from "next/link";
import { ArrowLeft, Home, Search, Pizza } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
          <Pizza className="h-12 w-12 text-primary" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-primary">
          Error 404
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Oops! Wrong <span className="text-primary">turn.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-muted-foreground">
          Looks like this page is off the menu. The page you're looking for
          doesn't exist, may have been moved, or is temporarily unavailable.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold text-foreground transition hover:bg-muted">
            <Search className="h-4 w-4" />
            Explore Menu
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Return to the homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
