"use client";

import React, {
  FC,
  useEffect,
} from "react";

import Logo from "./Logo";

import { X } from "lucide-react";

import { menuCategories } from "@/constants/data";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { useOutsideClick } from "@/hooks";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuCategory {
  _id?: string;
  id?: string;
  title?: string;
  label?: string;
  href?: string;
  slug?: string | { current: string }; // Safely type check object properties
}

const SideMenu: FC<
  SidebarProps
> = ({
  isOpen,
  onClose,
}) => {
  const pathname =
    usePathname();

  const sidebarRef =
    useOutsideClick<HTMLDivElement>(
      onClose
    );

  // ======================================================
  // LOCK BODY SCROLL
  // ======================================================

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        ref={sidebarRef}
        className={`absolute left-0 top-0 h-full w-[300px] bg-bg-main border-r border-white/10 p-6 flex flex-col gap-6 transform transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between shrink-0">
          <Logo
            className="text-white"
            spanDesign="group-hover:text-white"
          />

          <button
            onClick={onClose}
            aria-label="Close Menu"
            className="text-text-dark-mode-hint hover:text-white transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* NAVIGATION WITH CONTAINER SCROLL WRAPPING */}
        <nav className="flex flex-col gap-4 text-xs uppercase tracking-[0.2em] font-semibold overflow-y-auto pr-2 pb-6">
          {menuCategories?.map(
            (
              item: MenuCategory,
              index: number
            ) => {
              // Extract the string variant safely out of potential CMS object bindings
              const parsedSlug = typeof item.slug === "object"
                ? item.slug?.current
                : item.slug;

              const slug =
                parsedSlug ||
                item.title
                  ?.toLowerCase()
                  ?.replace(
                    /\s+/g,
                    "-"
                  );

              const targetHref =
                item.href ||
                `/category/${slug}`;

              const uniqueKey =
                item._id ||
                item.id ||
                slug ||
                `menu-item-${index}`;

              const isActive =
                pathname ===
                targetHref;

              return (
                <Link
                  key={
                    uniqueKey
                  }
                  href={
                    targetHref
                  }
                  onClick={
                    onClose
                  }
                  className={`transition py-1 ${
                    isActive
                      ? "text-white"
                      : "text-text-dark-mode-hint hover:text-white"
                  }`}
                >
                  {item.title ||
                    item.label}
                </Link>
              );
            }
          )}
        </nav>
      </div>
    </div>
  );
};

export default SideMenu;