"use client";

import { useState } from "react";
import {
  X,
  Loader2,
  Save,
  Image as ImageIcon,
  MapPin,
  Tag,
  DollarSign,
  FileText,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import { updateMenuItem } from "@/lib/api/vendor-menu-api";

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  vendorEmail: string;
};

type Props = {
  item: MenuItem;
  onClose: () => void;
  onUpdated: () => void;
};

const categories = [
  "Margherita",
  "Pepperoni",
  "Cheese",
  "BBQ Chicken",
  "Vegetarian",
  "Meat Lovers",
  "Seafood",
  "Hawaiian",
  "Spicy",
  "Specialty",
  "Other",
];

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-green-600 focus:ring-2 focus:ring-green-600/15";

const labelClass =
  "mb-2 flex items-center gap-2 text-sm font-semibold text-foreground";

export default function EditMenuItemModal({ item, onClose, onUpdated }: Props) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(String(item.price));
  const [location, setLocation] = useState(item.location);
  const [imageUrl, setImageUrl] = useState(item.images?.[0] || "");
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !category ||
      !description.trim() ||
      !price ||
      !location.trim() ||
      !imageUrl.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 1) {
      toast.error("Please enter a valid price.");
      return;
    }

    try {
      setLoading(true);

      await updateMenuItem(item._id, {
        name: name.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        images: [imageUrl.trim()],
        vendorEmail: item.vendorEmail,
      });

      toast.success("Menu item updated successfully.");
      onUpdated();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update menu item.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-menu-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              <Utensils size={21} />
            </div>

            <div>
              <h2
                id="edit-menu-title"
                className="text-lg font-bold text-foreground sm:text-xl">
                Edit Menu Item
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                Update your menu item information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
            className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50">
            <X size={21} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="overflow-y-auto px-5 py-6 sm:px-7">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left column */}
              <div className="space-y-5">
                <div>
                  <label htmlFor="item-name" className={labelClass}>
                    <Utensils size={16} className="text-green-600" />
                    Item Name
                  </label>

                  <input
                    id="item-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Classic Margherita"
                    className={inputClass}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="item-category" className={labelClass}>
                    <Tag size={16} className="text-green-600" />
                    Category
                  </label>

                  <select
                    id="item-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                    required
                    disabled={loading}>
                    <option value="">Select pizza category</option>
                    {categories.map((itemCategory) => (
                      <option key={itemCategory} value={itemCategory}>
                        {itemCategory}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="item-price" className={labelClass}>
                    <DollarSign size={16} className="text-green-600" />
                    Price (৳)
                  </label>

                  <input
                    id="item-price"
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    className={inputClass}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="item-location" className={labelClass}>
                    <MapPin size={16} className="text-green-600" />
                    Location
                  </label>

                  <input
                    id="item-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dhanmondi, Dhaka"
                    className={inputClass}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                <div>
                  <label htmlFor="item-description" className={labelClass}>
                    <FileText size={16} className="text-green-600" />
                    Description
                  </label>

                  <textarea
                    id="item-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your menu item..."
                    rows={5}
                    className={`${inputClass} resize-none`}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="item-image" className={labelClass}>
                    <ImageIcon size={16} className="text-green-600" />
                    Image URL
                  </label>

                  <input
                    id="item-image"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageError(false);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className={inputClass}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Image preview */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Image Preview
                  </p>

                  <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted sm:h-48">
                    {imageUrl && !imageError ? (
                      <img
                        src={imageUrl}
                        alt="Menu item preview"
                        onError={() => setImageError(true)}
                        className="h-full w-full object-cover transition duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageIcon size={32} />
                        <span className="text-xs">
                          {imageUrl
                            ? "Unable to load image"
                            : "Your image preview will appear here"}
                        </span>
                      </div>
                    )}

                    {imageUrl && !imageError && (
                      <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                        Preview
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-border bg-muted/40 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
