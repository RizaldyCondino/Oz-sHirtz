"use client";

import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import SocialMediaIcons from "./SocialMediaIcons";

const Footer = () => {
  return (
    <footer className="w-full bg-[#111111] text-white/70 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* TOP */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* BRAND */}
          <div className="flex flex-col gap-2">
            <Logo className="text-white" />

            <p className="text-[11px] text-white/50 max-w-xs leading-relaxed">
              Minimal streetwear for everyday luxury.
            </p>

            <SocialMediaIcons size={14} />
          </div>

          {/* LINKS */}
          <div className="flex gap-8 text-xs">
            <Link href="/shipping" className="hover:text-white transition">
              Shipping
            </Link>

            <Link href="/returns" className="hover:text-white transition">
              Returns
            </Link>

            <Link href="/size-guide" className="hover:text-white transition">
              Size Guide
            </Link>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-white/10 my-6" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-white/40">
          <p>© {new Date().getFullYear()} OzCrtz</p>

          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>

            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>

            <Link href="/cookies" className="hover:text-white transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;