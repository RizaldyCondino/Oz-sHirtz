"use client";

import React, { useEffect, useRef, useState } from "react";

interface StickyNavBarProps {
  children: React.ReactNode;
  navbarHeight?: number;
}

function getBackgroundBehind(el: HTMLElement): { r: number; g: number; b: number } | null {
  el.style.visibility = "hidden";
  const { left, width, top, height } = el.getBoundingClientRect();
  const sampleX = left + width / 2;
  const sampleY = top + height + 2;
  const target = document.elementFromPoint(sampleX, sampleY) as HTMLElement | null;
  el.style.visibility = "visible";

  if (!target) return null;

  let node: HTMLElement | null = target;
  while (node) {
    const bg = window.getComputedStyle(node).backgroundColor;
    const match = bg.match(/\d+/g);
    if (match && match.length >= 3) {
      const [r, g, b, a] = match.map(Number);
      if (a !== 0 && !(r === 0 && g === 0 && b === 0 && a === 0)) {
        return { r, g, b };
      }
    }
    node = node.parentElement;
  }
  return null;
}

function isDarkColor(r: number, g: number, b: number): boolean {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

export default function StickyNavBar({ children, navbarHeight = 0 }: StickyNavBarProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dark, setDark] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const isMobile = () => window.innerWidth < 1024;

    const detectColor = () => {
      const bar = barRef.current;
      if (!bar) return;
      const color = getBackgroundBehind(bar);
      if (color) setDark(isDarkColor(color.r, color.g, color.b));
    };

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
      detectColor();
    };

    const updateHeight = () => {
      if (barRef.current) setBarHeight(barRef.current.offsetHeight);
      if (!isMobile()) setVisible(true);
    };

    updateHeight();
    detectColor();
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
                transition: "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease",
              }
            : {}
        }
        className={`backdrop-blur  transition-colors duration-300 ${
          dark
            ? "bg-[#111111]/90 text-white [&_*]:text-white [&_*]:border-white/20"
            : "bg-[#FAF8F4]/90 text-[#111111]"
        }`}
      >
        <div className="w-full max-w-screen px-4 md:px-6 lg:px-8 py-2">
          {children}
        </div>
      </div>
    </>
  );
}