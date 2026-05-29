"use client";

import React, { FC, useMemo, useState } from "react";
import Logo from "./Logo";
import { X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOutsideClick } from "@/hooks";
import { collections } from "@/constants/data";
import type { NavCategory } from "@/sanity/lib/queries/query";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navCategories: NavCategory[];
}

const AUDIENCE_GROUPS = [
  { key: "men", label: "Mens" },
  { key: "women", label: "Womens" },
  { key: "kids", label: "Kids" },
];

const HeaderMenu: FC<SidebarProps> = ({ isOpen, onClose, navCategories = []}) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  // Group the lightweight NavCategory objects by audience slug
  const audienceGroups = useMemo(() => {
    return AUDIENCE_GROUPS.map((group) => ({
      ...group,
      categories: navCategories.filter((cat) => cat.audience === group.key),
    }));
  }, [navCategories]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={sidebarRef}
        className={`absolute left-0 top-0 h-full w-[85%] max-w-sm bg-black text-white/80
          transform transition-transform duration-300 ease-out flex flex-col ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Logo className="text-white" />
          <button onClick={onClose} className="hover:opacity-70 transition">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col px-6 py-6 space-y-5 overflow-y-auto">
          <Link
            href="/category/all"
            onClick={onClose}
            className={`text-sm transition ${
              pathname === "/category/all" ? "text-white" : "text-white/60 hover:text-white"
            }`}
          >
            All Products
          </Link>

          {/* Collections */}
          <div>
            <button
              onClick={() => toggle("collections")}
              className="flex justify-between items-center w-full text-sm"
            >
              Collections
              <ChevronDown
                size={16}
                className={`transition-transform ${openSection === "collections" ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`ml-3 mt-2 flex flex-col gap-3 text-xs overflow-hidden transition-all duration-300 ${
                openSection === "collections" ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {collections.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Audience Groups */}
          {audienceGroups.map((group) => (
            <div key={group.key}>
              <button
                onClick={() => toggle(group.key)}
                className="flex justify-between items-center w-full text-sm"
              >
                {group.label}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openSection === group.key ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`ml-3 mt-2 flex flex-col gap-3 text-xs overflow-hidden transition-all duration-300 ${
                  openSection === group.key ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <Link
                  href={`/category/${group.key}`}
                  onClick={onClose}
                  className="font-medium text-white/80 hover:text-white transition"
                >
                  All {group.label}
                </Link>

                {group.categories.length > 0 ? (
                  group.categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/category/${group.key}/${cat.slug}`}
                      onClick={onClose}
                      className="text-white/60 hover:text-white capitalize transition"
                    >
                      {cat.title}
                    </Link>
                  ))
                ) : (
                  <p className="text-white/40 text-xs">No categories</p>
                )}
              </div>
            </div>
          ))}

          {/* Sale */}
          <Link
            href="/category/sale"
            onClick={onClose}
            className={`text-sm transition ${
              pathname === "/category/sale" ? "text-white" : "text-white/60 hover:text-white"
            }`}
          >
            Sale
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default HeaderMenu;