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
  speed = 35,
  className = "",
}: BrandMarqueeProps) {
  if (brands.length === 0) return null;

  const marqueeItems = brands.map((brand) => ({
    id: brand._id,
    content: (
      <div className="mx-4 md:mx-8 grayscale hover:grayscale-0 transition-all duration-500 ease-in-out cursor-pointer  hover:opacity-100">
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
          {/* <h2 className="text-[15px] tracking-[3px] font-medium uppercase text-[#111111]">
            Brands
          </h2> */}
      
        </div>

        <div className="overflow-hidden mb-5 [mask-image:linear-gradient(10deg,transparent_15%,black_50%,transparent_85%)]">
          <InfiniteMarquee items={marqueeItems} speed={speed} pauseOnHover={true} />
        </div>

        

      
      </div>
    </section>
  );
}