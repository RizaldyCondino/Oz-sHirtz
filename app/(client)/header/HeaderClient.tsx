"use client";

import React, { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuCategories } from "@/constants/data";
import Logo from "@/components/Logo";
import HeaderMenu from "@/components/HeaderMenu";
import CartIcon from "@/components/CartIcon";
import type { CollectionNavItem, NavCategory } from "@/sanity/lib/queries/query";

interface Props {
  navCategories: NavCategory[];
  collections: CollectionNavItem[];
}

function normalizeSlug(value: string): string {
  return value.toLowerCase().trim().replaceAll(" ", "-").replaceAll("_", "-");
}

export default function HeaderClient({ navCategories = [], collections = []}: Props) {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) setShowHeader(true);
      else if (currentScrollY > lastScrollY && currentScrollY > 80)
        setShowHeader(false);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSaleActive = pathname.startsWith("/category/sale");
  const iconSize = 17;

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          flex items-center justify-between
          px-5 md:px-7 py-2
          bg-[#FAF8F4]/90 backdrop-blur-md
          text-[#111111] select-none
          transition-all duration-300
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-1"
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-[10px] uppercase tracking-[0.20em] font-medium">

          {/* Collections dropdown */}
          <div className="relative group">
            <span className={`py-2 block transition cursor-default ${pathname.startsWith("/collections") ? "font-bold" : "hover:text-black/70"}`}>
              Collections
            </span>
            <div className="absolute left-0 top-full pt-2 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 z-50">
              <div className="w-56 bg-[#231F20] text-white shadow-xl py-2 rounded-md">
                {collections.map((col) => (
                  <Link
                    key={col.href}
                    href={col.href}
                    className={`block px-4 py-2.5 text-[9px] capitalize transition hover:bg-white/10 ${pathname === col.href ? "bg-white/10 font-medium" : ""}`}
                  >
                    <span className="block">{col.label}</span>
                    {col.description && (
                      <span className="block text-white/50 mt-0.5 text-[8px] normal-case">
                        {col.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link 
            href="/category/all"
            className={pathname === "/category/all" ? "font-bold" : "hover:text-black/70"}
          >
            Featured
          </Link>

          {menuCategories.map((group) => {
            const isActive = pathname.startsWith(`/category/${group.key}`);
            return (
              <div key={group.key} className="relative group">
                <Link
                  href={`/category/${group.key}`}
                  className={`py-2 block transition ${isActive ? "font-bold" : "hover:text-black/70"}`}
                >
                  {group.label}
                </Link>
                <div className="absolute left-0 top-full pt-2 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 z-50">
                  <div className="w-52 bg-[#231F20] text-white shadow-xl py-2 rounded-md">
                    {group.items.map((item) => {
                      const itemSlug = normalizeSlug(item);
                      const isSubActive = pathname === `/category/${group.key}/${itemSlug}`;
                      return (
                        <Link
                          key={item}
                          href={`/category/${group.key}/${itemSlug}`}
                          className={`block px-4 py-2 text-[9px] capitalize transition hover:bg-white/10 ${isSubActive ? "bg-white/10 font-medium" : ""}`}
                        >
                          {item}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          

          <Link
            href="/category/sale"
            className={`font-medium transition ${isSaleActive ? "font-bold text-red-600" : "hover:text-black/70"}`}
          >
            Sale
          </Link>
        </nav>

        {/* Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 scale-90">
          <Logo />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button className="hover:opacity-70" aria-label="Search">
            <Search size={iconSize} />
          </button>

          {isSignedIn ? (
            <UserButton appearance={{ elements: { avatarBox: "!w-4 !h-4" } }} />
          ) : (
            <SignInButton mode="modal" >
              <button className="hover:opacity-70" aria-label="Sign in">
                <p className="text-xs font-medium cursor-pointer">Login</p>
              </button>
            </SignInButton>
          )}

          <CartIcon/>
        </div>
      </header>

      <div className="h-[40px]" />

      <HeaderMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navCategories={navCategories}
      />
    </>
  );
}