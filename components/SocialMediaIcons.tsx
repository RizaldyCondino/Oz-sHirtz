"use client";

import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SocialMediaIconsProps = {
  size?: number;
};

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ size = 16 }) => {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex gap-3 mt-2">

        {/* Instagram */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition"
            >
              <FaInstagram size={size} />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>Instagram</p>
          </TooltipContent>
        </Tooltip>

        {/* Twitter */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition"
            >
              <FaTwitter size={size} />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>Twitter / X</p>
          </TooltipContent>
        </Tooltip>

        {/* Facebook */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition"
            >
              <FaFacebook size={size} />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>Facebook</p>
          </TooltipContent>
        </Tooltip>

      </div>
    </TooltipProvider>
  );
};

export default SocialMediaIcons;