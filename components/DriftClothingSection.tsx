import React from "react";
import FeatureBlock from "./FeatureBlock";

export default function OzsHirtzSection() {
  return (
    <section className="bg-white">
      {/* Section 1 — What is OzCrtz */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[450px]">
        {/* Image side */}
        <div className="relative overflow-hidden bg-[#f5f5f5] min-h-[340px] lg:min-h-auto order-1 lg:order-2">
          <div className="flex flex-col justify-center px-8 py-16 sm:px-12 lg:px-16 xl:px-20">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400 mb-4">
              Visit Us
            </p>
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] text-black mb-6">
              Find Us
              <br />
              In Store
            </h2>
            <div className="w-10 h-[3px] bg-black mb-7" />
            <p className="text-[15px] text-gray-500 leading-relaxed max-w-md font-light mb-6">
              Home to some of the best curated streetwear and denim pieces, you
              can visit us and try them on in-store.
            </p>

            {/* Address block */}
            <div className="border-l-2 border-black pl-5 space-y-0.5">
              <p className="text-[13px] font-black uppercase tracking-[0.12em] text-black">
                188 Street
              </p>
              <p className="text-[13px] text-gray-500 font-light">
                San Jose del Monte, Bulacan
              </p>
              <p className="text-[13px] text-gray-500 font-light">
                Philippines
              </p>
            </div>

            <a
              href="https://www.google.com/maps/place/SM+City+San+Jose+del+Monte/data=!4m2!3m1!1s0x0:0x672c0ff720fd3e92?sa=X&ved=1t:2428&ictx=111"
              className="mt-10 inline-flex items-center gap-3 group w-fit"
            >
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-black border-b-2 border-black pb-0.5 group-hover:border-gray-400 group-hover:text-gray-400 transition-colors duration-200">
                Find Us
              </span>
              <svg
                className="w-4 h-4 text-black group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Text side */}
        <div className="flex flex-col justify-center px-8 py-16 sm:px-12 lg:px-16 xl:px-20 order-2 lg:order-1 bg-[#111111]">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400 mb-4">
            About
          </p>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] text-white mb-6">
            What is
            <br />
            OzCrtz
          </h2>
          <div className="w-10 h-[3px] bg-[#111111] mb-7" />
          <p className="text-[15px] text-gray-300 leading-relaxed max-w-md font-light">
            OzCrtz is a dream come true for young local entrepreneur Rizaldy
            Condino, bringing carefully selected brands with a strong focus on
            quality, style, and ethical production values.
          </p>
          <a
            href="/about"
            className="mt-10 inline-flex items-center gap-3 group w-fit"
          >
            {/* <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white border-b-2 border-[#111111] pb-0.5 group-hover:border-gray-400 group-hover:text-gray-400 transition-colors duration-200">
              Read More
            </span> */}
            <svg
              className="w-4 h-4 text-[#111111] group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>

      <div />
    </section>
  );
}
