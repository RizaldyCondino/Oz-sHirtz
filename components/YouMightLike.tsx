"use client";

import React, { useState } from "react";
import { Product } from "@/sanity/lib/queries";
import ProductCard from "./ProductCardProps";
import Pagination from "./Paginations";


const ITEMS_PER_PAGE = 4;

interface Props {
  products: Product[];
}

export default function YouMightLike({ products }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!products || products.length === 0) return null;

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = products.slice(start, start + ITEMS_PER_PAGE);

  return (
    <section className="max-w-8xl  mx-auto px-10 sm:px-6 py-12 border-t border-neutral-100">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1">
          Discover
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-[#111]">
          You Might Like
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {paginated.map((product) => (
          <ProductCard
            key={product._id}
            isLoading={false}
            title={product.name ?? ""}
            price={product.price ?? 0}
            discount={product.discount}
            image={product.images?.[0]?.asset?.url ?? "/placeholder.jpg"}
            tag={product.status}
            colorways={(product.colorways ?? []).map((c) => ({
              ...c,
              hex: c.hex ?? "",
            }))}
            href={`/product/${product.slug?.current ?? ""}`}
          />
        ))}
      </div>

      <Pagination
      
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
      />
    </section>
  );
}