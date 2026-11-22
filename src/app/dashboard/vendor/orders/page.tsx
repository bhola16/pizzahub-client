"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  MessageSquare,
  Package,
  RefreshCw,
  ShoppingBag,
  Store,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  getVendorOrders,
  updateVendorOrderStatus,
  type Order,
} from "@/lib/api/orders";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

type VendorOrderStatus = "accepted" | "rejected";
type OrderFilter = "all" | "pending" | "accepted" | "rejected";

export default function CustomerOrdersPage() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
    | { name?: string; email?: string; role?: string }
    | undefined;

  const userEmail = user?.email;
  const userRole = user?.role;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Fetch vendor orders
  const fetchOrders = useCallback(async () => {
    if (!userEmail) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getVendorOrders(userEmail);

      setOrders(
        data.filter(
          (order) =>
            order.vendorEmail.toLowerCase() === userEmail.toLowerCase(),
        ),
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load customer orders.",
      );
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (!isPending) {
      if (userRole === "vendor" && userEmail) {
        fetchOrders();
      } else {
        setLoading(false);
      }
    }
  }, [isPending, userRole, userEmail, fetchOrders]);

  // Update order status
  const handleStatusUpdate = async (
    order: Order,
    status: VendorOrderStatus,
  ) => {
    if (
      order.status !== "pending" ||
      !userEmail ||
      order.vendorEmail.toLowerCase() !== userEmail.toLowerCase()
    ) {
      toast.error("You cannot modify this order.");
      return;
    }

    try {
      setUpdatingId(order.id);

      await updateVendorOrderStatus(order.id, userEmail, status);

      setOrders((previousOrders) =>
        previousOrders.map((item) =>
          item.id === order.id ? { ...item, status } : item,
        ),
      );

      toast.success(
        status === "accepted"
          ? "Order accepted successfully."
          : "Order rejected successfully.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order status.",
      );

      await fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  // Toggle order details
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId((current) => (current === orderId ? null : orderId));
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    const statusPriority: Record<Order["status"], number> = {
      pending: 1,
      accepted: 2,
      rejected: 3,
      cancelled: 4,
    };

    return orders
      .filter((order) => {
        if (activeFilter === "all") return true;
        return order.status === activeFilter;
      })
      .sort((a, b) => {
        if (activeFilter === "all") {
          const statusDifference =
            statusPriority[a.status] - statusPriority[b.status];

          if (statusDifference !== 0) return statusDifference;
        }

        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [orders, activeFilter]);

  // Format dates
  const formatDate = (date: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Status styles
  const statusStyles: Record<Order["status"], string> = {
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    accepted:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    cancelled:
      "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400",
  };

  // Loading state
  if (isPending || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F3] dark:bg-[#171412]">
        <RefreshCw className="animate-spin text-orange-500" size={30} />
      </main>
    );
  }

  // Vendor access validation
  if (!user || userRole !== "vendor") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FFF9F3] px-4 text-center dark:bg-[#171412]">
        <Store size={45} className="text-orange-500" />

        <h1 className="text-2xl font-bold text-foreground">
          Vendor Access Only
        </h1>

        <p className="text-muted-foreground">
          Please sign in with a vendor account to manage customer orders.
        </p>

        <Link
          href="/dashboard"
          className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600">
          Go to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full bg-[#FFF9F3]  space-y-2 text-[#30231D] dark:bg-[#171412] dark:text-white">
      {" "}
      <div className="w-full">
        {/* Page Header */}
        <div className="mb-5 space-y-3">
          <Link
            href="/dashboard/vendor"
            className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-orange-500">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Customer Orders
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Review customer requests and manage your orders.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:bg-muted disabled:opacity-60">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="mt-1 text-xl font-semibold">{orders.length}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="mt-1 text-xl font-semibold text-yellow-600">
              {orders.filter((order) => order.status === "pending").length}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">Accepted</p>
            <p className="mt-1 text-xl font-semibold text-green-600">
              {orders.filter((order) => order.status === "accepted").length}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">Rejected</p>
            <p className="mt-1 text-xl font-semibold text-red-600">
              {orders.filter((order) => order.status === "rejected").length}
            </p>
          </div>
        </div>

        {/* Order Filters */}
        <div className="my-4 flex flex-wrap items-center gap-2">
          {(
            [
              { value: "all", label: "All", count: orders.length },
              {
                value: "pending",
                label: "Pending",
                count: orders.filter((order) => order.status === "pending")
                  .length,
              },
              {
                value: "accepted",
                label: "Accepted",
                count: orders.filter((order) => order.status === "accepted")
                  .length,
              },
              {
                value: "rejected",
                label: "Rejected",
                count: orders.filter((order) => order.status === "rejected")
                  .length,
              },
            ] as const
          ).map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                activeFilter === filter.value
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              {filter.label}

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeFilter === filter.value
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-500/10">
              <ShoppingBag size={27} />
            </div>

            <h2 className="text-lg font-bold">
              {activeFilter === "all"
                ? "No Customer Orders Yet"
                : `No ${activeFilter} Orders`}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {activeFilter === "all"
                ? "New customer orders will appear here."
                : `There are currently no ${activeFilter} orders.`}
            </p>

            {activeFilter !== "all" && (
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className="mt-4 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
                View All Orders
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const isUpdating = updatingId === order.id;
              const isExpanded = expandedOrderId === order.id;

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={14} />
                      <span>Requested on {formatDate(order.createdAt)}</span>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Main Order Information */}
                  <div className="grid gap-4 p-4 sm:grid-cols-[120px_1fr]">
                    {/* Item Image */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted sm:aspect-square">
                      <Image
                        src={order.itemImage || "/placeholder-pizza.jpg"}
                        alt={order.itemName}
                        fill
                        sizes="(max-width: 640px) 100vw, 120px"
                        className="object-cover"
                      />
                    </div>

                    {/* Item and Customer Information */}
                    <div className="flex flex-col justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold">{order.itemName}</h2>

                        <p className="mt-0.5 text-base font-bold text-orange-500">
                          ৳{order.price}
                        </p>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {/* Customer */}
                          <div className="flex items-start gap-2">
                            <User
                              size={16}
                              className="mt-0.5 shrink-0 text-orange-500"
                            />

                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">
                                Customer
                              </p>

                              <p className="text-sm font-semibold">
                                {order.customerName}
                              </p>

                              <p className="break-all text-xs text-muted-foreground">
                                {order.customerEmail}
                              </p>
                            </div>
                          </div>

                          {/* Delivery Date */}
                          <div className="flex items-start gap-2">
                            <CalendarDays
                              size={16}
                              className="mt-0.5 shrink-0 text-orange-500"
                            />

                            <div>
                              <p className="text-xs text-muted-foreground">
                                Delivery Date
                              </p>

                              <p className="text-sm font-semibold">
                                {formatDate(order.deliveryDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                        {order.status === "pending" ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(order, "accepted")
                              }
                              disabled={isUpdating}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3.5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
                              {isUpdating ? (
                                <RefreshCw size={15} className="animate-spin" />
                              ) : (
                                <CheckCircle size={15} />
                              )}
                              Accept Order
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(order, "rejected")
                              }
                              disabled={isUpdating}
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3.5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:hover:bg-red-500/10">
                              {isUpdating ? (
                                <RefreshCw size={15} className="animate-spin" />
                              ) : (
                                <XCircle size={15} />
                              )}
                              Reject Order
                            </button>
                          </>
                        ) : (
                          <div
                            className={`flex items-center gap-2 rounded-lg border px-4 py-3 ${
                              order.status === "accepted"
                                ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-900 dark:from-green-950/30 dark:to-emerald-950/20"
                                : "border-red-200 bg-gradient-to-r from-red-50 to-rose-50 dark:border-red-900 dark:from-red-950/30 dark:to-rose-950/20"
                            }`}>
                            {order.status === "accepted" ? (
                              <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 shrink-0 text-red-600" />
                            )}

                            <p
                              className={`text-sm font-medium capitalize ${
                                order.status === "accepted"
                                  ? "text-green-700 dark:text-green-400"
                                  : "text-red-700 dark:text-red-400"
                              }`}>
                              This order has already been {order.status}.
                            </p>
                          </div>
                        )}

                        {/* Order Details Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleOrderDetails(order.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold transition hover:bg-muted">
                          {isExpanded ? (
                            <>
                              <ChevronUp size={15} />
                              Hide Order Details
                            </>
                          ) : (
                            <>
                              <ChevronDown size={15} />
                              Order Details
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Order Details */}
                  {isExpanded && (
                    <div className="border-t border-border bg-muted/20 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">Order Details</h3>
                          <p className="text-xs text-muted-foreground">
                            Customer and delivery information
                          </p>
                        </div>

                        <Package className="text-orange-500" size={20} />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {/* Customer Information */}
                        <div className="rounded-lg border border-border bg-card p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <User size={16} className="text-orange-500" />
                            <h4 className="text-sm font-semibold">
                              Customer Information
                            </h4>
                          </div>

                          <p className="text-sm font-medium">
                            {order.customerName}
                          </p>
                          <p className="mt-0.5 break-all text-xs text-muted-foreground">
                            {order.customerEmail}
                          </p>
                        </div>

                        {/* Item Information */}
                        <div className="rounded-lg border border-border bg-card p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <ShoppingBag
                              size={16}
                              className="text-orange-500"
                            />
                            <h4 className="text-sm font-semibold">
                              Item Information
                            </h4>
                          </div>

                          <p className="text-sm font-medium">
                            {order.itemName}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Price: ৳{order.price}
                          </p>
                        </div>

                        {/* Delivery Date */}
                        <div className="rounded-lg border border-border bg-card p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <CalendarDays
                              size={16}
                              className="text-orange-500"
                            />
                            <h4 className="text-sm font-semibold">
                              Delivery Date
                            </h4>
                          </div>

                          <p className="text-sm font-medium">
                            {formatDate(order.deliveryDate)}
                          </p>
                        </div>

                        {/* Delivery Address */}
                        <div className="rounded-lg border border-border bg-card p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <MapPin size={16} className="text-orange-500" />
                            <h4 className="text-sm font-semibold">
                              Delivery Address
                            </h4>
                          </div>

                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {order.deliveryAddress}
                          </p>
                        </div>

                        {/* Customer Message */}
                        {order.customerMessage && (
                          <div className="rounded-lg border border-border bg-card p-3 sm:col-span-2">
                            <div className="mb-2 flex items-center gap-2">
                              <MessageSquare
                                size={16}
                                className="text-orange-500"
                              />
                              <h4 className="text-sm font-semibold">
                                Customer Message
                              </h4>
                            </div>

                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {order.customerMessage}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Request Date and Status */}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-muted-foreground" />

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Request Date
                            </p>
                            <p className="text-sm font-semibold">
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
