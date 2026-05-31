"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getWishlistCount } from "@/lib/actions/wishlist.actions";
import { cn } from "@/lib/utils";

const CACHE_KEY = "wishlist_count";

interface WishlistIconProps {
  className?: string;
  isSignedIn?: boolean;
}

const WishlistIcon = ({ className, isSignedIn }: WishlistIconProps) => {
  // Always 0 on server — no hydration mismatch
  const [count, setCount] = useState(0);

  const fetchAndCache = async () => {
    try {
      const c = await getWishlistCount();
      setCount(c);
      if (c > 0) {
        localStorage.setItem(CACHE_KEY, String(c));
      } else {
        localStorage.removeItem(CACHE_KEY);
      }
    } catch {
      // keep current value
    }
  };

  useEffect(() => {
    // Read localStorage AFTER hydration to avoid SSR mismatch
    const cached = Number(localStorage.getItem(CACHE_KEY) ?? 0);
    if (cached > 0) setCount(cached);

    // Then fetch the real value from server
    fetchAndCache();

    window.addEventListener("wishlist:updated", fetchAndCache);
    return () => window.removeEventListener("wishlist:updated", fetchAndCache);
  }, []);

  useEffect(() => {
    if (isSignedIn === false) {
      setCount(0);
      localStorage.removeItem(CACHE_KEY);
    }
  }, [isSignedIn]);

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist${count > 0 ? ` (${count} items)` : ""}`}
      className={cn(
        "relative inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#F0EAE0] transition-colors duration-200",
        className
      )}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-colors duration-200",
          count > 0 ? "fill-red-400 text-red-400" : "text-[#231F20]"
        )}
      />

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};

export default WishlistIcon;