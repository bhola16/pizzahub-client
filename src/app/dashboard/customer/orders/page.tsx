"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  MessageSquare,
  Package,
  RefreshCw,
  ShoppingBag,
  Store,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { cancelCustomerOrder, getCustomerOrders, type Order } from "@/lib/api/orders";

export default function MyOrdersPage() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
    | { name?: string; email?: string; role?: string }
    | undefined;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const data = await getCustomerOrders(user.email);
      setOrders(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load orders.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isPending) {
      if (user?.role === "customer" && user.email) {
        fetchOrders();
      } else {
        setLoading(false);
      }
    }
  }, [isPending, user?.role, user?.email, fetchOrders]);

  const handleWithdraw = async (order: Order) => {
    if (order.status !== "pending" || !user?.email) return;

    const confirmed = window.confirm(
      "Are you sure you want to withdraw this order?",
    );

    if (!confirmed) return;

    try {
      setWithdrawingId(order.id);

      await cancelCustomerOrder(order.id, user.email);

      setOrders((previousOrders) =>
        previousOrders.map((item) =>
          item.id === order.id ? { ...item, status: "cancelled" } : item,
        ),
      );

      toast.success("Your order has been withdrawn.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to withdraw order.",
      );

      await fetchOrders();
    } finally {
      setWithdrawingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F3] dark:bg-[#171412]">
        <RefreshCw className="animate-spin text-orange-500" size={30} />
      </main>
    );
  }

  if (!user || user.role !== "customer") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FFF9F3] px-4 text-center dark:bg-[#171412]">
        <ShoppingBag size={45} className="text-orange-500" />
        <h1 className="text-2xl font-bold text-foreground">
          Customer Access Only
        </h1>
        <p className="text-muted-foreground">
          Please sign in with a customer account to view your orders.
        </p>
        <Link
          href="/menu"
          className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600">
          Browse Menu
        </Link>
      </main>
    );
  }

  const statusStyles: Record<Order["status"], string> = {
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
    accepted:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    cancelled:
      "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400",
  };

  return (
    <main className="min-h-screen bg-[#FFF9F3] py-10 text-[#30231D] dark:bg-[#171412] dark:text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/customer"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-orange-500">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">My Orders</h1>
            <p className="mt-2 text-muted-foreground">
              Track and manage your pizza orders.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
            <ShoppingBag size={48} className="mx-auto mb-4 text-orange-500" />
            <h2 className="text-xl font-bold">No Orders Yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't placed any orders yet.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={16} />
                    Ordered {new Date(order.createdAt).toLocaleDateString()}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid gap-6 p-5 md:grid-cols-[180px_1fr]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={order.itemImage || "/placeholder-pizza.jpg"}
                      alt={order.itemName}
                      fill
                      sizes="(max-width: 768px) 100vw, 180px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold">{order.itemName}</h2>
                        <p className="mt-1 text-lg font-bold text-orange-500">
                          ৳{order.price}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                      <div className="flex items-start gap-2">
                        <Store size={17} className="mt-0.5 text-orange-500" />
                        <div>
                          <p className="font-semibold">Vendor</p>
                          <p className="text-muted-foreground">
                            {order.vendorName}
                          </p>
                          <p className="break-all text-muted-foreground">
                            {order.vendorEmail}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <CalendarDays
                          size={17}
                          className="mt-0.5 text-orange-500"
                        />
                        <div>
                          <p className="font-semibold">Delivery Date</p>
                          <p className="text-muted-foreground">
                            {new Date(
                              `${order.deliveryDate}T00:00:00`,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 sm:col-span-2">
                        <MapPin size={17} className="mt-0.5 text-orange-500" />
                        <div>
                          <p className="font-semibold">Delivery Address</p>
                          <p className="text-muted-foreground">
                            {order.deliveryAddress}
                          </p>
                        </div>
                      </div>

                      {order.customerMessage && (
                        <div className="flex items-start gap-2 sm:col-span-2">
                          <MessageSquare
                            size={17}
                            className="mt-0.5 text-orange-500"
                          />
                          <div>
                            <p className="font-semibold">Your Message</p>
                            <p className="text-muted-foreground">
                              {order.customerMessage}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-4">
                      {order.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleWithdraw(order)}
                          disabled={withdrawingId === order.id}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:hover:bg-red-500/10">
                          {withdrawingId === order.id ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {withdrawingId === order.id
                            ? "Withdrawing..."
                            : "Withdraw Order"}
                        </button>
                      )}

                      {order.status === "cancelled" && (
                        <span className="text-sm text-muted-foreground">
                          This order has been withdrawn.
                        </span>
                      )}

                      {order.status === "rejected" && (
                        <span className="text-sm text-muted-foreground">
                          This order was rejected by the vendor.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
