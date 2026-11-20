"use client";

import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function PaymentPage() {
  const [paying, setPaying] = useState(false);

  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  const { data: session } = authClient.useSession();
  const vendorName = session?.user?.name || "Vendor";

  const handlePayment = () => {
    setPaying(true);

    // Stripe payment integration will be added here.
    toast.info("Payment integration will be added soon.");

    setPaying(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <div>
        <Link
          href="/dashboard/vendor/subscription"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary">
          <ArrowLeft size={16} />
          Back to Subscription
        </Link>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Complete Your Payment
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Upgrade your restaurant to PizzaHub Premium.
        </p>
      </div>

      {canceled && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm">
          Payment was canceled. You can try again whenever you're ready.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">Payment Method</h2>
                <p className="text-sm text-muted-foreground">
                  Secure card payment
                </p>
              </div>
            </div>

            <div className="relative mx-auto mb-6 max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-6 text-white shadow-xl">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[25px] border-white/5" />
              <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full border-[30px] border-white/5" />

              <div className="relative flex items-center justify-between">
                <span className="text-sm font-semibold tracking-widest">
                  PIZZAHUB
                </span>
                <CreditCard className="h-7 w-7 text-white/80" />
              </div>

              <div className="relative mt-10">
                <div className="mb-2 h-8 w-11 rounded-md border border-yellow-200/40 bg-gradient-to-br from-yellow-200 to-yellow-500" />
                <p className="text-lg tracking-[0.25em] text-white/90">
                  •••• •••• •••• ••••
                </p>
              </div>

              <div className="relative mt-6 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">
                    Card Holder
                  </p>
                  <p className="mt-1 text-sm font-medium">{vendorName}</p>
                </div>

                <span className="text-xl font-bold italic text-white/90">
                  CARD
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">Credit or Debit Card</p>
                <p className="text-xs text-muted-foreground">
                  Visa, Mastercard and other supported cards
                </p>
              </div>

              <Check className="h-5 w-5 text-primary" />
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock size={13} />
              Your payment information will be securely processed.
            </p>
          </div>
        </div>

        <div className="h-fit rounded-xl border border-border bg-card p-5 sm:p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Order Summary</h2>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">PizzaHub Premium Plan</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Monthly subscription
                </p>
              </div>

              <span className="text-lg font-bold">$20</span>
            </div>

            <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              Access to all Premium features
            </div>
          </div>

          <div className="my-5 border-t border-dashed border-border" />

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>$20</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span>$0</span>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">$20</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <form action="/api/checkout_sessions" method="POST">
              <button
                type="submit"
                role="link"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                <CreditCard size={16} />
                Pay $20
              </button>
            </form>

            <div className="flex flex-col items-center gap-2">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck size={14} className="text-green-600" />
                Secure payment
              </p>

              <div className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-muted-foreground">
                <Lock size={14} />
                <span>Powered by</span>
                <span className="font-bold text-foreground">Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
