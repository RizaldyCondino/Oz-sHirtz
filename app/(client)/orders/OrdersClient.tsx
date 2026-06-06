"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cancelOrder } from "@/lib/actions/order.actions";
import {
  Package, MapPin, ChevronDown, XCircle,
  ShoppingBag, ArrowRight, ReceiptText, Tag, ArrowUpDown,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { STATUS_CONFIG, PAYMENT_CONFIG } from "@/constants/data";
import Pagination from "@/components/Paginations";

type Order = Awaited<
  ReturnType<typeof import("@/lib/actions/order.actions").getOrders>
>[number];

const fmt = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

type SortOption = "date-desc" | "date-asc" | "total-desc" | "total-asc";

const ORDERS_PER_PAGE = 5;

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedOrders = [...orders].sort((a, b) => {
    switch (sort) {
      case "date-desc":  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "date-asc":   return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "total-desc": return b.totalAmount - a.totalAmount;
      case "total-asc":  return a.totalAmount - b.totalAmount;
      default: return 0;
    }
  });

  const totalPages = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handleSortChange = (v: string) => {
    setSort(v as SortOption);
    setCurrentPage(1); // reset to page 1 on sort change
  };

  const handleCancel = async (orderId: string) => {
    setCancellingId(orderId);
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled");
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-[#111]/5 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-[#111]/30" />
          </div>
          <h2 className="text-2xl font-semibold text-[#111] tracking-tight mb-2">No orders yet</h2>
          <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
            When you place an order, it&apos;ll show up here so you can track its progress.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#111] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-[#111]/80 transition-colors"
          >
            Start Shopping <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <div className="bg-[#FAF8F4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1">Account</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#111]">Order History</h1>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-neutral-400">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </p>
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[200px] h-8 text-[11px] gap-1.5 text-black font-semibold hoverEffect cursor-pointer shadow-xs  border-none hover:bg-white/50 bg-white rounded-md px-3  focus:ring-0">
                <ArrowUpDown size={11} className="text-neutral-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" className="text-xs">
                <SelectItem value="date-desc">Newest first</SelectItem>
                <SelectItem value="date-asc">Oldest first</SelectItem>
                <SelectItem value="total-desc">Highest total</SelectItem>
                <SelectItem value="total-asc">Lowest total</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6  space-y-3">
        {paginatedOrders.map((order) => {
          const isExpanded = expandedId === order.id;
          const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
          const payment = PAYMENT_CONFIG[order.paymentStatus] ?? PAYMENT_CONFIG.UNPAID;
          const previewItems = order.items.slice(0, 3);

          const subtotal = order.items.reduce(
  (sum: number, item: any) => sum + (item.originalPrice ?? item.price) * item.quantity,
  0
);
          const hasDiscount = order.discountAmount > 0 || subtotal > order.totalAmount;
          const discountDisplay = hasDiscount ? subtotal - order.totalAmount : 0;

          return (
            <div
              key={order.id}
              className="bg-white border border-[#111]/6 rounded-2xl overflow-hidden transition-shadow hover:shadow-sm"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
              >
                <div className="flex -space-x-2 shrink-0">
                  {previewItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-white bg-neutral-100"
                      style={{ zIndex: previewItems.length - idx }}
                    >
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={14} className="text-neutral-300" />
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div
                      className="relative w-11 h-11 rounded-xl bg-neutral-100 border-2 border-white flex items-center justify-center"
                      style={{ zIndex: 0 }}
                    >
                      <span className="text-[10px] font-semibold text-neutral-400">
                        +{order.items.length - 3}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-mono text-neutral-400 truncate">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    {order.notes && (
                      <p className="text-xs text-neutral-500 truncate hidden sm:block">
                        · {order.notes}
                      </p>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      <span className={`text-[11px] font-medium ${status.color}`}>{status.label}</span>
                    </div>
                    <span className={`text-[10px] font-medium ${payment.color}`}>{payment.label}</span>
                  </div>
                  <span className="text-sm font-bold text-[#b8502e]">{fmt(order.totalAmount)}</span>
                  <ChevronDown
                    size={15}
                    className={`text-neutral-300 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              <div className="sm:hidden flex items-center gap-3 px-6 pb-4 -mt-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  <span className={`text-[11px] font-medium ${status.color}`}>{status.label}</span>
                </div>
                <span className="text-neutral-200">·</span>
                <span className={`text-[11px] font-medium ${payment.color}`}>{payment.label}</span>
              </div>

              {isExpanded && (
                <div className="border-t border-[#111]/6 px-6 py-5 space-y-5 bg-[#FAFAF9]">
                  <div className="space-y-4">
                    {order.items.map((item) => {
                      const originalPrice = (item as any).originalPrice as number | null;
                      const isDiscounted = originalPrice && originalPrice > item.price;

                      return (
                        <div key={item.id} className="flex gap-4 items-start">
                          <div className="relative w-[60px] h-[72px] rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-[#111]/5">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={18} className="text-neutral-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="text-sm font-medium text-[#111] line-clamp-1">{item.name}</p>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {item.colorway && (
                                <span className="text-[10px] bg-[#8C6227]/10 text-[#8C6227] px-2 py-0.5 rounded-full font-medium">
                                  {item.colorway}
                                </span>
                              )}
                              {item.size && (
                                <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                                  Size {item.size}
                                </span>
                              )}
                              <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                                Qty {item.quantity}
                              </span>
                              {isDiscounted && (
                                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                                  <Tag size={9} />
                                  {Math.round((1 - item.price / originalPrice!) * 100)}% off
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0 pt-0.5 space-y-0.5">
                            {isDiscounted && (
                              <p className="text-[11px] text-neutral-400 line-through">
                                {fmt(originalPrice! * item.quantity)}
                              </p>
                            )}
                            <p className="text-sm font-semibold text-[#b8502e]">
                              {fmt(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-[#111]/6" />

                  <div className="space-y-1.5">
                    {hasDiscount && (
                      <>
                        <div className="flex justify-between text-xs text-neutral-500">
                          <span>Subtotal</span>
                          <span>{fmt(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-green-600 font-medium">
                          <span className="flex items-center gap-1"><Tag size={11} /> Discount</span>
                          <span>−{fmt(discountDisplay)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-sm font-bold text-[#111] pt-1 border-t border-[#111]/6">
                      <span>Total paid</span>
                      <span className="text-[#b8502e]">{fmt(order.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="border-t border-[#111]/6" />

                  <div className="space-y-2">
                    {order.address && (
                      <div className="flex items-start gap-2 text-xs text-neutral-500">
                        <MapPin size={12} className="shrink-0 mt-0.5 text-neutral-400" />
                        <p>
                          {order.address.address}, {order.address.city},{" "}
                          {order.address.state} {order.address.zip}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-neutral-400 capitalize">{order.paymentMethod}</p>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {order.stripeReceiptUrl ? (
                      <a
                        href={order.stripeReceiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-[#b8502e] hover:text-[#111] transition-colors"
                      >
                        <ReceiptText size={13} /> View Receipt
                      </a>
                    ) : (
                      <div />
                    )}

                    {order.status === "PENDING" && (
                      <button
                        disabled={cancellingId === order.id}
                        onClick={() => handleCancel(order.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={13} />
                        {cancellingId === order.id ? "Cancelling…" : "Cancel this order"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            setExpandedId(null); // collapse any open order when changing pages
          }}
        />
      </div>
    </div>
  );
}