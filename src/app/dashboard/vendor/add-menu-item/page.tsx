
"use client";

import {
  addMenuItem,
  uploadMenuItemImage,
} from "@/lib/api/vendor/add-menu-api";
import { getVendorSubscription } from "@/lib/api/vendor/subscription-api";
import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Infinity,
  Loader2,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const totalLimit =
  Number(process.env.NEXT_PUBLIC_UPGRADE_LIMIT) || 3;

export default function AddMenuItemPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user;

  const [isPremium, setIsPremium] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [countLoading, setCountLoading] = useState(true);
  const [currentItems, setCurrentItems] = useState(0);

  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    location: "",
  });

  const plan = isPremium ? "premium" : "free";
  const isFreePlan = !isPremium;

  // Fetch vendor subscription status
  useEffect(() => {
    if (isPending) return;

    if (!user?.id) {
      setPremiumLoading(false);
      setIsPremium(false);
      return;
    }

    let cancelled = false;

    const fetchSubscription = async () => {
      try {
        setPremiumLoading(true);

        const subscription = await getVendorSubscription();

        const premium =
          subscription.subscriptionPlan === "premium" &&
          ["active", "trialing"].includes(
            subscription.subscriptionStatus,
          );

        if (!cancelled) {
          setIsPremium(premium);
        }
      } catch (error) {
        console.error("Subscription status error:", error);

        if (!cancelled) {
          setIsPremium(false);
          toast.error("Unable to check your subscription status.");
        }
      } finally {
        if (!cancelled) {
          setPremiumLoading(false);
        }
      }
    };

    fetchSubscription();

    return () => {
      cancelled = true;
    };
  }, [user?.id, isPending]);

  // Fetch vendor menu item count
  useEffect(() => {
    if (isPending) return;

    if (!user?.email) {
      setCountLoading(false);
      setCurrentItems(0);
      return;
    }

    let cancelled = false;

    const fetchItemCount = async () => {
      try {
        setCountLoading(true);

        const response = await fetch(
          `${API_URL}/menuItems/count/${encodeURIComponent(user.email)}`,
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch menu item count.",
          );
        }

        if (!cancelled) {
          setCurrentItems(data.totalItems ?? 0);
        }
      } catch (error) {
        console.error("Menu item count error:", error);

        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to fetch your menu item count.",
          );
        }
      } finally {
        if (!cancelled) {
          setCountLoading(false);
        }
      }
    };

    fetchItemCount();

    return () => {
      cancelled = true;
    };
  }, [user?.email, isPending]);

  // Handle form changes
  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit menu item
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login before adding a menu item.");
      return;
    }

    if (premiumLoading || countLoading) {
      toast.error("Please wait while your account information loads.");
      return;
    }

    // Only Free vendors have a menu item limit
    if (!isPremium && currentItems >= totalLimit) {
      toast.error(
        "You have reached your free menu item limit. Please upgrade to Premium.",
      );

      router.push("/dashboard/vendor/subscription");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter a pizza name.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a pizza category.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a pizza description.");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter your restaurant location.");
      return;
    }

    if (
      !formData.price ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      toast.error("Please enter a valid pizza price.");
      return;
    }

    if (!imageUrl.trim()) {
      toast.error("Please enter a pizza image URL.");
      return;
    }

    try {
      const parsedUrl = new URL(imageUrl.trim());

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        toast.error("Please enter a valid image URL.");
        return;
      }
    } catch {
      toast.error("Please enter a valid image URL.");
      return;
    }

    if (imageError) {
      toast.error("The image URL is invalid. Please enter another URL.");
      return;
    }

    try {
      setLoading(true);

      // Upload image to ImgBB
      toast.loading("Uploading pizza image to ImgBB...", {
        id: "menu-upload",
      });

      const uploadedImageUrl = await uploadMenuItemImage(
        imageUrl.trim(),
      );

      // Save menu item
      // Vendor identity and subscription are verified by the backend.
      const result = await addMenuItem({
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        location: formData.location.trim(),
        price: Number(formData.price),
        images: [uploadedImageUrl],
      });

      if (result.upgradeRequired) {
        toast.error(
          result.message ||
            "Please upgrade your plan to add more menu items.",
          { id: "menu-upload" },
        );

        router.push("/dashboard/vendor/subscription");
        return;
      }

      toast.success("Menu item submitted for admin approval!", {
        id: "menu-upload",
      });

      setCurrentItems((prev) => prev + 1);

      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        location: "",
      });

      setImageUrl("");
      setImageError(false);

      router.push("/dashboard/vendor/my-menu-items");
    } catch (error) {
      console.error("Add menu item error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
        { id: "menu-upload" },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/vendor/my-menu-items"
          className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
        >
          <ArrowLeft size={16} />
          Back to My Menu Items
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Add Menu Item
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add a new delicious pizza to your restaurant menu.
        </p>
      </div>

      {/* Subscription Information */}
      <div className="flex flex-col gap-4 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/60 dark:bg-orange-950/20 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            Your Current Plan:{" "}
            <span className="text-orange-600 capitalize dark:text-orange-400">
              {premiumLoading ? "Loading..." : `${plan} Plan`}
            </span>
          </p>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {premiumLoading
              ? "Checking your subscription..."
              : isFreePlan
                ? `Free plan allows up to ${totalLimit} menu items. Premium offers unlimited items.`
                : "Your Premium plan allows unlimited menu items."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h2 className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Menu Items:{" "}
            {countLoading || premiumLoading ? (
              "Loading..."
            ) : (
              <>
                {currentItems}
                {" / "}
                {isPremium ? (
                  <span className="inline-flex items-center gap-1 text-orange-500">
                    <Infinity className="h-5 w-5" />
                    Unlimited
                  </span>
                ) : (
                  totalLimit
                )}
              </>
            )}
          </h2>

          {isFreePlan && !premiumLoading && (
            <Link
              href="/dashboard/vendor/subscription"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
            >
              Upgrade Plan
            </Link>
          )}
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#211C19] sm:p-7"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Pizza Information
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Provide the details of your pizza.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Pizza Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Pizza Name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Classic Margherita"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-[#171412] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-orange-950"
            />
          </div>

          {/* Pizza Category */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Pizza Category *
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-[#171412] dark:text-gray-100 dark:focus:ring-orange-950"
            >
              <option value="">Select pizza category</option>
              <option value="Classic Pizzas">Classic Pizzas</option>
              <option value="Vegetarian Pizzas">Vegetarian Pizzas</option>
              <option value="Meat Lovers">Meat Lovers</option>
              <option value="Specialty / Gourmet Pizzas">
                Specialty / Gourmet Pizzas
              </option>
              <option value="Sides & Appetizers">Sides & Appetizers</option>
              <option value="Beverages & Desserts">
                Beverages & Desserts
              </option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Price (৳) *
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="1"
              step="0.01"
              placeholder="e.g. 350"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-[#171412] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-orange-950"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label
              htmlFor="location"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Location (Area / City) *
            </label>

            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Dhanmondi, Dhaka"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-[#171412] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-orange-950"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description *
          </label>

          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe your pizza, ingredients, toppings, and taste..."
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-[#171412] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-orange-950"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-3">
          <div>
            <label
              htmlFor="imageUrl"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Pizza Image URL *
            </label>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Paste a direct pizza image URL. It will be uploaded to ImgBB.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 dark:border-gray-700 dark:bg-[#171412] dark:focus-within:ring-orange-950">
            <ImagePlus
              size={20}
              className="shrink-0 text-gray-400 dark:text-gray-500"
            />

            <input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/pizza.jpg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImageError(false);
              }}
              required
              className="w-full border-0 bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          {imageUrl && (
            <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#171412]">
              {!imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="Pizza preview"
                  onError={() => {
                    setImageError(true);
                    toast.error(
                      "Unable to load image. Please check the URL.",
                    );
                  }}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  Image preview unavailable.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Approval Notice */}
        <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
          />

          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              Admin Approval Required
            </p>

            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              Your pizza will remain pending until an admin reviews and
              approves it.
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/vendor/my-menu-items"
            className="rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#2A2420]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              loading ||
              countLoading ||
              premiumLoading ||
              isPending
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading & Saving...
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                Add Pizza
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
