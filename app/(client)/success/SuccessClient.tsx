// SuccessClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useStore from "@/store";
import { getOrderByNumber } from "@/actions/getOrderByNumber";

type OrderItem = {
  id: string;
  name: string;
  colorway: string;
  size: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  totalAmount: number;
  discountAmount: number;
  items: OrderItem[];
};

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetCart } = useStore();

  const orderNumber = searchParams.get("orderNumber");
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderNumber || !sessionId) {
      router.replace("/");
      return;
    }

    resetCart();

    getOrderByNumber(orderNumber).then((data) => {
      setOrder(data as Order | null);
      setLoading(false);
    });
  }, [orderNumber, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#8C6227]" size={32} />
      </div>
    );
  }

  const hasDiscount = order && order.discountAmount > 0;

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#8C6227]/10 p-8 sm:p-12 max-w-md w-full text-center shadow-sm">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-50 p-4">
            <CheckCircle className="text-green-500" size={48} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-black mb-2">
          Order Confirmed!
        </h1>
        <p className="text-neutral-500 text-sm mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <Separator className="mb-6" />

        {/* Order details */}
        <div className="bg-[#FAF8F4] rounded-xl p-4 mb-4 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Order number</span>
            <span className="font-medium text-black">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Status</span>
            <span className="font-medium text-green-600">Confirmed</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Payment</span>
            <span className="font-medium text-green-600">Paid</span>
          </div>

          {/* Discount summary */}
          {hasDiscount && (
            <>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium text-black">
                  ₱{(order.totalAmount + order.discountAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <Tag size={13} />
                  Discount applied
                </span>
                <span className="font-medium text-green-600">
                  −₱{order.discountAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-neutral-100 pt-2">
                <span className="text-black">Total paid</span>
                <span className="text-black">${order.totalAmount.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Per-item colorway breakdown */}
        {order && order.items.length > 0 && (
          <div className="mb-6 text-left space-y-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
              Items
            </p>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start bg-[#FAF8F4] rounded-xl px-4 py-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-black leading-tight">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.colorway && (
                      <span className="text-xs bg-[#8C6227]/10 text-[#8C6227] rounded-full px-2 py-0.5 font-medium">
                        {item.colorway}
                      </span>
                    )}
                    {item.size && (
                      <span className="text-xs text-neutral-400">
                        Size: {item.size}
                      </span>
                    )}
                    <span className="text-xs text-neutral-400">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-black shrink-0 ml-4">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="flex items-start gap-3 bg-[#8C6227]/5 rounded-xl p-4 mb-6 text-left">
          <Package className="text-[#8C6227] shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-neutral-600">
            You will receive a confirmation email shortly. You can track your
            order status in your orders page.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="w-full bg-[#111111] hover:bg-[#111111]/80 hoverEffect text-white rounded-full"
          >
            <Link href="/orders">
              View My Orders <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full border-[#8C6227]/20 hoverEffect text-[#8C6227] hover:bg-[#8C6227]/5"
          >
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}