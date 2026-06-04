"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";
import { TbSparkles } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { hybridSearch, SearchResult } from "@/sanity/lib/search";

export default function SearchBar({
  align = "right",
}: {
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [mode, setMode] = useState<"groq" | "vector" | "hybrid">("hybrid");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timeout = setTimeout(() => {
      startTransition(async () => {
        try {
          setError(null);
          const data = await hybridSearch(query, mode);
          setResults(data);
          setHasSearched(true);
        } catch (err) {
          setError("Search failed. Please try again.");
          setResults([]);
        }
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, mode]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setError(null);
  };

  if (!mounted) {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label="Search"
        className="cursor-pointer"
      >
        <FiSearch className="w-4 h-4 mt-2 text-neutral-600" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative group"
        aria-label="Search"
      >
        <FiSearch className="w-4 h-4 mt-2 hover:text-[#111111] cursor-pointer text-neutral-600 transition-colors" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="search-dropdown"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ originX: align === "left" ? 0 : 1, originY: 0 }}
            className={`absolute ${align === "left" ? "left-0" : "right-0"} top-8 w-[300px] lg:w-[420px] max-w-[calc(100vw-2rem)] bg-[#FAF8F4] border border-[#e5e1da] rounded-xl z-50 overflow-hidden shadow-sm`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-b border-[#e5e1da]">
              <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-widest text-[#b8502e] flex items-center gap-1.5">
                {/* <TbSparkles size={11} /> */}
                Search
              </span>
              <button onClick={handleClose} aria-label="Close search">
                <FiX
                  size={13}
                  className="text-neutral-400 cursor-pointer hover:text-black transition-colors"
                />
              </button>
            </div>

            {/* Search input */}
            <div className="px-4 lg:px-5 pt-3 pb-2">
              <div className="relative flex items-center">
                <FiSearch
                  size={13}
                  className="absolute left-3 text-neutral-400 pointer-events-none"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="w-full bg-white border border-[#e5e1da] rounded-lg pl-8 pr-8 py-2 lg:py-2.5 text-[12px] lg:text-[13px] text-[#111] placeholder:text-neutral-400 outline-none focus:border-[#b8502e] transition-colors"
                />
                {query && (
                  <button
                    onClick={handleClear}
                    className="absolute right-3 text-neutral-400 hover:text-black transition-colors"
                  >
                    <FiX size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Mode toggle */}
            <div className="px-4 lg:px-5 pb-3 flex gap-1.5 lg:gap-2">
              {(["groq", "vector", "hybrid"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`text-[9px] lg:text-[10px] font-bold uppercase tracking-widest px-2.5 lg:px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    mode === m
                      ? "bg-[#111] text-white border-[#111]"
                      : "bg-white text-neutral-500 border-[#e5e1da] hover:border-[#111] hover:text-[#111]"
                  }`}
                >
                  {m === "groq"
                    ? "Keyword"
                    : m === "vector"
                      ? "AI"
                      : "✦ Hybrid"}
                </button>
              ))}
              <span className="ml-auto text-[9px] lg:text-[10px] text-neutral-400 self-center">
                {mode === "groq"
                  ? "Exact match"
                  : mode === "vector"
                    ? "Semantic"
                    : "Best of both"}
              </span>
            </div>

            {/* Results */}
            <div className="max-h-[340px] lg:max-h-[480px] overflow-y-auto">
              {/* Loading */}
              {isPending && (
                <div className="flex items-center justify-center gap-2 py-8 text-neutral-400">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <FiLoader size={14} />
                  </motion.div>
                  <span className="text-[11px] lg:text-[12px]">Searching...</span>
                </div>
              )}

              {/* Error */}
              {error && !isPending && (
                <p className="text-center text-[11px] lg:text-[12px] text-red-400 py-6 px-4">
                  {error}
                </p>
              )}

              {/* Empty state */}
              {!isPending && !error && hasSearched && results.length === 0 && (
                <div className="text-center py-8 px-4">
                  <p className="text-[11px] lg:text-[12px] text-neutral-400">
                    No products found for
                  </p>
                  <p className="text-[12px] lg:text-[13px] font-semibold text-[#111] mt-0.5">
                    "{query}"
                  </p>
                  {mode !== "hybrid" && (
                    <button
                      onClick={() => setMode("hybrid")}
                      className="mt-3 text-[10px] lg:text-[11px] text-[#b8502e] underline underline-offset-2 cursor-pointer"
                    >
                      Try Hybrid search instead
                    </button>
                  )}
                </div>
              )}

              {/* Results list */}
              {!isPending && !error && results.length > 0 && (
                <AnimatePresence initial={false}>
                  <div className="divide-y divide-[#f0ece4]">
                    {results.map((product, i) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.15, delay: i * 0.03 }}
                      >
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={handleClose}
                          className="flex gap-3 lg:gap-4 px-4 lg:px-5 py-3 lg:py-4 hover:bg-[#f0ece4] transition-colors group"
                        >
                          {/* Image */}
                          <div className="relative w-[46px] h-[56px] lg:w-[60px] lg:h-[72px] flex-shrink-0 rounded-md overflow-hidden bg-neutral-100">
                            {(() => {
                              const resolvedImage =
                                product.colorwayImage ?? product.image ?? null;
                              return resolvedImage ? (
                                <Image
                                  src={urlFor(resolvedImage)
                                    .width(120)
                                    .height(144)
                                    .url()}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                                  sizes="(min-width: 1024px) 60px, 46px"
                                />
                              ) : (
                                <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                                  <FiSearch
                                    size={14}
                                    className="text-neutral-400"
                                  />
                                </div>
                              );
                            })()}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] lg:text-[13px] font-medium text-[#111] truncate group-hover:text-[#b8502e] transition-colors">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              {product.brand && (
                                <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                  {product.brand}
                                </span>
                              )}
                              {product.brand && product.category && (
                                <span className="text-[9px] lg:text-[10px] text-neutral-300">
                                  ·
                                </span>
                              )}
                              {product.category && (
                                <span className="text-[9px] lg:text-[10px] text-neutral-400">
                                  {product.category}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] lg:text-[13px] font-semibold text-[#b8502e]">
                                ₱{product.price?.toLocaleString()}
                              </span>
                              {product.originalPrice &&
                                product.originalPrice > product.price && (
                                  <span className="text-[10px] lg:text-[11px] text-neutral-400 line-through">
                                    ₱{product.originalPrice?.toLocaleString()}
                                  </span>
                                )}
                              {product.status === "sale" || product.isOnSale ? (
                                <span className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest bg-[#b8502e] text-white px-1.5 py-0.5 rounded-full">
                                  Sale
                                </span>
                              ) : product.status === "new" || product.isNew ? (
                                <span className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest bg-[#111] text-white px-1.5 py-0.5 rounded-full">
                                  New
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}

              {/* Idle state */}
              {!isPending && !hasSearched && !query && (
                <div className="px-4 py-6 lg:py-8 text-center">
                  <p className="text-[11px] lg:text-[12px] text-neutral-400">
                    Type to search products, brands, or categories
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    {/* <TbSparkles size={11} className="text-[#b8502e]" /> */}
                    <span className="text-[9px] lg:text-[10px] text-neutral-400 uppercase tracking-widest font-medium">
                      AI-powered hybrid search
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {results.length > 0 && !isPending && (
              <div className="px-4 lg:px-5 py-2.5 lg:py-3 border-t border-[#e5e1da] flex items-center justify-between">
                <span className="text-[9px] lg:text-[10px] text-neutral-400 uppercase tracking-widest">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
                <Link
                  href={`/category/all?q=${encodeURIComponent(query)}`}
                  onClick={handleClose}
                  className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-[#b8502e] hover:underline underline-offset-2"
                >
                  View all →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}