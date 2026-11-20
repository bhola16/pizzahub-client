import { checkoutVerify } from "@/lib/api/payment/payments-api";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Headphones,
} from "lucide-react";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let isSuccessful = false;
  let message = "";

  if (!session_id) {
    message = "Session ID is missing.";
  } else {
    try {
      const result = await checkoutVerify(session_id);
      isSuccessful = true;
      message = result.message;
    } catch (error) {
      message =
        error instanceof Error ? error.message : "Payment verification failed.";
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          {/* Status Header */}
          <div
            className={`px-8 pt-10 pb-8 text-center ${
              isSuccessful ? "bg-green-50/70" : "bg-red-50/70"
            }`}>
            <div
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-5 ${
                isSuccessful
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}>
              {isSuccessful ? (
                <CheckCircle2 size={46} strokeWidth={1.8} />
              ) : (
                <XCircle size={46} strokeWidth={1.8} />
              )}
            </div>

            <p
              className={`text-sm font-semibold uppercase tracking-widest mb-2 ${
                isSuccessful ? "text-green-600" : "text-red-600"
              }`}>
              {isSuccessful ? "Payment confirmed" : "Payment unsuccessful"}
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              {isSuccessful ? "You're Premium!" : "Payment verification failed"}
            </h1>

            <p className="text-slate-500 mt-3 text-sm leading-6">
              {isSuccessful
                ? "Your Premium subscription is now active."
                : "We couldn't verify your payment. Please try again or contact support."}
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div
              className={`rounded-xl p-4 border ${
                isSuccessful
                  ? "bg-green-50 border-green-100"
                  : "bg-red-50 border-red-100"
              }`}>
              <p
                className={`text-sm font-medium ${
                  isSuccessful ? "text-green-700" : "text-red-700"
                }`}>
                {message}
              </p>
            </div>

            {isSuccessful ? (
              <>
                <div className="mt-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-green-600" size={21} />
                    <p className="text-sm text-slate-600">
                      Secure payment successfully verified
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-600" size={21} />
                    <p className="text-sm text-slate-600">
                      Unlimited menu item publishing unlocked
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-600" size={21} />
                    <p className="text-sm text-slate-600">
                      Premium vendor benefits activated
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 text-center mt-7 leading-5">
                  Thank you for choosing PizzaHub! A confirmation email will be
                  sent to your registered email address.
                </p>

                <Link
                  href="/dashboard/vendor"
                  className="mt-7 w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 transition-all shadow-lg shadow-green-600/20">
                  Go to Vendor Dashboard
                  <ArrowRight size={18} />
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-500 mt-6 text-center leading-6">
                  If your payment was deducted, please contact our support team
                  before attempting another payment.
                </p>

                <Link
                  href="/dashboard/vendor/payment"
                  className="mt-7 w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 transition-all">
                  Try Again
                  <ArrowRight size={18} />
                </Link>
              </>
            )}

            {/* Support */}
            <div className="mt-7 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Headphones size={16} />
              Need help?
              <a
                href="mailto:ku.bhola16@gmail.com"
                className="text-green-600 hover:text-green-700 font-medium">
                Contact Support
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 PizzaHub. All rights reserved.
        </p>
      </div>
    </main>
  );
}
