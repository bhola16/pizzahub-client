"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { checkExistingOrder, placeOrder } from "@/lib/api/orders";

interface OrderButtonProps {
  itemId: string;
  status: string;
  isActive: boolean;
  vendorEmail: string;
}

export default function OrderButton({
  itemId,
  status,
  isActive,
  vendorEmail,
}: OrderButtonProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [checkingOrder, setCheckingOrder] = useState(true);
  const [alreadyOrdered, setAlreadyOrdered] = useState(false);

type SessionUser = NonNullable<typeof session>["user"] & {
  role?: string;
};

const user = session?.user as SessionUser | undefined;

  // Check existing order when the customer opens the page
  useEffect(() => {
    let cancelled = false;

    const checkOrder = async () => {
      if (isPending) return;

      if (!user?.email || user.role !== "customer") {
        setCheckingOrder(false);
        return;
      }

      try {
        const ordered = await checkExistingOrder(itemId, user.email);

        if (!cancelled) {
          setAlreadyOrdered(ordered);
        }
      } catch (error) {
        console.error("Order check failed:", error);
      } finally {
        if (!cancelled) {
          setCheckingOrder(false);
        }
      }
    };

    setCheckingOrder(true);
    checkOrder();

    return () => {
      cancelled = true;
    };
  }, [itemId, isPending, user?.email, user?.role]);

  const handleOrder = async () => {
    if (isPending || loading || checkingOrder || alreadyOrdered) return;

    // Authentication check
    if (!session?.user) {
      router.push(
        `/sign-in?callbackURL=${encodeURIComponent(`/menu/${itemId}`)}`,
      );
      return;
    }

    // Admin restriction
    if (user?.role === "admin") {
      toast.error("Admins cannot place orders.");
      return;
    }

    // Vendor restriction
    if (user?.role === "vendor") {
      if (user.email?.toLowerCase() === vendorEmail.toLowerCase()) {
        toast.error("You cannot order your own menu item.");
      } else {
        toast.error("Vendors cannot place customer orders.");
      }
      return;
    }

    // Availability check
    if (status !== "approved" || !isActive) {
      toast.error("This menu item is currently unavailable.");
      return;
    }

    if (!user?.email) {
      toast.error("Your account email could not be found.");
      return;
    }

    try {
      setLoading(true);

      const result = await placeOrder({
        itemId,
        customerName: user.name || "",
        customerEmail: user.email,
      });

      if (result.alreadyOrdered) {
        setAlreadyOrdered(true);
        toast.info("You have already ordered this item.");
        return;
      }

      setAlreadyOrdered(true);
      toast.success("Your order has been placed successfully!");
    } catch (error) {
      console.error("Order failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const disabled =
    isPending ||
    loading ||
    checkingOrder ||
    alreadyOrdered ||
    status !== "approved" ||
    !isActive;

  return (
    <button
      type="button"
      onClick={handleOrder}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-70 ${
        alreadyOrdered
          ? "bg-green-600 shadow-green-500/20"
          : "bg-orange-500 shadow-orange-500/20 hover:bg-orange-600"
      }`}>
      {loading || isPending || checkingOrder ? (
        <Loader2 size={20} className="animate-spin" />
      ) : alreadyOrdered ? (
        <CheckCircle size={20} />
      ) : (
        <ShoppingBag size={20} />
      )}

      {loading
        ? "Placing Order..."
        : isPending || checkingOrder
          ? "Checking..."
          : alreadyOrdered
            ? "Already Ordered"
            : status !== "approved" || !isActive
              ? "Unavailable"
              : "Order Now"}
    </button>
  );
}
