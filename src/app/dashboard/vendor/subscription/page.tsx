"use client";

import {
  ArrowLeft,
  Check,
  Crown,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { authClient } from "@/lib/auth-client";

import {
  cancelVendorSubscription,
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

  const user = session?.user as { email?: string; role?: string } | undefined;

  const [subscription, setSubscription] = useState<VendorSubscription>({
    subscriptionPlan: "free",
    subscriptionStatus: "free",
    premium: false,
    cancelAtPeriodEnd: false,
    currentPeriodEnd: null,
  });

  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch subscription information.
  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getVendorSubscription();

      setSubscription(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load subscription",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (user?.role === "vendor") {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [isPending, user?.role, fetchSubscription]);

  // Navigate to the payment page.
  // No sessionStorage permission is required.
  const handleUpgrade = () => {
    setNavigating(true);
    router.push("/dashboard/payment");
  };

  // Cancel subscription.
  const handleCancelSubscription = async () => {
    try {
      setCancelLoading(true);

      const data = await cancelVendorSubscription();

      toast.success(data.message || "Subscription cancelled successfully.");

      setCancelDialogOpen(false);

      await fetchSubscription();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to cancel subscription.",
      );
    } finally {
      setCancelLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "vendor") {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

        <h2 className="text-lg font-semibold">Vendor Access Required</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Please sign in with a vendor account.
        </p>
      </div>
    );
  }

  const isPremium =
    subscription.premium === true &&
    subscription.subscriptionPlan === "premium" &&
    ["active", "trialing"].includes(subscription.subscriptionStatus);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/vendor"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <Crown
              className={`h-5 w-5 ${
                isPremium ? "text-amber-500" : "text-slate-500"
              }`}
            />

            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isPremium ? "text-amber-600" : "text-primary"
              }`}>
              Vendor Membership
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold">Subscription Plans</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose the right plan for your restaurant.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchSubscription}
          disabled={loading || cancelLoading}
          className="transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
      </div>

      {/* Current Subscription */}
      <div
        className={`space-y-4 rounded-2xl border p-6 transition-all duration-300 ${
          isPremium
            ? "border-amber-300/70 bg-gradient-to-br from-amber-50/80 via-card to-orange-50/50 shadow-sm shadow-amber-500/10 dark:border-amber-700/50 dark:from-amber-950/20 dark:to-orange-950/10"
            : "border-slate-200 bg-gradient-to-br from-slate-50/80 via-card to-blue-50/40 dark:border-slate-700 dark:from-slate-900/40 dark:to-blue-950/10"
        }`}>
        <div className="flex items-center gap-4">
          <div
            className={`rounded-xl p-3 shadow-sm ${
              isPremium
                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/20"
                : "bg-gradient-to-br from-slate-500 to-blue-600 text-white shadow-blue-500/20"
            }`}>
            {isPremium ? (
              <Crown className="h-7 w-7" />
            ) : (
              <Zap className="h-7 w-7" />
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Your Current Plan</p>

            <h2 className="text-xl font-bold">
              {isPremium ? "Premium Plan" : "Free Plan"}
            </h2>

            <p className="text-sm capitalize text-muted-foreground">
              Status: {subscription.subscriptionStatus}
            </p>
          </div>

          <div className="ml-auto">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                isPremium
                  ? "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                  : "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}>
              {isPremium ? (
                <Crown className="h-3.5 w-3.5" />
              ) : (
                <Zap className="h-3.5 w-3.5" />
              )}
              {isPremium ? "PREMIUM MEMBER" : "FREE MEMBER"}
            </span>
          </div>
        </div>

        {/* Cancel Subscription */}
        {isPremium && (
          <div className="border-t border-amber-200/70 pt-4 dark:border-amber-800/40">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">Cancel Premium Subscription</h3>

                <p className="text-sm text-muted-foreground">
                  Your Premium access will be removed immediately.
                </p>
              </div>

              <AlertDialog
                open={cancelDialogOpen}
                onOpenChange={(open) => {
                  if (!cancelLoading) {
                    setCancelDialogOpen(open);
                  }
                }}>
                <AlertDialogTrigger
                  render={
                    <Button variant="destructive" disabled={cancelLoading} />
                  }>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Subscription
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Cancel Premium Subscription?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                      Are you sure you want to cancel your Premium subscription?
                      Your Premium access will be removed immediately, and your
                      account will return to the Free plan. This action cannot
                      be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={cancelLoading}>
                      Keep Premium
                    </AlertDialogCancel>

                    <AlertDialogAction
                      disabled={cancelLoading}
                      onClick={(event) => {
                        event.preventDefault();
                        handleCancelSubscription();
                      }}
                      className="bg-destructive text-white hover:bg-destructive/90">
                      {cancelLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        "Yes, Cancel Subscription"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Find Your Perfect Plan</h2>

          <p className="text-sm text-muted-foreground">
            Simple pricing for your restaurant.
          </p>
        </div>

        <div className="grid gap-6 pt-3 lg:grid-cols-2">
          {plans.map((plan) => {
            const premium = plan.name === "Premium";
            const current = premium ? isPremium : !isPremium;

            return (
              <div
                key={plan.name}
                className={`relative mx-auto flex w-full max-w-md flex-col rounded-2xl border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  premium
                    ? "border-amber-300/70 shadow-amber-500/10 hover:border-amber-400 dark:border-amber-700/50"
                    : "border-border hover:border-slate-400"
                }`}>
                {premium && (
                  <div className="absolute -top-3 right-5 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-amber-500/20">
                    <Sparkles size={13} />
                    Recommended
                  </div>
                )}

                <div className="mb-5">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 hover:scale-110 ${
                      premium
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/20"
                        : "bg-gradient-to-br from-slate-500 to-blue-600 text-white shadow-blue-500/20"
                    }`}>
                    {premium ? <Crown size={24} /> : <Zap size={24} />}
                  </div>

                  <h2 className="text-xl font-bold">{plan.name}</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6 border-b pb-6">
                  <span className="text-3xl font-extrabold">{plan.price}</span>

                  {premium && (
                    <span className="ml-1 text-sm text-muted-foreground">
                      / month
                    </span>
                  )}
                </div>

                <div className="mb-7 flex-1 space-y-4">
                  <p className="text-sm font-semibold">What you get</p>

                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          premium
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}>
                        <Check className="h-3.5 w-3.5" />
                      </div>

                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {current ? (
                  <Button
                    disabled
                    variant="outline"
                    className={`h-12 w-full cursor-default border font-semibold shadow-sm ${
                      premium
                        ? "border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 dark:border-amber-700 dark:from-amber-950/40 dark:to-orange-950/30 dark:text-amber-300"
                        : "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    }`}>
                    {premium ? (
                      <Crown className="mr-2 h-4 w-4" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Current Plan
                  </Button>
                ) : premium ? (
                  <Button
                    className="h-12 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 font-semibold text-white shadow-md shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-amber-600 hover:via-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/30 active:translate-y-0"
                    onClick={handleUpgrade}
                    disabled={navigating}>
                    {navigating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Crown className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                    )}

                    {navigating
                      ? "Opening Payment Page..."
                      : "Upgrade to Premium"}
                  </Button>
                ) : (
                  <Button
                    disabled
                    variant="outline"
                    className="h-12 w-full cursor-default border-slate-300 bg-slate-100 font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <Zap className="mr-2 h-4 w-4" />
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
