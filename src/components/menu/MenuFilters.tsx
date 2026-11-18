
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";

const categories = [
  "All Categories",
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

interface MenuFiltersProps {
  locations: string[];
}

export default function MenuFilters({ locations }: MenuFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <div className="rounded-2xl border border-orange-100 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            type="search"
            placeholder="Search pizzas..."
            value={searchParams.get("search") || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-transparent py-3 pl-10 pr-3 text-sm text-stone-800 outline-none transition focus:border-orange-500 dark:border-stone-700 dark:text-white"
          />
        </div>

        {/* Category */}
        <select
          value={searchParams.get("category") || "All Categories"}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-800 outline-none transition focus:border-orange-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Location */}
        <select
          value={searchParams.get("location") || "All Locations"}
          onChange={(e) => updateFilter("location", e.target.value)}
          className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-800 outline-none transition focus:border-orange-500 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
        >
          <option value="All Locations">All Locations</option>

          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={clearFilters}
          disabled={!searchParams.toString()}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-orange-400 dark:hover:bg-stone-800"
        >
          <RotateCcw size={15} />
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
