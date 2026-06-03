import React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image"; // adjust to your sanity image builder path

// ─── Types (mirroring nikeHero schema) ───────────────────────────────────────

type ButtonStyle =
  | "filledBlack"
  | "filledWhite"
  | "outlineBlack"
  | "outlineWhite"
  | "textArrow";

type TextPosition =
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight"
  | "centerLeft"
  | "center";

type TextTheme = "white" | "black";
type AspectRatio = "fullVh" | "21/9" | "16/9" | "4/3";
type ProductImagePosition = "right" | "left" | "center";
type BackgroundType = "image" | "video";

interface SanityCta {
  _key: string;
  label: string;
  url: string;
  style: ButtonStyle;
  openInNewTab: boolean;
}

interface SanityImageAsset {
  asset: { _ref: string };
  alt?: string;
  hotspot?: { x: number; y: number };
}

interface NikeHeroData {
  campaignLabel?: string;
  headline: string;
  subheadline?: string;
  ctas?: SanityCta[];
  backgroundType?: BackgroundType;
  backgroundImage?: SanityImageAsset & {
    mobileImage?: SanityImageAsset;
  };
  backgroundVideo?: {
    videoFile?: { asset: { url: string } };
    posterImage?: SanityImageAsset;
    disableOnMobile?: boolean;
  };
  overlayOpacity?: number;
  productImage?: SanityImageAsset & {
    position?: ProductImagePosition;
  };
  textPosition?: TextPosition;
  textTheme?: TextTheme;
  aspectRatio?: AspectRatio;
  ariaLabel?: string;
}

