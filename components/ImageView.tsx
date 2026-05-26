"use client";

import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";

import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

interface Props {
  images?: Array<{
    asset?: {
      _ref?: string;
      url?: string;
      _type?: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type?: "image";
    _key: string;
  }>;

  isStock?: number;
  isFeatured?: boolean;
}

const ImageView = ({ images = [], isStock, isFeatured }: Props) => {
  return (
    <div className="w-full flex flex-col gap-6 pr-1 overflow-hidden scrollbar-hide bg-[#FAF8F4]">
      {images.map((image, index) => {
        let imageUrl = "";
        
        if (image?.asset?.url) {
          imageUrl = image.asset.url;
        } else if (image?.asset?._ref) {
          imageUrl = urlFor(image).url();
        }

        if (!imageUrl) return null;

        return (
          <div
            key={image._key || index}
            className="relative w-full aspect-[4/5] overflow-hidden bg-[#FAF8F4] border border-gray-100 shadow-sm group shrink-0"
          >
            <Image
              src={imageUrl}
              alt={`Product image ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`
                object-cover
                object-center
                transition-all
                duration-0
                group-hover:scale-105
                ${isStock === 0 ? "opacity-50" : ""}
              `}
            />

            {index === 0 && isFeatured && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#8C6227] text-white text-[10px] tracking-[0.2em] uppercase">
                Featured
              </div>
            )}

            {isStock === 0 && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="px-4 py-1 bg-white text-black text-xs uppercase tracking-widest">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImageView;