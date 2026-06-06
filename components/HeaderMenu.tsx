"use client";

import React, { FC, useMemo, useState } from "react";
import Logo from "./Logo";
import { X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOutsideClick } from "@/hooks";
import { collections } from "@/constants/data";
import type { NavCategory } from "@/sanity/lib/queries/query";
import { AnimatePresence, motion } from "motion/react";

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

const HeaderMenu: FC<SidebarProps> = ({ isOpen, onClose, navCategories = [] }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  const audienceGroups = useMemo(() => {
    return AUDIENCE_GROUPS.map((group) => ({
      ...group,
      categories: navCategories.filter((cat) => cat.audience === group.key),
    }));
  }, [navCategories]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="sidebar-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            ref={sidebarRef}
            key="sidebar-panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-black text-white/80 flex flex-col"
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
                  <motion.span
                    animate={{ rotate: openSection === "collections" ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{ display: "flex" }}
                  >
                    <ChevronDown size={16} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {openSection === "collections" && (
                    <motion.div
                      key="collections-items"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{ overflow: "hidden" }}
                      className="ml-3 mt-2 flex flex-col gap-3 text-xs"
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Audience Groups */}
              {audienceGroups.map((group) => (
                <div key={group.key}>
                  <button
                    onClick={() => toggle(group.key)}
                    className="flex justify-between items-center w-full text-sm"
                  >
                    {group.label}
                    <motion.span
                      animate={{ rotate: openSection === group.key ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{ display: "flex" }}
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {openSection === group.key && (
                      <motion.div
                        key={`${group.key}-items`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        style={{ overflow: "hidden" }}
                        className="ml-3 mt-2 flex flex-col gap-3 text-xs"
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
                      </motion.div>
                    )}
                  </AnimatePresence>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeaderMenu;