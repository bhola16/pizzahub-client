"use client";

import {
  CheckCircle2,
  CreditCard,
  Loader2,
  LockKeyhole,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface DemoPaymentPopoverProps {
  open: boolean;
  amount: number;
  customerName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DemoPaymentPopover({
  open,
  amount,
  customerName,
  loading,
  onClose,
  onConfirm,
}: DemoPaymentPopoverProps) {
  if (!open) return null;

  const handleCancel = () => {
    if (loading) return;

    onClose();
    toast.info("Payment cancelled. No order was placed.");
  };

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-payment-title"
        className="relative flex max-h-[92dvh] w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-900 sm:rounded-3xl">
        {/* Header */}
        <div className="relative shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 text-white sm:px-6 sm:py-5">
          <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10" />

          <div className="relative flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard size={21} />

                <h2
                  id="demo-payment-title"
                  className="text-lg font-bold sm:text-xl">
                  Payment Details (Demo Payment)
                </h2>
              </div>

              <p className="mt-1 text-xs text-orange-100 sm:text-sm">
                Review your payment before placing the order
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              aria-label="Close payment"
              className="rounded-full p-2 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 space-y-4 overflow-y-auto overscroll-contain p-4 sm:space-y-5 sm:p-6">
          {/* Amount */}
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Total Amount
            </p>

            <h3 className="mt-1 text-3xl font-extrabold text-orange-500 sm:text-4xl">
              ৳{amount.toFixed(2)}
            </h3>
          </div>

          {/* Card Preview */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-800 via-stone-900 to-black p-4 text-white shadow-lg sm:p-5">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/20 blur-2xl" />

            <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-orange-400/20 blur-2xl" />

            <div className="relative flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CreditCard size={21} className="text-orange-400" />
                <span className="text-sm font-bold">PizzaHub Pay</span>
              </div>

              <span className="rounded-full bg-orange-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-300">
                Demo
              </span>
            </div>

            <div className="relative my-6 sm:my-7">
              <p className="text-[10px] tracking-widest text-stone-400">
                CARD NUMBER
              </p>

              <p className="mt-2 text-base font-semibold tracking-[0.2em] sm:text-lg sm:tracking-[0.25em]">
                •••• •••• •••• 4242
              </p>
            </div>

            <div className="relative flex items-end justify-between gap-2">
              <div>
                <p className="text-[10px] text-stone-400">CARD HOLDER</p>

                <p className="mt-1 text-xs font-semibold tracking-wide sm:text-sm">
                  {customerName.toUpperCase()}
                </p>
              </div>

              <CreditCard size={28} className="shrink-0 text-orange-400" />
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-3 rounded-xl border border-orange-100 bg-orange-50 p-4 dark:border-stone-700 dark:bg-stone-800">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-stone-600 dark:text-stone-300">
                Order Amount
              </span>

              <span className="font-semibold text-stone-800 dark:text-white">
                ৳{amount.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-dashed border-orange-200 pt-3 dark:border-stone-600">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-stone-800 dark:text-white">
                  Total Payable
                </span>

                <span className="text-lg font-extrabold text-orange-500">
                  ৳{amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/40">
            <LockKeyhole
              size={16}
              className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
            />

            <p className="text-xs leading-5 text-blue-700 dark:text-blue-300">
              Demo mode: No real payment will be processed. Your order will only
              be saved after you confirm this payment.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 gap-3 border-t border-stone-100 bg-white p-4 dark:border-stone-800 dark:bg-stone-900 sm:p-5">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-stone-300 px-3 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800">
            Cancel Payment
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 size={17} />
                Confirm Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
