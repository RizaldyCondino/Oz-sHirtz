"use client";
import React, { useEffect, useState } from "react";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { Address } from "@/sanity.types";

import NoAccess from "@/components/NoAccess";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import { ShoppingBag, Trash } from "lucide-react";
import { Title } from "@/components/ui/text";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddWishlistButton from "@/components/AddWishlistButtonDb";
import toast from "react-hot-toast";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { client } from "@/sanity/lib/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createCheckoutSession, Metadata } from "@/actions/createCheckoutSession";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
    setSelectedColorway,
    setSelectedSize,
  } = useStore();

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type == "address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.log("Addresses fetching error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetCart = () => {
    const confirmed = window.confirm("Are you sure you want to reset your cart?");
    if (confirmed) {
      resetCart();
      toast.success("Cart reset successfully");
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
        addresses: selectedAddress,
      };
      if (groupedItems && groupedItems.length > 0) {
        const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      }
    } catch (error) {
      console.error("Error creating checkout session", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  const OrderSummary = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-500 font-mono uppercase tracking-wider text-[11px]">
          Sub Total
        </span>
        <PriceFormatter amount={getSubTotalPrice()} className="text-[#8C6227]" />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-500 font-mono uppercase tracking-wider text-[11px]">
          Discount
        </span>
        <PriceFormatter
          amount={getSubTotalPrice() - getTotalPrice()}
          className="text-[#8C6227]"
        />
      </div>
      <Separator className="bg-[#8C6227]/10" />
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm uppercase tracking-wider font-mono">
          Total
        </span>
        <PriceFormatter
          amount={getTotalPrice()}
          className="text-[#8C6227] font-bold text-base"
        />
      </div>
      <Button
        className="w-full rounded-full font-semibold tracking-wide text-[11px] uppercase bg-[#8C6227] hover:bg-[#7a5420] border-none text-white hoverEffect"
        size="lg"
        disabled={loading}
        onClick={handleCheckOut}
      >
        {loading ? "Please wait..." : "Proceed to Checkout"}
      </Button>
    </div>
  );

  return (
    <div className="bg-[#FAF8F4] pb-52 md:pb-10 min-h-screen">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-[#8C6227]" />
                <Title>Shopping Cart</Title>
              </div>

              <div className="grid lg:grid-cols-3 md:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border border-[#8C6227]/10 bg-white rounded-md">
                    {groupedItems?.map(({ product, selectedColorway: itemColorway, selectedSize: itemSize }) => {
                      // ✅ Count keyed by colorway + size
                      const itemCount = getItemCount(
                        product?._id,
                        itemColorway,
                        itemSize
                      );

                      // ✅ Resolve per-variant price
                      const activeColorway = product?.colorways?.find(
                        (c) => c.name === itemColorway
                      );
                      const activeSizeConfig = activeColorway?.sizes?.find(
                        (s) => s.size === itemSize
                      );
                      const unitPrice =
                        activeSizeConfig?.price ??
                        activeColorway?.price ??
                        product?.price ??
                        0;

                      // ✅ Resolve display image — prefer colorway images
                      const displayImage =
                        activeColorway?.images?.[0] ?? product?.images?.[0];

                      return (
                        <div
                          key={`${product?._id}-${itemColorway}-${itemSize}`}
                          className="border-b border-[#8C6227]/10 p-2.5 last:border-0 flex items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-start gap-2 h-26 md:h-44">
                            {displayImage && (
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="border border-[#8C6227]/10 p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                              >
                                <Image
                                  src={urlFor(displayImage).url()}
                                  alt={product?.name ?? "Product image"}
                                  height={500}
                                  width={500}
                                  loading="lazy"
                                  className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                />
                              </Link>
                            )}

                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">
                                  {product?.name}
                                </h2>
                                {/* ✅ Show colorway + size instead of old variant/status */}
                                <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                                  Color:{" "}
                                  <span className="text-[#8C6227] font-semibold">
                                    {itemColorway}
                                  </span>
                                </p>
                                <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                                  Size:{" "}
                                  <span className="text-[#8C6227] font-semibold">
                                    {itemSize}
                                  </span>
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AddWishlistButton
                                        product={product}
                                        className="relative top-0 right-0"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Add to Favorite
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        onClick={() => {
                                          deleteCartProduct(
                                            product?._id,
                                            itemColorway,
                                            itemSize
                                          );
                                          toast.success("Item removed from cart");
                                        }}
                                      >
                                        <Trash className="w-4 h-4 md:w-5 md:h-5 text-neutral-400 hover:text-red-500 hoverEffect" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Remove Item</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>

                          {/* ✅ Quantity + Price — sync store selection before rendering QuantityButtons */}
                          <div className="flex flex-col items-end justify-between h-36 md:h-44 p-0.5 md:p-1">
                            <PriceFormatter
                              amount={unitPrice * itemCount}
                              className="text-[#8C6227] font-bold"
                            />
                            <QuantityButtonsWithContext
                              product={product}
                              colorway={itemColorway}
                              size={itemSize}
                            />
                          </div>
                        </div>
                      );
                    })}

                    <Button
                      onClick={handleResetCart}
                      className="m-5 font-semibold text-[11px] uppercase tracking-wide rounded-full"
                      variant="destructive"
                    >
                      Reset Cart
                    </Button>
                  </div>
                </div>

                {/* Sidebar */}
                <div>
                  {/* Desktop Order Summary */}
                  <div className="hidden md:block w-full bg-white p-6 rounded-lg border border-[#8C6227]/10">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[#8C6227] font-mono mb-4">
                      Order Summary
                    </h2>
                    <OrderSummary />
                  </div>

                  {/* Delivery Address */}
                  {addresses && (
                    <div className="bg-white rounded-md mt-5 border border-[#8C6227]/10">
                      <Card className="border-none shadow-none">
                        <CardHeader>
                          <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#8C6227] font-mono">
                            Delivery Address
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RadioGroup
                            defaultValue={addresses
                              ?.find((addr) => addr.default)
                              ?._id.toString()}
                          >
                            {addresses?.map((address) => (
                              <div
                                key={address?._id}
                                onClick={() => setSelectedAddress(address)}
                                className={`flex items-center space-x-2 mb-4 cursor-pointer ${
                                  selectedAddress?._id === address?._id
                                    ? "text-[#8C6227]"
                                    : "text-neutral-600"
                                }`}
                              >
                                <RadioGroupItem value={address?._id.toString()} />
                                <Label
                                  htmlFor={`address-${address?._id}`}
                                  className="grid gap-1.5 flex-1 cursor-pointer"
                                >
                                  <span className="font-semibold text-sm">
                                    {address?.name}
                                  </span>
                                  <span className="text-xs text-neutral-500">
                                    {address.address}, {address.city},{" "}
                                    {address.state} {address.zip}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          <Button
                            variant="outline"
                            className="w-full mt-4 rounded-full text-[11px] uppercase tracking-wide border-[#8C6227]/30 text-[#8C6227] hover:bg-[#8C6227]/10"
                          >
                            Add New Address
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}

      {/* Mobile Order Summary */}
      {groupedItems?.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2 border-t border-[#8C6227]/10">
          <div className="bg-white p-4 rounded-lg mx-4 mb-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#8C6227] font-mono mb-3">
              Order Summary
            </h2>
            <OrderSummary />
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Helper component: temporarily syncs store selection so QuantityButtons works in cart
const QuantityButtonsWithContext = ({
  product,
  colorway,
  size,
}: {
  product: any;
  colorway: string;
  size: string;
}) => {
  const { setSelectedColorway, setSelectedSize } = useStore();

  useEffect(() => {
    setSelectedColorway(colorway);
    setSelectedSize(size);
  }, [colorway, size]);

  return <QuantityButtons product={product} />;
};

export default CartPage;