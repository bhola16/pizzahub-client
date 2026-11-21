"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Utensils } from "lucide-react";
import { getMenuItems, type MenuItem } from "@/lib/api/menu";

const categories = [
  {
    id: 1,
    name: "Classic Pizzas",
    slug: "classic-pizzas",
    description: "Timeless flavors that never go out of style.",
    count: "Traditional Favorites",
  },
  {
    id: 2,
    name: "Vegetarian Pizzas",
    slug: "vegetarian-pizzas",
    description: "Fresh vegetables and delicious combinations.",
    count: "Fresh & Healthy",
  },
  {
    id: 3,
    name: "Meat Lovers",
    slug: "meat-lovers",
    description: "Loaded with savory meats and bold flavors.",
    count: "Rich & Flavorful",
  },
  {
    id: 4,
    name: "Specialty / Gourmet Pizzas",
    slug: "specialty-gourmet",
    description: "Unique creations for an extraordinary taste.",
    count: "Premium Selection",
  },
  {
    id: 5,
    name: "Sides & Appetizers",
    slug: "sides-appetizers",
    description: "Perfect little bites to complete your meal.",
    count: "Perfect Add-ons",
  },
  {
    id: 6,
    name: "Beverages & Desserts",
    slug: "beverages-desserts",
    description: "Refreshing drinks and sweet treats.",
    count: "Sweet & Refreshing",
  },
];

const PizzaCategories = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FFF9F4] py-16 dark:bg-[#17120F] sm:py-20">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-500/10" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl dark:bg-orange-600/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-600 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-400">
            <Utensils size={15} />
            Explore Our Collections
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-white">
            Find Your Perfect
            <span className="text-orange-500"> Slice</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base dark:text-neutral-400">
            From timeless classics to exciting gourmet creations, discover a
            category made for every pizza craving.
          </p>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const categoryItems = menuItems.filter(
              (item) =>
                item.category?.trim().toLowerCase() ===
                category.name.toLowerCase(),
            );

            const categoryImage = categoryItems.find(
              (item) => item.images?.length > 0,
            )?.images?.[0];

            return (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -7 }}
                className="group relative isolate h-[280px] overflow-hidden rounded-3xl bg-neutral-900 shadow-md transition-shadow duration-300 hover:shadow-xl hover:shadow-orange-500/15 sm:h-[320px]">
                {/* Category Image */}
                {categoryImage ? (
                  <Image
                    src={categoryImage}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-white/40">
                    <Utensils size={48} />
                  </div>
                )}

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/45" />

                {/* Category Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <span className="inline-block rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {loading
                      ? "Loading..."
                      : `${categoryItems.length} ${
                          categoryItems.length === 1 ? "Item" : "Items"
                        }`}
                  </span>

                  <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                    {category.name}
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/75">
                    {category.description}
                  </p>

                  <Link
                    href={`/menu?category=${encodeURIComponent(category.name)}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-orange-400">
                    Explore Category
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 transition-all duration-300 group-hover:rotate-45 group-hover:bg-orange-400">
                      <ArrowUpRight size={17} />
                    </span>
                  </Link>
                </div>

                {/* Hover Border */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/0 transition-colors duration-300 group-hover:border-orange-400/70" />
              </motion.article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center">
          <Link
            href="/menu"
            className="group inline-flex items-center gap-3 rounded-full border border-orange-300 px-7 py-3.5 text-sm font-bold text-orange-600 transition-all duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white dark:border-orange-800 dark:text-orange-400 dark:hover:border-orange-500 dark:hover:bg-orange-500 dark:hover:text-white">
            Explore Full Menu
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PizzaCategories;
