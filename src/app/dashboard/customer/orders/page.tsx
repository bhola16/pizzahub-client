"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronUp,
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
import {
  cancelCustomerOrder,
  getCustomerOrders,
  type Order,
} from "@/lib/api/orders";

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

export default function MyOrdersPage() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
    | { name?: string; email?: string; role?: string }
    | undefined;

  const userEmail = user?.email;
  const userRole = user?.role;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!userEmail) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getCustomerOrders(userEmail);
      setOrders(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load orders.",
      );
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (!isPending) {
      if (userRole === "customer" && userEmail) {
        fetchOrders();
      } else {
        setLoading(false);
      }
    }
  }, [isPending, userRole, userEmail, fetchOrders]);

  const handleWithdraw = async (order: Order) => {
    if (
      order.status !== "pending" ||
      !userEmail ||
      order.customerEmail.toLowerCase() !== userEmail.toLowerCase()
    ) {
      return;
    }

    try {
      setWithdrawingId(order.id);

      await cancelCustomerOrder(order.id, userEmail);

      setOrders((previousOrders) =>
        previousOrders.filter((item) => item.id !== order.id),
      );

      setExpandedOrderId(null);

      toast.success("Your order has been withdrawn successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to withdraw order.",
      );

      await fetchOrders();
    } finally {
      setWithdrawingId(null);
    }
  };

  const toggleDetails = (orderId: string) => {
    setExpandedOrderId((current) => (current === orderId ? null : orderId));
  };

  const formatDate = (date: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusStyles: Record<Order["status"], string> = {
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    accepted:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    cancelled:
      "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400",
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F3] dark:bg-[#171412]">
        <RefreshCw className="animate-spin text-orange-500" size={30} />
      </main>
    );
  }

  if (!user || userRole !== "customer") {
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
          className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600">
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9F3] py-10 text-[#30231D] dark:bg-[#171412] dark:text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/customer"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-orange-500">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">My Orders</h1>
              <p className="mt-2 text-muted-foreground">
                View your orders and track their delivery status.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:opacity-60">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-500/10">
              <ShoppingBag size={30} />
            </div>

            <h2 className="text-xl font-bold">No Orders Yet</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              You haven't placed any orders yet. Explore our menu and find
              something delicious!
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const isWithdrawing = withdrawingId === order.id;

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={16} />
                      <span>Requested on {formatDate(order.createdAt)}</span>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Main Order Information */}
                  <div className="grid gap-5 p-5 sm:grid-cols-[160px_1fr]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted sm:aspect-square">
                      <Image
                        src={order.itemImage || "/placeholder-pizza.jpg"}
                        alt={order.itemName}
                        fill
                        sizes="(max-width: 640px) 100vw, 160px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between gap-5">
                      <div>
                        <h2 className="text-xl font-bold">{order.itemName}</h2>

                        <p className="mt-1 text-lg font-bold text-orange-500">
                          ৳{order.price}
                        </p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <div className="flex items-start gap-2">
                            <Store
                              size={17}
                              className="mt-0.5 shrink-0 text-orange-500"
                            />
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">
                                Vendor
                              </p>
                              <p className="font-semibold">
                                {order.vendorName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <CalendarDays
                              size={17}
                              className="mt-0.5 shrink-0 text-orange-500"
                            />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Delivery Date
                              </p>
                              <p className="font-semibold">
                                {formatDate(order.deliveryDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                        <button
                          type="button"
                          onClick={() => toggleDetails(order.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">
                          {isExpanded ? (
                            <>
                              <ChevronUp size={16} />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} />
                              View Order Details
                            </>
                          )}
                        </button>

                        {order.status === "pending" && (
                          <AlertDialog>
                            <AlertDialogTrigger
                              render={
                                <button
                                  type="button"
                                  disabled={isWithdrawing}
                                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:hover:bg-red-500/10">
                                  {isWithdrawing ? (
                                    <RefreshCw
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <XCircle size={16} />
                                  )}
                                  Withdraw Order
                                </button>
                              }
                            />

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Withdraw this order?
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                  Are you sure you want to withdraw your order
                                  for {order.itemName}? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Keep Order
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  disabled={isWithdrawing}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleWithdraw(order);
                                  }}
                                  className="bg-red-600 text-white hover:bg-red-700">
                                  {isWithdrawing
                                    ? "Withdrawing..."
                                    : "Yes, Withdraw"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {order.status === "accepted" && (
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Your order has been accepted.
                          </span>
                        )}

                        {order.status === "rejected" && (
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">
                            This order was rejected by the vendor.
                          </span>
                        )}

                        {order.status === "cancelled" && (
                          <span className="text-sm text-muted-foreground">
                            This order has been cancelled.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Order Details */}
                  {isExpanded && (
                    <div className="border-t border-border bg-muted/20 p-5 sm:p-6">
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold">Order Details</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Complete information about your order
                          </p>
                        </div>

                        <Package className="text-orange-500" size={22} />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Vendor Information */}
                        <div className="rounded-xl border border-border bg-card p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                              <Store size={18} />
                            </div>
                            <h4 className="font-semibold">
                              Vendor Information
                            </h4>
                          </div>

                          <p className="font-medium">{order.vendorName}</p>
                          <p className="mt-1 break-all text-sm text-muted-foreground">
                            {order.vendorEmail}
                          </p>
                        </div>

                        {/* Delivery Date */}
                        <div className="rounded-xl border border-border bg-card p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                              <CalendarDays size={18} />
                            </div>
                            <h4 className="font-semibold">Delivery Date</h4>
                          </div>

                          <p className="font-medium">
                            {formatDate(order.deliveryDate)}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Scheduled delivery
                          </p>
                        </div>

                        {/* Delivery Address */}
                        <div className="rounded-xl border border-border bg-card p-4 sm:col-span-2">
                          <div className="flex items-start gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                              <MapPin size={18} />
                            </div>

                            <div>
                              <h4 className="font-semibold">
                                Delivery Address
                              </h4>
                              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                {order.deliveryAddress}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Customer Message */}
                        {order.customerMessage && (
                          <div className="rounded-xl border border-border bg-card p-4 sm:col-span-2">
                            <div className="flex items-start gap-3">
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                                <MessageSquare size={18} />
                              </div>

                              <div>
                                <h4 className="font-semibold">Your Message</h4>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                  {order.customerMessage}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Request Information */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Clock size={18} />
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Request Date
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="mb-1 text-xs text-muted-foreground">
                            Order Status
                          </p>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
