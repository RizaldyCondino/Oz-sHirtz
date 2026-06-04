"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
  | "top-left"    | "top-center"    | "top-right"
  | "middle-left" | "middle-center" | "middle-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

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
  products?: unknown[];
}

// ─── Position → Tailwind map ──────────────────────────────────────────────────

const POSITION_CLASSES: Record<TextPosition, string> = {
  "top-left":      "justify-start  items-start  pt-24 pb-0  pl-6 sm:pl-10 md:pl-16 lg:pl-24 pr-6",
  "top-center":    "justify-start  items-center pt-24 pb-0  px-6",
  "top-right":     "justify-start  items-end    pt-24 pb-0  pr-6 sm:pr-10 md:pr-16 lg:pr-24 pl-6",
  "middle-left":   "justify-center items-start  py-0        pl-6 sm:pl-10 md:pl-16 lg:pl-24 pr-6",
  "middle-center": "justify-center items-center py-0        px-6",
  "middle-right":  "justify-center items-end    py-0        pr-6 sm:pr-10 md:pr-16 lg:pr-24 pl-6",
  "bottom-left":   "justify-end    items-start  pt-0 pb-16 md:pb-20 pl-6 sm:pl-10 md:pl-16 lg:pl-24 pr-6",
  "bottom-center": "justify-end    items-center pt-0 pb-16 md:pb-20 px-6",
  "bottom-right":  "justify-end    items-end    pt-0 pb-16 md:pb-20 pr-6 sm:pr-10 md:pr-16 lg:pr-24 pl-6",
};

const ALIGN_CLASSES: Record<TextAlign, string> = {
  left:   "text-left  items-start",
  center: "text-center items-center",
  right:  "text-right  items-end",
};

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CollectionClient({ collection }: CollectionClientProps) {
  const coverUrl = collection.coverImage?.asset?.url ?? null;

  const gallery = collection.galleryImages ?? [];
  const textPosition: TextPosition = collection.textPosition ?? "bottom-left";
  const textAlign: TextAlign = collection.textAlign ?? "left";

  const positionCls = POSITION_CLASSES[textPosition];
  const alignCls    = ALIGN_CLASSES[textAlign];

  return (
    <main className="min-h-screen bg-[#080808] text-white font-sans selection:bg-white selection:text-black">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative h-[85vh] min-h-[520px] w-full overflow-hidden">

        {/* Background */}
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={collection.coverImage?.alt || collection.title || "Collection cover"}
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

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/60 via-transparent to-transparent" />
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px",
          }}
        />

        {/* Text block — position driven by Sanity fields */}
        <div className={`absolute inset-0 flex flex-col ${positionCls}`}>
          <div className={`flex flex-col max-w-3xl space-y-5 ${alignCls}`}>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(3rem,8vw,7rem)] font-black tracking-[-0.03em] uppercase leading-[0.9] text-white"
            >
              {collection.title}
            </motion.h1>

            {/* Description */}
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

            {/* Drop date meta */}
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

        {/* Scroll hint */}
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
          <>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="flex flex-col sm:flex-row w-full"
            >
              {gallery.map((item, i) => {
                const href = item.link || "#";

                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="relative flex-1 overflow-hidden"
                    style={{ minHeight: "clamp(260px, 45vw, 680px)" }}
                  >
                    <Link href={href} className="block w-full h-full absolute inset-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.alt || `Gallery image ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#151515]" />
                      )}

                      {/* Bottom vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Index */}
                      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/20 tracking-widest">
                        0{i + 1}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* See All Collections */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center py-14 border-t border-white/8"
            >
              <Link
                href="/collections"
                className="group inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-[#111111] hover:text-[#111111]/80 transition-colors duration-200"
              >
                <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-14" />
                See All Collections
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center px-6 border-t border-white/8">
            <p className="text-white/20 text-xs font-mono tracking-[0.2em] uppercase">
              Gallery coming soon
            </p>
            <Link
              href="/collections"
              className="mt-8 inline-flex items-center gap-2 border border-white/15 hover:bg-white hover:text-black transition-all duration-200 text-[10px] uppercase tracking-[0.25em] px-6 py-3 font-bold text-white rounded-sm"
            >
              See All Collections <ArrowUpRight size={12} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}