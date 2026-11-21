"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  Eye,
  Loader2,
  Package,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import {
  deleteAdminMenuItem,
  getAdminMenuItems,
  reviewAdminMenuItem,
  updateAdminMenuItemAvailability,
  type AdminMenuItem,
} from "@/lib/api/admin/manageMenuItems-api";

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

const AdminManageMenuItemsPage = () => {
  const { data: session, isPending: sessionLoading } = useSession();

  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const user = session?.user as { role?: string } | undefined;

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminMenuItems(search, category, status);
      setItems(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch menu items.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, category, status]);

  useEffect(() => {
    if (!sessionLoading && user?.role === "admin") {
      fetchItems();
    }
  }, [sessionLoading, user?.role, fetchItems]);

  const handleReview = async (
    id: string,
    newStatus: "approved" | "rejected",
  ) => {
    try {
      setProcessingId(id);
      await reviewAdminMenuItem(id, newStatus);
      toast.success(`Menu item ${newStatus} successfully.`);
      await fetchItems();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleAvailability = async (id: string, isActive: boolean) => {
    try {
      setProcessingId(id);
      await updateAdminMenuItemAvailability(id, isActive);
      toast.success(
        `Menu item ${isActive ? "activated" : "deactivated"} successfully.`,
      );
      await fetchItems();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this menu item?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteAdminMenuItem(id);
      toast.success("Menu item deleted successfully.");
      setItems((previous) => previous.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const pendingCount = items.filter((item) => item.status === "pending").length;

  const approvedCount = items.filter(
    (item) => item.status === "approved",
  ).length;

  const activeCount = items.filter(
    (item) => item.status === "approved" && item.isActive,
  ).length;

  if (sessionLoading || (loading && user?.role === "admin")) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-red-500" />
          <h2 className="text-lg font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-sm text-gray-500">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Menu Items
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review, manage, and control submitted menu items.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-600">
          <Package className="h-4 w-4 text-green-600" />
          {items.length} Menu Items
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Items</p>
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {items.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Pending Review</p>
            <Eye className="h-5 w-5 text-orange-500" />
          </div>
          <h2 className="mt-2 text-2xl font-bold text-orange-600">
            {pendingCount}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Approved</p>
            <Check className="h-5 w-5 text-green-500" />
          </div>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {approvedCount}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Active Items</p>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <h2 className="mt-2 text-2xl font-bold text-emerald-600">
            {activeCount}
          </h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search item or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-lg border bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-green-500">
              <option value="all">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none rounded-lg border bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-green-500">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h2 className="font-semibold text-gray-900">Submitted Menu Items</h2>
          <button
            onClick={fetchItems}
            className="text-sm font-medium text-green-600 hover:text-green-700">
            Refresh
          </button>
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 font-medium text-gray-700">
              No menu items found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Menu Item</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div className="max-w-[200px]">
                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="line-clamp-1 text-xs text-gray-500">
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-800">
                        {item.vendorName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.vendorEmail}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-gray-600">{item.category}</td>

                    <td className="px-4 py-4 font-semibold text-gray-900">
                      ৳{item.price}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : item.status === "pending"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                        }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {item.status === "approved" ? (
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {item.status === "pending" && (
                          <>
                            <button
                              disabled={processingId === item._id}
                              onClick={() => handleReview(item._id, "approved")}
                              title="Approve"
                              className="rounded-lg bg-green-50 p-2 text-green-600 transition hover:bg-green-100 disabled:opacity-50">
                              {processingId === item._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </button>

                            <button
                              disabled={processingId === item._id}
                              onClick={() => handleReview(item._id, "rejected")}
                              title="Reject"
                              className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50">
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        {item.status === "approved" && (
                          <button
                            disabled={processingId === item._id}
                            onClick={() =>
                              handleAvailability(item._id, !item.isActive)
                            }
                            title={item.isActive ? "Deactivate" : "Activate"}
                            className={`rounded-lg p-2 transition disabled:opacity-50 ${
                              item.isActive
                                ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}>
                            {processingId === item._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : item.isActive ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        <button
                          disabled={deletingId === item._id}
                          onClick={() => handleDelete(item._id)}
                          title="Delete"
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:opacity-50">
                          {deletingId === item._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageMenuItemsPage;
