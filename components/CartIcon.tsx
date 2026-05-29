"use client";
import useStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";

const CartIcon = () => {
  const { items } = useStore();

  // ✅ Total quantity across all colorway+size combos
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="group relative">
      <ShoppingBag className="w-4 h-4 hover:text-[#111111] hoverEffect" />
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[9px] font-bold rounded-full flex items-center justify-center h-3 w-3">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;