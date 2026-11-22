"use client";

import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  ShieldBan,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  AdminUser,
  blockAdminUser,
  getAdminUsers,
  unblockAdminUser,
} from "@/lib/api/admin/manageUsers-api";
import Link from "next/link";

export default function ManageUsersPage() {
  const { data: session, isPending } = useSession();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlRole = searchParams.get("role") || "all";

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState(urlSearch);
  const [role, setRole] = useState(urlRole);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Prevent older search requests from overwriting newer results
  const requestId = useRef(0);

  const currentUser = session?.user;

  // Sync inputs with URL (including browser back/forward)
  useEffect(() => {
    setSearch(urlSearch);
    setRole(urlRole);
  }, [urlSearch, urlRole]);

  // Search and filter with debounce
  useEffect(() => {
    if (isPending) return;

    if (currentUser?.role !== "admin") {
      setUsers([]);
      setLoading(false);
      return;
    }

    const currentRequest = ++requestId.current;

    const timer = setTimeout(async () => {
      try {
        // Do not show the full-page loader for subsequent searches
        const data = await getAdminUsers(search.trim(), role);

        if (currentRequest === requestId.current) {
          setUsers(data);
        }
      } catch (error) {
        if (currentRequest === requestId.current) {
          toast.error(
            error instanceof Error ? error.message : "Failed to fetch users.",
          );
        }
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search, role, isPending, currentUser?.role]);

  // Update URL without triggering Next.js navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      const trimmedSearch = search.trim();

      if (trimmedSearch) {
        params.set("search", trimmedSearch);
      } else {
        params.delete("search");
      }

      if (role !== "all") {
        params.set("role", role);
      } else {
        params.delete("role");
      }

      const query = params.toString();
      const newUrl = query
        ? `${window.location.pathname}?${query}`
        : window.location.pathname;

      const currentUrl = window.location.pathname + window.location.search;

      if (newUrl !== currentUrl) {
        window.history.replaceState(null, "", newUrl);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, role]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers(search.trim(), role);
      setUsers(data);
    } catch (error) {
      console.error("Failed to refresh users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Block / Unblock user
  const handleBlockToggle = async (user: AdminUser) => {
    if (updatingId !== null) return;

    try {
      setUpdatingId(user._id);

      const result = user.isBlocked
        ? await unblockAdminUser(user._id)
        : await blockAdminUser(user._id);

      setUsers((previous) =>
        previous.map((item) =>
          item._id === user._id
            ? { ...item, isBlocked: !user.isBlocked }
            : item,
        ),
      );

      toast.success(result.message);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update user status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Initial loading
  if (isPending || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  // Admin access check
  if (currentUser?.role !== "admin") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">
        <ShieldBan className="mx-auto mb-3 h-10 w-10 text-red-500" />

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Access Denied
        </h2>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Only administrators can manage users.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/dashboard/admin"
            className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-orange-500">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Manage Users
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View, search, and manage registered users.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 sm:self-center">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Users */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
              <Users size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Users
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-3 text-green-600 dark:bg-green-950 dark:text-green-300">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Users
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.filter((user) => !user.isBlocked).length}
              </h2>
            </div>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-950 dark:text-red-300">
              <ShieldBan size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Blocked Users
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.filter((user) => user.isBlocked).length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-red-500"
                aria-label="Clear search">
                <X size={17} />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {/* User */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "User"}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserRound size={19} />
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {user.name || "Unnamed User"}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Mail size={12} />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      {user.role}
                    </span>
                  </td>

                  {/* Registration Date */}
                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={14} />

                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.isBlocked
                          ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300"
                          : "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                      }`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4 text-right">
                    {user.role === "admin" ? (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        Protected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBlockToggle(user)}
                        disabled={updatingId !== null}
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition disabled:opacity-50 ${
                          user.isBlocked
                            ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900"
                            : "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                        }`}>
                        {updatingId === user._id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : user.isBlocked ? (
                          "Unblock"
                        ) : (
                          "Block"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Showing {users.length} users
        </div>
      </div>
    </div>
  );
}
