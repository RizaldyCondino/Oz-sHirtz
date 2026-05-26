"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ShoppingBag, ArrowLeft, Heart } from "lucide-react";
import { PortableText } from "@portabletext/react";

import ImageView from "@/components/ImageView";
import PriceFormatter from "./PriceFormatter";
import SizeGuideModal from "./SizeGuideModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "./AddToCartButton";
import useStore from "@/store"; // 👈 added

interface Size {
  size: string;
  stock: number;
  sku: string;
  price?: number;
}

interface ProductImage {
  _key: string;
  asset: { url: string };
  alt?: string;
}

interface Colorway {
  name: string;
  hex: string;
  sku: string;
  slug: any;
  images?: ProductImage[];
  sizes?: Size[];
  price?: number;
  discount?: number;
}

interface Product {
  _id: string;
  name: string;
  slug: any;
  sku: string;
  price: number;
  discount?: number;
  stock: number;
  description?: any;
  images?: ProductImage[];
  colorways?: Colorway[];
  currentColorName?: string;
  brand?: { title: string; slug: any };
  audience?: { title: string; slug: any };
  categories?: { title: string; slug: any }[];
  collection?: { title: string; slug: any; description?: string };
}

interface Props {
  product: Product;
}

export default function ProductClient({ product }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ Sync URL → Zustand
  const { setSelectedColorway, setSelectedSize, resetSelection } = useStore();

  const defaultColor = product.colorways?.[0]?.name;
  const selectedColorName = searchParams.get("color") || defaultColor || null;
  const selectedSize = searchParams.get("size");

  // ✅ Keep store in sync with URL params
  useEffect(() => {
    if (selectedColorName) setSelectedColorway(selectedColorName);
    setSelectedSize(selectedSize ?? null);
  }, [selectedColorName, selectedSize]);

  // ✅ Reset selection when leaving the product page
  useEffect(() => {
    return () => {
      resetSelection();
    };
  }, [product._id]);

  const [hoveredColorName, setHoveredColorName] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const activeColorway = useMemo(() => {
    if (!product.colorways) return null;
    return (
      product.colorways.find((c) => c.name === selectedColorName) ||
      product.colorways[0]
    );
  }, [product.colorways, selectedColorName]);

  const activeSizeObj = useMemo(() => {
    return activeColorway?.sizes?.find((s) => s.size === selectedSize);
  }, [activeColorway, selectedSize]);

  const effectivePrice = useMemo(() => {
    return activeSizeObj?.price ?? activeColorway?.price ?? product.price;
  }, [activeSizeObj, activeColorway, product.price]);

  const activeDiscount = activeColorway?.discount ?? product.discount ?? 0;

  const discountedPrice =
    activeDiscount > 0
      ? effectivePrice - (effectivePrice * activeDiscount) / 100
      : null;

  const displayImages = useMemo(() => {
    const targetColorName = hoveredColorName || selectedColorName;
    const targetColorway =
      product.colorways?.find((c) => c.name === targetColorName) ||
      product.colorways?.[0];
    return targetColorway?.images?.length
      ? targetColorway.images
      : (product.images ?? []);
  }, [hoveredColorName, selectedColorName, product.images, product.colorways]);

  const displaySku = activeSizeObj?.sku ?? activeColorway?.sku ?? product.sku;

  const resolveSlug = (slugField: any): string => {
    if (!slugField) return "";
    if (typeof slugField === "object" && "current" in slugField)
      return slugField.current;
    return String(slugField);
  };

  const handleSizeSelect = (sizeName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    selectedSize === sizeName
      ? params.delete("size")
      : params.set("size", sizeName);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getVariantUrl = (colorName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("color", colorName);
    params.delete("size");
    return `${pathname}?${params.toString()}`;
  };

  const isOutOfStock = activeSizeObj
    ? activeSizeObj.stock <= 0
    : product.stock <= 0;

  const displayColorName =
    hoveredColorName ||
    selectedColorName ||
    product.currentColorName ||
    "Select Color";

  const audienceSlug = resolveSlug(product.audience?.slug);
  const firstCategorySlug = resolveSlug(product.categories?.[0]?.slug);

  return (
    <section className="relative bg-[#FAF8F4] min-h-screen py-4 sm:py-6 lg:py-4">
      <div className="relative z-10 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-20">
        <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-8 lg:gap-16 items-start">

          {/* LEFT SIDE DETAILS */}
          <div className="flex flex-col items-start text-left pt-2 lg:sticky lg:top-6">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[10px] text-muted-foreground mb-4 flex-wrap uppercase tracking-wider"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="h-auto p-0 flex items-center gap-1 hover:bg-transparent hover:text-foreground transition uppercase text-[10px] tracking-wider"
              >
                <ArrowLeft size={12} /> Back
              </Button>
              <span>/</span>
              <Link href="/" className="hover:text-foreground">Home</Link>
              {audienceSlug && (
                <>
                  <span>/</span>
                  <Link href={`/category/${audienceSlug}`} className="hover:text-foreground">
                    {product.audience?.title}
                  </Link>
                </>
              )}
              {firstCategorySlug && (
                <>
                  <span>/</span>
                  <Link
                    href={audienceSlug ? `/category/${audienceSlug}/${firstCategorySlug}` : `/category/${firstCategorySlug}`}
                    className="hover:text-foreground"
                  >
                    {product.categories?.[0]?.title}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-[150px]">
                {product.name}
              </span>
            </nav>

            {/* DESKTOP PRODUCT DETAILS */}
            <div className="hidden lg:flex flex-col items-start text-left">
              {product.collection && (
                <Badge
                  variant="outline"
                  className="mb-3 px-3 py-1 rounded-full bg-neutral-50 border-neutral-200/60 text-[#8C6227] text-[9px] uppercase tracking-[0.2em] font-medium pointer-events-none"
                >
                  <span className="w-1 h-1 rounded-full bg-[#8C6227] mr-1.5" />
                  {product.collection.title}
                </Badge>
              )}

              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {product.audience?.title} &bull; {product.categories?.[0]?.title || "Apparel"}
              </span>

              <h1 className="text-2xl font-semibold leading-tight text-foreground">
                {product.name}
              </h1>

              <div className="flex flex-col gap-0.5 mt-1.5">
                {product.brand && (
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                    {product.brand.title}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground tracking-wider font-mono">
                  SKU: {displaySku}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 flex-wrap">
                {discountedPrice ? (
                  <>
                    <span className="font-bold text-[#8C6227]">
                      <PriceFormatter amount={discountedPrice} className="text-2xl" />
                    </span>
                    <div className="flex items-center gap-2">
                      <PriceFormatter amount={effectivePrice} className="text-[11px] line-through text-muted-foreground" />
                      <Badge className="bg-[#8C6227]/10 text-[#8C6227] hover:bg-[#8C6227]/10 text-[10px] px-2 py-0.5 font-medium rounded-full border-none shadow-none">
                        -{activeDiscount}%
                      </Badge>
                    </div>
                  </>
                ) : (
                  <PriceFormatter amount={effectivePrice} className="text-2xl font-semibold text-[#8C6227]" />
                )}
              </div>

              {product.description && (
                <div className="mt-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-none border-t border-neutral-100 dark:border-neutral-800 pt-6 w-full">
                  <PortableText value={product.description} />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE IMAGES & CONTROLS */}
          <div>
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-10">
              <div className="h-[50vh] sm:h-[65vh] lg:h-[80vh] bg-background rounded-sm overflow-y-auto overflow-x-hidden scrollbar-hide">
                <div className="flex flex-col gap-6">
                  <ImageView
                    images={displayImages}
                    isStock={activeSizeObj?.stock ?? product.stock}
                  />
                </div>
              </div>

              <div className="pt-2">
                {/* MOBILE PRODUCT DETAILS */}
                <div className="flex lg:hidden flex-col items-start text-left mb-5">
                  <h1 className="text-xl font-semibold leading-tight text-foreground">
                    {product.name}
                  </h1>
                  <div className="flex flex-col gap-0.5 mt-1">
                    {product.brand && (
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">
                        {product.brand.title}
                      </p>
                    )}
                    <p className="text-[9px] text-muted-foreground tracking-wider font-mono">
                      SKU: {displaySku}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 mt-3 flex-wrap">
                    {discountedPrice ? (
                      <>
                        <span className="font-bold text-[#8C6227]">
                          <PriceFormatter amount={discountedPrice} className="text-xl" />
                        </span>
                        <div className="flex items-center gap-1.5">
                          <PriceFormatter amount={effectivePrice} className="text-[10px] line-through text-muted-foreground" />
                          <Badge className="bg-[#8C6227]/10 text-[#8C6227] hover:bg-[#8C6227]/10 text-[9px] px-1.5 py-0.5 font-medium rounded-full border-none shadow-none">
                            -{activeDiscount}%
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <PriceFormatter amount={effectivePrice} className="text-xl font-semibold text-[#8C6227]" />
                    )}
                  </div>
                </div>

                {/* COLOR PICKER */}
                {product.colorways && product.colorways.length > 0 && (
                  <div className="mb-6">
                    <div className="mb-2.5">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8C6227]">Colors</h3>
                      <p className="text-[11px] font-medium text-foreground transition-all duration-150 mt-0.5">
                        {displayColorName}
                      </p>
                    </div>
                    <div className="flex gap-2.5 flex-wrap">
                      {product.colorways.map((color, idx) => (
                        <Link
                          key={idx}
                          href={getVariantUrl(color.name)}
                          aria-label={`Select color ${color.name}`}
                          onMouseEnter={() => setHoveredColorName(color.name)}
                          onMouseLeave={() => setHoveredColorName(null)}
                          className={`w-6 h-6 rounded-full block transition duration-200 hover:scale-110 cursor-pointer ${
                            selectedColorName === color.name
                              ? "ring-1 ring-black/20 ring-offset-black/20 scale-105"
                              : "border border-neutral-200"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* SIZE PICKER */}
                {activeColorway?.sizes && activeColorway.sizes.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3 max-w-xs">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8C6227]">Select Size</h3>
                      <Button
                        variant="link"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="h-auto p-0 underline text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        Size Guide
                      </Button>
                      <SizeGuideModal
                        isOpen={isSizeGuideOpen}
                        onClose={() => setIsSizeGuideOpen(false)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeColorway.sizes.map((item, idx) => (
                        <Button
                          key={idx}
                          type="button"
                          disabled={item.stock <= 0}
                          onClick={() => handleSizeSelect(item.size)}
                          variant={selectedSize === item.size ? "default" : "outline"}
                          className={`h-auto px-3 py-1.5 text-[11px] font-medium rounded-full shadow-sm min-w-[36px] cursor-pointer ${
                            selectedSize === item.size
                              ? ""
                              : "text-neutral-800 bg-background hover:bg-neutral-50 dark:text-neutral-200 cursor-pointer"
                          }`}
                        >
                          {item.size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STOCK STATUS */}
                <div className="text-xs font-medium mb-5">
                  {!selectedSize ? (
                    <span className="text-muted-foreground font-mono text-[11px]">
                      [Please select a size to check availability]
                    </span>
                  ) : isOutOfStock ? (
                    <span className="text-destructive uppercase tracking-wider text-[10px] font-bold">
                      Out of stock
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-mono text-[11px]">
                      [Status: {activeSizeObj?.stock} in stock]
                    </span>
                  )}
                </div>

                {/* CTA BUTTONS */}
                <div className="flex flex-row items-center gap-2 mt-3 w-full max-w-[280px]">
                  <AddToCartButton product={product} className="w-36 rounded-full" />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isOutOfStock}
                    className="flex-1 gap-1.5 text-[10px] uppercase font-semibold rounded-full h-9 border-neutral-300 dark:border-neutral-700 bg-background text-foreground whitespace-nowrap cursor-pointer"
                  >
                    <Heart size={12} /> Favorite
                  </Button>
                </div>

                {/* MOBILE DESCRIPTION */}
                <div className="block lg:hidden">
                  {product.description && (
                    <div className="mt-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-none border-t border-neutral-100 dark:border-neutral-800 pt-6 w-full">
                      <PortableText value={product.description} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}