interface HeroBannerProps {
  data: NikeHeroData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const textPositionClasses: Record<TextPosition, string> = {
  bottomLeft: "items-end justify-start",
  bottomCenter: "items-end justify-center text-center",
  bottomRight: "items-end justify-end text-right",
  centerLeft: "items-center justify-start",
  center: "items-center justify-center text-center",
};

const aspectRatioClasses: Record<AspectRatio, string> = {
  fullVh: "min-h-screen",
  "21/9": "aspect-[21/9]",
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
};

const productPositionClasses: Record<ProductImagePosition, string> = {
  right: "right-0 left-auto",
  left: "left-0 right-auto",
  center: "left-1/2 -translate-x-1/2",
};

function ctaClass(style: ButtonStyle): string {
  const base =
    "inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium tracking-widest uppercase transition-all duration-200 rounded-xs";
  const map: Record<ButtonStyle, string> = {
    filledBlack: `${base} bg-[#111] text-white hover:bg-black`,
    filledWhite: `${base} bg-white text-[#111] hover:bg-white/90`,
    outlineBlack: `${base} border border-[#111] text-[#111] hover:bg-[#111] hover:text-white`,
    outlineWhite: `${base} border border-white text-white hover:bg-white hover:text-[#111]`,
    textArrow: `${base} px-0 underline-offset-4 hover:underline`,
  };
  return map[style] ?? map.filledBlack;
}

// ─── Component ────────────────────────────────────────────────────────────────

const HeroBanner: React.FC<HeroBannerProps> = ({ data }) => {
  const {
    campaignLabel,
    headline,
    subheadline,
    ctas = [],
    backgroundType = "image",
    backgroundImage,
    backgroundVideo,
    overlayOpacity = 20,
    productImage,
    textPosition = "bottomLeft",
    textTheme = "white",
    aspectRatio = "fullVh",
    ariaLabel,
  } = data;

  const isLight = textTheme === "black";
  const overlayStyle = { opacity: overlayOpacity / 100 };
  const productPos: ProductImagePosition = productImage?.position ?? "right";

  const bgImageUrl = backgroundImage?.asset
    ? urlFor(backgroundImage).width(1920).quality(90).url()
    : null;

  const mobileBgUrl = backgroundImage?.mobileImage?.asset
    ? urlFor(backgroundImage.mobileImage).width(768).quality(85).url()
    : bgImageUrl;

  const productImageUrl = productImage?.asset
    ? urlFor(productImage).width(900).quality(90).url()
    : null;

  const posterUrl = backgroundVideo?.posterImage?.asset
    ? urlFor(backgroundVideo.posterImage).width(1920).quality(85).url()
    : bgImageUrl;

  return (
  <div className="relative w-full">
    <section
      aria-label={ariaLabel ?? "Hero section"}
      className={`
        relative overflow-hidden w-full h-screen
        ${isLight ? "text-[#1C1C1C]" : "text-white"}
        bg-[#111]
      `}
    >
        {/* ── Background ── */}

        {backgroundType === "video" && backgroundVideo?.videoFile?.asset?.url ? (
          <>
            {/* Desktop video */}
            <video
              className={`
                absolute inset-0 w-full h-full object-cover
                ${backgroundVideo.disableOnMobile ? "hidden sm:block" : ""}
              `}
              autoPlay
              muted
              loop
              playsInline
              poster={posterUrl ?? undefined}
            >
              <source src={backgroundVideo.videoFile.asset.url} type="video/mp4" />
            </video>

            {/* Mobile poster fallback */}
            {backgroundVideo.disableOnMobile && posterUrl && (
              <div className="absolute inset-0 sm:hidden">
                <Image
                  src={mobileBgUrl ?? posterUrl}
                  alt={backgroundImage?.alt ?? ""}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            )}
          </>
        ) : bgImageUrl ? (
          <>
            {/* Mobile bg */}
            {mobileBgUrl && mobileBgUrl !== bgImageUrl && (
              <div className="absolute inset-0 sm:hidden">
                <Image
                  src={mobileBgUrl}
                  alt={backgroundImage?.alt ?? ""}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            )}
            {/* Desktop bg */}
            <div className={mobileBgUrl !== bgImageUrl ? "absolute inset-0 hidden sm:block" : "absolute inset-0"}>
              <Image
                src={bgImageUrl}
                alt={backgroundImage?.alt ?? ""}
                fill
                priority
                className="object-cover"
                style={{
                  objectPosition: backgroundImage?.hotspot
                    ? `${backgroundImage.hotspot.x * 100}% ${backgroundImage.hotspot.y * 100}%`
                    : "center",
                }}
                sizes="100vw"
              />
            </div>
          </>
        ) : (
          // Fallback solid background when no image provided
          <div className="absolute inset-0 bg-[#FAF8F4]" />
        )}

        {/* ── Overlay scrim ── */}
        {overlayOpacity > 0 && (
          <div
            className="absolute inset-0 bg-black pointer-events-none"
            style={overlayStyle}
            aria-hidden="true"
          />
        )}

        {/* ── Product spotlight image ── */}
        {productImageUrl && (
          <div
            className={`
              absolute bottom-0 h-[85%] w-auto pointer-events-none select-none z-10
              ${productPositionClasses[productPos]}
              ${productPos === "center" ? "w-full flex justify-center" : "w-[42%] lg:w-[38%]"}
            `}
          >
            <Image
              src={productImageUrl}
              alt={productImage?.alt ?? "Product"}
              fill={productPos !== "center"}
              width={productPos === "center" ? 600 : undefined}
              height={productPos === "center" ? 800 : undefined}
              className="object-contain object-bottom drop-shadow-2xl"
              sizes="(max-width: 768px) 60vw, 40vw"
              priority
            />
          </div>
        )}

        {/* ── Text / CTA block ── */}
        <div
          className={`
            relative z-20 flex flex-col w-full h-full px-6 sm:px-10 lg:px-16
            pb-12 lg:pb-16 pt-16
            ${textPositionClasses[textPosition]}
          `}
        >
          <div
            className={`
              max-w-xl
              ${textPosition === "bottomCenter" || textPosition === "center" ? "mx-auto" : ""}
              ${textPosition === "bottomRight" ? "ml-auto" : ""}
            `}
          >
            {/* Campaign label / eyebrow */}
            {campaignLabel && (
              <div
                className={`
                  inline-flex items-center gap-3 mb-5
                  ${isLight ? "text-[#1C1C1C]" : "text-white/80"}
                `}
              >
                <div
                  className={`h-px w-8 ${isLight ? "bg-[#1C1C1C]" : "bg-white/60"}`}
                />
                <span className="text-xs tracking-[4px] font-medium uppercase">
                  {campaignLabel}
                </span>
              </div>
            )}

            {/* Headline */}
            <h1
              className={`
                text-[clamp(3rem,7vw,7rem)] leading-[0.95] font-black tracking-tight uppercase
                ${isLight ? "text-[#1C1C1C]" : "text-white"}
              `}
            >
              {headline}
            </h1>

            {/* Subheadline */}
            {subheadline && (
              <p
                className={`
                  mt-5 text-base lg:text-lg max-w-sm leading-relaxed
                  ${isLight ? "text-[#555555]" : "text-white/70"}
                `}
              >
                {subheadline}
              </p>
            )}

            {/* CTAs */}
            {ctas.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
                {ctas.map((cta) => (
                  <Link
                    key={cta._key}
                    href={cta.url ?? "#"}
                    target={cta.openInNewTab ? "_blank" : undefined}
                    rel={cta.openInNewTab ? "noopener noreferrer" : undefined}
                    className={ctaClass(cta.style)}
                  >
                    {cta.label}
                    {cta.style === "textArrow" && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroBanner;