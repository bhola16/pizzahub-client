import Link from "next/link";
import { XCircle, ArrowLeft, Headphones, ShieldCheck } from "lucide-react";

const PaymentCancelPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-orange-50/70 px-8 pt-10 pb-8 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-5">
              <XCircle size={46} strokeWidth={1.8} />
            </div>

            <p className="text-sm font-semibold uppercase tracking-widest text-orange-600 mb-2">
              Payment cancelled
            </p>

            <h1 className="text-3xl font-bold text-slate-900">No worries!</h1>

            <p className="text-slate-500 mt-3 text-sm leading-6">
              You cancelled the checkout process. No payment was completed.
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="rounded-xl p-4 border border-orange-100 bg-orange-50">
              <p className="text-sm font-medium text-orange-700">
                Your Premium subscription has not been activated. You can return
                whenever you're ready.
              </p>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <ShieldCheck className="text-green-600" size={21} />
              <p className="text-sm text-slate-600">
                Your account and existing menu items remain safe.
              </p>
            </div>

            <Link
              href="/dashboard/vendor/subscription"
              className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 transition-all shadow-lg shadow-green-600/20">
              Return to Subscription
              <ArrowLeft size={18} />
            </Link>

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
};

export default PaymentCancelPage;
