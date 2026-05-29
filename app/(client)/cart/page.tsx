"use client";

import React, { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { getAddresses } from "@/lib/actions/address.actions";
import { createOrder } from "@/lib/actions/order.actions";

import useStore from "@/store";
import { Heart, ShoppingBag, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import EmptyCart from "@/components/EmptyCart";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import AddressModal from "@/components/AddressModal";

const CartPage = () => {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const {
    deleteCartProduct,
    getTotalPrice,
    getSubTotalPrice,
    resetCart,
    getGroupedItems,
    getItemCount,
  } = useStore();

  const groupedItems = getGroupedItems();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
      const defaultAddr = data.find((addr: any) => addr.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
      else if (data.length > 0) setSelectedAddress(data[0]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isSignedIn) fetchAddresses();
    else {
      setAddresses([]);
      setSelectedAddress(null);
    }
  }, [isSignedIn]);

  const handleCheckout = async () => {
    if (!isSignedIn) {
      openSignIn({ redirectUrl: "/cart" });
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        addressId: selectedAddress.id,
        totalAmount: getTotalPrice(),
        discountAmount: getSubTotalPrice() - getTotalPrice(),
        paymentMethod: "COD" as const,
        notes: "",
        items: groupedItems.map(({ product, selectedColorway, selectedSize }) => {
          const quantity = getItemCount(product._id, selectedColorway, selectedSize);
          return {
            productId: product._id,
            name: product.name ?? "",
            price: product.price ?? 0,
            image: product.images?.[0] ? urlFor(product.images[0]).url() : "",
            colorway: selectedColorway || "",
            size: selectedSize || "",
            quantity,
          };
        }),
      };

      const order = await createOrder(orderData);
      toast.success("Order placed successfully!");
      resetCart();
      window.location.href = `/orders/${order.id}`;
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="bg-[#FAF8F4] mt-10 pb-52 md:pb-10 min-h-screen">
      {groupedItems?.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          {/* <div className="flex items-center gap-3 py-6">
            <ShoppingBag className="text-[#8C6227]" size={28} />
            <h1 className="text-2xl md:text-3xl font-semibold">Shopping Cart</h1>
          </div> */}

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-[#8C6227]/10 overflow-hidden">
                {groupedItems.map(({ product, selectedColorway, selectedSize }) => {
                  const quantity = getItemCount(product._id, selectedColorway, selectedSize);
                  const activeColorway = product.colorways?.find(
                    (c: any) => c.name === selectedColorway
                  );
                  const displayImage = activeColorway?.images?.[0] || product.images?.[0];

                  return (
                    <div
                      key={`${product._id}-${selectedColorway}-${selectedSize}`}
                      className="flex gap-4 p-4 sm:p-6 border-b border-[#8C6227]/10 last:border-0"
                    >
                      {/* Product Image - Fixed larger size, no shrinking */}
                      <Link href={`/product/${product.slug?.current}`} className="flex-shrink-0">
                        <div className="relative w-[150px] h-[150px] sm:w-[150px] sm:h-[150px]">
                          <Image
                            src={urlFor(displayImage).url()}
                            alt={product.name ?? "Product"}
                            fill
                            sizes="(max-width: 640px) 130px, 150px"
                            className="rounded-xl object-cover"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base font-medium sm:text-lg line-clamp-2 pr-6 text-black">
                          {product.name}
                        </h3>

                        <p className="text-sm text-neutral-600 mt-1.5">
                          Color: <span className="font-medium">{selectedColorway}</span> •{" "}
                          Size: <span className="font-medium">{selectedSize}</span>
                        </p>

                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <QuantityButtons
                            product={product}
                            colorwayOverride={selectedColorway}
                            sizeOverride={selectedSize}
                          />
                          <PriceFormatter
                            amount={(product.price ?? 0) * quantity}
                            className="font-bold text-[#8C6227] text-lg sm:text-xl"
                          />
                          
                        </div>
                        
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-[#8C6227]/10">
                <CardHeader>
                  <CardTitle className="text-[#8C6227] font-mono uppercase tracking-widest text-sm">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <PriceFormatter amount={getSubTotalPrice()} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <PriceFormatter 
                      amount={getSubTotalPrice() - getTotalPrice()} 
                      className="text-red-600"
                    />
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <PriceFormatter amount={getTotalPrice()} className="text-[#8C6227]" />
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-[#111111] hover:bg-[#111111]/80 cursor-pointer hoverEffect text-white rounded-full py-6 mt-4 text-base"
                  >
                    {loading
                      ? "Processing Order..."
                      : isSignedIn
                        ? "Place Order"
                        : "Sign in to Checkout"}
                  </Button>

                  {!isSignedIn && (
                    <p className="text-xs text-center text-neutral-400 mt-1">
                      You'll be asked to sign in when placing your order
                    </p>
                  )}
                </CardContent>
              </Card>

              {isSignedIn && (
                <Card className="border-[#8C6227]/10">
                  <CardHeader>
                    <CardTitle className="text-[#8C6227] font-mono uppercase tracking-widest text-sm">
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {addresses.length > 0 ? (
                      <RadioGroup value={selectedAddress?.id}>
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddress(addr)}
                            className={`p-4 rounded-xl cursor-pointer border transition-all ${
                              selectedAddress?.id === addr.id
                                ? "border-[#8C6227] bg-[#8C6227]/5"
                                : "border-transparent hover:bg-neutral-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <RadioGroupItem value={addr.id} className="mt-1" />
                              <div className="text-sm">
                                <p className="font-semibold">{addr.name}</p>
                                <p className="text-neutral-600 mt-1 leading-tight">
                                  {addr.address}, {addr.city}, {addr.state} {addr.zip}
                                </p>
                                {addr.isDefault && (
                                  <span className="text-xs text-[#8C6227] font-medium mt-1 inline-block">
                                    Default Address
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <p className="text-neutral-500 py-8 text-center">
                        No addresses yet
                      </p>
                    )}
                    <AddressModal onAddressAdded={fetchAddresses} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default CartPage;