"use client";
import useStore from "@/store";
import { ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import { useEffect, useRef } from "react";

const CartIcon = () => {
  const { items, cartOpen, setCartOpen, getTotalPrice } = useStore();
  const ref = useRef<HTMLDivElement>(null);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setCartOpen(!cartOpen)}
        className="relative group"
        aria-label="Cart"
      >
        <ShoppingBag className="w-4 h-4 mt-2 hover:text-[#111111] cursor-pointer" />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 mt-2 bg-[#111111] text-white text-[9px] font-bold rounded-full flex items-center justify-center h-3 w-3">
            {totalCount > 99 ? "99+" : totalCount}
          </span>
        )}
      </button>

      {cartOpen && (
        <div className="absolute  right-0 top-8 w-[300px]  bg-[#FAF8F4] border border-[#e5e1da] rounded-xl z-50 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e1da]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#111]">
              Your Bag
              <span className="ml-2 bg-[#111] text-white text-[8px] px-2 py-0.5 rounded-full font-medium">
                {totalCount} {totalCount === 1 ? "item" : "items"}
              </span>
            </span>
            <button onClick={() => setCartOpen(false)} aria-label="Close cart">
              <X
                size={13}
                className="text-neutral-400 cursor-pointer hover:text-black"
              />
            </button>
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <p className="text-center text-xs text-neutral-400 py-8">
              Your bag is empty
            </p>
          ) : (
            <div className="max-h-[320px] overflow-y-auto divide-y divide-[#f0ece4]">
              {items.slice(0, 3).map((item) => {
                const activeColorway = item.product.colorways?.find(
                  (c) => c.name === item.selectedColorway,
                );
                const displayImage =
                  activeColorway?.images?.[0] || item.product.images?.[0];

                return (
                  <div
                    key={`${item.product._id}-${item.selectedColorway}-${item.selectedSize}`}
                    className="flex gap-3 px-4 py-3"
                  >
                    {displayImage && (
                      <div className="relative w-[46px] h-[56px] flex-shrink-0 rounded-md overflow-hidden bg-neutral-100">
                        <Image
                          src={urlFor(displayImage).url()}
                          alt={item.product.name ?? ""}
                          fill
                          className="object-cover"
                          sizes="46px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#111] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        {item.selectedColorway} / {item.selectedSize}
                      </p>
                      <PriceFormatter
                        amount={(item.product.price ?? 0) * item.quantity}
                        className="text-[11px] font-semibold text-[#8C6227] mt-1 block"
                      />
                      <div className="mt-1.5">
                        <QuantityButtons
                          product={item.product}
                          colorwayOverride={item.selectedColorway}
                          sizeOverride={item.selectedSize}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-4 py-3 border-t border-[#e5e1da]">
              {items.length > 5 && (
                <p className="text-[10px] text-neutral-400 text-center mb-2">
                  +{items.length - 5} more item{items.length - 5 > 1 ? "s" : ""}{" "}
                  in your bag
                </p>
              )}
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                  Total
                </span>
                <PriceFormatter
                  amount={getTotalPrice()}
                  className="text-sm font-semibold text-[#111]"
                />
              </div>
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="block w-full text-center bg-[#111111] text-white text-[10px] font-semibold uppercase tracking-widest rounded-full py-2.5 hover:bg-[#111]/80 transition"
              >
                View Cart ({totalCount} {totalCount === 1 ? "item" : "items"})
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartIcon;
