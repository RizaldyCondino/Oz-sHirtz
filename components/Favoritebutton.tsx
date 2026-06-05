"use client";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/actions/wishlist.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

interface FavoriteButtonProps {
  product: {
    _id: string;
    name?: string;
    price?: number;
    images?: any[];
    slug?: { current?: string };
  };
  resolvedImage?: string;  // ← added
  className?: string;
  variant?: "icon" | "full";
  size?: number;
}

const FavoriteButton = ({
  product,
  resolvedImage,  // ← added
  className,
  variant = "icon",
  size = 14,
}: FavoriteButtonProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();

  const [favorited, setFavorited] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState(false);

  const updateFavoritedState = useCallback(async () => {
    if (!isLoaded) {
      setChecked(false);
      return;
    }

    if (!isSignedIn) {
      setFavorited(false);
      setChecked(true);
      return;
    }

    try {
      const val = await isInWishlist(product._id);
      setFavorited(val);
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
      setFavorited(false);
    } finally {
      setChecked(true);
    }
  }, [isLoaded, isSignedIn, product._id]);

  useEffect(() => {
    updateFavoritedState();
  }, [updateFavoritedState]);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      updateFavoritedState();
    };

    window.addEventListener("wishlist:updated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlist:updated", handleWishlistUpdate);
  }, [updateFavoritedState]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const next = !favorited;
    setFavorited(next);

    startTransition(async () => {
      try {
        if (next) {
          await addToWishlist({
            productId: product._id,
            name: product.name ?? "",
            price: product.price ?? 0,
            // resolvedImage (from cart) takes priority, falls back to urlFor (product page)
            image: resolvedImage ?? (product.images?.[0] ? urlFor(product.images[0]).url() : undefined),
            slug: product.slug?.current,
          });
          toast.success("Added to wishlist ♥");
        } else {
          await removeFromWishlist(product._id);
          toast.success("Removed from wishlist");
        }
        window.dispatchEvent(new Event("wishlist:updated"));
      } catch {
        setFavorited(!next);
        toast.error("Something went wrong");
      }
    });
  };

  if (!checked) return null;

  if (variant === "full") {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "text-[12px] tracking-wider uppercase font-bold rounded-full h-11 cursor-pointer bg-white border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white whitespace-nowrap transition-colors",
          favorited && "bg-[#111111] text-white border-[#111111] hover:bg-[#333333]",
          className
        )}
      >
        <Heart
          size={size}
          className={cn("transition-all", favorited ? "fill-white text-white" : "text-[#111111]")}
        />
        <span className="ml-1">{favorited ? "Saved" : "Add to Favorite"}</span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "text-[12px] uppercase font-semibold rounded-full h-11 w-9 p-0 cursor-pointer border-neutral-300 hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-colors",
        favorited && "bg-[#111111] border-[#111111] text-white hover:bg-[#333333]",
        className
      )}
    >
      <Heart
        size={size}
        className={cn("transition-all", favorited ? "fill-white text-white" : "text-[#111111]")}
      />
    </Button>
  );
};

export default FavoriteButton;