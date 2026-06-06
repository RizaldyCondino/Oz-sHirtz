"use client";

import React, { useEffect, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { getAddresses, deleteAddress } from "@/lib/actions/address.actions";
import { createCheckoutSession } from "@/actions/createCheckoutSession";

import useStore from "@/store";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Pencil, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import EmptyCart from "@/components/EmptyCart";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import AddressModal from "@/components/AddressModal";
import FavoriteButton from "@/components/Favoritebutton";
import YouMightLike from "@/components/YouMightLike";
import { generateOrderNumber } from "@/lib/utils";

const CartPage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const { getGroupedItems, getItemCount } = useStore();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    if (!isClient || !isLoaded) return;
    if (isSignedIn) {
      fetchAddresses();
    } else {
      setAddresses([]);
      setSelectedAddress(null);
    }
  }, [isClient, isSignedIn, isLoaded]);

  // Fetch suggested products based on cart item categories/ids
  useEffect(() => {
    if (!isClient) return;
    const items = getGroupedItems();
    if (items.length === 0) return;

    const fetchSuggestions = async () => {
      try {
        // Pull all unique category slugs or product ids from cart
        const productIds = items.map((i) => i.product._id);

        // Import your Sanity query — adjust to match your actual query setup
        const { client } = await import("@/sanity/lib/client");
        const query = `*[_type == "product" && !(_id in $ids)] | order(_createdAt desc) [0...12] {
          _id,
          name,
          price,
          discount,
          status,
          "slug": slug,
          "images": images[]{
            asset->{url}
          },
          colorways[]{
            name,
            hex,
            price,
            discount,
            images[]{
              asset->{url}
            }
          }
        }`;

        const related = await client.fetch(query, { ids: productIds });
        setSuggestedProducts(related);
      } catch (err) {
        console.error("Failed to load suggestions", err);
      }
    };

    fetchSuggestions();
  }, [isClient]);

  // ── Colorway-aware pricing helpers ──────────────────────────────────────────
  const getColorwayPrice = (product: any, selectedColorway: string) => {
    const activeColorway = product.colorways?.find(
      (c: any) => c.name === selectedColorway,
    );
    const price = activeColorway?.price ?? product.price ?? 0;
    const discountPercent = activeColorway?.discount ?? product.discount ?? 0;
    const discountedPrice =
      discountPercent > 0 ? price * (1 - discountPercent / 100) : price;
    return { price, discountedPrice };
  };

  const groupedItems = isClient ? getGroupedItems() : [];

  const colorwaySubtotal = groupedItems.reduce(
    (sum, { product, selectedColorway, selectedSize }) => {
      const qty = getItemCount(product._id, selectedColorway, selectedSize);
      const { price } = getColorwayPrice(product, selectedColorway);
      return sum + price * qty;
    },
    0,
  );

  const colorwayTotal = groupedItems.reduce(
    (sum, { product, selectedColorway, selectedSize }) => {
      const qty = getItemCount(product._id, selectedColorway, selectedSize);
      const { discountedPrice } = getColorwayPrice(product, selectedColorway);
      return sum + discountedPrice * qty;
    },
    0,
  );

  const colorwayDiscount = colorwaySubtotal - colorwayTotal;
  // ────────────────────────────────────────────────────────────────────────────

  const handleEditAddress = (addr: any) => {
    setEditingAddress(addr);
    setEditModalOpen(true);
  };

  const handleDeleteAddress = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      if (selectedAddress?.id === id) setSelectedAddress(null);
      await fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

