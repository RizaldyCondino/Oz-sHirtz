"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { getWishlist } from "@/lib/actions/wishlist.actions";

const WishlistIcon = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setCount(0);
      return;
    }
    try {
      const wishlist = await getWishlist();
      setCount(wishlist?.items?.length ?? 0);
    } catch (error) {
      console.error("[WishlistIcon] Failed to fetch wishlist count:", error);
      setCount(0);
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  useEffect(() => {
    window.addEventListener("wishlist:updated", fetchCount);
    return () => window.removeEventListener("wishlist:updated", fetchCount);
  }, [fetchCount]);

  return (
    <Link href="/wishlist" className="group relative">
      <Heart className="w-4 h-4 hover:text-[#111111] hoverEffect" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[9px] font-bold rounded-full flex items-center justify-center h-3 w-3">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
};

export default WishlistIcon;