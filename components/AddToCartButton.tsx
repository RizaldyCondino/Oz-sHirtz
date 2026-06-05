"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/sanity/lib/queries/query";
import { cn } from "@/lib/utils";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

interface Props {
  product: Product;
  className?: string;
  disableCartOpen?: boolean;
  discountedUnitPrice?: number;
}

const AddToCartButton = ({
  product,
  className,
  disableCartOpen,
  discountedUnitPrice, // ✅ from prop
}: Props) => {
  const {
    addItem,
    getItemCount,
    setCartOpen,
    getStockForSelection,
    selectedColorway,
    selectedSize,
  } = useStore();

  const colorway = selectedColorway ?? "";
  const size = selectedSize ?? "";
  const itemCount = getItemCount(product?._id, colorway, size);

  const hasSelection = !!selectedColorway && !!selectedSize;

  const currentStock = hasSelection ? getStockForSelection(product) : Infinity;
  const isOutOfStock = hasSelection && currentStock === 0;
  const isAtStockLimit = hasSelection && itemCount >= currentStock;
  const isButtonDisabled = isOutOfStock || isAtStockLimit;

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleAddToCart = () => {
    if (!hasSelection) {
      toast.error("Please select a color and size first");
      return;
    }
    if (isAtStockLimit) {
      toast.error("Cannot add more than available stock");
      return;
    }
    addItem(product);
    if (!disableCartOpen) setCartOpen(true);
    toast.success(`${product?.name?.substring(0, 12)}... added successfully!`);
  };

  const activeColorway = product?.colorways?.find(
    (c) => c.name === selectedColorway,
  );
  const activeSizeConfig = activeColorway?.sizes?.find(
    (s) => s.size === selectedSize,
  );
  const unitPrice =
    activeSizeConfig?.price ?? activeColorway?.price ?? product?.price ?? 0;

  const buttonLabel = isOutOfStock
    ? "Out of Stock"
    : !hasSelection
      ? "Select Options"
      : isAtStockLimit
        ? "Max Stock Reached"
        : "Add to Cart";

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#111111]">
              Quantity
            </span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex justify-between border-t border-[#111111]/20 pt-1">
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#111111]">
              Subtotal
            </span>
            <div className="flex items-center gap-1.5">
              {discountedUnitPrice && discountedUnitPrice < unitPrice && (
                <PriceFormatter
                  amount={unitPrice * itemCount}
                  className="text-[11px] line-through text-neutral-400"
                />
              )}
              <PriceFormatter
                amount={(discountedUnitPrice ?? unitPrice) * itemCount}
                className="text-[14px] font-bold text-[#b8502e]"
              />
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isButtonDisabled}
          aria-label={buttonLabel}
          className={cn(
            "w-full h-11 rounded-full font-bold tracking-wider text-[12px] uppercase shadow-none border transition-all duration-200",
            hasSelection &&
              !isOutOfStock &&
              !isAtStockLimit &&
              "bg-[#111111] border-[#111111]/20 text-white hover:bg-[#333333]",
            !hasSelection &&
              "bg-[#111111] border-[#111111]/20 text-white hover:bg-neutral-100 cursor-pointer",
            isAtStockLimit &&
              "bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed",
            isOutOfStock &&
              "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed",
            className,
          )}
        >
          <ShoppingBag size={13} className="mr-1.5" />
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;