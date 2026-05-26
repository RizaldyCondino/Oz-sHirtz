import React from "react";
import FeatureBlock from "./FeatureBlock";

export default function OzsHirtzSection() {
  return (
    <section className="bg-white py-10 sm:py-14 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 lg:space-y-24">

        {/* Section 1 */}
        <FeatureBlock
          title="What is Oz’sHirtz?"
          description={
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Oz’sHirtz is a dream come true for young local entrepreneur
              Rizaldy Condino, bringing carefully selected brands with a strong
              focus on quality, style, and ethical production values.
            </p>
          }
          image="/Images/oz.png"
          buttonText="Read More"
          buttonLink="/about"
        />

        {/* Section 2 */}
        <FeatureBlock
          title="Find us in store"
          description={
            <div className="space-y-3 text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
              <p>
                Home to some of the best curated streetwear and denim pieces,
                you can visit us and try them on in-store.
              </p>

              <div className="pt-2 text-sm sm:text-base">
                <p className="font-semibold text-black">188 Street</p>
                <p>San Jose del Monte, Bulacan</p>
                <p>Philippines</p>
              </div>
            </div>
          }
          image="/Images/Location.png"
          buttonText="Find Us"
          buttonLink="/contact"
          reverse
        />

      </div>
    </section>
  );
}