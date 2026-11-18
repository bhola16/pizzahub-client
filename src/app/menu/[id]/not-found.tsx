import Link from "next/link";

export default function MenuItemNotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
        Menu Item Not Found
      </h1>

      <p className="mt-3 text-stone-600 dark:text-stone-400">
        This item does not exist, is not approved, or is currently unavailable.
      </p>

      <Link
        href="/menu"
        className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">
        Browse Menu
      </Link>
    </main>
  );
}
