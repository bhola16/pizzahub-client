
"use client";

import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  Headphones,
  ShieldCheck,
  RefreshCw,
  CreditCard,
} from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-500/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10" />

      <div className="relative w-full max-w-lg">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 px-8 pb-9 pt-12 text-center dark:from-orange-950/50 dark:to-amber-950/40">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 ring-8 ring-orange-100/50 dark:bg-orange-900/40 dark:ring-orange-900/20">
              <XCircle
                size={58}
                strokeWidth={1.7}
                className="text-orange-500 dark:text-orange-400"
              />
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300">
              <CreditCard size={14} />
              Checkout cancelled
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              No worries!
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
              You cancelled the checkout process. No payment was completed,
              and you can try again whenever you're ready.
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-5 dark:border-orange-900/60 dark:bg-orange-950/30">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={22}
                  className="mt-0.5 shrink-0 text-orange-600 dark:text-orange-400"
                />
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Your account is safe
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Your Premium subscription has not been activated. Your
                    account and existing menu items remain unchanged.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <Link
                href="/dashboard/vendor/subscription"
                className="group flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-green-600/30"
              >
                <RefreshCw
                  size={18}
                  className="transition-transform group-hover:rotate-180"
                />
                Try Again
              </Link>

              <Link
                href="/dashboard/vendor"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </Link>
            </div>

            <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <Headphones size={17} />
              Need help?
              <a
                href="mailto:ku.bhola16@gmail.com"
                className="font-semibold text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          © 2026 PizzaHub. All rights reserved.
        </p>
      </div>
    </main>
  );
}
