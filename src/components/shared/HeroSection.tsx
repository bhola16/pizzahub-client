"use client";

import { ArrowRight, Flame, Star } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#FFF8F1] dark:bg-[#17120F]">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-500/10" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl dark:bg-orange-600/10" />

      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center md:text-left">
          {/* Promotional Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm dark:border-orange-900 dark:bg-neutral-900/80 dark:text-orange-400">
            <Flame size={17} className="fill-orange-500 text-orange-500" />
            Freshly Baked. Always Delicious.
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl dark:text-white">
            Hot & Fresh Pizza
            <span className="mt-2 block text-orange-500">
              Delivered to Your Door.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-neutral-600 sm:text-lg md:mx-0 dark:text-neutral-400">
            Craving something delicious? Explore handcrafted pizzas made with
            fresh ingredients, irresistible flavors, and a whole lot of love.
            Your next favorite slice is just a click away.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
            <Link
              href="/menu"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/30 sm:w-auto">
              Explore Pizza Menu
              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

           
          </div>

          {/* Trust Indicator */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <div className="flex -space-x-3">
              {[
                "https://i.pravatar.cc/100?img=12",
                "https://i.pravatar.cc/100?img=32",
                "https://i.pravatar.cc/100?img=47",
                "https://i.pravatar.cc/100?img=5",
              ].map((avatar, index) => (
                <div
                  key={index}
                  className="relative h-10 w-10 overflow-hidden rounded-full border-[3px] border-[#FFF8F1] dark:border-[#17120F]">
                  <Image
                    src={avatar}
                    alt="PizzaHub customer"
                    fill
                    sizes="40px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center gap-1 sm:justify-start">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className="fill-orange-400 text-orange-400"
                  />
                ))}
                <span className="ml-1 text-sm font-bold text-neutral-800 dark:text-white">
                  PizzaHub
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Discover delicious pizzas from trusted vendors
              </p>
            </div>
          </div>
        </motion.div>

        {/* Premium Pizza Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mx-auto w-full max-w-[580px]">
          {/* Ambient Glow */}
          <div className="absolute inset-8 rounded-full bg-orange-400/30 blur-[90px] dark:bg-orange-500/20" />

          {/* Decorative Rings */}
          <div className="absolute inset-2 rounded-full border border-dashed border-orange-400/40" />
          <div className="absolute inset-8 rounded-full border border-orange-300/30 dark:border-orange-700/30" />

          {/* Floating Decorative Dots */}
          <div className="absolute left-8 top-12 h-3 w-3 rounded-full bg-orange-400 shadow-lg shadow-orange-400/50" />
          <div className="absolute right-12 top-20 h-2 w-2 rounded-full bg-yellow-400" />
          <div className="absolute bottom-16 left-12 h-2.5 w-2.5 rounded-full bg-red-400" />

          {/* Main Pizza Image */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.035 }}
            className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-white/50 shadow-2xl shadow-orange-900/20 dark:border-neutral-700/60">
            <Image
              src="/assets/hero-pizza2.jpeg"
              alt="Freshly baked pepperoni pizza with melted cheese"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 580px"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
          </motion.div>

          {/* Floating Fresh Badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-3 top-10 z-20 flex items-center gap-3 rounded-2xl border border-orange-100 bg-white/95 p-3 shadow-xl backdrop-blur-md sm:-left-8 dark:border-neutral-700 dark:bg-neutral-900/95">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
              <Flame size={23} />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Freshly prepared
              </p>
              <p className="text-sm font-extrabold text-neutral-900 dark:text-white">
                Hot & Delicious
              </p>
            </div>
          </motion.div>

          {/* Floating Quality Badge */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-5 right-2 z-20 rounded-2xl border border-orange-100 bg-white/95 px-5 py-4 shadow-xl backdrop-blur-md sm:-right-5 dark:border-neutral-700 dark:bg-neutral-900/95">
            <div className="flex items-center gap-2">
              <Star size={17} className="fill-orange-400 text-orange-400" />
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                Made with Love
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Every slice, a little happiness.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
