import React from "react";
import Link from "next/link";

type FeatureBlockProps = {
  title: string;
  description: React.ReactNode;
  image: string;
  buttonText: string;
  buttonLink: string;
  reverse?: boolean;
};

const FeatureBlock: React.FC<FeatureBlockProps> = ({
  title,
  description,
  image,
  buttonText,
  buttonLink,
  reverse = false,
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 py-12 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Image Side */}
      <div className="w-full md:w-1/2">
        <div className="overflow-hidden bg-[#F0E6D2] aspect-[4/3] w-full">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition duration-500 hover:scale-102"
          />
        </div>
      </div>

      {/* Content Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center max-w-lg">
        <h2 className="text-3xl md:text-4xl font-normal text-[#1A1A1A] mb-6 tracking-wide leading-tight">
          {title}
        </h2>
        <div className="text-sm md:text-base text-[#5A5A5A] leading-relaxed mb-8 space-y-4 font-light">
          {description}
        </div>
        <div>
          <Link
            href={buttonLink}
            className="inline-block bg-[#C32F27] hover:bg-[#A8251E] text-white text-xs md:text-sm font-medium py-3 px-8 rounded transition duration-200 uppercase tracking-wider"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureBlock;