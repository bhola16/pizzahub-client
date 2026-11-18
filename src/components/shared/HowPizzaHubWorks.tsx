"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Pizza,
  Search,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Explore & Discover",
    description:
      "Browse different pizza categories and discover delicious options from local vendors.",
  },
  {
    number: "02",
    icon: Pizza,
    title: "Choose Your Pizza",
    description:
      "Select your favorite pizza, explore the details, and add your choices to your order.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Order & Enjoy",
    description:
      "Complete your order through a convenient checkout process and enjoy your pizza.",
  },
];

export default function HowPizzaHubWorks() {
  return (
    <section className="overflow-hidden bg-white px-4 py-20 dark:bg-[#1D1916] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            Simple & Convenient
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#30231D] dark:text-white sm:text-4xl">
            How <span className="text-[#E87932]">PizzaHub</span> Works
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#796B62] dark:text-gray-400 sm:text-base">
            Your favorite pizza is just a few simple steps away.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Connecting line */}
          <div className="absolute left-[16.66%] right-[16.66%] top-12 hidden border-t-2 border-dashed border-orange-200 dark:border-orange-500/20 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-7 flex h-24 w-24 items-center justify-center rounded-full border-4 border-orange-100 bg-[#FFF5EB] text-[#E87932] shadow-sm dark:border-[#443025] dark:bg-[#30231D]">
                  <Icon size={34} strokeWidth={1.8} />

                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E87932] text-xs font-bold text-white shadow-md">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#30231D] dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-xs text-sm leading-7 text-[#796B62] dark:text-gray-400">
                  {step.description}
                </p>

                {index !== 2 && (
                  <ArrowRight
                    size={20}
                    className="mt-5 text-orange-400 md:hidden"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-[#E87932] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#D96525] hover:shadow-orange-500/30">
            Explore Our Menu
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
