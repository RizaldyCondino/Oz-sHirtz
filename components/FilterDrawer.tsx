"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableBrands: string[];
  availableSizes: string[];
}

export default function FilterDrawer({
  isOpen,
  onClose,
  availableBrands,
  availableSizes,
}: FilterDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPriceInput, setMinPriceInput] = useState(searchParams.get("minPrice") || "");
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get("maxPrice") || "");

  useEffect(() => {
    setMinPriceInput(searchParams.get("minPrice") || "");
    setMaxPriceInput(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  const lowerPath = pathname.toLowerCase();
  const isShoesCategory = ["shoes", "sneakers", "footwear", "slides", "boots", "sandals"].some(
    (item) => lowerPath.includes(item)
  );
  // const isAllCategory = lowerPath.includes("/all");
  // const isMenAll = lowerPath.includes("/men/all");
  // const isWomenAll = lowerPath.includes("/women/all");
  // const showBoth = isAllCategory || isMenAll || isWomenAll;
  const showBoth = lowerPath.includes("/all");

  const apparelSizes = availableSizes
    .filter((size) => isNaN(Number(size[0])) && !size.includes("."))
    .sort();

  const footwearSizes = availableSizes
    .filter((size) => !isNaN(Number(size[0])) || size.includes("."))
    .sort((a, b) => parseFloat(a) - parseFloat(b));

  const activeFilterCount =
    searchParams.getAll("brand").length +
    searchParams.getAll("size").length +
    (searchParams.get("minPrice") || searchParams.get("maxPrice") ? 1 : 0) +
    (searchParams.get("sort") ? 1 : 0);

  const isChecked = (key: string, value: string) =>
    searchParams.getAll(key).includes(value);

  const currentSort = searchParams.get("sort") || "";

  const handleCheckboxChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const existing = currentParams.getAll(key);

    if (existing.includes(value)) {
      const updated = existing.filter((v) => v !== value);
      currentParams.delete(key);
      updated.forEach((v) => currentParams.append(key, v));
    } else {
      currentParams.append(key, value);
    }

    currentParams.delete("page");
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  const handleSortChange = (value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    if (value) currentParams.set("sort", value);
    else currentParams.delete("sort");
    currentParams.delete("page");
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  const applyPriceRange = (minVal: string, maxVal: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    if (minVal.trim()) currentParams.set("minPrice", minVal);
    else currentParams.delete("minPrice");
    if (maxVal.trim()) currentParams.set("maxPrice", maxVal);
    else currentParams.delete("maxPrice");
    currentParams.delete("page");
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    ["sort", "size", "brand", "minPrice", "maxPrice"].forEach((key) =>
      currentParams.delete(key)
    );
    setMinPriceInput("");
    setMaxPriceInput("");
    router.push(`?${currentParams.toString()}`, { scroll: false });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 flex-shrink-0">
          <SheetHeader className="mb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </Badge>
                )}
              </SheetTitle>
            </div>
          </SheetHeader>

          <Button
            variant="outline"
            className="w-full text-xs sm:text-sm font-medium cursor-pointer"
            onClick={handleResetFilters}
          >
            Reset All Filters
          </Button>
        </div>

        <Separator />

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-2">
          <Accordion
            type="multiple"
            defaultValue={["brands", "size", "price"]}
            className="w-full"
          >
            {/* Brands */}
            <AccordionItem value="brands" className="border-none">
              <AccordionTrigger className="text-xs sm:text-sm font-semibold uppercase tracking-widest py-4 cursor-pointer">
                Brands
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="grid grid-cols-2 gap-y-2">
                  {availableBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 cursor-pointer p-2 -mx-2 rounded-md transition-colors"
                    >
                      <Checkbox
                        checked={isChecked("brand", brand.toLowerCase())}
                        onCheckedChange={() =>
                          handleCheckboxChange("brand", brand.toLowerCase())
                        }
                      />
                      <span className="text-xs sm:text-sm lg:text-xs font-medium">{brand}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
              <Separator />
            </AccordionItem>

            {/* Sizes */}
            <AccordionItem value="size" className="border-none">
              <AccordionTrigger className="text-xs sm:text-sm font-semibold uppercase tracking-widest py-4 cursor-pointer">
                Size
              </AccordionTrigger>
              <AccordionContent className="pb-6 space-y-8">
                {(showBoth || !isShoesCategory) && apparelSizes.length > 0 && (
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                      Apparel
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {apparelSizes.map((size) => (
                        <label
                          key={size}
                          className="flex items-center gap-2 cursor-pointer p-2 -mx-2 rounded-md transition-colors"
                        >
                          <Checkbox
                            checked={isChecked("size", size.toLowerCase())}
                            onCheckedChange={() =>
                              handleCheckboxChange("size", size.toLowerCase())
                            }
                          />
                          <span className="text-xs sm:text-xs lg:text-xs">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {(showBoth || isShoesCategory) && footwearSizes.length > 0 && (
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 cursor-pointer">
                      Footwear
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {footwearSizes.map((size) => (
                        <label
                          key={size}
                          className="flex items-center gap-2 cursor-pointer p-2 -mx-2 rounded-md transition-colors"
                        >
                          <Checkbox
                            checked={isChecked("size", size.toLowerCase())}
                            onCheckedChange={() =>
                              handleCheckboxChange("size", size.toLowerCase())
                            }
                          />
                          <span className="text-xs sm:text-sm">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </AccordionContent>
              <Separator />
            </AccordionItem>

            {/* Price & Sort */}
            <AccordionItem value="price" className="border-none">
              <AccordionTrigger className="text-xs sm:text-sm font-semibold uppercase tracking-widest py-4">
                Price & Sort
              </AccordionTrigger>
              <AccordionContent className="pb-6 space-y-8">
                {/* Sort By */}
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Sort By
                  </p>
                  <RadioGroup
                    value={currentSort}
                    onValueChange={handleSortChange}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-2 -mx-2 rounded-md transition-colors cursor-pointer">
                      <RadioGroupItem value="lowest" id="lowest" />
                      <Label htmlFor="lowest" className="cursor-pointer text-xs sm:text-sm font-medium">
                        Price: Low to High
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-2 -mx-2 rounded-md transition-colors cursor-pointer">
                      <RadioGroupItem value="highest" id="highest" />
                      <Label htmlFor="highest" className="cursor-pointer text-xs sm:text-sm font-medium">
                        Price: High to Low
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Price Range */}
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Price Range
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        onBlur={() => applyPriceRange(minPriceInput, maxPriceInput)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && applyPriceRange(minPriceInput, maxPriceInput)
                        }
                        className="text-xs sm:text-sm w-26"
                      />
                    </div>
                    <span className="text-muted-foreground text-xs">-</span>
                    <div className="flex-1">
                      <Input
                        
                        type="number"
                        placeholder="Max"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        onBlur={() => applyPriceRange(minPriceInput, maxPriceInput)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && applyPriceRange(minPriceInput, maxPriceInput)
                        }
                        className="text-xs sm:text-sm w-26"
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Sticky Footer */}
        <div className="flex-shrink-0 border-t px-5 sm:px-6 py-4 bg-background">
          <SheetFooter>
            <Button 
              className="w-full text-sm sm:text-base font-medium cursor-pointer" 
              onClick={onClose}
            >
              Done
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}