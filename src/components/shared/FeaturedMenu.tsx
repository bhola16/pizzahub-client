
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MapPin, Star } from "lucide-react";

const featuredItems = [
  {
    id: 1,
    name: "Classic Pepperoni",
    category: "Classic Pizza",
    price: 550,
    location: "Dhanmondi, Dhaka",
    vendor: "Pizza House",
    image: "/assets/pizzas/pizza1.jpeg",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Garden Fresh",
    category: "Vegetarian Pizza",
    price: 480,
    location: "Gulshan, Dhaka",
    vendor: "Green Oven",
    image: "/assets/pizzas/pizza2.jpeg",
    rating: 4.7,
  },
  {
    id: 3,
    name: "BBQ Chicken",
    category: "Meat Lovers",
    price: 620,
    location: "Uttara, Dhaka",
    vendor: "Fire Crust",
    image: "/assets/pizzas/pizza3.jpeg",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Four Cheese Pizza",
    category: "Specialty Pizza",
    price: 690,
    location: "Banani, Dhaka",
    vendor: "Cheese Corner",
    image: "/assets/pizzas/pizza4.jpeg",
    rating: 4.8,
  },
  {
    id: 5,
    name: "Chicken Supreme",
    category: "Specialty Pizza",
    price: 750,
    location: "Mirpur, Dhaka",
    vendor: "Pizza Palace",
    image: "/assets/pizzas/pizza5.jpeg",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Spicy Beef Pizza",
    category: "Meat Lovers",
    price: 650,
    location: "Mohammadpur, Dhaka",
    vendor: "Hot Slice",
    image: "/assets/pizzas/pizza2.jpeg",
    rating: 4.6,
  },
];

const FeaturedMenu = () => {
  return (
    <section className="bg-white py-2 dark:bg-[#111111] sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              Our Favorites
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              Featured <span className="text-orange-500">Menu Items</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base dark:text-neutral-400">
              Discover delicious pizzas crafted with fresh ingredients
              and unforgettable flavors.
            </p>
          </div>

          <Link
            href="/menu"
            className="group inline-flex w-fit items-center gap-2 font-semibold text-orange-500 transition-colors hover:text-orange-600"
          >
            View All Menu
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* Featured Pizza Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-2xl border border-orange-100 bg-[#FFFCF9] shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-orange-500/10 dark:border-neutral-800 dark:bg-[#1A1A1A]"
            >
              {/* Pizza Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-orange-50 dark:bg-neutral-800">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-orange-600 shadow-sm dark:bg-neutral-900/95 dark:text-orange-400">
                  {item.category}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-neutral-900 transition-colors group-hover:text-orange-500 dark:text-white">
                    {item.name}
                  </h3>

                  <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {item.rating}
                  </div>
                </div>

                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  By {item.vendor}
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <MapPin size={15} className="shrink-0 text-orange-500" />
                  {item.location}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-orange-100 pt-4 dark:border-neutral-800">
                  <div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      Price
                    </span>
                    <p className="text-xl font-extrabold text-orange-500">
                      ৳{item.price}
                    </p>
                  </div>

                  <Link
                    href={`/menu/${item.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20"
                  >
                    View Details
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenu;
