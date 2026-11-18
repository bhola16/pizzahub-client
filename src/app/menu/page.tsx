import MenuCard from "@/components/menu/MenuCard";
import MenuFilters from "@/components/menu/MenuFilters";
import { getMenuItems } from "@/lib/api/menu";

interface MenuPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    location?: string;
  }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const filters = await searchParams;

  const items = await getMenuItems(filters);
  const allItems = await getMenuItems();

  const locations = [...new Set(allItems.map((item) => item.location))];

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

        {/* Search and Filters */}
        <MenuFilters locations={locations} />

        {/* Menu Count */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            Available Menu Items
          </h2>

          <span className="text-sm text-stone-500 dark:text-stone-400">
            {items.length} items found
          </span>
        </div>

        {/* Menu Items */}
        {items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-orange-200 bg-gradient-to-b from-orange-50/80 via-white to-white px-6 py-16 text-center shadow-sm dark:border-stone-700 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 sm:py-20">
            {/* Decorative Background */}
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-100/60 blur-3xl dark:bg-orange-500/5" />

            <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-orange-100/60 blur-3xl dark:bg-orange-500/5" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Icon */}
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl shadow-inner dark:bg-orange-500/10">
                🍕
              </div>

              {/* Badge */}
              <span className="mb-3 rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                Nothing to serve yet
              </span>

              {/* Title */}
              <h3 className="text-2xl font-bold tracking-tight text-stone-800 dark:text-white sm:text-3xl">
                No Menu Items Found
              </h3>

              {/* Description */}
              <p className="mt-3 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400 sm:text-base">
                We couldn&apos;t find any pizzas matching your search. Try a
                different keyword or adjust your filters to discover something
                delicious!
              </p>

              {/* Footer Text */}
              <p className="mt-5 text-xs text-stone-400 dark:text-stone-500">
                Fresh pizzas are waiting to be discovered!
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
