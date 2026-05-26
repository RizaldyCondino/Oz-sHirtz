import React from "react";
import Link from "next/link";
import Image from "next/image";

type CategoryCardProps = {
  title: string;
  image: string;
  href: string;
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  image,
  href,
}) => {
  return (
    <Link
      href={href}
      className="group relative block bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[#F0E6D2]">
        <Image
          src={image}
          alt={title}
          fill
          priority={false}
          className="object-cover scale-105 group-hover:scale-110 transition duration-500"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />

        {/* Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-lg sm:text-2xl tracking-[0.3em] uppercase font-light">
            {title}
          </h3>
        </div>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[#C8A97E]/10 pointer-events-none" />
    </Link>
  );
};

export default CategoryCard;