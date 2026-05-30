"use client";

import React, { useEffect, useState, useTransition } from "react";
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
  className?: string;
  /** "icon" = just the heart icon button (default), "full" = with label */
  variant?: "icon" | "full";
  size?: number;
}

const FavoriteButton = ({
  product,
  className,
  variant = "icon",
  size = 14,
}: FavoriteButtonProps) => {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const [favorited, setFavorited] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState(false);

  // Check initial wishlist state
  useEffect(() => {
    if (!isSignedIn) {
      setFavorited(false);
      setChecked(true);
      return;
    }
    isInWishlist(product._id)
      .then((val) => setFavorited(val))
      .finally(() => setChecked(true));
  }, [product._id, isSignedIn]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const next = !favorited;
    setFavorited(next); // optimistic

   startTransition(async () => {
  try {
    if (next) {
      await addToWishlist({
        productId: product._id,
        name: product.name ?? "",
        price: product.price ?? 0,
        image: product.images?.[0] ? urlFor(product.images[0]).url() : undefined,
        slug: product.slug?.current,
      });
      toast.success("Added to wishlist ♥");
    } else {
      await removeFromWishlist(product._id);
      toast.success("Removed from wishlist");
    }
    // 👇 notify WishlistIcon to re-fetch count
    window.dispatchEvent(new Event("wishlist:updated"));
  } catch {
    setFavorited(!next); // revert on error
    toast.error("Something went wrong");
  }
});
  };

  if (!checked) return null; // avoid hydration flicker

  if (variant === "full") {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "text-xs uppercase font-semibold rounded-full h-9 cursor-pointer border-neutral-300 hover:border-black/80 hover:text-black whitespace-nowrap transition-colors",
          favorited && "border-red-400 text-red-500 hover:border-red-500 hover:text-red-600",
          className
        )}
      >
        <Heart
          size={size}
          className={cn(
            "transition-all",
            favorited ? "fill-red-500 text-red-500" : "text-black"
          )}
        />
        <span className="ml-1">{favorited ? "Saved" : "Save"}</span>
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
        "text-xs uppercase font-semibold rounded-full h-9 w-9 p-0 cursor-pointer border-neutral-300 hover:border-black/80 transition-colors",
        favorited && "border-red-400 hover:border-red-500",
        className
      )}
    >
      <Heart
        size={size}
        className={cn(
          "transition-all",
          favorited ? "fill-red-500 text-red-500" : "text-black"
        )}
      />
    </Button>
  );
};

export default FavoriteButton;