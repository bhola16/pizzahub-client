"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MapPin, Store, Loader2 } from "lucide-react";
import { getFeaturedMenuItems, type MenuItem } from "@/lib/api/menu";

const FeaturedMenu = () => {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const data = await getFeaturedMenuItems();
        setFeaturedItems(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch featured menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <section className="bg-white py-12 dark:bg-[#111111] sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            Our Favorites
          </span>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Featured <span className="text-orange-500">Menu Items</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            Discover delicious pizzas crafted with fresh ingredients and
            unforgettable flavors.
          </p>

          <Link
            href="/menu"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-orange-500 transition hover:gap-3">
            View All Menu <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading featured menu items...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && featuredItems.length === 0 && (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            No featured menu items available right now.
          </div>
        )}

        {/* Menu Cards */}
        {!loading && featuredItems.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item, index) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-[#1a1a1a]">
                {/* Item Image */}
                <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={item.images?.[0] || "/assets/pizzas/pizza1.jpeg"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Category */}
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm">
                    {item.category} this is the category...
                  </span>
                </div>

                {/* Item Information */}
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>

                    <span className="shrink-0 text-lg font-bold text-orange-500">
                      ৳{item.price}
                    </span>
                  </div>

                  {/* Restaurant Location */}
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
                    <span>{item.location}</span>
                  </div>

                  {/* Vendor Information */}
                  <div className="mb-5 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Store className="h-4 w-4 shrink-0 text-orange-500" />
                    <span>
                      By{" "}
                      <span className="font-semibold">{item.vendorName}</span>
                    </span>
                  </div>

                  {/* View Details */}
                  <Link
                    href={`/menu/${item._id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMenu;
