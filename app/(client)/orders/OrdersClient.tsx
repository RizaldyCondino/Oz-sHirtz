"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cancelOrder } from "@/lib/actions/order.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PriceFormatter from "@/components/PriceFormatter";
import {
  Package,
  MapPin,
  ChevronDown,
  ChevronUp,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

type Order = Awaited<ReturnType<typeof import("@/lib/actions/order.actions").getOrders>>[number];

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-purple-50 text-purple-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const PAYMENT_STYLES: Record<string, string> = {
  PAID: "bg-green-50 text-green-700",
  UNPAID: "bg-red-50 text-red-700",
  PARTIAL: "bg-yellow-50 text-yellow-700",
};

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

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
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-[#8C6227]/10 p-6">
          <Package className="text-[#8C6227]" size={40} />
        </div>
        <h2 className="text-xl font-semibold text-black">No orders yet</h2>
        <p className="text-neutral-500 text-sm">
          Your orders will appear here once you place one.
        </p>
        <Button asChild className="rounded-full bg-[#111111] hover:bg-[#111111]/80 text-white mt-2">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-black mb-6">My Orders</h1>

        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;

            return (
              <Card key={order.id} className="border-[#8C6227]/10 overflow-hidden">
                {/* Order Header */}
                <CardHeader
                  className="cursor-pointer hover:bg-neutral-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-semibold text-black">
                        {order.notes ?? order.id}
                      </CardTitle>
                      <p className="text-xs text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${PAYMENT_STYLES[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-neutral-400" />
                      ) : (
                        <ChevronDown size={16} className="text-neutral-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Expanded Content */}
                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    <Separator />

                    {/* Items */}
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3 items-start">
                          {item.image ? (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#8C6227]/10">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-neutral-100 shrink-0 flex items-center justify-center">
                              <Package size={20} className="text-neutral-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {[
                                item.colorway && `Color: ${item.colorway}`,
                                item.size && `Size: ${item.size}`,
                                `Qty: ${item.quantity}`,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </div>
                          <PriceFormatter
                            amount={item.price * item.quantity}
                            className="text-sm font-semibold text-[#8C6227] shrink-0"
                          />
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Address */}
                    {order.address && (
                      <div className="flex items-start gap-2 text-sm text-neutral-600">
                        <MapPin size={14} className="shrink-0 mt-0.5 text-[#8C6227]" />
                        <p>
                          {order.address.address}, {order.address.city},{" "}
                          {order.address.state} {order.address.zip}
                        </p>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-500">
                        {order.paymentMethod} ·{" "}
                        {order.discountAmount > 0 && (
                          <span className="text-red-500">
                            -<PriceFormatter amount={order.discountAmount} /> off
                          </span>
                        )}
                      </span>
                      <div className="text-right">
                        <p className="text-xs text-neutral-500">Total</p>
                        <PriceFormatter
                          amount={order.totalAmount}
                          className="font-bold text-[#8C6227] text-lg"
                        />
                      </div>
                    </div>

                    {/* Cancel button */}
                    {order.status === "PENDING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                        disabled={cancellingId === order.id}
                        onClick={() => handleCancel(order.id)}
                      >
                        <XCircle size={14} className="mr-2" />
                        {cancellingId === order.id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </Button>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}