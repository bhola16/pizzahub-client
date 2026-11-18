import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import OrderButton from "@/components/menu/OrderButton";
import { getMenuItemById } from "@/lib/api/menu";

interface MenuDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MenuDetailsPage({
  params,
}: MenuDetailsPageProps) {
  const { id } = await params;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    notFound();
  }

  const item = await getMenuItemById(id);

  if (!item || item.status !== "approved" || !item.isActive) {
    notFound();
  }

  const images = item.images?.length ? item.images : ["/placeholder-pizza.jpg"];

  return (
    <main className="min-h-screen bg-[#FFF9F3] py-10 text-[#30231D] transition-colors dark:bg-[#171412] dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link
          href="/menu"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#796B62] transition hover:text-orange-500 dark:text-gray-400">
          <ArrowLeft size={18} />
          Back to Menu
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image Gallery */}
          <section>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-orange-100 dark:bg-[#211C19]">
              <Image
                src={images[0]}
                alt={item.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {images.slice(1, 4).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-orange-100 dark:bg-[#211C19]">
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
          </section>

          {/* Menu Information */}
          <section className="flex flex-col">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                {item.category}
              </span>

              <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-400">
                Available
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {item.name}
            </h1>

            <p className="mt-5 text-base leading-8 text-[#796B62] dark:text-gray-400">
              {item.description}
            </p>

            <div className="my-8 flex items-center justify-between border-y border-orange-100 py-6 dark:border-white/10">
              <div>
                <p className="text-sm text-[#796B62] dark:text-gray-400">
                  Price
                </p>
                <p className="mt-1 text-3xl font-bold text-orange-500">
                  ৳{item.price}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#796B62] dark:text-gray-400">
                <ShoppingBag size={19} className="text-orange-500" />
                Freshly prepared
              </div>
            </div>

            {/* Location */}
            <div className="mb-8 flex items-start gap-3">
              <MapPin className="mt-1 shrink-0 text-orange-500" size={20} />
              <div>
                <h3 className="font-semibold">Available Location</h3>
                <p className="mt-1 text-sm text-[#796B62] dark:text-gray-400">
                  {item.location}
                </p>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="rounded-2xl border border-orange-100 bg-white p-5 dark:border-white/10 dark:bg-[#211C19]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-500 dark:bg-orange-500/15">
                  <Store size={22} />
                </div>

                <div>
                  <h2 className="font-bold">Vendor Information</h2>
                  <p className="text-sm text-[#796B62] dark:text-gray-400">
                    Sold by {item.vendorName}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail size={17} className="shrink-0 text-orange-500" />
                  <a
                    href={`mailto:${item.vendorEmail}`}
                    className="break-all text-[#796B62] hover:text-orange-500 dark:text-gray-400">
                    {item.vendorEmail}
                  </a>
                </div>

                {item.vendorPhone && (
                  <div className="flex items-center gap-3">
                    <Phone size={17} className="shrink-0 text-orange-500" />
                    <a
                      href={`tel:${item.vendorPhone}`}
                      className="text-[#796B62] hover:text-orange-500 dark:text-gray-400">
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
                    <span className="text-[#796B62] dark:text-gray-400">
                      {item.vendorAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Button */}
            <div className="mt-8">
              <OrderButton
                itemId={item._id}
                status={item.status}
                isActive={item.isActive}
                vendorEmail={item.vendorEmail}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
