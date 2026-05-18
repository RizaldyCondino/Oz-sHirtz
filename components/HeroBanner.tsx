import React from "react";

const HeroBanner: React.FC = () => {
  const taglines: string[] = ["Warm", "Minimal", "Timeless"];

  return (
    <section className="relative w-screen min-h-[280px] md:h-[360px] bg-[#F0E6D2] overflow-hidden select-none">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#D8C3A5]/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C8A97E]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Main Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-6">
        
        {/* Left Side - Text */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left tracking-wider">
          
          {/* Small Label */}
          <span className="mb-4 text-[10px] uppercase tracking-[0.35em] text-[#8C6227] border border-[#8C6227]/30 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
            Modern Streetwear
          </span>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light leading-none tracking-tight">
            <span className="text-[#8C6227]">Oz’s</span>
            <span className="text-[#231F20]">Hrtz</span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-[#5C5145]">
            Crafted for those who embrace simplicity, confidence, and timeless
            everyday fashion.
          </p>

          {/* Taglines */}
          <div className="mt-5 flex flex-wrap justify-center md:justify-start items-center gap-3 text-[#A38A67] uppercase tracking-[0.3em] text-[10px] sm:text-xs">
            {taglines.map((item, index) => (
              <React.Fragment key={item}>
                <span>{item}</span>
                {index < taglines.length - 1 && (
                  <span className="text-[#A38A67]/50">·</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="px-6 py-2.5 bg-[#231F20] text-white text-xs uppercase tracking-[0.2em] rounded-full hover:opacity-90 transition">
              Shop Now
            </button>

            <button className="px-6 py-2.5 border border-[#231F20]/20 text-[#231F20] text-xs uppercase tracking-[0.2em] rounded-full hover:bg-black/5 transition">
              Explore
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="flex-1 hidden md:flex justify-center items-end relative h-full">
          
          {/* Glow Behind Image */}
          <div className="absolute bottom-10 w-[260px] h-[260px] bg-[#C8A97E]/30 rounded-full blur-3xl" />

          {/* Main Image */}
          <img
            src="/Images/Beigh.png"
            alt="Fashion Model"
            className="relative z-10 h-[320px] md:h-[340px] object-contain  drop-shadow-2xl pointer-events-none"
          />
          

          {/* Floating Card */}
          <div className="absolute top-10 -left-6 bg-white/70 backdrop-blur-md border border-white/40 px-4 py-2 rounded-2xl shadow-lg">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C6227]">
              New Collection
            </p>
            <p className="text-xs text-[#231F20] mt-1">
              Autumn Essentials 2026
            </p>
          </div>

          {/* Bottom Badge */}
          <div className="absolute bottom-8 right-0 bg-[#231F20] text-white px-4 py-3 rounded-2xl shadow-xl">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">
              Limited Drop
            </p>
            <p className="text-base font-light mt-1">
              Available Now
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;