"use client";

import { CheckCircle, Loader2, ShoppingBag, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
  cancelCustomerOrder,
  checkExistingOrder,
  placeOrder,
} from "@/lib/api/orders";
import { authClient } from "@/lib/auth-client";

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

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderButtonProps {
  itemId: string;
  status: string;
  isActive: boolean;
  vendorEmail: string;
}

type SessionUser = {
  name?: string;
  email?: string;
  role?: string;
};

export default function OrderButton({
  itemId,
  status,
  isActive,
  vendorEmail,
}: OrderButtonProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as SessionUser | undefined;

  const [loading, setLoading] = useState(false);
  const [checkingOrder, setCheckingOrder] = useState(true);
  const [alreadyOrdered, setAlreadyOrdered] = useState(false);
  const [existingOrderId, setExistingOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState<
    "pending" | "accepted" | "rejected" | "cancelled" | undefined
  >();

  const [showForm, setShowForm] = useState(false);

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");

  const getLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const minDate = getLocalDate(new Date());

  const refreshOrderStatus = async () => {
    if (!user?.email || user.role !== "customer") {
      setAlreadyOrdered(false);
      setExistingOrderId("");
      setOrderStatus(undefined);
      return;
    }

    const result = await checkExistingOrder(itemId, user.email);

    setAlreadyOrdered(result.alreadyOrdered);
    setExistingOrderId(result.orderId || "");
    setOrderStatus(result.status);
  };

  useEffect(() => {
    let cancelled = false;

    const checkOrder = async () => {
      if (isPending) return;

      if (!user?.email || user.role !== "customer") {
        setAlreadyOrdered(false);
        setExistingOrderId("");
        setOrderStatus(undefined);
        setCheckingOrder(false);
        return;
      }

      setCheckingOrder(true);

      try {
        const result = await checkExistingOrder(itemId, user.email);

        if (!cancelled) {
          setAlreadyOrdered(result.alreadyOrdered);
          setExistingOrderId(result.orderId || "");
          setOrderStatus(result.status);
        }
      } catch (error) {
        console.error("Order check failed:", error);

        if (!cancelled) {
          toast.error("Could not check your existing order.");
        }
      } finally {
        if (!cancelled) {
          setCheckingOrder(false);
        }
      }
    };

    checkOrder();

    return () => {
      cancelled = true;
    };
  }, [itemId, isPending, user?.email, user?.role]);

  const handleOrder = () => {
    if (isPending || loading || checkingOrder) return;

    if (!session?.user) {
      router.push(
        `/sign-in?callbackURL=${encodeURIComponent(`/menu/${itemId}`)}`,
      );
      return;
    }

    if (user?.role === "admin") {
      toast.error("Admins cannot place orders.");
      return;
    }

    if (user?.role === "vendor") {
      if (user.email?.toLowerCase() === vendorEmail.toLowerCase()) {
        toast.error("You cannot order your own menu item.");
      } else {
        toast.error("Vendors cannot place customer orders.");
      }
      return;
    }

    if (user?.role !== "customer") {
      toast.error("Only customers can place orders.");
      return;
    }

    if (alreadyOrdered) return;

    if (status !== "approved" || !isActive) {
      toast.error("This menu item is currently unavailable.");
      return;
    }

    if (!user.email) {
      toast.error("Your account email could not be found.");
      return;
    }

    setShowForm(true);
  };

  const handleCancelOrder = async () => {
    if (!user?.email || !existingOrderId || orderStatus !== "pending") {
      return;
    }

    try {
      setLoading(true);

      await cancelCustomerOrder(existingOrderId, user.email);

      setAlreadyOrdered(false);
      setExistingOrderId("");
      setOrderStatus(undefined);

      toast.success("Your order has been cancelled.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel your order.",
      );

      try {
        await refreshOrderStatus();
      } catch (refreshError) {
        console.error("Failed to refresh order status:", refreshError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.email || !user.name) {
      toast.error("Your customer information could not be found.");
      return;
    }

    if (!deliveryDate || !deliveryAddress.trim()) {
      toast.error("Please provide your delivery date and address.");
      return;
    }

    if (deliveryDate < minDate) {
      toast.error("Please select today or a future delivery date.");
      return;
    }

    try {
      setLoading(true);

      const result = await placeOrder({
        itemId,
        customerName: user.name,
        customerEmail: user.email,
        deliveryDate,
        deliveryAddress: deliveryAddress.trim(),
        customerMessage: customerMessage.trim(),
      });

      if (result.alreadyOrdered) {
        await refreshOrderStatus();
        setShowForm(false);
        toast.info("You already have an active order for this item.");
        return;
      }

      setAlreadyOrdered(true);
      setExistingOrderId(result.data?.id || "");
      setOrderStatus("pending");

      setShowForm(false);
      setDeliveryDate("");
      setDeliveryAddress("");
      setCustomerMessage("");

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

  const buttonDisabled =
    isPending ||
    loading ||
    checkingOrder ||
    (!alreadyOrdered && (status !== "approved" || !isActive)) ||
    (alreadyOrdered && orderStatus !== "pending");

  return (
    <>
      {/* Order / Cancel Button */}
      {alreadyOrdered && orderStatus === "pending" ? (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                disabled={buttonDisabled}
                className="flex w-full items-center justify-center text-md gap-2 rounded-xl bg-red-500 px-6 py-8 font-semibold  text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <XCircle size={20} />
                )}
                {loading ? "Please wait..." : "Cancel Order"}
              </Button>
            }
          />

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Your Order?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>
                Keep Order
              </AlertDialogCancel>

              <AlertDialogAction
                disabled={loading}
                onClick={(event) => {
                  event.preventDefault();
                  handleCancelOrder();
                }}
                className="bg-red-500 text-white hover:bg-red-600">
                {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
                {loading ? "Cancelling..." : "Yes, Cancel Order"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <button
          type="button"
          onClick={handleOrder}
          disabled={buttonDisabled}
          className={`flex w-full items-center text-md justify-center gap-2 rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-70 ${
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
            ? "Please wait..."
            : isPending || checkingOrder
              ? "Checking..."
              : alreadyOrdered
                ? "Already Ordered"
                : status !== "approved" || !isActive
                  ? "Unavailable"
                  : "Order Now"}
        </button>
      )}

      {/* Delivery Information Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!loading) setShowForm(open);
        }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Delivery Information</DialogTitle>
            <DialogDescription>
              Provide your delivery details to place your order.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Customer Name
              </label>
              <input
                value={user?.name || ""}
                disabled
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Delivery Date
              </label>
              <input
                type="date"
                min={minDate}
                value={deliveryDate}
                onChange={(event) => setDeliveryDate(event.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Delivery Address
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
                placeholder="Enter your complete delivery address"
                rows={3}
                required
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Message to Vendor
                <span className="ml-1 font-normal text-muted-foreground">
                  (Optional)
                </span>
              </label>
              <textarea
                value={customerMessage}
                onChange={(event) => setCustomerMessage(event.target.value)}
                placeholder="Any special instructions for the vendor?"
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-orange-500"
              />
            </div>

            <DialogFooter className="gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => setShowForm(false)}
                className="flex-1">
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-500 text-white hover:bg-orange-600">
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Placing..." : "Confirm Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
