"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import FilterDrawer from "./FilterDrawer";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface FilterControlProps {
  availableBrands: string[];
  availableSizes: string[];
}

export default function FilterControl({ availableBrands, availableSizes }: FilterControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();

  const activeFilterCount =
    searchParams.getAll("brand").length +
    searchParams.getAll("size").length +
    (searchParams.get("minPrice") || searchParams.get("maxPrice") ? 1 : 0) +
    (searchParams.get("sort") ? 1 : 0);

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="flex cursor-pointer items-center gap-2 text-[9px] font-medium tracking-widest uppercase border-none"
      >
        Filter & Sort
        <SlidersHorizontal size={14} />
        {activeFilterCount > 0 && (
          <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      <FilterDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        availableBrands={availableBrands}
        availableSizes={availableSizes}
      />
    </>
  );
}