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
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />

            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
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
          disabled={loading || cancelLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
      </div>

      {/* Current Subscription */}
      <div className="space-y-4 rounded-2xl border bg-card p-6">
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

            <h2 className="text-xl font-bold">
              {isPremium ? "Premium Plan" : "Free Plan"}
            </h2>

            <p className="text-sm capitalize text-muted-foreground">
              Status: {subscription.subscriptionStatus}
            </p>
          </div>
        </div>

        {/* Cancel Subscription */}
        {isPremium && (
          <div className="border-t pt-4">
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
                className={`relative mx-auto flex w-full max-w-md flex-col rounded-2xl border bg-card p-7 shadow-sm ${
                  premium ? "border-primary shadow-md" : "border-border"
                }`}>
                {premium && (
                  <div className="absolute -top-3 right-5 flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                    <Sparkles size={13} />
                    Recommended
                  </div>
                )}

                <div className="mb-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
                      <Check className="h-4 w-4 shrink-0 text-green-600" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {current ? (
                  <Button disabled variant="outline" className="w-full">
                    <Check className="mr-2 h-4 w-4" />
                    Current Plan
                  </Button>
                ) : premium ? (
                  <Button
                    className="w-full"
                    onClick={handleUpgrade}
                    disabled={navigating}>
                    {navigating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Crown className="mr-2 h-4 w-4" />
                    )}

                    {navigating
                      ? "Opening Payment Page..."
                      : "Upgrade to Premium"}
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
