
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

interface MenuFiltersProps {
  locations: string[];
  categoryCounts: Record<string, number>;
  totalCount: number;
}

export default function MenuFilters({
  locations,
  categoryCounts,
  totalCount,
}: MenuFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "All Categories";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value.startsWith("All ")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    router.push(query ? `/menu?${query}` : "/menu");
  }

  function clearFilters() {
    router.push("/menu");
  }

  return (
    <div className="space-y-3 rounded-xl border border-orange-100 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
      {/* Search and Location */}
      <div className="grid gap-2 md:grid-cols-2">
        {/* Search */}
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            type="search"
            placeholder="Search pizzas..."
            value={searchParams.get("search") || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-transparent py-2 pl-9 pr-3 text-sm text-stone-800 outline-none transition focus:border-orange-500 dark:border-stone-700 dark:text-white"
          />
        </div>

        {/* Location */}
        <select
          value={searchParams.get("location") || "All Locations"}
          onChange={(e) => updateFilter("location", e.target.value)}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-orange-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
        >
          <option value="All Locations">All Locations</option>

          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Category Tabs */}
      <div>
        <p className="mb-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
          Browse by Category
        </p>

        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-4 lg:grid-cols-7">
          <button
            type="button"
            onClick={() => updateFilter("category", "All Categories")}
            className={`rounded-lg border px-1.5 py-1.5 text-sm font-medium transition ${
              selectedCategory === "All Categories"
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-orange-400 hover:text-orange-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            }`}
          >
            All Categories
            <span className="ml-1 opacity-80">({totalCount})</span>
          </button>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => updateFilter("category", category)}
              className={`rounded-lg border px-2 py-1.5 text-sm font-medium transition ${
                selectedCategory === category
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-orange-400 hover:text-orange-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
              }`}
            >
              {category}
              <span className="ml-1 opacity-80">
                ({categoryCounts[category] || 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={clearFilters}
          disabled={!searchParams.toString()}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-orange-400 dark:hover:bg-stone-800"
        >
          <RotateCcw size={13} />
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
