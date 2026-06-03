"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import InfiniteMarquee from "./InfiniteMarquee";

interface Brand {
  _id: string;
  title: string;
  slug: { current: string };
  logo?: string | null;
  productCount?: number;
}

interface BrandMarqueeProps {
  title?: string;
  brands: Brand[];
  speed?: number;
  className?: string;
}

export default function BrandMarquee({
  title,
  brands = [],
  speed = 35,
  className = "",
}: BrandMarqueeProps) {
  if (brands.length === 0) return null;

  const marqueeItems = brands.map((brand) => ({
    id: brand._id,
    content: (
      <Link
        href={`/category/all?q=${brand?.title}`}
        className="group relative mx-6 md:mx-10 flex flex-col items-center justify-center gap-2"
      >
        {/* Logo / name */}
        <div className="relative flex items-center justify-center h-12 md:h-16 transition-all duration-500">
          {brand.logo ? (
            <img
              src={brand.logo}
              alt={brand.title}
              className="h-10 md:h-14 w-auto max-w-[120px] md:max-w-[160px] object-contain
                         grayscale opacity-50
                         group-hover:grayscale-0 group-hover:opacity-100
                         transition-all duration-500 ease-out"
            />
          ) : (
            <span
              className="text-base md:text-xl font-black tracking-[3px] uppercase
                         text-[#999] group-hover:text-[#111]
                         transition-colors duration-300"
            >
              {brand.title}
            </span>
          )}
        </div>

       
      </Link>
    ),
  }));

  return (
    <section className={`relative py-14 bg-[#FAF8F4] overflow-hidden ${className}`}>

      {/* Top rule */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#1C1C1C]/10" />
          {title && (
            <span className="text-[10px] tracking-[5px] font-semibold uppercase text-[#999]">
              {title}
            </span>
          )}
          <div className="h-px flex-1 bg-[#1C1C1C]/10" />
        </div>
      </div>

      {/* Marquee with edge fade */}
      <div
        className="overflow-hidden
          [mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_88%,transparent_100%)]"
      >
        <InfiniteMarquee
          items={marqueeItems}
          speed={speed}
          pauseOnHover={true}
        />
      </div>

      {/* Bottom rule */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-20 mt-10">
        <div className="h-px bg-[#1C1C1C]/10" />
      </div>
    </section>
  );
}