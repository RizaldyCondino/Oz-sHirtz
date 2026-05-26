import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link href="/" className="inline-flex p-1 group">
      <h2 
        className={`tracking-wider text-[#111111] font-bold text-wrap text-2xl transition-colors duration-200 hoverEffect ${className}`}
      >
        OzCrtz
      </h2>
    </Link>
  );
};

export default Logo;