const handleCheckout = async () => {
  if (!isSignedIn) {
    openSignIn({ forceRedirectUrl: "/cart" });
    return;
  }
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    setLoading(true);
    try {
      const lineItems = groupedItems.map(
        ({ product, selectedColorway, selectedSize }) => {
          const quantity = getItemCount(
            product._id,
            selectedColorway,
            selectedSize,
          );
          const activeColorway = product.colorways?.find(
            (c: any) => c.name === selectedColorway,
          );
          const displayImage =
            activeColorway?.images?.[0] || product.images?.[0];
          const selectedImage = displayImage
            ? urlFor(displayImage).url()
            : undefined;
          const { discountedPrice } = getColorwayPrice(
            product,
            selectedColorway,
          );
          return {
            product: { ...product, price: discountedPrice },
            quantity,
            selectedColorway,
            selectedSize,
            selectedImage,
          };
        },
      );

      const url = await createCheckoutSession(lineItems, {
        orderNumber: generateOrderNumber(),
        customerName: user?.fullName ?? user?.firstName ?? "Customer",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "",
        clerkUserId: user?.id,
        address: selectedAddress,
      });

      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="bg-[#FAF8F4] mt-10 pb-52 md:pb-10 min-h-screen">
      {groupedItems?.length > 0 ? (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-[#8C6227]/10 overflow-hidden">
                  {groupedItems.map(
                    ({ product, selectedColorway, selectedSize }) => {
                      const quantity = getItemCount(
                        product._id,
                        selectedColorway,
                        selectedSize,
                      );
                      const activeColorway = product.colorways?.find(
                        (c: any) => c.name === selectedColorway,
                      );
                      const displayImage =
                        activeColorway?.images?.[0] || product.images?.[0];
                      const resolvedImageUrl = displayImage
                        ? urlFor(displayImage).url()
                        : undefined;
                      const { price, discountedPrice } = getColorwayPrice(
                        product,
                        selectedColorway,
                      );
                      const hasDiscount = discountedPrice < price;

                      return (
                        <div
                          key={`${product._id}-${selectedColorway}-${selectedSize}`}
                          className="flex gap-4 p-4 sm:p-6 border-b border-[#8C6227]/10 last:border-0"
                        >
                          <Link
                            href={`/product/${product.slug?.current}`}
                            className="flex-shrink-0"
                          >
                            <div className="relative w-[130px] h-[170px] sm:w-[140px] sm:h-[160px]">
                              <Image
                                src={displayImage ? urlFor(displayImage).url() : "/placeholder.png"}
                                alt={product.name ?? "Product"}
                                fill
                                sizes="(max-width: 640px) 100px, 140px"
                                className="rounded-xl object-cover"
                              />
                            </div>
                          </Link>

                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-base sm:text-lg line-clamp-2 pr-3 text-black flex-1">
                                {product.name}
                              </h3>
                              <FavoriteButton
                                className="h-8 w-8"
                                product={product}
                                resolvedImage={resolvedImageUrl}
                              />
                            </div>
                            <p className="text-sm text-neutral-600 mt-1">
                              Color:{" "}
                              <span className="font-medium">
                                {selectedColorway}
                              </span>
                            </p>
                            <p className="text-sm text-neutral-600 mt-0.5">
                              Size:{" "}
                              <span className="font-medium">{selectedSize}</span>
                            </p>
                            <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex-1">
                                <QuantityButtons
                                  product={product}
                                  colorwayOverride={selectedColorway}
                                  sizeOverride={selectedSize}
                                />
                              </div>
                              <div className="flex flex-col items-end">
                                {hasDiscount && (
                                  <PriceFormatter
                                    amount={price * quantity}
                                    className="text-sm text-neutral-400 line-through"
                                  />
                                )}
                                <PriceFormatter
                                  amount={discountedPrice * quantity}
                                  className="font-bold text-[#b8502e] text-lg sm:text-xl"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="border-[#b8502e]/10">
                  <CardHeader>
                    <CardTitle className="text-[#b8502e] uppercase tracking-wider text-sm">
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <PriceFormatter amount={colorwaySubtotal} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discount</span>
                      <PriceFormatter
                        amount={colorwayDiscount}
                        className="text-red-600"
                      />
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <PriceFormatter
                        amount={colorwayTotal}
                        className="text-[#b8502e]"
                      />
                    </div>
                    <Button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full bg-[#111111] hover:bg-[#111111]/80 text-white font-medium hoverEffect lg:text-[15px] rounded-full py-4 sm:py-6 mt-4 text-sm sm:text-xs cursor-pointer"
                    >
                      {loading
                        ? "Redirecting to checkout..."
                        : isSignedIn
                          ? "Checkout"
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
                  <Card className="border-black/10">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-[#b8502e] uppercase tracking-wider text-sm">
                        Delivery Address
                      </CardTitle>
                      <AddressModal onAddressAdded={fetchAddresses} />
                    </CardHeader>
                    <CardContent>
                      {addresses.length > 0 ? (
                        <RadioGroup
                          value={selectedAddress?.id}
                          onValueChange={(val) =>
                            setSelectedAddress(
                              addresses.find((a) => a.id === val),
                            )
                          }
                        >
                          {addresses.map((addr) => (
                            <div
                              key={addr.id}
                              onClick={() => setSelectedAddress(addr)}
                              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                                selectedAddress?.id === addr.id
                                  ? "shadow-md bg-white"
                                  : "border-white bg-white hover:bg-neutral-50"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <RadioGroupItem
                                  value={addr.id}
                                  className="mt-1 bg-black"
                                />
                                <div className="text-sm flex-1 min-w-0">
                                  <p className="font-semibold">{addr.name}</p>
                                  <p className="text-neutral-600 mt-1 leading-tight">
                                    {addr.address}, {addr.city}, {addr.state}{" "}
                                    {addr.zip}
                                  </p>
                                  {addr.isDefault && (
                                    <span className="text-xs text-[#8C6227] font-medium mt-1 inline-block">
                                      Default Address
                                    </span>
                                  )}
                                </div>
                                <div
                                  className="flex gap-1 shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-neutral-400 hover:text-black hover:bg-neutral-100"
                                    onClick={() => handleEditAddress(addr)}
                                  >
                                    <Pencil size={13} />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-neutral-400 hover:text-red-500 hover:bg-red-50"
                                    disabled={deletingId === addr.id}
                                    onClick={() =>
                                      handleDeleteAddress(addr.id)
                                    }
                                  >
                                    <Trash2 size={13} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        <p className="text-neutral-500 py-8 text-center text-sm">
                          No addresses yet. Add one above.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                
              </div>
          
            </div>
          </div>
    {/* ── You Might Like ───────────────────────────────────────────── */}
          <div className="w-full ">
            {suggestedProducts.length > 0 && (
            <YouMightLike products={suggestedProducts} />
          )}
          </div>
          
        </>
      ) : (
        <EmptyCart />
      )}

      {editingAddress && (
        <AddressModal
          onAddressAdded={() => {
            fetchAddresses();
            setEditingAddress(null);
          }}
          editAddress={editingAddress}
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open);
            if (!open) setEditingAddress(null);
          }}
        />
      )}
    </div>
  );
};

export default CartPage;