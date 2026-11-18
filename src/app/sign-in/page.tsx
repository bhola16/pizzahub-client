
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pizza, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Welcome back to PizzaHub!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Google sign-in failed.");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-black">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950 md:grid-cols-2">

        {/* Left Side */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-orange-500 p-10 text-white md:flex">
          <div>
            <div className="flex items-center gap-2">
              <Pizza size={32} />
              <span className="text-2xl font-extrabold">PizzaHub</span>
            </div>

            <h1 className="mt-20 text-4xl font-extrabold leading-tight">
              Your favorite pizza, just a click away.
            </h1>

            <p className="mt-5 text-orange-50">
              Sign in and enjoy fresh, delicious pizzas delivered straight
              to your door.
            </p>
          </div>

          <p className="text-sm text-orange-100">
            Fresh ingredients. Amazing taste. Every time.
          </p>

          <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full border-[35px] border-orange-400/40" />
        </div>

        {/* Form */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400 md:hidden">
                <Pizza size={27} />
              </div>

              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Welcome back!
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Sign in to continue to PizzaHub.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-12 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-orange-500 hover:text-orange-600"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              <span className="text-xs font-medium text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.65 5.93c4.47-4.13 7.12-10.2 7.12-17.58Z" />
                <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" />
                <path fill="#34A853" d="M24 48c6.47 0 11.92-2.13 15.89-5.87l-7.65-5.93c-2.13 1.43-4.86 2.28-8.24 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
              </svg>
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-bold text-orange-500 hover:text-orange-600"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
