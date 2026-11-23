"use client";

import { Home, RefreshCw, ShoppingBag, Utensils } from "lucide-react";
import Link from "next/link";

export default function MenuItemNotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-xl shadow-orange-500/5 dark:border-stone-800 dark:bg-stone-900 sm:p-12">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
          <Utensils size={42} strokeWidth={1.7} />
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
          Oops! Something went wrong
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
          Menu Item Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-sm leading-7 text-stone-600 dark:text-stone-400">
          We couldn't find this menu item. It may not exist, may not be
          approved, or could currently be unavailable.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:bg-orange-600 active:translate-y-0">
            <RefreshCw size={18} />
            Refresh Page
          </button>

          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-50 px-6 py-3 font-semibold text-stone-800 transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:text-orange-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-orange-500 dark:hover:text-orange-400">
            <ShoppingBag size={18} />
            Browse Menu
          </Link>
        </div>

        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-orange-500 dark:text-stone-400 dark:hover:text-orange-400">
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
