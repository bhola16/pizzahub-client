"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { toast } from "sonner";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.success("Thanks for subscribing!", {
      description: "Stay tuned for delicious updates from PizzaHub.",
    });

    e.currentTarget.reset();
  };

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: FaFacebookF,
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: FaInstagram,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: FaLinkedinIn,
    },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Menu", href: "/menu" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  const supportLinks = [
    { name: "My Orders", href: "/dashboard/customer/orders" },
    { name: "My Account", href: "/dashboard/customer" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <footer className="border-t border-orange-100 bg-[#FFF9F5] text-neutral-700 dark:border-neutral-800 dark:bg-[#111111] dark:text-neutral-300">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                <Image
                  src="/assets/pizzahub-logo.jpg"
                  alt="PizzaHub Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <span className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Pizza<span className="text-orange-500">Hub</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-neutral-600 dark:text-neutral-400">
              Freshly baked, deliciously crafted, and delivered with love.
              Discover your favorite pizza and make every moment special with
              PizzaHub.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:text-white dark:bg-neutral-800 dark:text-orange-400 dark:hover:bg-orange-500 dark:hover:text-white">
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-neutral-900 dark:text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-400">
                    <ArrowUpRight
                      size={14}
                      className="text-orange-500 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-neutral-900 dark:text-white">
              Customer Support
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-orange-500" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Call Us
                  </p>
                  <a
                    href="tel:+8801900000000"
                    className="mt-1 block text-sm font-medium transition-colors hover:text-orange-500">
                    +880 1900-000000
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-orange-500" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Email Us
                  </p>
                  <a
                    href="mailto:support@pizzahub.com"
                    className="mt-1 block break-all text-sm font-medium transition-colors hover:text-orange-500">
                    support@pizzahub.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-orange-500" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Our Location
                  </p>
                  <p className="mt-1 text-sm font-medium">Dhaka, Bangladesh</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-3 text-lg font-bold text-neutral-900 dark:text-white">
              Stay Connected
            </h3>

            <p className="mb-5 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Subscribe to receive exclusive offers, delicious updates, and
              special discounts.
            </p>

            <form onSubmit={handleNewsletter} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                aria-label="Email address"
                className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition-all placeholder:text-neutral-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
              />

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.98]">
                Subscribe
                <ArrowRight size={17} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-orange-100 dark:border-neutral-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            © {currentYear} PizzaHub. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            Made with
            <Heart size={15} className="fill-orange-500 text-orange-500" />
            for pizza lovers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-orange-500">
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-orange-500">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
