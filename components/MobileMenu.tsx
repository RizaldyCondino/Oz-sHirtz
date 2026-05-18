"use client";
import { AlignLeft } from "lucide-react";

import SideMenu from "./SideMenu";

import { useState } from "react";

const MobileMenu = () => {
  const [isSidebarOpen, setSideBarOpen] = useState(false);
  return (
    <>
      <button onClick={() => setSideBarOpen(!isSidebarOpen)}>
        <AlignLeft className="hover:text-text-dark-mode-muted hoverEffect md:hidden hover:cursor-pointer" />
      </button>
      <div className="md:hidden">
        <SideMenu
          isOpen={isSidebarOpen}
          onClose={() => setSideBarOpen(false)}
        />
      </div>
    </>
  );
};

export default MobileMenu;
