"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PriceFormatter from "./PriceFormatter";

interface ImageType {
  url: string;
}

interface Colorway {
  name: string;
  hex: string;
  images?: ImageType[];
}

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  discount?: number;
  brand?: string | { title: string };
  images?: ImageType[];
  colorways?: Colorway[];
}

export default function FeaturedProducts({
  title,
  products = [],
}: {
  title: string;
  products: Product[];
}) {
  return (
    <section className="pt-8 bg-[#FAF8F4] w-full">
      {/* Header */}
      <div className="flex items-center mb-5 justify-between  px-4 sm:px-6 lg:px-10">
        <h2 className="text-[15px] tracking-[3px] font-bold uppercase text-[#111111]">
          {title}
        </h2>
        <Link
              href="/category/all?q=Featured"
              className="inline-flex items-center gap-3 group w-fit"
            >
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black border-b-2 border-black pb-0.5 group-hover:border-gray-400 group-hover:text-gray-400 transition-colors duration-200">
                View All
              </span>
              <svg
                className="w-4 h-4 text-black group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
      </div>
      

      {/* Full-width 3-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[2px]">
        {products.slice(0, 3).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const primaryImage =
    product.colorways?.[0]?.images?.[0]?.url || product.images?.[0]?.url;
  const secondaryImage =
    product.colorways?.[0]?.images?.[1]?.url || product.images?.[1]?.url;

  const hasDiscount = !!product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - (product.discount ?? 0) / 100)
    : product.price;

  const brandName =
    typeof product.brand === "string"
      ? product.brand
      : product.brand?.title || "";

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className="group block relative bg-neutral-100 overflow-hidden"
    >
      {/* Image container */}
      <div className="aspect-[3/4] relative overflow-hidden">
        {/* Primary Image */}
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
            No Image
          </div>
        )}

        {/* Secondary Image - Subtle Quick Transition */}
        {secondaryImage && (
          <motion.img
            src={secondaryImage}
            alt={`${product.name} alternate`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-black text-white text-[9px] px-2 py-1 font-semibold tracking-widest uppercase z-10">
            -{product.discount}%
          </div>
        )}



        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm px-3 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-[11px] font-medium text-neutral-900 truncate mb-1">
            {product.name}
          </p>
          <div className="flex items-center gap-2">
            <PriceFormatter
              amount={discountedPrice}
              className="text-[12px] font-bold text-[#b8502e]"
            />
            {hasDiscount && (
              <PriceFormatter
                amount={product.price}
                className="text-[11px] text-neutral-400 line-through"
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}