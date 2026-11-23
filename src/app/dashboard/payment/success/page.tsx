
"use client";

import {
  CheckCircle2,
  ArrowRight,
  Home,
  LayoutDashboard,
  Crown,
  Sparkles,
  ShieldCheck,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getVendorSubscription } from "@/lib/api/vendor/subscription-api";

type VerificationStatus = "checking" | "success" | "pending" | "error";

export default function PaymentSuccessPage() {
  const { data: session, isPending } = authClient.useSession();

  const [status, setStatus] =
    useState<VerificationStatus>("checking");

  useEffect(() => {
    if (isPending) return;

    const user = session?.user as
      | { role?: string }
      | undefined;

    if (!user || user.role !== "vendor") {
      setStatus("error");
      return;
    }

    let cancelled = false;

    const verifySubscription = async () => {
      try {
        for (let attempt = 0; attempt < 10; attempt++) {
          const subscription = await getVendorSubscription();

          if (
            subscription.premium === true &&
            subscription.subscriptionPlan === "premium" &&
            ["active", "trialing"].includes(
              subscription.subscriptionStatus
            )
          ) {
            if (!cancelled) setStatus("success");
            return;
          }

          if (attempt < 9) {
            await new Promise((resolve) =>
              setTimeout(resolve, 2000)
            );
          }
        }

        if (!cancelled) setStatus("pending");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    verifySubscription();

    return () => {
      cancelled = true;
    };
  }, [isPending, session]);

  if (isPending || status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <h1 className="mt-5 text-xl font-bold">
            Verifying Your Payment
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while we confirm your Premium subscription.
          </p>
        </div>
      </main>
    );
  }

  const verified = status === "success";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-green-200/40 blur-3xl dark:bg-green-500/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/10" />

      <div className="relative w-full max-w-lg">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div
            className={`relative overflow-hidden px-8 pb-9 pt-12 text-center ${
              verified
                ? "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/60 dark:to-emerald-950/40"
                : "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/40"
            }`}
          >
            <div className="absolute right-8 top-8">
              <Sparkles
                size={28}
                className="text-green-300 dark:text-green-800"
              />
            </div>

            <div
              className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ring-8 ${
                verified
                  ? "bg-green-100 ring-green-100/50 dark:bg-green-900/50 dark:ring-green-900/20"
                  : "bg-amber-100 ring-amber-100/50 dark:bg-amber-900/50 dark:ring-amber-900/20"
              }`}
            >
              {verified ? (
                <CheckCircle2
                  size={58}
                  strokeWidth={1.7}
                  className="text-green-600 dark:text-green-400"
                />
              ) : (
                <XCircle
                  size={58}
                  strokeWidth={1.7}
                  className="text-amber-600 dark:text-amber-400"
                />
              )}
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider dark:bg-slate-950/50">
              {verified ? <Crown size={14} /> : <ShieldCheck size={14} />}
              {verified ? "Premium activated" : "Verification pending"}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {verified
                ? "Payment Successful!"
                : status === "pending"
                  ? "Payment Processing"
                  : "Unable to Verify Payment"}
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
              {verified
                ? "Your PizzaHub Premium subscription is active. Enjoy all Premium features!"
                : status === "pending"
                  ? "Your payment may have completed, but your subscription has not appeared yet. Please refresh your subscription status shortly."
                  : "We could not verify your Premium subscription. Please check your subscription status or contact support."}
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="rounded-2xl border p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={22}
                  className="mt-0.5 shrink-0 text-green-600"
                />
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    {verified
                      ? "You're all set!"
                      : "Your account is safe"}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {verified
                      ? "Your Premium subscription has been confirmed in your account."
                      : "Premium access will only be enabled after Stripe confirms your subscription through the secure webhook."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <Link
                href="/dashboard/vendor/subscription"
                className="group flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-green-700"
              >
                {verified ? "View Subscription" : "Check Subscription"}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/dashboard/vendor"
                className="flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LayoutDashboard size={18} />
                Back to Dashboard
              </Link>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
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
