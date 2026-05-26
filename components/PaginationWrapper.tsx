"use client";

import React, { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "./Paginations";


interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
}

// Inner component that safely consumes Next.js navigation hooks
function PaginationInner({ currentPage, totalPages }: PaginationWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    // Creating a clean instances map from current URL params state
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    // Push state update through Next router
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false, // Prevents layout snapping or jumping to top of viewport
    });
  };

  return (
    <nav aria-label="Product Catalog Pagination" className="w-full flex justify-center mt-12">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </nav>
  );
}

// Wrapper export providing a Suspense Boundary safety layer for Next.js build optimization
export default function PaginationWrapper(props: PaginationWrapperProps) {
  return (
    <Suspense fallback={<div className="h-10 w-full animate-pulse bg-neutral-100 rounded-sm" />}>
      <PaginationInner {...props} />
    </Suspense>
  );
}