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
}

const AddToCartButton = ({ product, className }: Props) => {
  const {
    addItem,
    getItemCount,
    getStockForSelection,
    selectedColorway,
    selectedSize,
  } = useStore();

  const colorway = selectedColorway ?? "";
  const size = selectedSize ?? "";
  const itemCount = getItemCount(product?._id, colorway, size);
  const currentStock = getStockForSelection(product);
  const hasSelection = !!selectedColorway && !!selectedSize;
  const isOutOfStock = currentStock === 0;

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
    if (currentStock > itemCount) {
      addItem(product);
      toast.success(`${product?.name?.substring(0, 12)}... added successfully!`);
    } else {
      toast.error("Cannot add more than available stock");
    }
  };

  const activeColorway = product?.colorways?.find(
    (c) => c.name === selectedColorway
  );
  const activeSizeConfig = activeColorway?.sizes?.find(
    (s) => s.size === selectedSize
  );
  const unitPrice =
    activeSizeConfig?.price ??
    activeColorway?.price ??
    product?.price ??
    0;

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#111111]/80 font-mono uppercase tracking-wider">
              Quantity
            </span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex justify-between border-t border-[#111111]/20 pt-1">
            <span className="text-xs font-semibold text-[#111111] uppercase tracking-wider font-mono">
              Subtotal
            </span>
            <PriceFormatter
              amount={unitPrice * itemCount}
              className="text-xs font-bold text-[#111111]"
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || !hasSelection}
          className={cn(
            // base
            "w-full h-9 rounded-full font-semibold text-[10px] uppercase tracking-wide shadow-none border transition-all duration-200",
            // enabled state — matches ProductClient's gold theme
            !isOutOfStock && hasSelection &&
              "bg-[#111111] border-[#111111] text-white hover:bg-[#111111] hover:border-[#1111111]",
            // select options state
            !isOutOfStock && !hasSelection &&
              "bg-[#8C6227]/10 border-[#8C6227]/30 text-[#111111] hover:bg-[#8C6227]/20",
            // out of stock state
            isOutOfStock &&
              "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed",
            className
          )}
        >
          <ShoppingBag size={13} className="mr-1.5" />
          {isOutOfStock
            ? "Out of Stock"
            : !hasSelection
            ? "Select Options"
            : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;