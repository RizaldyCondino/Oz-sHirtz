"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import InfiniteMarquee from "./InfiniteMarquee";

interface Brand {
  _id: string;
  title: string;
  slug: { current: string };
  logo?: string | null;
  productCount?: number;
}

interface BrandMarqueeProps {
  title: string;
  brands: Brand[];
  speed?: number;
  className?: string;
}

export default function BrandMarquee({
  title,
  brands = [],
  speed = 25,
  className = "",
}: BrandMarqueeProps) {
  if (brands.length === 0) return null;

  const marqueeItems = brands.map((brand) => ({
    id: brand._id,
    content: (
      <div className="mx-4 md:mx-8 grayscale hover:grayscale-0 transition-all duration-500 ease-in-out cursor-pointer opacity-70 hover:opacity-100">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.title}
            className="h-16 md:h-24 w-auto max-h-16 md:max-h-24 object-contain"
          />
        ) : (
          <span className="text-sm md:text-lg font-medium text-neutral-500 whitespace-nowrap px-4 md:px-8">
            {brand.title}
          </span>
        )}
      </div>
    ),
  }));

  return (
    <section className={`py-12 bg-[#FAF8F4] ${className}`}>
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg md:text-xl font-semibold uppercase tracking-wider text-neutral-900">
            {title}
          </h2>
          <Link
            href="/brands"
            className="text-[11px] uppercase tracking-widest font-semibold text-black  flex items-center gap-1 hover:text-[#111111] transition"
          >
            All Brands <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-hidden mb-8 [mask-image:linear-gradient(45deg,transparent_15%,black_50%,transparent_85%)]">
          <InfiniteMarquee items={marqueeItems} speed={speed} pauseOnHover={true} />
        </div>

        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <InfiniteMarquee items={marqueeItems} speed={speed} pauseOnHover={true} reverse={true} />
        </div>
      </div>
    </section>
  );
}