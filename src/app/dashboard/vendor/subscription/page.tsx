"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Crown,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

import {
  createSubscriptionCheckout,
  getVendorSubscription,
  type VendorSubscription,
} from "@/lib/api/vendor/subscription-api";

const plans = [
  {
    name: "Free",
    description: "Everything you need to get started.",
    price: "Free",
    features: [
      "Maximum 3 active menu items",
      "Basic vendor dashboard",
      "Order management",
    ],
  },
  {
    name: "Premium",
    description: "Grow your restaurant and reach more customers.",
    price: "Monthly subscription",
    features: [
      "Unlimited active menu items",
      "Premium vendor badge",
      "Featured menu placement",
      "All Free plan features",
    ],
  },
];

export default function VendorSubscriptionPage() {
  const { data: session, isPending } = authClient.useSession();

  const [subscription, setSubscription] = useState<VendorSubscription>({
    subscriptionPlan: "free",
    subscriptionStatus: "inactive",
  });

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const user = session?.user as { email?: string; role?: string } | undefined;

  const vendorEmail = user?.email;

  const fetchSubscription = useCallback(async () => {
    if (!vendorEmail) return;

    try {
      setLoading(true);

      const data = await getVendorSubscription(vendorEmail);
      setSubscription(data);
    } catch (error) {
      console.error("Subscription fetch error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load subscription information.",
      );
    } finally {
      setLoading(false);
    }
  }, [vendorEmail]);

  useEffect(() => {
    if (!isPending && vendorEmail) {
      fetchSubscription();
    } else if (!isPending && !vendorEmail) {
      setLoading(false);
    }
  }, [isPending, vendorEmail, fetchSubscription]);

  const handleUpgrade = async () => {
    if (!vendorEmail) {
      toast.error("Please sign in to continue.");
      return;
    }

    try {
      setUpgrading(true);

      const checkoutUrl = await createSubscriptionCheckout(vendorEmail);

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Stripe checkout error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to start checkout.",
      );

      setUpgrading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vendorEmail || user?.role !== "vendor") {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

        <h2 className="text-lg font-semibold">Vendor Access Required</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Please sign in with a vendor account to manage your subscription.
        </p>
      </div>
    );
  }

  const isPremium = subscription.subscriptionPlan === "premium";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Subscription Plans
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose the right plan to grow your restaurant.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchSubscription}
          disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
      </div>

      {/* Current Subscription */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              {isPremium ? (
                <Crown className="h-6 w-6 text-primary" />
              ) : (
                <Zap className="h-6 w-6 text-primary" />
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Your Current Plan</p>

              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">
                  {isPremium ? "Premium Plan" : "Free Plan"}
                </h2>

                {isPremium && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {isPremium
              ? "You have access to all Premium features."
              : "Upgrade to unlock all Premium features."}

            {isPremium && subscription.subscriptionStatus && (
              <p className="mt-1 capitalize">
                Subscription status: {subscription.subscriptionStatus}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => {
          const premium = plan.name === "Premium";
          const current = premium === isPremium;

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-card p-6 ${
                premium ? "border-primary shadow-lg" : "border-border"
              }`}>
              {premium && (
                <div className="absolute -top-3 right-5 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Sparkles className="h-3 w-3" />
                  Recommended
                </div>
              )}

              <div className="mb-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  {premium ? (
                    <Crown className="h-6 w-6 text-primary" />
                  ) : (
                    <Zap className="h-6 w-6 text-primary" />
                  )}
                </div>

                <h2 className="text-xl font-bold">{plan.name}</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-2xl font-bold">{plan.price}</span>

                {premium && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Recurring billing through Stripe. Price configured in
                    Stripe.
                  </p>
                )}
              </div>

              <div className="mb-6 flex-1 space-y-4">
                <p className="text-sm font-semibold">What you get</p>

                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {current ? (
                <Button disabled className="w-full" variant="outline">
                  <Check className="mr-2 h-4 w-4" />
                  Current Plan
                </Button>
              ) : premium ? (
                <Button
                  className="w-full"
                  onClick={handleUpgrade}
                  disabled={upgrading}>
                  {upgrading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Premium
                    </>
                  )}
                </Button>
              ) : (
                <Button disabled variant="outline" className="w-full">
                  Free Plan
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}