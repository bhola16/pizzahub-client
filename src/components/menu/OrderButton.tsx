
"use client";

import { CheckCircle, Loader2, ShoppingBag, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
  cancelCustomerOrder,
  getCustomerOrders,
  placeOrder,
  type Order,
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

import DemoPaymentPopover from "./DemoPaymentPopover";

interface OrderButtonProps {
  itemId: string;
  status: string;
  isActive: boolean;
  vendorEmail: string;
  price: number;
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
  price,
}: OrderButtonProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as SessionUser | undefined;

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [alreadyOrdered, setAlreadyOrdered] = useState(false);
  const [existingOrderId, setExistingOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState<Order["status"]>();

  const [showForm, setShowForm] = useState(false);
  const [showPaymentPopover, setShowPaymentPopover] = useState(false);

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

  // Restore an existing order from the database.
  useEffect(() => {
    if (isPending || !user?.email || user.role !== "customer") return;

    let isMounted = true;

    const loadExistingOrder = async () => {
      try {
        const orders = await getCustomerOrders(user.email!);

        if (!isMounted) return;

        const existingOrder = orders
          .filter(
            (order) =>
              order.itemId === itemId &&
              (order.status === "pending" ||
                order.status === "accepted"),
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime(),
          )[0];

        if (existingOrder) {
          setAlreadyOrdered(true);
          setExistingOrderId(existingOrder.id);
          setOrderStatus(existingOrder.status);
        } else {
          setAlreadyOrdered(false);
          setExistingOrderId("");
          setOrderStatus(undefined);
        }
      } catch (error) {
        console.error("Failed to restore existing order:", error);
      }
    };

    loadExistingOrder();

    return () => {
      isMounted = false;
    };
  }, [itemId, user?.email, user?.role, isPending]);

  const handleOrder = () => {
    if (isPending || loading || paymentLoading) return;

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

  // Validate delivery details and open payment.
  // IMPORTANT: This function does NOT save an order.
  const handleSubmitOrder = (event: FormEvent<HTMLFormElement>) => {
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

    setShowForm(false);
    setShowPaymentPopover(true);
  };

  // Save the order ONLY after the customer confirms demo payment.
  const handleConfirmPayment = async () => {
    if (!user?.email || !user.name) {
      toast.error("Your customer information could not be found.");
      return;
    }

    try {
      setPaymentLoading(true);

      const result = await placeOrder({
        itemId,
        customerName: user.name,
        customerEmail: user.email,
        deliveryDate,
        deliveryAddress: deliveryAddress.trim(),
        customerMessage: customerMessage.trim(),
      });

      if (result.alreadyOrdered) {
        const orders = await getCustomerOrders(user.email);

        const existingOrder = orders.find(
          (order) =>
            order.itemId === itemId &&
            (order.status === "pending" ||
              order.status === "accepted"),
        );

        if (existingOrder) {
          setAlreadyOrdered(true);
          setExistingOrderId(existingOrder.id);
          setOrderStatus(existingOrder.status);
        }

        setShowPaymentPopover(false);

        toast.info(
          result.message || "You already have an active order.",
        );

        return;
      }

      const savedOrderId = result.data?.id;

      if (!savedOrderId) {
        throw new Error(
          "The server did not return the saved order ID. Please check your orders.",
        );
      }

      // Update the button only after the backend confirms the order.
      setAlreadyOrdered(true);
      setExistingOrderId(savedOrderId);
      setOrderStatus("pending");

      setShowPaymentPopover(false);

      setDeliveryDate("");
      setDeliveryAddress("");
      setCustomerMessage("");

      toast.success("Payment confirmed! Your order has been placed.");
    } catch (error) {
      console.error("Order/payment confirmation failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to place your order. Please try again.",
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // This function is only for cancelling an already saved order.
  const handleCancelOrder = async () => {
    if (!user?.email || !existingOrderId || orderStatus !== "pending") {
      toast.error("Unable to find your pending order.");
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
        error instanceof Error
          ? error.message
          : "Failed to cancel your order.",
      );
    } finally {
      setLoading(false);
    }
  };

  const buttonDisabled =
    isPending ||
    loading ||
    paymentLoading ||
    (!alreadyOrdered && (status !== "approved" || !isActive)) ||
    (alreadyOrdered && orderStatus !== "pending");

  return (
    <>
      {/* Order / Cancel Order button */}
      <div>
        {alreadyOrdered && orderStatus === "pending" ? (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  disabled={buttonDisabled}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-8 text-md font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
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
                <AlertDialogTitle>
                  Cancel Your Order?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure you want to cancel this order? This action
                  cannot be undone.
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
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  {loading && (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  )}

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
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-md font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-70 ${
              alreadyOrdered
                ? "bg-green-600 shadow-green-500/20"
                : "bg-orange-500 shadow-orange-500/20 hover:bg-orange-600"
            }`}
          >
            {loading || isPending || paymentLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : alreadyOrdered ? (
              <CheckCircle size={20} />
            ) : (
              <ShoppingBag size={20} />
            )}

            {loading || paymentLoading
              ? "Please wait..."
              : isPending
                ? "Checking..."
                : alreadyOrdered
                  ? "Already Ordered"
                  : status !== "approved" || !isActive
                    ? "Unavailable"
                    : "Order Now"}
          </button>
        )}
      </div>

      {/* Payment modal: order is NOT saved until confirmation. */}
      <DemoPaymentPopover
  open={showPaymentPopover}
  amount={price}
  customerName={user?.name || "Customer"}
  loading={paymentLoading}
  onClose={() => {
    if (!paymentLoading) {
      setShowPaymentPopover(false);
    }
  }}
  onConfirm={handleConfirmPayment}
/>

      {/* Delivery Information Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!paymentLoading) setShowForm(open);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Delivery Information</DialogTitle>

            <DialogDescription>
              Provide your delivery details before continuing to payment.
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
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
              >
                Continue to Payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
