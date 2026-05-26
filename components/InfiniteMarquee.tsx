"use client";

import React from "react";

interface MarqueeItem {
  id: string;
  content: React.ReactNode;
}

interface InfiniteMarqueeProps {
  items: MarqueeItem[];
  speed?: number; // Duration in seconds
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
}

export default function InfiniteMarquee({
  items,
  speed = 25,
  pauseOnHover = true,
  reverse = false,
  className = "",
}: InfiniteMarqueeProps) {
  return (
    <div className={`overflow-hidden w-full ${className}`}>
      <div className="rfm-marquee-container">
        <div
          className="rfm-marquee"
          style={
            {
              "--duration": `${speed}s`,
              "--direction": reverse ? "reverse" : "normal",
              "--pause-on-hover": pauseOnHover ? "paused" : "running",
            } as React.CSSProperties
          }
        >
          {/* Spread items twice to create the seamless loop */}
          {[...items, ...items].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="mx-3 shrink-0 flex items-center justify-center rounded-sm border border-transparent bg-white p-2 shadow-sm ring-1 shadow-black/15 ring-black/5 dark:bg-neutral-900"
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}