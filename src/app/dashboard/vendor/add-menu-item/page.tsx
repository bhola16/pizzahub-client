"use client";

import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const totalLimit = Number(process.env.NEXT_PUBLIC_UPGRADE_LIMIT) || 3;

export default function AddMenuItemPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;
  const plan =
    (user as (typeof user & { plan?: string }) | undefined)?.plan || "free";

  const isFreePlan = plan.toLowerCase() === "free";

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

  // Fetch the vendor's actual menu item count
  useEffect(() => {
    if (!user?.email || !API_URL) return;

    const fetchItemCount = async () => {
      try {
        setCountLoading(true);

        const response = await fetch(
          `${API_URL}/menuItems/count/${encodeURIComponent(user.email)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch menu item count.");
        }

        const data = await response.json();
        setCurrentItems(data.totalItems ?? 0);
      } catch (error) {
        console.error("Menu item count error:", error);
        toast.error("Unable to fetch your menu item count.");
      } finally {
        setCountLoading(false);
      }
    };
    console.log(currentItems);

    fetchItemCount();
  }, [user?.email]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login before adding a menu item.");
      return;
    }

    if (!API_URL) {
      toast.error("API URL is missing. Check your environment variables.");
      return;
    }

    if (countLoading) {
      toast.error("Please wait while your menu item count loads.");
      return;
    }

    if (isFreePlan && currentItems >= totalLimit) {
      toast.error("You have reached your menu item limit. Upgrade your plan.");
      router.push("/dashboard/vendor/subscription");
      return;
    }

    if (!imageUrl.trim()) {
      toast.error("Please enter a pizza image URL.");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/menuItems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          images: [imageUrl.trim()],
          vendorName: user.name,
          vendorEmail: user.email,
          plan,
        }),
      });

      const result = await response.json();

      if (result.upgradeRequired) {
        toast.error(result.message);
        router.push("/dashboard/vendor/subscription");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to add menu item.");
      }

      toast.success("Menu item submitted for admin approval!");

      // Update the displayed item count
      setCurrentItems((prev) => prev + 1);

      // Reset form
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
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/vendor/my-menu-items"
          className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-orange-600">
          <ArrowLeft size={16} />
          Back to My Menu Items
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Add Menu Item
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new delicious pizza to your restaurant menu.
        </p>
      </div>

      {/* Subscription Information */}
      <div className="flex flex-col gap-4 rounded-xl border border-orange-200 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-gray-900">
            Your Current Plan:{" "}
            <span className="text-orange-600 capitalize">{plan} Plan</span>
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {isFreePlan
              ? `Free plan allows up to ${totalLimit} menu items. Premium offers unlimited items.`
              : "Your Premium plan allows unlimited menu items."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-700">
            Menu Items:{" "} 

            {countLoading
              ? "Loading..."
              : `${currentItems}/${isFreePlan ? totalLimit : "Unlimited"}`}
          </h2>

          {isFreePlan && (
            <Link
              href="/dashboard/vendor/subscription"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700">
              Upgrade Plan
            </Link>
          )}
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Pizza Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Provide the details of your pizza.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Pizza Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Pizza Category */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700">
              Pizza Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
              <option value="">Select pizza category</option>
              <option value="Margherita">Margherita</option>
              <option value="Pepperoni">Pepperoni</option>
              <option value="Cheese">Cheese Pizza</option>
              <option value="BBQ Chicken">BBQ Chicken</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Meat Lovers">Meat Lovers</option>
              <option value="Seafood">Seafood</option>
              <option value="Hawaiian">Hawaiian</option>
              <option value="Spicy">Spicy Pizza</option>
              <option value="Specialty">Specialty Pizza</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="text-sm font-medium text-gray-700">
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label
              htmlFor="location"
              className="text-sm font-medium text-gray-700">
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700">
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
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-3">
          <div>
            <label
              htmlFor="imageUrl"
              className="text-sm font-medium text-gray-700">
              Pizza Image URL *
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Paste a direct pizza image URL.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
            <ImagePlus size={20} className="shrink-0 text-gray-400" />
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
              className="w-full border-0 py-3 text-sm outline-none"
            />
          </div>

          {imageUrl && (
            <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {!imageError ? (
                <img
                  src={imageUrl}
                  alt="Pizza preview"
                  onError={() => setImageError(true)}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center text-sm text-red-500">
                  Unable to load image preview.
                </div>
              )}

              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow">
                <CheckCircle2 size={14} className="text-green-600" />
                Image Preview
              </div>
            </div>
          )}
        </div>

        {/* Approval Notice */}
        <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-blue-900">
              Admin Approval Required
            </p>
            <p className="mt-1 text-sm text-blue-700">
              Your pizza will remain pending until an admin reviews and approves
              it.
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/vendor/my-menu-items"
            className="rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading || countLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
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
