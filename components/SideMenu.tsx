"use client";

import React, { FC } from "react";
import Logo from "./Logo";
import { X } from "lucide-react";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks";
// import SearchBar from "./SearchBar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 text-white/70 shadow-xl transition-all duration-300
      ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div
        ref={sidebarRef}
        className={`min-w-72 max-w-120 bg-bg-main h-screen p-10 border-r border-r-shop_light_green flex flex-col gap-6 transform transition-transform duration-300 hover:cursor-pointer
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center gap-5">
          <Logo className="text-white" spanDesign="group-hover:text-white" />
          <button
            onClick={onClose}
            className="hover:text-shop_light_green transition"
          >
            <X />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
          <div className="block md:hidden ">
            {/* <SearchBar  /> */}
          </div>

          {headerData?.map((item) => (
            <Link
              href={item?.href}
              key={item?.title}
              className={`hover:text-shop_light_green transition ${
                pathname === item?.href ? "text-white" : ""
              }`}
              onClick={onClose}
            >
              {item?.title}
            </Link>
          ))}
        </div>

        {/* <SocialMedia /> */}
      </div>
    </div>
  );
};

export default SideMenu;