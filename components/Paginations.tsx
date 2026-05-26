"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Hide the element entirely if there's only 1 page to display
  if (totalPages <= 1) return null;

  // Helper function to calculate which page numbers should be visible
  const getVisiblePages = () => {
    const maxVisible = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      // If total pages are less than max visible, show all
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Complex pagination window calculation
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);

      if (startPage > 2) {
        pages.push("ellipsis-start");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 py-8 select-none">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        type="button"
        aria-label="Go to previous page"
        className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Pages Container */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          // Render stylistic ellipsis placeholder blocks
          if (typeof page === "string") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-7 h-7 flex items-center justify-center text-xs text-gray-400 font-medium tracking-tighter"
              >
                ...
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              type="button"
              aria-current={isActive ? "page" : undefined}
              aria-label={`Go to page ${page}`}
              className={`w-7 h-7 rounded-full text-xs font-medium cursor-pointer transition ${
                isActive
                  ? "bg-black text-white font-semibold"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        type="button"
        aria-label="Go to next page"
        className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}