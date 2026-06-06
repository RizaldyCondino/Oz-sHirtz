"use client";

import React, { useState } from "react"; // ✅ add useState
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // ✅ add Loader2
import ProductCardCollection from "./ProductCardCollection";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SanityImage {
  asset?: { url?: string };
  alt?: string;
}

interface GalleryImage {
  imageUrl?: string;
  alt?: string;
  link?: string;
  label?: string;
}

type TextPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type TextAlign = "left" | "center" | "right";

interface CollectionData {
  _id: string;
  title?: string;
  slug?: { current: string };
  description?: string;
  season?: string;
  year?: number;
  coverImage?: SanityImage;
  isFeatured?: boolean;
  isSnkrs?: boolean;
  dropDate?: string;
  galleryImages?: GalleryImage[];
  textPosition?: TextPosition;
  textAlign?: TextAlign;
}

interface CollectionClientProps {
  collection: CollectionData;
  products?: any[];
  totalProducts?: number; // ✅ pass this from the server page
}

// ─── Position → Tailwind map ──────────────────────────────────────────────────

const POSITION_CLASSES: Record<TextPosition, string> = {
  "top-left":
    "justify-start  items-start  pt-24 pb-0  pl-6 sm:pl-10 md:pl-16 lg:pl-24 pr-6",
  "top-center": "justify-start  items-center pt-24 pb-0  px-6",
  "top-right":
    "justify-start  items-end    pt-24 pb-0  pr-6 sm:pr-10 md:pr-16 lg:pr-24 pl-6",
  "middle-left":
    "justify-center items-start  py-0        pl-6 sm:pl-10 md:pl-16 lg:pl-24 pr-6",
  "middle-center": "justify-center items-center py-0        px-6",
  "middle-right":
    "justify-center items-end    py-0        pr-6 sm:pr-10 md:pr-16 lg:pr-24 pl-6",
  "bottom-left":
    "justify-end    items-start  pt-0 pb-16 md:pb-20 pl-6 sm:pl-10 md:pl-16 lg:pl-24 pr-6",
  "bottom-center": "justify-end    items-center pt-0 pb-16 md:pb-20 px-6",
  "bottom-right":
    "justify-end    items-end    pt-0 pb-16 md:pb-20 pr-6 sm:pr-10 md:pr-16 lg:pr-24 pl-6",
};

const ALIGN_CLASSES: Record<TextAlign, string> = {
  left: "text-left  items-start",
  center: "text-center items-center",
  right: "text-right  items-end",
};

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = {
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], // ✅
    },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CollectionClient({
  collection,
  products: initialProducts = [],
  totalProducts = 0, // ✅ receive total count from server
}: CollectionClientProps) {
  const coverUrl = collection.coverImage?.asset?.url ?? null;
  const gallery = collection.galleryImages ?? [];
  const textPosition: TextPosition = collection.textPosition ?? "bottom-left";
  const textAlign: TextAlign = collection.textAlign ?? "left";
  const positionCls = POSITION_CLASSES[textPosition];
  const alignCls = ALIGN_CLASSES[textAlign];

  // ✅ Pagination state
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 12;
  const hasMore = products.length < totalProducts;

  // ✅ Fetch next page from your Sanity API route
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const offset = page * ITEMS_PER_PAGE;

      const res = await fetch(
        `/api/products?collectionSlug=${collection.slug?.current}&offset=${offset}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await res.json();

      setProducts((prev) => [...prev, ...data.products]);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load more products:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white  font-sans selection:bg-white selection:text-black">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="  relative  h-[110vh] min-h-[520px] w-full overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={
              collection.coverImage?.alt ||
              `${collection.title || "Collection"} cover image`
            }
            fill
            priority
            className="object-cover object-center scale-[1.03] transition-transform duration-[8s] ease-out"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#111]">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px)," +
                  "repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)",
              }}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/60 via-transparent to-transparent" />
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px",
          }}
        />

        <div className={`absolute inset-0 flex flex-col ${positionCls}`}>
          <div className={`flex flex-col max-w-3xl space-y-5 ${alignCls}`}>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(3rem,8vw,7rem)] font-black tracking-[-0.03em] uppercase leading-[0.9] text-white"
            >
              {collection.title}
            </motion.h1>

            {collection.description && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="text-sm sm:text-base text-white/45 max-w-xl leading-relaxed font-light tracking-wide"
              >
                {collection.description}
              </motion.p>
            )}

            {collection.dropDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-3"
              >
                <div className="h-px w-8 bg-white/20" />
                <span className="text-[11px] text-white/25 font-mono tracking-[0.18em]">
                  Drop:{" "}
                  {new Date(collection.dropDate).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="absolute bottom-8 right-8 flex flex-col items-center gap-1.5 pointer-events-none"
        >
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>

      {/* ── Gallery ───────────────────────────────────────────────────────── */}
      <section className="w-full">
        {gallery.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-3 w-full"
          >
            {gallery.map((item, i) => {
              const href = item.link || "#";
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  <Link href={href} className="group block w-full h-full absolute inset-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.alt || `${collection.title} gallery ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#151515]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                      <div className="font-mono text-[10px] text-white/30 tracking-widest">
                        0{i + 1}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center px-6 border-t border-white/8" />
        )}
      </section>

      {/* ── Products Section ───────────────────────────── */}
      {products.length > 0 && (
        <section className="w-full py-15 border-t px-10 border-white/10">
          <div className="max-w-8xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-10 sm:gap-y-14">
              {products.map((product, i) => {
                const productTitle = product.title || product.name || "Untitled Product";
                return (
                  <ProductCardCollection
                    key={product._id || i}
                    title={productTitle}
                    price={product.price}
                    discount={product.discount}
                    image={
                      product.image?.asset?.url ||
                      product.mainImage?.asset?.url ||
                      "/placeholder.jpg"
                    }
                    colorways={product.colorways}
                    sizes={product.sizes}
                    href={`/product/${product.slug?.current || product._id}`}
                    soldOut={product.soldOut}
                    tag={product.tag}
                  />
                );
              })}
            </div>

            {/* ✅ Load More UI — right here, inside the section, after the grid */}
            {(hasMore || isLoadingMore) && (
              <div className="flex flex-col items-center gap-4 mt-16">
                {/* Progress bar */}
                <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/60 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((products.length / totalProducts) * 100, 100)}%`,
                    }}
                  />
                </div>

                <p className="text-[11px] text-white/30 tracking-widest font-mono uppercase">
                  {products.length} of {totalProducts} products
                </p>

                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2 px-10 py-3 border border-white/20 text-white/70 text-[11px] tracking-[0.2em] uppercase font-mono hover:border-white/50 hover:text-white transition-all duration-200 disabled:opacity-30"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Loading
                    </>
                  ) : (
                    "Load more"
                  )}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}