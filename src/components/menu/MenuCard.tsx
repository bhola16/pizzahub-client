import Image from "next/image";
import Link from "next/link";
import { MapPin, Store } from "lucide-react";
import type { MenuItem } from "@/lib/api/menu";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={item.images?.[0] || "/placeholder-pizza.jpg"}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
          {item.category}
        </span>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            {item.name}
          </h3>

          <span className="shrink-0 font-bold text-orange-600">
            ৳{item.price}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-stone-600 dark:text-stone-400">
          {item.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1">
            <Store size={14} />
            {item.vendorName}
          </span>

          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {item.location}
          </span>
        </div>

        <Link
          href={`/menu/${item._id}`}
          className="block rounded-xl bg-orange-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600">
          View Details
        </Link>
      </div>
    </div>
  );
}
