import React from "react";
import Image from "next/image";
import Link from "next/link";

const HeroBanner: React.FC = () => {
  return (
    <section className="relative min-h-[64vh] overflow-hidden flex items-end bg-[#FAF8F4] text-[#1C1C1C] pb-0">
      <div className="max-w-full mx-auto px-5 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-end h-full w-full">
        
        {/* Left Content */}
        <div className="flex flex-col justify-center pb-16 lg:pb-24 pt-16 lg:pt-0">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-[1px] w-8 bg-[#1C1C1C]"></div>
            <span className="text-sm tracking-[3px] font-medium uppercase">Premium Collection</span>
          </div>

          <h1 className="text-[58px] sm:text-[72px] lg:text-[75px] leading-[1.05] font-bold tracking-wider">
            OzCrtz
          </h1>
          
          <p className="mt-6 text-base lg:text-m max-w-md text-[#555555]">
            Discover the latest trends & express your style effortlessly.<br />
            Shop exclusive collections with premium designs.
          </p>

          {/* Responsive Button Container */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/category/all" className=" cursor-pointer w-full sm:w-auto bg-[#1C1C1C] hover:bg-black text-white px-8 py-3.5 text-base font-medium rounded-xs transition-all">
              Explore Now
            </Link>
            
            <Link 
              href="/category/men" 
              className="w-full sm:w-auto text-center border border-[#1C1C1C]/30 hover:border-[#1C1C1C] px-7 py-3.5 text-base font-medium rounded-xs transition-all"
            >
              Shop Men
            </Link>
          </div>

          {/* Trust / Minimal details */}
          <div className="mt-12 flex flex-wrap items-center gap-4 sm:gap-5 text-sm text-[#777777]">
            <div>Free Shipping</div>
            <div className="w-px h-3 bg-[#1C1C1C]/20"></div>
            <div>30 Days Return</div>
            <div className="w-px h-3 bg-[#1C1C1C]/20"></div>
            <div>Premium Quality</div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative flex justify-center lg:justify-end h-full">
          <div className="relative w-full max-w-[420px] lg:max-w-[450px] h-full flex items-end">
            <Image
              src="/images/bg-transparent.png"
              alt="Dalenga Wear Model"
              width={500}
              height={700}
              priority
              className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
              style={{ maxHeight: '100%' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;