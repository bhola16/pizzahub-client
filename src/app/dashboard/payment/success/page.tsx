
"use client";

import {
  CheckCircle2,
  ArrowRight,
  Home,
  LayoutDashboard,
  Crown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-green-200/40 blur-3xl dark:bg-green-500/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/10" />

      <div className="relative w-full max-w-lg">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
          {/* Success header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 px-8 pb-9 pt-12 text-center dark:from-green-950/60 dark:to-emerald-950/40">
            <div className="absolute right-8 top-8 text-green-300 dark:text-green-800">
              <Sparkles size={28} />
            </div>

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-100/50 dark:bg-green-900/50 dark:ring-green-900/20">
              <CheckCircle2
                size={58}
                strokeWidth={1.7}
                className="text-green-600 dark:text-green-400"
              />
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300">
              <Crown size={14} />
              Premium activated
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Payment Successful!
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
              Thank you for upgrading to PizzaHub Premium. Your subscription
              payment was completed successfully.
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="rounded-2xl border border-green-100 bg-green-50/70 p-5 dark:border-green-900/60 dark:bg-green-950/30">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={22}
                  className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
                />
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    You're all set!
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Your subscription status is being synchronized. It may
                    take a few moments for your Premium features to appear.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <Link
                href="/dashboard/vendor/subscription"
                className="group flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-green-600/30"
              >
                View Subscription
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/dashboard/vendor"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <LayoutDashboard size={18} />
                Back to Dashboard
              </Link>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Home size={18} />
                Back to Home
              </Link>
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
