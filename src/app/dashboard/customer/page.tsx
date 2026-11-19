"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";

type Order = {
  _id: string;
  status: "pending" | "accepted" | "rejected";
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CustDashboardPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const customerEmail = user?.email;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!customerEmail) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/customer-orders/${encodeURIComponent(customerEmail)}`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load orders.",
      );
    } finally {
      setLoading(false);
    }
  }, [customerEmail]);

  useEffect(() => {
    if (customerEmail) {
      fetchOrders();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [customerEmail, isPending, fetchOrders]);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const acceptedOrders = orders.filter(
    (order) => order.status === "accepted",
  ).length;

  const rejectedOrders = orders.filter(
    (order) => order.status === "rejected",
  ).length;

  const statistics = [
    {
      title: "Total Orders",
      count: totalOrders,
      description: "All your orders",
      icon: ShoppingBag,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Pending Orders",
      count: pendingOrders,
      description: "Waiting for confirmation",
      icon: Clock3,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Accepted Orders",
      count: acceptedOrders,
      description: "Successfully accepted",
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      title: "Rejected Orders",
      count: rejectedOrders,
      description: "Orders not accepted",
      icon: XCircle,
      color: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
  ];

  if (isPending || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track your orders and check their current status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-foreground">
                {stat.count}
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
