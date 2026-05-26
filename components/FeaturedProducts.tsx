"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section className="py-5 bg-[#FAF8F4] w-full">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
            {title}
          </h2>

          <Link
            href="/category/all"
            className="text-[11px] uppercase tracking-widest font-semibold text-black  flex items-center gap-1 hover:text-[#111111] transition"
          >
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {/* Products Grid - Drops grid-cols-2 for 3-columns early on small-screens */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
          {products.map((product) => {
            const displayImage =
              product.colorways?.[0]?.images?.[0]?.url ||
              product.images?.[0]?.url;

            const hasDiscount = !!product.discount && product.discount > 0;
            const discountedPrice = hasDiscount
              ? product.price * (1 - product.discount / 100)
              : product.price;

            const brandName =
              typeof product.brand === "string"
                ? product.brand
                : product.brand?.title || "";

            return (
              <div key={product._id} className="block">
                {/* Product Link */}
                <Link
                  href={`/product/${product.slug?.current}`}
                  className="block"
                >
                  <div className="aspect-[3/4] bg-neutral-100 overflow-hidden mb-3 relative rounded-md">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                        No Image
                      </div>
                    )}

                    {/* Discount Badge - Top Left */}
                    {hasDiscount && (
                      <div className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 rounded-full font-medium z-10">
                        -{product.discount}%
                      </div>
                    )}

                    {/* Brand Name - Top Right */}
                    {brandName && (
                      <div className="absolute top-2 right-2 text-orange-900 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded z-10">
                        {brandName}
                      </div>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-[12px] font-medium text-neutral-900 truncate">
                    {product.name}
                  </h3>
                </Link>

                {/* Color Swatches */}
                {/* {product.colorways && product.colorways.length > 0 && (
                  <div className="flex gap-1.5 mt-2">
                    {product.colorways.map((color) => (
                      <Link
                        key={color.name}
                        href={`/product/${product.slug?.current}?color=${encodeURIComponent(
                          color.name
                        )}`}
                        className="w-3 h-3 rounded-full border border-neutral-200 hover:border-neutral-400 transition-all"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )} */}

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                  <PriceFormatter
                    amount={discountedPrice}
                    className="text-[12px] font-bold text-[#8C6227]"
                  />

                  {hasDiscount && (
                    <PriceFormatter
                      amount={product.price}
                      className="text-[11px] text-neutral-400 line-through"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}