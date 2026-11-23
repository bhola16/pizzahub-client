import MenuCard from "@/components/menu/MenuCard";
import MenuFilters from "@/components/menu/MenuFilters";
import { getMenuItems } from "@/lib/api/menu";
import { MenuItem } from "@/lib/api/menu-server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface MenuPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    location?: string;
  }>;
}

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export default async function MenuPage({ searchParams }: MenuPageProps) {

 


  const filters = await searchParams;

  let items: MenuItem[];
  let allItems: MenuItem[];

  try {
    [items, allItems] = await Promise.all([
      getMenuItems(filters),
      getMenuItems(),
    ]);
  } catch (error) {
    console.error("Failed to fetch menu items:", error);
    notFound();
  }

  // Get unique locations
  const locations = [
    ...new Set(allItems.map((item) => item.location).filter(Boolean)),
  ].sort();

  // Calculate category counts
  const categoryCounts: Record<string, number> = Object.fromEntries(
    categories.map((category) => [
      category,
      allItems.filter(
        (item) =>
          item.category?.trim().toLowerCase() === category.toLowerCase(),
      ).length,
    ]),
  );

  return (
    <main className="min-h-screen bg-orange-50/40 px-4 py-12 dark:bg-stone-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Page Header */}
        <div className="text-center">
          <p className="mb-2 font-semibold uppercase tracking-widest text-orange-600">
            Our Menu
          </p>

          <h1 className="text-3xl font-bold text-stone-900 dark:text-white sm:text-4xl">
            Discover Your Favorite Pizza
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-stone-600 dark:text-stone-400">
            Explore delicious pizzas from trusted local vendors.
          </p>
        </div>

        {/* Search, Category and Location Filters */}
        <MenuFilters
          locations={locations}
          categoryCounts={categoryCounts}
          totalCount={allItems.length}
        />

        {/* Menu Count */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            Available Menu Items
          </h2>

          <span className="text-sm text-stone-500 dark:text-stone-400">
            {items.length} {items.length === 1 ? "item" : "items"} found
          </span>
        </div>

        {/* Menu Items */}
        {items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-orange-200 bg-gradient-to-b from-orange-50/80 via-white to-white px-6 py-16 text-center shadow-sm dark:border-stone-700 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:py-20">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-stone-800">
              <span className="text-4xl">🍕</span>
            </div>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white">
              No Menu Items Found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-stone-600 dark:text-stone-400">
              We couldn't find any menu items matching your search or selected
              filters. Try another category or location.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
