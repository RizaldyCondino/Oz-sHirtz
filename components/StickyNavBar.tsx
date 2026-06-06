"use client";

import React, { useEffect, useRef, useState } from "react";

interface StickyNavBarProps {
  children: React.ReactNode;
  navbarHeight?: number;
}

export default function StickyNavBar({ children, navbarHeight = 0 }: StickyNavBarProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const isMobile = () => window.innerWidth < 1024;

    const onScroll = () => {
      const placeholder = placeholderRef.current;
      if (!placeholder) return;

      const rect = placeholder.getBoundingClientRect();
      const sticky = rect.top <= navbarHeight;
      setIsSticky(sticky);

      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      if (Math.abs(diff) < 4) return;

      if (sticky && isMobile()) {
        setVisible(diff < 0);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    const updateHeight = () => {
      if (barRef.current) setBarHeight(barRef.current.offsetHeight);
      if (!isMobile()) setVisible(true);
    };

    updateHeight();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateHeight);
    };
  }, [navbarHeight]);

  return (
    <>
      <div ref={placeholderRef} style={{ height: isSticky ? barHeight : 0 }} />
      <div
        ref={barRef}
        style={
          isSticky
            ? {
                position: "fixed",
                top: navbarHeight,
                left: 0,
                right: 0,
                zIndex: 50,
                transform: visible ? "translateY(0)" : "translateY(-110%)",
                transition: "transform 0.3s ease",
              }
            : {}
        }
        className="backdrop-blur bg-[#FAF8F4]/90 text-[#111111] transition-colors duration-300"
      >
        <div className="w-full max-w-screen px-4 md:px-6 lg:px-8 py-2">
          {children}
        </div>
      </div>
    </>
  );
}