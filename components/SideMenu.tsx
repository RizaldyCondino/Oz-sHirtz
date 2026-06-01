"use client";

import React, { FC, useEffect, useState } from "react";
import Logo from "./Logo";
import { X, ChevronDown } from "lucide-react";
import { menuCategories, collections } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOutsideClick } from "@/hooks";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function normalizeSlug(value: string): string {
  return value.toLowerCase().trim().replaceAll(" ", "-").replaceAll("_", "-");
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Auto-open the active group when menu opens
  useEffect(() => {
    if (!isOpen) return;
    const active = menuCategories.find((g) => pathname.startsWith(`/category/${g.key}`));
    if (active) setOpenGroup(active.key);
    else if (pathname.startsWith("/collections")) setOpenGroup("collections");
    else setOpenGroup(null);
  }, [isOpen, pathname]);

  const toggleGroup = (key: string) =>
    setOpenGroup((prev) => (prev === key ? null : key));

  const isSaleActive = pathname.startsWith("/category/sale");

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        ref={sidebarRef}
        className={`absolute left-0 top-0 h-full w-[300px] bg-[#1A1714] border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-white/10">
          <Logo className="text-white" spanDesign="group-hover:text-white" />
          <button
            onClick={onClose}
            aria-label="Close Menu"
            className="text-white/50 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col overflow-y-auto flex-1 py-4">

          {/* Collections accordion */}
          <div>
            <button
              onClick={() => toggleGroup("collections")}
              className={`w-full flex items-center justify-between px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-semibold transition ${
                openGroup === "collections" || pathname.startsWith("/collections")
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Collections
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  openGroup === "collections" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openGroup === "collections" && (
              <div className="flex flex-col pb-1">
                {collections.map((col) => (
                  <Link
                    key={col.href}
                    href={col.href}
                    onClick={onClose}
                    className={`px-8 py-2.5 text-[9px] uppercase tracking-[0.15em] transition ${
                      pathname === col.href
                        ? "text-white font-semibold"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {col.label}
                    {"description" in col && col.description && (
                      <span className="block text-white/30 text-[8px] normal-case mt-0.5">
                        {col.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Featured */}
          <Link
            href="/category/all"
            onClick={onClose}
            className={`px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-semibold transition ${
              pathname === "/category/all"
                ? "text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Featured
          </Link>

          <div className="mx-6 my-2 border-t border-white/10" />

          {/* Menu Categories */}
          {menuCategories.map((group) => {
            const isGroupActive = pathname.startsWith(`/category/${group.key}`);
            const isExpanded = openGroup === group.key;

            return (
              <div key={group.key}>
                <button
                  onClick={() => toggleGroup(group.key)}
                  className={`w-full flex items-center justify-between px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-semibold transition ${
                    isGroupActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {group.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="flex flex-col pb-1">
                    <Link
                      href={`/category/${group.key}`}
                      onClick={onClose}
                      className={`px-8 py-2 text-[9px] uppercase tracking-[0.15em] transition ${
                        pathname === `/category/${group.key}`
                          ? "text-white font-semibold"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      All {group.label}
                    </Link>
                    {group.items.map((item) => {
                      const itemSlug = normalizeSlug(item);
                      const href = `/category/${group.key}/${itemSlug}`;
                      return (
                        <Link
                          key={item}
                          href={href}
                          onClick={onClose}
                          className={`px-8 py-2 text-[9px] uppercase tracking-[0.15em] transition capitalize ${
                            pathname === href
                              ? "text-white font-semibold"
                              : "text-white/50 hover:text-white"
                          }`}
                        >
                          {item}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mx-6 my-2 border-t border-white/10" />

          {/* Sale */}
          <Link
            href="/category/sale"
            onClick={onClose}
            className={`px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-semibold transition ${
              isSaleActive ? "text-red-400" : "text-white/60 hover:text-red-400"
            }`}
          >
            Sale
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default SideMenu;