"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pizza,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Store,
  ShoppingBag,
  ArrowRight,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type AccountRole = "vendor" | "customer";

export default function SignUpPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer" as AccountRole,
  });

  const passwordRules = [
    {
      label: "At least 6 characters",
      valid: formData.password.length >= 6,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(formData.password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(formData.password),
    },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  // Upload profile image to ImgBB
  const handleImageChange = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewURL = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewURL);
    setUploadedImageURL("");
    setUploadingImage(true);

    try {
      const uploadData = new FormData();
      uploadData.append("image", file);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

      if (!apiKey) {
        throw new Error("ImgBB API key is not configured.");
      }

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: uploadData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.error?.message || "Image upload failed.");
      }

      setUploadedImageURL(result.data.url);
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      URL.revokeObjectURL(previewURL);

      setImageFile(null);
      setImagePreview("");
      setUploadedImageURL("");

      toast.error(
        error instanceof Error ? error.message : "Image upload failed.",
      );

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove profile image
  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
    setUploadedImageURL("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // Create account
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || uploadingImage) return;

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Please meet all password requirements.");
      return;
    }

    if (imageFile && !uploadedImageURL) {
      toast.error("Image upload failed. Please upload your image again.");
      return;
    }

    setLoading(true);

    try {
      const { data: signUpRes, error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        image: uploadedImageURL || undefined,
        role: formData.role,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      console.log("Sign-up response:", signUpRes);

      toast.success("Welcome to PizzaHub! Your account is ready.");

      router.push(
        formData.role === "vendor"
          ? "/dashboard/vendor"
          : "/dashboard/customer",
      );

      router.refresh();
    } catch (error) {
      console.error("Sign-up error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Google sign-up
  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google sign-up error:", error);
      toast.error("Google authentication failed.");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#fffaf3] px-4 py-10 transition-colors dark:bg-[#111111] sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#eee5dc] bg-white shadow-xl shadow-[#7c2d12]/5 dark:border-[#333333] dark:bg-[#1b1b1b] md:grid-cols-2">
        {/* Left Branding Section */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-red-600 p-10 text-white md:flex lg:p-12">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <Pizza size={30} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  PizzaHub
                </h1>
                <p className="text-[9px] font-semibold tracking-[2px] text-red-100">
                  FRESH & DELICIOUS
                </p>
              </div>
            </div>

            <div className="mt-20">
              <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold tracking-wider">
                WELCOME TO PIZZAHUB
              </span>

              <h2 className="mt-7 text-4xl font-extrabold leading-tight lg:text-5xl">
                Good food brings people together.
              </h2>

              <p className="mt-6 max-w-sm leading-relaxed text-red-100">
                Discover delicious pizzas, explore exciting flavors, or grow
                your restaurant business with PizzaHub.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-red-600 bg-amber-300" />
                <div className="h-8 w-8 rounded-full border-2 border-red-600 bg-orange-300" />
                <div className="h-8 w-8 rounded-full border-2 border-red-600 bg-yellow-200" />
              </div>

              <p className="text-sm font-medium text-red-50">
                Delicious moments start here!
              </p>
            </div>

            <p className="text-xs text-red-100">
              Fresh ingredients. Amazing taste. Every time.
            </p>
          </div>

          <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full border-[40px] border-red-400/40" />
          <div className="absolute right-10 top-32 h-20 w-20 rounded-full border-[12px] border-red-400/30" />
        </div>

        {/* Registration Form */}
        <div className="flex items-center justify-center px-5 py-9 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 md:hidden">
                <Pizza size={27} />
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-red-600 dark:text-red-400">
                Get started today
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight text-[#292524] dark:text-white">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-[#78716c] dark:text-gray-400">
                Join PizzaHub and enjoy something delicious.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Image */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#44403c] dark:text-gray-300">
                  Profile Image{" "}
                  <span className="font-normal text-gray-400">(Optional)</span>
                </label>

                <div className="flex items-center gap-4">
                  <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#e7d8cc] bg-[#fffaf3] dark:border-gray-700 dark:bg-[#252525]">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User
                        size={28}
                        className="text-[#a8a29e] dark:text-gray-500"
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 rounded-lg border border-[#e7d8cc] bg-white px-3 py-2 text-sm font-semibold text-[#44403c] transition hover:border-red-500 hover:text-red-600 disabled:opacity-50 dark:border-gray-700 dark:bg-[#252525] dark:text-gray-300 dark:hover:border-red-500 dark:hover:text-red-400">
                      <Camera size={16} />
                      {uploadingImage ? "Uploading..." : "Upload image"}
                    </button>

                    {imageFile && (
                      <button
                        type="button"
                        onClick={removeImage}
                        disabled={uploadingImage}
                        className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400">
                        <X size={15} />
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    hidden
                    onChange={(e) => handleImageChange(e.target.files?.[0])}
                  />
                </div>

                <p className="mt-2 text-xs text-[#a8a29e] dark:text-gray-500">
                  JPG, PNG or WebP. Maximum 5 MB.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#44403c] dark:text-gray-300">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e]"
                    size={19}
                  />

                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#e7d8cc] bg-[#fffaf3] py-3 pl-11 pr-4 text-[#292524] outline-none transition placeholder:text-[#a8a29e] focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-gray-700 dark:bg-[#252525] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-red-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#44403c] dark:text-gray-300">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e]"
                    size={19}
                  />

                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#e7d8cc] bg-[#fffaf3] py-3 pl-11 pr-4 text-[#292524] outline-none transition placeholder:text-[#a8a29e] focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-gray-700 dark:bg-[#252525] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-red-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#44403c] dark:text-gray-300">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e]"
                    size={19}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#e7d8cc] bg-[#fffaf3] py-3 pl-11 pr-12 text-[#292524] outline-none transition placeholder:text-[#a8a29e] focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-gray-700 dark:bg-[#252525] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-red-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e] transition hover:text-red-600 dark:hover:text-red-400">
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {passwordRules.map((rule) => (
                    <div
                      key={rule.label}
                      className={`flex items-center gap-2 text-xs ${
                        rule.valid
                          ? "text-green-600 dark:text-green-400"
                          : "text-[#a8a29e] dark:text-gray-500"
                      }`}>
                      <Check size={14} />
                      {rule.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Role */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#44403c] dark:text-gray-300">
                  Choose Account Role
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "customer" })
                    }
                    aria-pressed={formData.role === "customer"}
                    className={`rounded-xl border p-3.5 text-left transition ${
                      formData.role === "customer"
                        ? "border-red-600 bg-red-50 ring-2 ring-red-600/10 dark:border-red-500 dark:bg-red-500/10"
                        : "border-[#e7d8cc] bg-white hover:border-red-300 dark:border-gray-700 dark:bg-[#252525] dark:hover:border-red-500"
                    }`}>
                    <div className="flex items-center justify-between">
                      <ShoppingBag
                        size={22}
                        className={
                          formData.role === "customer"
                            ? "text-red-600 dark:text-red-400"
                            : "text-[#a8a29e]"
                        }
                      />
                      {formData.role === "customer" && (
                        <Check
                          size={17}
                          className="text-red-600 dark:text-red-400"
                        />
                      )}
                    </div>

                    <p className="mt-3 text-sm font-bold text-[#292524] dark:text-white">
                      Customer
                    </p>
                    <p className="mt-1 text-xs text-[#78716c] dark:text-gray-400">
                      Order delicious food
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "vendor" })}
                    aria-pressed={formData.role === "vendor"}
                    className={`rounded-xl border p-3.5 text-left transition ${
                      formData.role === "vendor"
                        ? "border-red-600 bg-red-50 ring-2 ring-red-600/10 dark:border-red-500 dark:bg-red-500/10"
                        : "border-[#e7d8cc] bg-white hover:border-red-300 dark:border-gray-700 dark:bg-[#252525] dark:hover:border-red-500"
                    }`}>
                    <div className="flex items-center justify-between">
                      <Store
                        size={22}
                        className={
                          formData.role === "vendor"
                            ? "text-red-600 dark:text-red-400"
                            : "text-[#a8a29e]"
                        }
                      />
                      {formData.role === "vendor" && (
                        <Check
                          size={17}
                          className="text-red-600 dark:text-red-400"
                        />
                      )}
                    </div>

                    <p className="mt-3 text-sm font-bold text-[#292524] dark:text-white">
                      Vendor
                    </p>
                    <p className="mt-1 text-xs text-[#78716c] dark:text-gray-400">
                      Manage your restaurant
                    </p>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                {uploadingImage
                  ? "Uploading image..."
                  : loading
                    ? "Creating account..."
                    : "Create Account"}

                {!loading && !uploadingImage && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e7d8cc] dark:bg-gray-800" />
              <span className="text-xs font-medium text-[#a8a29e]">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-[#e7d8cc] dark:bg-gray-800" />
            </div>

            {/* Google Authentication */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e7d8cc] bg-white py-3 font-semibold text-[#44403c] transition hover:bg-[#fffaf3] dark:border-gray-700 dark:bg-[#252525] dark:text-gray-200 dark:hover:bg-[#303030]">
              <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.65 5.93c4.47-4.13 7.12-10.2 7.12-17.58Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.47 0 11.92-2.13 15.89-5.87l-7.65-5.93c-2.13 1.43-4.86 2.28-8.24 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Sign In Link */}
            <p className="mt-7 text-center text-sm text-[#78716c] dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-bold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                Sign in
              </Link>
            </p>

            <p className="mt-5 text-center text-xs text-[#a8a29e] dark:text-gray-500">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
