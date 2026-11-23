import { getSession } from "@/lib/core/server";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Store,
  Tag,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import OrderButton from "@/components/menu/OrderButton";
import { getMenuItemById } from "@/lib/api/menu-server";
interface MenuDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MenuDetailsPage({
  params,
}: MenuDetailsPageProps) {
  // Check authentication first
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { id } = await params;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    notFound();
  }

  let item;

  try {
    item = await getMenuItemById(id);
  } catch {
    notFound();
  }

  if (!item || item.status !== "approved" || !item.isActive) {
    notFound();
  }

  const images = item.images?.length ? item.images : ["/placeholder-pizza.jpg"];

  return (
    <main className="min-h-screen bg-orange-50/40 py-8 text-stone-800 dark:bg-stone-950 dark:text-white sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link
          href="/menu"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-orange-500 dark:text-stone-400">
          <ArrowLeft size={17} />
          Back to Menu
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <section className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-orange-100 shadow-sm dark:bg-stone-900">
              <Image
                src={images[0]}
                alt={item.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition duration-500 hover:scale-105"
              />

              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-green-700 shadow-sm backdrop-blur">
                  <CheckCircle2 size={15} />
                  Available Now
                </span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {images.slice(1, 4).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-orange-100 dark:bg-stone-900">
                    <Image
                      src={image}
                      alt={`${item.name} image ${index + 2}`}
                      fill
                      sizes="(max-width: 640px) 33vw, 200px"
                      className="object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Product Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                  <Utensils size={19} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Quality
                  </p>
                  <p className="text-sm font-semibold">Freshly Prepared</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                  <ShoppingBag size={19} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Ordering
                  </p>
                  <p className="text-sm font-semibold">Easy Ordering</p>
                </div>
              </div>
            </div>
          </section>

          {/* Menu Information */}
          <section className="flex flex-col">
            {/* Category and Availability Tags */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-bold text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
                <Tag size={14} />
                {item.category}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Available
              </span>
            </div>

            {/* Title and Description */}
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {item.name}
            </h1>

            <p className="mt-5 text-base leading-8 text-stone-600 dark:text-stone-400">
              {item.description}
            </p>

            {/* Price Card */}
            <div className="my-7 rounded-2xl border border-orange-100 bg-white p-5 dark:border-stone-800 dark:bg-stone-900 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                    Menu Price
                  </p>
                  <p className="mt-1 text-3xl font-extrabold text-orange-500 sm:text-4xl">
                    ৳{item.price}
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-3 text-orange-500 dark:bg-orange-500/10">
                  <ShoppingBag size={26} />
                </div>
              </div>
            </div>

            {/* Category Information */}
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                <Tag size={19} />
              </div>

              <div>
                <h3 className="font-bold">Menu Category</h3>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  {item.category}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="mb-7 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                <MapPin size={19} />
              </div>

              <div>
                <h3 className="font-bold">Available Location</h3>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  {item.location}
                </p>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                  <Store size={23} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Provided by
                  </p>
                  <h2 className="text-lg font-bold">{item.vendorName}</h2>
                </div>
              </div>

              <div className="space-y-3 border-t border-stone-100 pt-4 text-sm dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <Mail size={17} className="shrink-0 text-orange-500" />
                  <a
                    href={`mailto:${item.vendorEmail}`}
                    className="break-all text-stone-600 transition hover:text-orange-500 dark:text-stone-400">
                    {item.vendorEmail}
                  </a>
                </div>

                {item.vendorPhone && (
                  <div className="flex items-center gap-3">
                    <Phone size={17} className="shrink-0 text-orange-500" />
                    <a
                      href={`tel:${item.vendorPhone}`}
                      className="text-stone-600 transition hover:text-orange-500 dark:text-stone-400">
                      {item.vendorPhone}
                    </a>
                  </div>
                )}

                {item.vendorAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-orange-500"
                    />
                    <span className="text-stone-600 dark:text-stone-400">
                      {item.vendorAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Button */}
            <div className="mt-6">
              <OrderButton
                itemId={item._id}
                status={item.status}
                isActive={item.isActive}
                vendorEmail={item.vendorEmail}
                price={item.price}
              />
            </div>

            <Link
              href="/menu"
              className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-orange-500 dark:text-stone-400">
              Explore More Menu Items
              <ArrowUpRight size={16} />
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
