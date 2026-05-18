import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface LogoProps {
  spanDesign?: string;
  className?: string;
}

const Logo = ({ className, spanDesign }: LogoProps) => {
  return (
    <Link href="/" className="inline-flex p-1 group">
      <h2 
        className={cn(
          "tracking-wider text-text-dark-mode-primary group-hover:text-text-dark-mode-hint font-normal text-wrap text-2xl transition-colors duration-200 hoverEffect", 
          className
        )}
      >
        Oz’s
        <span className={cn("text-text-dark-mode-hint group-hover:text-text-dark-mode-primary transition-colors duration-200", spanDesign)}>
          Hrtz
        </span>
      </h2>
    </Link>
  );
};

export default Logo;