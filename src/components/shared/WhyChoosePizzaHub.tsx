"use client";

import { motion } from "motion/react";
import {
  BadgeCheck,
  Clock3,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Quality Ingredients",
    description:
      "Enjoy delicious pizzas made with fresh ingredients and carefully selected toppings.",
  },
  {
    icon: Clock3,
    title: "Fast Delivery",
    description:
      "Get your favorite pizza delivered to your doorstep without unnecessary delays.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Enjoy a smooth and secure checkout experience with reliable payment options.",
  },
  {
    icon: MapPin,
    title: "Local Pizza Shops",
    description:
      "Discover popular pizza shops and explore delicious options around your area.",
  },
  {
    icon: HeartHandshake,
    title: "Trusted Vendors",
    description:
      "Connect with trusted local vendors offering quality food and friendly service.",
  },
  {
    icon: Truck,
    title: "Easy Ordering",
    description:
      "Browse menus, choose your favorite items, and place your order in just a few steps.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function WhyChoosePizzaHub() {
  return (
    <section className="overflow-hidden bg-[#FFF9F3] px-4 py-2 dark:bg-[#171412] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            Why PizzaHub?
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#30231D] dark:text-white sm:text-4xl">
            More Than Just <span className="text-[#E87932]">Pizza</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#796B62] dark:text-gray-400 sm:text-base">
            We make discovering and ordering your favorite pizza simple,
            convenient, and enjoyable.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="group rounded-2xl border border-[#F0E3D8] bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-orange-500/5 dark:border-[#39302A] dark:bg-[#211C19]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#E87932] transition-colors duration-300 group-hover:bg-[#E87932] group-hover:text-white dark:bg-orange-500/10">
                  <Icon size={24} strokeWidth={2} />
                </div>

                <h3 className="text-lg font-bold text-[#30231D] dark:text-white">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#796B62] dark:text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
