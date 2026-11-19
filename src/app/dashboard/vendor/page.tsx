"use client";

import { useCallback, useEffect, useState } from "react";
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Crown,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import {
  getVendorDashboard,
  type VendorDashboardData,
} from "@/lib/api/vendor-dashboard-api";

export default function VendorDashboardPage() {
  const { data: session, isPending } = useSession();
  const vendorEmail = session?.user?.email;

  const [dashboard, setDashboard] = useState<VendorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    if (!vendorEmail) return;

    try {
      setLoading(true);

      const data = await getVendorDashboard(vendorEmail);
      setDashboard(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, [vendorEmail]);

  useEffect(() => {
    if (vendorEmail) {
      fetchDashboard();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [vendorEmail, isPending, fetchDashboard]);

  if (isPending || loading) {
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

  const statistics = [
    {
      title: "Total Menu Items",
      value: dashboard?.totalMenuItems ?? 0,
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

  const planName =
    dashboard?.subscriptionPlan?.charAt(0).toUpperCase() +
    (dashboard?.subscriptionPlan?.slice(1) || "");

  return (
    <div className="space-y-7">
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
          disabled={loading}
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

      {/* Subscription */}
      <div className="relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-6 dark:border-green-900 dark:from-green-950/40 dark:to-card sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400">
              <Crown className="h-5 w-5" />
              Your Subscription
            </div>

            <h2 className="text-2xl font-bold text-foreground">
              {planName || "Free"} Plan
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Your current subscription plan and available features.
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20">
            <Crown className="h-8 w-8" />
          </div>
        </div>

        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-green-500/10 blur-3xl" />
      </div>
    </div>
  );
}
