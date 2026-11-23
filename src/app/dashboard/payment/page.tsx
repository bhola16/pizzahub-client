"use client";

import { createCheckoutSession } from "@/lib/api/vendor/subscription-api";
import { authClient } from "@/lib/auth-client";

import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PaymentPage() {
  const router = useRouter();

  const [paying, setPaying] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const vendorName = session?.user?.name || "Vendor";

  // Verify authentication and vendor role.
  // This does not use or consume any one-time permission.
  useEffect(() => {
    if (isPending) return;

    const user = session?.user as { role?: string } | undefined;

    if (!user) {
      router.replace("/sign-in?callbackURL=/dashboard/payment");
      return;
    }

    if (user.role !== "vendor") {
      router.replace("/dashboard");
      return;
    }

    setAuthorized(true);
  }, [isPending, session?.user, router]);

  // Start Stripe Checkout.
  const handlePayment = async () => {
    try {
      setPaying(true);

      const checkoutUrl = await createCheckoutSession();

      window.location.assign(checkoutUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to initiate payment",
      );

      setPaying(false);
    }
  };

  if (isPending || !authorized) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/vendor/subscription"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft size={16} />
          Back to Subscription
        </Link>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Complete Your Payment
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Upgrade your restaurant to PizzaHub Premium.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Payment Method */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">Payment Method</h2>

                <p className="text-sm text-muted-foreground">
                  Secure payment through Stripe Checkout
                </p>
              </div>
            </div>

            {/* Payment Card Preview */}
            <div className="mx-auto mb-6 max-w-md rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-widest">
                  PIZZAHUB
                </span>

                <CreditCard size={28} />
              </div>

              <div className="mt-10">
                <p className="text-lg tracking-[0.25em]">•••• •••• •••• ••••</p>
              </div>

              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-widest text-white/50">
                  Card Holder
                </p>

                <p className="mt-1 text-sm font-medium">{vendorName}</p>
              </div>
            </div>

            {/* Supported Payment Method */}
            <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
              <CreditCard className="h-5 w-5 text-primary" />

              <div className="flex-1">
                <p className="text-sm font-semibold">Credit or Debit Card</p>

                <p className="text-xs text-muted-foreground">
                  Visa, Mastercard and supported cards
                </p>
              </div>

              <Check className="h-5 w-5 text-primary" />
            </div>

            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock size={13} />
              Card information is processed securely by Stripe.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-xl border bg-card p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />

            <h2 className="text-lg font-bold">Order Summary</h2>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">PizzaHub Premium Plan</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Monthly subscription
                </p>
              </div>

              <span className="text-lg font-bold">$20</span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-600" />
              Access to all Premium features
            </div>
          </div>

          <div className="my-5 border-t border-dashed" />

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>

              <span>$20</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>

              <span>$0</span>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>

                <span className="text-2xl font-bold text-primary">$20</span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                USD per month, billed monthly.
              </p>
            </div>
          </div>

          {/* Pay Button */}
          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={handlePayment}
              disabled={paying || !session}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
              {paying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard size={16} />
              )}

              {paying ? "Redirecting to Stripe..." : "Pay $20"}
            </button>

            <div className="flex flex-col items-center gap-2">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck size={14} className="text-green-600" />
                Secure payment
              </p>

              <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                <Lock size={14} />
                Powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
