"use client";
import useStore from "@/store";
import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Product } from "@/sanity/lib/queries/query";

interface Props {
  product: Product;
  className?: string;
}

const QuantityButtons = ({ product, className }: Props) => {
  const {
    addItem,
    removeItem,
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

  const handleRemoveProduct = () => {
    removeItem(product?._id, colorway, size);
    if (itemCount > 1) {
      toast.success("Quantity decreased successfully");
    } else {
      toast.success(`${product?.name?.substring(0, 12)} removed successfully!`);
    }
  };

  const handleAddToCart = () => {
    if (!hasSelection) {
      toast.error("Please select a color and size first");
      return;
    }
    if (currentStock > itemCount) {
      addItem(product);
      toast.success("Quantity increased successfully");
    } else {
      toast.error("Cannot add more than available stock");
    }
  };

  return (
    <div className={cn("flex items-center gap-2 pb-1 text-base", className)}>
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || isOutOfStock}
        className="w-6 h-6 border-neutral-800 bg-black text-white hover:bg-neutral-800 hover:text-white"
      >
        <Minus size={12} />
      </Button>

      <span className="font-semibold text-sm w-4 text-center text-black">
        {itemCount}
      </span>

      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={isOutOfStock || !hasSelection}
        className="w-6 h-6 border-neutral-800 bg-black text-white hover:bg-neutral-800 hover:text-white"
      >
        <Plus size={12} />
      </Button>
    </div>
  );
};

export default QuantityButtons;