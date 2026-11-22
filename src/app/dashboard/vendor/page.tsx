"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Crown,
  Infinity,
  Loader2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  TrendingUp,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getVendorDashboard,
  type VendorDashboardData,
} from "@/lib/api/vendor/vendor-dashboard-api";
import { useSession } from "@/lib/auth-client";

export default function VendorDashboardPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const vendorEmail = user?.email;

  const [dashboard, setDashboard] = useState<VendorDashboardData | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [premiumLoading, setPremiumLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    if (!vendorEmail || !user?.id) return;

    try {
      setLoading(true);

      const dashboardData = await getVendorDashboard(vendorEmail);

      setDashboard(dashboardData);
      setIsPremium(false); // Temporarily use Free Plan
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load dashboard.",
      );
    } finally {
      setLoading(false);
      setPremiumLoading(false);
    }
  }, [vendorEmail, user?.id]);

  useEffect(() => {
    if (isPending) return;

    if (vendorEmail && user?.id) {
      fetchDashboard();
    } else {
      setLoading(false);
      setPremiumLoading(false);
    }
  }, [vendorEmail, user?.id, isPending, fetchDashboard]);

  if (isPending || loading || premiumLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!vendorEmail) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  const totalItems = dashboard?.totalMenuItems ?? 0;
  const freeLimit = 3;
  const remainingItems = Math.max(0, freeLimit - totalItems);

  const statistics = [
    {
      title: "Total Menu Items",
      value: totalItems,
      description: "All submitted menu items",
      icon: UtensilsCrossed,
      iconClass:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    },
    {
      title: "Active Menu Items",
      value: dashboard?.activeMenuItems ?? 0,
      description: "Approved and available items",
      icon: CheckCircle2,
      iconClass:
        "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400",
    },
    {
      title: "Pending Orders",
      value: dashboard?.pendingOrders ?? 0,
      description: "Waiting for your response",
      icon: Clock3,
      iconClass:
        "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    },
    {
      title: "Accepted Orders",
      value: dashboard?.acceptedOrders ?? 0,
      description: "Orders accepted by you",
      icon: ShoppingBag,
      iconClass:
        "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
    },
  ];

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
            <TrendingUp className="h-4 w-4" />
            Vendor Dashboard
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Overview
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your menu items, customer orders, and subscription.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboard}
          disabled={loading || premiumLoading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.iconClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <h2 className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                  {stat.value}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 ${
          isPremium
            ? "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:border-amber-900 dark:from-amber-950/40 dark:via-card dark:to-yellow-950/20"
            : "border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:border-green-900 dark:from-green-950/40 dark:via-card dark:to-emerald-950/20"
        }`}>
        <div className="relative z-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div
                className={`mb-3 flex items-center gap-2 text-sm font-semibold ${
                  isPremium
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-green-700 dark:text-green-400"
                }`}>
                <Crown className="h-5 w-5" />
                Your Subscription
                {isPremium && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                    PREMIUM MEMBER
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-bold text-foreground">
                {isPremium ? "Premium Plan" : "Free Plan"}
              </h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {isPremium
                  ? "Enjoy unlimited menu publishing and all Premium benefits."
                  : "Upgrade your plan to unlock unlimited menu publishing and exclusive benefits."}
              </p>
            </div>

            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ${
                isPremium
                  ? "bg-amber-500 shadow-amber-500/20"
                  : "bg-green-600 shadow-green-600/20"
              }`}>
              {isPremium ? (
                <Crown className="h-8 w-8" />
              ) : (
                <Zap className="h-8 w-8" />
              )}
            </div>
          </div>

          {/* Menu Item Usage */}
          <div className="mt-8 rounded-xl border border-border/70 bg-background/80 p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Menu Item Usage
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {isPremium
                    ? "No menu item limit on your Premium plan."
                    : `${remainingItems} of ${freeLimit} free slots remaining`}
                </p>
              </div>

              <span className="text-sm font-bold text-foreground">
                {isPremium ? (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Infinity className="h-5 w-5" />
                    Unlimited
                  </span>
                ) : (
                  `${totalItems}/${freeLimit}`
                )}
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isPremium ? "bg-amber-500" : "bg-green-600"
                }`}
                style={{
                  width: isPremium
                    ? "100%"
                    : `${Math.min((totalItems / freeLimit) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Features */}
          <div className="mt-7">
            <h3 className="mb-4 text-sm font-bold text-foreground">
              {isPremium ? "Your Premium Benefits" : "Free Plan Features"}
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                <span className="text-sm text-muted-foreground">
                  Vendor dashboard
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                <span className="text-sm text-muted-foreground">
                  Order management
                </span>
              </div>

              <div className="flex items-center gap-3">
                {isPremium ? (
                  <Infinity className="h-5 w-5 shrink-0 text-amber-500" />
                ) : (
                  <LockKeyhole className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {isPremium ? "Unlimited menu items" : "Up to 3 menu items"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {isPremium ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-500" />
                ) : (
                  <LockKeyhole className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  Premium vendor badge
                </span>
              </div>

              <div className="flex items-center gap-3">
                {isPremium ? (
                  <Star className="h-5 w-5 shrink-0 text-amber-500" />
                ) : (
                  <LockKeyhole className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  Featured menu placement
                </span>
              </div>
            </div>
          </div>

          {/* Plan Action */}
          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
            {isPremium ? (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                  <ShieldCheck className="h-5 w-5" />
                  Your Premium benefits are active.
                </div>

                <span className="inline-flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2.5 text-sm font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  <Crown className="h-4 w-4" />
                  Premium Active
                </span>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Need more space for your menu? Upgrade to Premium.
                </p>

                <Link
                  href="/dashboard/vendor/subscription"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700">
                  Upgrade to Premium
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>

        <div
          className={`absolute -right-12 -top-16 h-48 w-48 rounded-full blur-3xl ${
            isPremium ? "bg-amber-500/10" : "bg-green-500/10"
          }`}
        />
      </div>
    </div>
  );
}
