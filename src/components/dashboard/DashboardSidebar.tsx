"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  UtensilsCrossed,
  ShoppingBag,
  CreditCard,
  Users,
  ClipboardList,
  Receipt,
  X,
} from "lucide-react";
import Image from "next/image";
import DashboardFooter from "./DashboardFooter";

interface DashboardSidebarProps {
  role: "vendor" | "customer" | "admin";
  isOpen: boolean;
  onClose: () => void;
}

const navigation = {
  vendor: [
    { name: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    {
      name: "Add Menu Item",
      href: "/dashboard/vendor/add-menu-item",
      icon: PlusCircle,
    },
    {
      name: "My Menu Items",
      href: "/dashboard/vendor/my-menu-items",
      icon: UtensilsCrossed,
    },
    {
      name: "Customer Orders",
      href: "/dashboard/vendor/orders",
      icon: ShoppingBag,
    },
    {
      name: "Subscription",
      href: "/dashboard/vendor/subscription",
      icon: CreditCard,
    },
  ],
  customer: [
    { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    {
      name: "My Orders",
      href: "/dashboard/customer/orders",
      icon: ShoppingBag,
    },
  ],
  admin: [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
      name: "Manage Menu Items",
      href: "/dashboard/admin/manage-menuItems",
      icon: ClipboardList,
    },
    {
      name: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Receipt,
    },
  ],
};

export default function DashboardSidebar({
  role,
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const links = navigation[role];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
    fixed left-0 top-20 z-60 flex h-[calc(100dvh-5rem)] w-72
    flex-col overflow-hidden border-r border-gray-200 bg-white
    shadow-xl transition-transform duration-300
    dark:border-gray-800 dark:bg-[#171412]
    lg:static lg:z-auto lg:h-full lg:translate-x-0 lg:shadow-none
    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}>
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center text-2xl font-extrabold tracking-tight text-[#E87932]">
            <Image
              src="/assets/pizzahub-logo.jpg"
              alt="Pizza-logo"
              width={40}
              height={40}
              className="mr-2 rounded-xl"
            />
            PizzaHub<span className="text-gray-900 dark:text-white">.</span>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Close sidebar">
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {role} Dashboard
          </p>

          {links.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== `/dashboard/${role}` &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E87932]/10 text-[#E87932]"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}>
                <Icon size={19} className="block h-[19px] w-[19px] shrink-0" />
                <span className="flex-1 truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0">
          <DashboardFooter />
        </div>
      </aside>
    </>
  );
}
