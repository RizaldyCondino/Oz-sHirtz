"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import PriceFormatter from "./PriceFormatter";

interface ImageType {
  asset?: { url: string };
}

interface SanitySizeObject {
  size?: string;
  stock?: number;
  price?: number;
  sku?: string;
}

interface Colorway {
  name: string;
  hex: string;
  images?: ImageType[];
  price?: number;
  discount?: number;
  sizes?: SanitySizeObject[];
}

type ProductCardProps = {
  title: string;
  price: number;
  discount?: number;
  image: string;
  colorways?: Colorway[];
  tag?: string;
  sizes?: SanitySizeObject[];
  href?: string;
  soldOut?: boolean;
  isLoading?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  discount,
  image,
  colorways = [],
  tag = "New",
  sizes = [],
  href = "#",
  soldOut = false,
  isLoading = false,
}) => {
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="group relative w-full bg-white/40 rounded-md backdrop-blur-md border border-white/20 overflow-hidden shadow-md">
        <div className="relative w-full aspect-[4/5] bg-[#F0E6D2] flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative">
              <Loader2 className="w-12 h-12 text-black animate-spin" />
              <div className="absolute inset-0 border-4 border-[#F0E6D2] border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-xs text-[#8C6227] tracking-wide">Loading product...</p>
          </motion.div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <motion.div className="h-4 bg-gray-200 rounded w-4/5" />
          <div className="flex items-center gap-2">
            <motion.div className="h-5 bg-gray-200 rounded w-24" />
            <motion.div className="h-4 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  const activeColorway = colorways[activeColorIndex];

  const activePrice = activeColorway?.price ?? price;
  const activeDiscount = activeColorway?.discount ?? discount;
  const activeSizes = activeColorway?.sizes ?? sizes;
  const activeImage =
    activeColorway?.images?.[0]?.asset?.url ?? image ?? "/placeholder.jpg";

  const hasStockData = activeSizes.some((size) => typeof size.stock === "number");
  const totalStock = activeSizes.reduce((acc, curr) => acc + (curr.stock ?? 0), 0);
  const isColorwaySoldOut = hasStockData && totalStock <= 0;
  const isGlobalSoldOut = soldOut || isColorwaySoldOut;

  const discountedPrice =
    activeDiscount && activeDiscount > 0
      ? activePrice - (activePrice * activeDiscount) / 100
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group relative w-full bg-white/40 rounded-md backdrop-blur-md border border-white/20 overflow-hidden shadow-md hover:shadow-xs transition duration-300 ${isGlobalSoldOut ? "opacity-60" : ""}`}
    >
      {/* Image Area */}
      <div className="relative w-full aspect-[4/5] bg-[#F0E6D2] overflow-hidden">
        <Link
          href={isGlobalSoldOut ? "#" : href}
          className="block w-full h-full relative cursor-pointer"
        >
          <Image
            src={activeImage}
            alt={title}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition duration-500"
          />
          {isGlobalSoldOut && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white uppercase tracking-[0.2em] text-sm z-10">
              Sold Out
            </span>
          )}
        </Link>

        {/* <span className="absolute text-[8px] top-2 left-2 md:text-[9px] rounded-md font-medium uppercase tracking-[0.18em] bg-white/70 backdrop-blur px-2 py-1 text-[#8C6227] z-10">
          {tag}
        </span> */}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <Link href={isGlobalSoldOut ? "#" : href} className="cursor-pointer">
          <h3 className="text-xs font-semibold text-[#231F20] truncate">
            {title}
          </h3>
        </Link>

        {/* Price Row with Discount % OFF */}
        <div className="flex items-center gap-2 flex-wrap">
          {discountedPrice ? (
            <>
              <PriceFormatter
                amount={discountedPrice}
                className="text-base font-semibold text-[#8C6227]"
              />
              <PriceFormatter
                amount={activePrice}
                className="line-through text-xs text-gray-500"
              />

              {/* Discount % OFF - Aligned with prices, red text, no background */}
              <span className="text-red-600 text-[10px] font-bold tracking-wide ">
                {activeDiscount}%
              </span>
            </>
          ) : (
            <PriceFormatter
              amount={activePrice}
              className="text-base text-[#5C5145]"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;