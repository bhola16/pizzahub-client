"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";

const DashboardFooter = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="shrink-0 border-t border-gray-200 p-2 dark:border-gray-800">
      {/* User Profile */}
      <Link href={`/profile`}>
        <div className="mb-4 flex items-center gap-3">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "User profile"}
              width={42}
              height={42}
              unoptimized
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E87932]/10 font-bold text-[#E87932]">
              {isPending ? <UserRound size={20} /> : initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {isPending ? "Loading..." : user?.name || "User"}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </Link>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        disabled={isSigningOut || isPending}
        className="mx-auto flex w-[calc(100%-8px)] items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400">
        <LogOut size={17} />
        {isSigningOut ? "Signing out..." : "Sign Out"}
      </button>

      {/* Copyright */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} PizzaHub
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Made with love for pizza lovers.
        </p>
      </div>
    </div>
  );
};

export default DashboardFooter;