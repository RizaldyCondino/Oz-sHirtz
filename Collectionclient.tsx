"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, PackageOpen } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SanityImage {
  asset?: { _ref?: string; url?: string };
  alt?: string;
}

interface ProductCardData {
  _id: string;
  name?: string;
  slug?: { current: string };
  sku?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  status?: string;
  isNew?: boolean;
  images?: SanityImage[];
}

interface CollectionData {
  _id: string;
  title?: string;
  slug?: { current: string };
  description?: string;
  season?: string;
  year?: number;
  coverImage?: SanityImage;
}

interface CollectionClientProps {
  collection: CollectionData;
  products: ProductCardData[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BADGE_STATUSES = new Set([
  "sale",
  "new",
  "featured",
  "snkrs",
  "coming-soon",
  "sold-out",
]);

function resolveImageUrl(img?: SanityImage): string | null {
  if (!img) return null;
  if (img.asset?.url) return img.asset.url;
  try {
    return urlFor(img).width(800).url();
  } catch {
    return null;
  }
}

const statusStyles: Record<string, string> = {
  sale: "bg-red-600 text-white",
  "sold-out": "bg-neutral-600 text-white",
  "coming-soon": "bg-blue-700 text-white",
  featured: "bg-amber-500 text-black",
  snkrs: "bg-green-700 text-white",
  new: "bg-white text-black",
};

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const heroText = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CollectionClient({
  collection,
  products,
}: CollectionClientProps) {
  const coverUrl = resolveImageUrl(collection.coverImage);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-white selection:text-black font-sans">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[360px] w-full overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={collection.coverImage?.alt || collection.title || "Collection"}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
        )}

        {/* Depth overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 md:px-16 pb-10 md:pb-14">
          <div className="max-w-4xl space-y-4">
            {(collection.season || collection.year) && (
              <motion.div initial="hidden" animate="show" variants={heroText}>
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-white/50 border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {collection.season} {collection.year}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none"
            >
              {collection.title}
            </motion.h1>

            {collection.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-sm sm:text-base text-white/50 max-w-xl leading-relaxed font-light"
              >
                {collection.description}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center gap-3 pt-2"
            >
              <Separator className="w-8 bg-white/20" />
              <span className="text-xs text-white/30 font-mono tracking-widest uppercase">
                {products.length}{" "}
                {products.length === 1 ? "Release" : "Releases"}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Product Grid ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-white rounded-full" />
            <p className="text-xs tracking-[0.2em] uppercase text-white/40 font-mono">
              {collection.title}
            </p>
          </div>
          <p className="text-xs text-white/30 font-mono tabular-nums">
            {String(products.length).padStart(2, "0")} items
          </p>
        </motion.div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
            {products.map((product, i) => {
              const productUrl = `/product/${product.slug?.current || ""}`;
              const imgUrl = resolveImageUrl(product.images?.[0]);
              const statusLower = (product.status || "").toLowerCase();
              const showNewBadge = product.isNew || statusLower === "new";
              const showStatusBadge =
                !showNewBadge &&
                BADGE_STATUSES.has(statusLower) &&
                statusLower !== "new";

              return (
                <motion.article
                  key={product._id}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  className="group relative flex flex-col"
                >
                  {/* Image */}
                  <Link href={productUrl} className="block">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-900">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={
                            product.images?.[0]?.alt ||
                            product.name ||
                            "Product"
                          }
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 text-xs font-mono">
                          [ NO IMAGE ]
                        </div>
                      )}

                      {/* Hover scrim */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {showNewBadge && (
                          <Badge className="bg-white text-black text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-lg border-0">
                            New
                          </Badge>
                        )}
                        {showStatusBadge && (
                          <Badge
                            className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-lg border-0 ${
                              statusStyles[statusLower] ||
                              "bg-neutral-700 text-white"
                            }`}
                          >
                            {statusLower === "coming-soon"
                              ? "Soon"
                              : product.status}
                          </Badge>
                        )}
                      </div>

                      {/* Quick view pill */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-center">
                        <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-black text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-1.5 shadow-2xl">
                          Quick View <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="mt-4 flex flex-col gap-1 flex-1">
                    <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors leading-snug line-clamp-2">
                      <Link href={productUrl}>{product.name}</Link>
                    </h3>

                    {product.sku && (
                      <p className="text-[11px] font-mono text-white/30 tracking-wide">
                        {product.sku}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mt-auto pt-3 flex items-center gap-2">
                      <span className="text-sm font-bold text-white tabular-nums">
                        ₱
                        {product.price?.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > (product.price || 0) && (
                          <span className="text-xs text-white/30 line-through tabular-nums font-mono">
                            ₱
                            {product.originalPrice.toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        )}
                      {product.discount && product.discount > 0 && (
                        <span className="ml-auto text-[10px] font-bold text-red-400 font-mono">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center justify-center text-center py-36 border border-dashed border-white/10 rounded-2xl bg-white/[0.02] px-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-5">
              <PackageOpen className="text-white/20" size={26} />
            </div>
            <p className="text-white/70 font-semibold text-sm">
              No products yet
            </p>
            <p className="text-white/30 text-xs mt-1.5 max-w-xs font-light leading-relaxed">
              This collection is empty. Check back soon or explore our other
              releases.
            </p>
            <Link
              href="/category/all"
              className="mt-7 inline-flex items-center gap-2 border border-white/20 hover:bg-white hover:text-black transition-all duration-200 text-xs uppercase tracking-widest px-6 py-2.5 font-bold rounded-full"
            >
              Shop All <ArrowUpRight size={13} />
            </Link>
          </motion.div>
        )}
      </section>
    </main>
  );
}