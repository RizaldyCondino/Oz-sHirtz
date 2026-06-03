"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, ArrowLeft, PackageOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { getWishlist, removeFromWishlist } from "@/lib/actions/wishlist.actions";
import { Button } from "@/components/ui/button";
import PriceFormatter from "@/components/PriceFormatter";
import { cn } from "@/lib/utils";

type WishlistItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string | null;
  slug: string | null;
};

const WishlistPage = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();
  const [pendingRemove, setPendingRemove] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist();
        setItems(data as WishlistItem[]);
      } catch {
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();

    const handleUpdate = () => fetchWishlist();
    window.addEventListener("wishlist:updated", handleUpdate);
    return () => window.removeEventListener("wishlist:updated", handleUpdate);
  }, []);

  const handleRemove = (productId: string) => {
    setPendingRemove((prev) => new Set(prev).add(productId));

    startTransition(async () => {
      try {
        await removeFromWishlist(productId);
        setItems((prev) => prev.filter((item) => item.productId !== productId));
        window.dispatchEvent(new Event("wishlist:updated"));
        toast.success("Removed from wishlist");
      } catch {
        toast.error("Something went wrong");
      } finally {
        setPendingRemove((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      {/* Header */}
      <div className="">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-6 h-6 text-[#b8502e] fill-[#b8502e]" />
            <h1 className="text-2xl font-bold tracking-tight text-[#231F20]">
              My Wishlist
            </h1>
          </div>
          <p className="text-sm text-[#7A6F65] ml-9">
            {loading
              ? "Loading your saved items..."
              : items.length === 0
              ? "No items saved yet"
              : `${items.length} item${items.length === 1 ? "" : "s"} saved`}
          </p>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-[#7A6F65] hover:text-[#231F20] transition-colors mb-8 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#EDE6DC] animate-pulse"
              >
                <div className="aspect-[4/5] bg-[#EDE6DC]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[#EDE6DC] rounded w-3/4" />
                  <div className="h-4 bg-[#EDE6DC] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#F0EAE0] flex items-center justify-center mb-6">
              <PackageOpen className="w-9 h-9 text-[#B8A898]" />
            </div>
            <h2 className="text-xl font-semibold text-[#231F20] mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-[#7A6F65] max-w-xs mb-8">
              Save items you love by tapping the heart icon on any product.
            </p>
            <Link href="/category/all">
              <Button className="bg-[#231F20] text-white hover:bg-[#3D3635] cursor-pointer rounded-full px-8 py-2 text-sm font-medium transition-colors">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && items.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const isRemoving = pendingRemove.has(item.productId);
                const href = item.slug ? `/product/${item.slug}` : "#";

                return (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isRemoving ? 0.4 : 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-[#EDE6DC] hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={isRemoving}
                      aria-label="Remove from wishlist"
                      className={cn(
                        "absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm border border-[#EDE6DC] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:border-red-200",
                        isRemoving && "opacity-100 cursor-not-allowed"
                      )}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#9B6B6B] hover:text-red-500 transition-colors cursor-pointer" />
                    </button>

                    {/* Image */}
                    <Link href={href} className="block relative w-full aspect-[4/5] bg-[#F5F0EA] overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 33vw, 25vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-[#C9BDB0]" />
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="p-3">
                      <Link href={href}>
                        <h3 className="text-xs font-semibold text-[#231F20] truncate hover:underline underline-offset-2 transition-all">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <PriceFormatter
                          amount={item.price}
                          className="text-sm font-semibold text-[#5C5145]"
                        />
                        <Link href={href}>
                          <Button
                            size="sm"
                            className="h-7 text-[10px] px-3 rounded-full cursor-pointer bg-[#231F20] text-white hover:bg-[#3D3635] transition-colors font-medium"
                          >
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;