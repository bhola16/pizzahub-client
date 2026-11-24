"use client";

import { authClient } from "@/lib/auth-client";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  ShoppingBag,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type UserRole = "admin" | "vendor" | "customer";

type NavbarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole | null;
};

const roleDashboard: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  vendor: "/dashboard/vendor",
  customer: "/dashboard/customer",
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  vendor: "Vendor",
  customer: "Customer",
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, setTheme } = useTheme();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as NavbarUser | undefined;
  const isLoggedIn = !!session?.user;

  const role: UserRole | null =
    user?.role === "admin" ||
    user?.role === "vendor" ||
    user?.role === "customer"
      ? user.role
      : null;

  const dashboardLink = role ? roleDashboard[role] : "/dashboard";

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click and Escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  // Close menus after navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Main navigation links
  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Menu", href: "/menu" },
    ...(isLoggedIn && role
      ? [{ label: "Dashboard", href: dashboardLink }]
      : []),
  ];

  // Logout
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Unable to log out. Please try again.");
        return;
      }

      setProfileOpen(false);
      setMobileMenuOpen(false);

      toast.success("Logged out successfully!");

      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  // Profile avatar
  const ProfileAvatar = ({ size = "h-9 w-9" }: { size?: string }) => {
    return (
      <div
        className={`${size} relative shrink-0 overflow-hidden rounded-full border border-[#E7D8C8] bg-[#FCE9D8] dark:border-[#514033] dark:bg-[#38271F]`}>
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name || "Profile image"}
            fill
            sizes="56px"
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#D45B24] dark:text-[#FFB36C]">
            <UserRound size={19} />
          </div>
        )}
      </div>
    );
  };

  // Theme toggle
  const ThemeToggle = () => {
    if (!mounted) {
      return (
        <button
          type="button"
          aria-label="Loading theme"
          disabled
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E7D8C8] bg-white text-[#D45B24] dark:border-[#514033] dark:bg-[#29221E] dark:text-[#FFB36C]">
          <Sun size={19} />
        </button>
      );
    }

    const isDark = resolvedTheme === "dark";

    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E7D8C8] bg-white text-[#D45B24] shadow-sm transition-all duration-300 hover:scale-110 hover:border-[#E87932] hover:bg-[#FFF0E3] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E87932] dark:border-[#514033] dark:bg-[#29221E] dark:text-[#FFB36C] dark:hover:border-[#E87932] dark:hover:bg-[#3B2B22]">
        {isDark ? (
          <Sun
            size={19}
            strokeWidth={2.2}
            className="transition-transform duration-500 group-hover:rotate-45"
          />
        ) : (
          <Moon
            size={19}
            strokeWidth={2.2}
            className="transition-transform duration-500 group-hover:rotate-45"
          />
        )}
      </button>
    );
  };

  // Customer orders icon
  const OrdersButton = () => {
    if (!isLoggedIn || role !== "customer") return null;

    const active = isActive("/dashboard/customer/orders");

    return (
      <Link
        href="/dashboard/customer/orders"
        aria-label="My orders"
        title="My orders"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 ${
          active
            ? "border-[#E87932] bg-[#FCE8D8] text-[#C44D1D] dark:border-[#A95428] dark:bg-[#493022] dark:text-[#FFB36C]"
            : "border-[#E7D8C8] bg-white text-[#514034] hover:border-[#E87932] hover:bg-[#FFF0E3] hover:text-[#D45B24] dark:border-[#514033] dark:bg-[#29221E] dark:text-[#E8D7C8] dark:hover:border-[#E87932] dark:hover:bg-[#3B2B22] dark:hover:text-[#FFB36C]"
        }`}>
        <ShoppingBag size={19} strokeWidth={2} />
      </Link>
    );
  };

  // Navigation link
  const NavLink = ({
    href,
    label,
    mobile = false,
  }: {
    href: string;
    label: string;
    mobile?: boolean;
  }) => {
    const active = isActive(href);

    return (
      <Link
        href={href}
        onClick={() => mobile && setMobileMenuOpen(false)}
        className={`relative rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
          mobile ? "block w-full rounded-xl px-4" : ""
        } ${
          active
            ? "bg-[#FCE8D8] text-[#C44D1D] dark:bg-[#493022] dark:text-[#FFB36C]"
            : "text-[#514034] hover:bg-[#FFF0E3] hover:text-[#D45B24] dark:text-[#E8D7C8] dark:hover:bg-[#3B2B22] dark:hover:text-[#FFB36C]"
        }`}>
        {label}
      </Link>
    );
  };

  return (
    <header
      className={`sticky top-0 z-100 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#E7D8C8] bg-[#FFFCF8]/95 shadow-[0_8px_30px_-15px_rgba(70,45,25,0.25)] backdrop-blur-xl dark:border-[#3C3029] dark:bg-[#191512]/95"
          : "border-b border-[#E7D8C8]/70 bg-[#FFFCF8]/90 backdrop-blur-xl dark:border-[#3C3029]/70 dark:bg-[#191512]/90"
      }`}>
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="PizzaHub home">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#F47735] to-[#C64A1D] shadow-lg shadow-[#D45B24]/20 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
            <Image
              src="/assets/pizzahub-logo.jpg"
              alt="PizzaHub logo"
              width={44}
              height={44}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[#29231F] dark:text-[#FFF7ED] sm:text-2xl">
              Pizza<span className="text-[#E36A2C]">Hub</span>
            </span>
            <span className="-mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#9B806B] dark:text-[#BDA48F]">
              Freshness delivered
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <OrdersButton />

          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#EFE5DA] dark:bg-[#332820]" />
          ) : isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              {/* Profile Button */}
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-[#E7D8C8] bg-white px-2.5 py-1.5 shadow-sm transition-all duration-200 hover:border-[#E87932] hover:bg-[#FFFAF5] hover:shadow-md dark:border-[#514033] dark:bg-[#29221E] dark:hover:border-[#A95428] dark:hover:bg-[#352820]">
                <ProfileAvatar size="h-8 w-8" />

                <span className="max-w-28 truncate text-sm font-semibold text-[#42352B] dark:text-[#F5E8DC]">
                  {user?.name || "My Account"}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-[#947A65] transition-transform duration-300 dark:text-[#C6A58E] ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-[#E7D8C8] bg-white p-2 shadow-xl shadow-black/10 dark:border-[#514033] dark:bg-[#29221E] dark:shadow-black/30">
                  {/* Profile Information */}
                  <div className="flex items-center gap-3 border-b border-[#EFE5DA] px-3 py-4 dark:border-[#514033]">
                    <ProfileAvatar size="h-14 w-14" />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#352B24] dark:text-[#FFF7ED]">
                        {user?.name || "User"}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-[#987F6D] dark:text-[#BDA48F]">
                        {user?.email}
                      </p>

                      {role && (
                        <span className="mt-2 inline-block rounded-full bg-[#FCE8D8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C44D1D] dark:bg-[#493022] dark:text-[#FFB36C]">
                          {roleLabels[role]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div className="space-y-1 py-2">
                    {role && (
                      <Link
                        href={dashboardLink}
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#514034] transition-colors hover:bg-[#FFF0E3] hover:text-[#D45B24] dark:text-[#E8D7C8] dark:hover:bg-[#3B2B22] dark:hover:text-[#FFB36C]">
                        <LayoutDashboard size={17} />
                        {roleLabels[role]} Dashboard
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#514034] transition-colors hover:bg-[#FFF0E3] hover:text-[#D45B24] dark:text-[#E8D7C8] dark:hover:bg-[#3B2B22] dark:hover:text-[#FFB36C]">
                      <Settings size={17} />
                      Profile Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[#EFE5DA] pt-2 dark:border-[#514033]">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30">
                      <LogOut size={17} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-5 py-2.5 text-sm font-bold text-[#514034] transition-colors hover:bg-[#FFF0E3] hover:text-[#D45B24] dark:text-[#E8D7C8] dark:hover:bg-[#3B2B22] dark:hover:text-[#FFB36C]">
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-gradient-to-r from-[#F47735] to-[#C64A1D] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#D45B24]/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#E96A2A] hover:to-[#B83E17] hover:shadow-xl hover:shadow-[#D45B24]/30">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <OrdersButton />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E7D8C8] bg-white text-[#D45B24] transition-all duration-200 hover:border-[#E87932] hover:bg-[#FFF0E3] dark:border-[#514033] dark:bg-[#29221E] dark:text-[#FFB36C] dark:hover:border-[#A95428] dark:hover:bg-[#3B2B22]">
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
      ref={mobileMenuRef}
        className={`grid overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}>
        <div className="min-h-0">
          <div className="border-t border-[#E7D8C8] bg-[#FFFCF8] px-4 pb-5 pt-3 dark:border-[#3C3029] dark:bg-[#191512]">
            <nav className="flex flex-col gap-1">
              {navigationLinks.map((link) => (
                <NavLink key={link.href} {...link} mobile />
              ))}
            </nav>

            {!isPending && (
              <div className="mt-4 border-t border-[#E7D8C8] pt-4 dark:border-[#3C3029]">
                {isLoggedIn ? (
                  <>
                    {/* Mobile Profile Information */}
                    <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#FFF3E8] p-3 dark:bg-[#29221E]">
                      <ProfileAvatar size="h-12 w-12" />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#352B24] dark:text-[#FFF7ED]">
                          {user?.name || "User"}
                        </p>

                        <p className="truncate text-xs text-[#987F6D] dark:text-[#BDA48F]">
                          {user?.email}
                        </p>

                        {role && (
                          <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-[#D45B24] dark:text-[#FFB36C]">
                            {roleLabels[role]} Account
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mobile Profile Links */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#E7D8C8] px-3 py-3 text-sm font-semibold text-[#514034] transition-colors hover:border-[#E87932] hover:bg-[#FFF0E3] dark:border-[#514033] dark:text-[#E8D7C8] dark:hover:bg-[#3B2B22]">
                        <UserRound size={16} />
                        Profile
                      </Link>

                      {role && (
                        <Link
                          href={dashboardLink}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 rounded-xl border border-[#E7D8C8] px-3 py-3 text-sm font-semibold text-[#514034] transition-colors hover:border-[#E87932] hover:bg-[#FFF0E3] dark:border-[#514033] dark:text-[#E8D7C8] dark:hover:bg-[#3B2B22]">
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40">
                      <LogOut size={17} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl border border-[#E7D8C8] px-4 py-3 text-center text-sm font-bold text-[#514034] transition-colors hover:border-[#E87932] hover:bg-[#FFF0E3] dark:border-[#514033] dark:text-[#E8D7C8] dark:hover:bg-[#3B2B22]">
                      Sign In
                    </Link>

                    <Link
                      href="/sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl bg-gradient-to-r from-[#F47735] to-[#C64A1D] px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-[#D45B24]/20 transition-all hover:from-[#E96A2A] hover:to-[#B83E17]">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E87932] to-[#F6B65B] opacity-90" />
    </header>
  );
}


