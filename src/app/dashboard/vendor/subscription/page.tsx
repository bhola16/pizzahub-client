"use client";

import {
  AlertCircle,
  ArrowLeft,
  Check,
  Crown,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import {
  getVendorSubscription,
  type VendorSubscription,
} from "@/lib/api/vendor/subscription-api";
import Link from "next/link";

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
    price: "$20",
    features: [
      "Unlimited active menu items",
      "Premium vendor badge",
      "Featured menu placement",
      "All Free plan features",
    ],
  },
];

export default function VendorSubscriptionPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [subscription, setSubscription] = useState<VendorSubscription>({
    subscriptionPlan: "free",
    subscriptionStatus: "inactive",
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const user = session?.user as { email?: string; role?: string } | undefined;
  const vendorEmail = user?.email;

  const fetchSubscription = useCallback(async () => {
    if (!vendorEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadError("");

      const data = await getVendorSubscription(vendorEmail);
      setSubscription(data);
    } catch (error) {
      console.error("Subscription fetch error:", error);

      const message =
        error instanceof TypeError
          ? "Cannot connect to the server. Please make sure your backend is running and your API URL is correct."
          : error instanceof Error
            ? error.message
            : "Could not load subscription information.";

      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [vendorEmail]);

  useEffect(() => {
    if (!isPending) {
      if (vendorEmail) {
        fetchSubscription();
      } else {
        setLoading(false);
      }
    }
  }, [isPending, vendorEmail, fetchSubscription]);

  const handleUpgrade = () => {
    router.push("/dashboard/payment");
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
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
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
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/dashboard/vendor"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-orange-500">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Vendor Membership
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Subscription Plans
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose the right plan to grow your restaurant.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={fetchSubscription}
            disabled={loading}
            className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Backend Connection Error */}
      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-300">
                Unable to load subscription
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                {loadError}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={fetchSubscription}
                disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Current Subscription */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              {isPremium ? (
                <Crown className="h-7 w-7 text-primary" />
              ) : (
                <Zap className="h-7 w-7 text-primary" />
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Your Current Plan</p>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">
                  {isPremium ? "Premium Plan" : "Free Plan"}
                </h2>

                {isPremium && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Crown className="mr-1 inline h-3 w-3" />
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="sm:max-w-xs sm:text-right">
            <p className="text-sm text-muted-foreground">
              {isPremium
                ? "You have access to all Premium features."
                : "Upgrade to unlock all Premium features."}
            </p>

            {isPremium && subscription.subscriptionStatus && (
              <p className="mt-2 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold capitalize text-green-600">
                <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                {subscription.subscriptionStatus}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold sm:text-2xl">
            Find Your Perfect Plan
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Simple pricing. Everything your restaurant needs.
          </p>
        </div>

        <div className="grid grid-cols-1 justify-center gap-6 pt-3 lg:grid-cols-2">
          {plans.map((plan) => {
            const premium = plan.name === "Premium";
            const current = premium === isPremium;

            return (
              <div
                key={plan.name}
                className={`relative mx-auto flex w-full max-w-md flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7 ${
                  premium
                    ? "border-primary/60 shadow-md shadow-primary/5"
                    : "border-border"
                }`}>
                {premium && (
                  <div className="absolute -top-3 right-5 flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-md">
                    <Sparkles className="h-3 w-3" />
                    Recommended
                  </div>
                )}

                <div className="mb-6">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                      premium
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}>
                    {premium ? (
                      <Crown className="h-6 w-6" />
                    ) : (
                      <Zap className="h-6 w-6" />
                    )}
                  </div>

                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6 border-b border-border pb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight">
                      {plan.price}
                    </span>
                    {premium && (
                      <span className="text-sm text-muted-foreground">
                        / month
                      </span>
                    )}
                  </div>

                  {premium && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Billed monthly
                    </p>
                  )}
                </div>

                <div className="mb-7 flex-1 space-y-4">
                  <p className="text-sm font-semibold">What you get</p>

                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </span>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {current ? (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full border-emerald-500/30 bg-gradient-to-r from-emerald-600 to-teal-500 font-semibold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-500 disabled:opacity-100">
                    <Check className="mr-2 h-4 w-4" />
                    Current Plan
                  </Button>
                ) : premium ? (
                  <Button className="w-full shadow-sm" onClick={handleUpgrade}>
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
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
    </div>
  );
}
