"use client";
import useStore from "@/store";
import { ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

const CartIcon = () => {
  const { items, cartOpen, setCartOpen, getTotalPrice } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isCartPage = pathname === "/cart";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const discountedTotal = items.reduce((sum, item) => {
    const cw = item.product.colorways?.find(
      (c) => c.name === item.selectedColorway
    );
    const sz = cw?.sizes?.find((s) => s.size === item.selectedSize);
    const base = sz?.price ?? cw?.price ?? item.product.price ?? 0;
    const disc = cw?.discount ?? item.product.discount ?? 0;
    const unit = disc > 0 ? base - (base * disc) / 100 : base;
    return sum + unit * item.quantity;
  }, 0);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          if (!isCartPage) setCartOpen(!cartOpen);
        }}
        className="relative group"
        aria-label="Cart"
      >
        <ShoppingBag className="w-4 h-4 mt-2 hover:text-[#111111] cursor-pointer" />
        <AnimatePresence>
          {totalCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute -top-1 -right-1 mt-1.5 bg-[#111111] text-white text-[10px] font-bold rounded-full flex items-center justify-center h-4 w-4"
            >
              {totalCount > 99 ? "99+" : totalCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {cartOpen && !isCartPage && (
          <motion.div
            key="cart-dropdown"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ originX: 1, originY: 0 }}
            className="absolute right-0 top-8 w-[320px] bg-[#FAF8F4] border border-[#e5e1da] rounded-xl z-50 overflow-hidden shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e1da]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b8502e]">
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
                <AnimatePresence initial={false}>
                  {items.slice(0, 3).map((item) => {
                    const activeColorway = item.product.colorways?.find(
                      (c) => c.name === item.selectedColorway
                    );
                    const displayImage =
                      activeColorway?.images?.[0] || item.product.images?.[0];

                    const activeSize = activeColorway?.sizes?.find(
                      (s) => s.size === item.selectedSize
                    );

                    const basePrice =
                      activeSize?.price ??
                      activeColorway?.price ??
                      item.product.price ??
                      0;

                    const activeDiscount =
                      activeColorway?.discount ??
                      item.product.discount ??
                      0;

                    const unitPrice =
                      activeDiscount > 0
                        ? basePrice - (basePrice * activeDiscount) / 100
                        : basePrice;

                    const lineTotal = unitPrice * item.quantity;

                    return (
                      <motion.div
                        key={`${item.product._id}-${item.selectedColorway}-${item.selectedSize}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: 12,
                          height: 0,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex gap-3 px-4 py-3"
                      >
                        {displayImage && (
                          <Link
                            href={`/product/${item.product.slug?.current ?? item.product._id}`}
                            onClick={() => setCartOpen(false)}
                            className="relative w-[60px] h-[72px] lg:w-[60px] lg:h-[72px] flex-shrink-0 rounded-md overflow-hidden bg-neutral-100 block"
                          >
                            <Image
                              src={urlFor(displayImage).url()}
                              alt={item.product.name ?? ""}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-200"
                              sizes="46px"
                            />
                          </Link>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-[#111] truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">
                            {item.selectedColorway} / {item.selectedSize}
                          </p>

                          {activeDiscount > 0 ? (
                            <div className="flex items-center gap-1.5 mt-1">
                              <PriceFormatter
                                amount={lineTotal}
                                className="text-[11px] font-semibold text-[#b8502e] block"
                              />
                              <PriceFormatter
                                amount={basePrice * item.quantity}
                                className="text-[10px] line-through text-neutral-400 block"
                              />
                              <span className="text-[9px] font-bold text-[#b8502e]/70">
                                -{activeDiscount}%
                              </span>
                            </div>
                          ) : (
                            <PriceFormatter
                              amount={lineTotal}
                              className="text-[11px] font-semibold text-[#b8502e] mt-1 block"
                            />
                          )}

                          <div className="mt-1.5">
                            <QuantityButtons
                              product={item.product}
                              colorwayOverride={item.selectedColorway}
                              sizeOverride={item.selectedSize}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-4 py-3 border-t border-[#e5e1da]">
                {items.length > 3 && (
                  <p className="text-[10px] text-neutral-400 text-center mb-2">
                    +{items.length - 3} more item{items.length - 3 > 1 ? "s" : ""}{" "}
                    in your bag
                  </p>
                )}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Total
                  </span>
                  <PriceFormatter
                    amount={discountedTotal}
                    className="text-sm font-semibold text-[#b8502e]"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartIcon;