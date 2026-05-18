"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";

import { Menu, Search, ShoppingBag, User } from "lucide-react";

import {
  ClerkProvider,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const Header = () => {
  const [isSidebarOpen, setSideBarOpen] = useState(false);

  const { isSignedIn } = useUser();

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };

  return (
    <header className="flex items-center justify-between border-b px-8 py-2 bg-bg-main text-text-dark-mode-primary">
      {/* Left: Menu */}
      <button
        className="hoverEffect hover:opacity-70"
        onClick={toggleSidebar}
      >
        <Menu size={15} />
      </button>

      {/* Sidebar */}
      <HeaderMenu
        isOpen={isSidebarOpen}
        onClose={() => setSideBarOpen(false)}
      />

      {/* Center: Logo */}
      <div className="flex-1 flex justify-center">
        <Logo />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <button className="hoverEffect hover:opacity-70">
          <Search size={15} />
        </button>

        {/* Auth */}
        {isSignedIn ? (
          <UserButton
            // afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        ) : (
          <SignInButton mode="modal">
            <button className="hoverEffect hover:opacity-70">
              <User size={15} />
            </button>
          </SignInButton>
        )}

        {/* Cart */}
        <button className="relative hoverEffect hover:opacity-70">
          <ShoppingBag size={15} />
        </button>
      </div>
    </header>
  );
};

export default Header;