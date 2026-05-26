import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCTS_BY_COLLECTION_QUERY, SINGLE_COLLECTION_QUERY } from "@/sanity/lib/queries/query";


interface SanityImage {
  asset?: { url: string };
  alt?: string;
}

interface ProductCardData {
  _id: string;
  name?: string;
  slug?: { current: string };
  sku?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  status?: string;
  isNew?: boolean;
  images?: SanityImage[];
}

interface CollectionData {
  _id: string;
  title?: string;
  slug?: { current: string };
  description?: string;
  season?: string;
  year?: number;
  coverImage?: SanityImage;
}

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

// Statuses that deserve a visible badge (excludes "active" which is the default)
const BADGE_STATUSES = new Set(["sale", "new", "featured", "snkrs", "coming-soon", "sold-out"]);

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";

  if (!slug) return notFound();

  const [collectionResponse, productsResponse] = await Promise.all([
    sanityFetch({ query: SINGLE_COLLECTION_QUERY, params: { slug } }),
    sanityFetch({
      query: PRODUCTS_BY_COLLECTION_QUERY,
      params: { collectionSlug: slug },
    }),
  ]);

  const collection = collectionResponse?.data as CollectionData | null;
  const products = (productsResponse?.data || []) as ProductCardData[];

  if (!collection) return notFound();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* ── Hero Banner ──────────────────────────────────── */}
      <div className="relative h-[40vh] min-h-[300px] w-full border-b border-white/10 bg-neutral-950">
        {collection.coverImage?.asset?.url ? (
          <Image
            src={collection.coverImage.asset.url}
            alt={collection.coverImage.alt || collection.title || "Collection banner"}
            fill
            priority
            className="object-cover object-center opacity-60 transition-opacity duration-500"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-black" />
        )}

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-16 bg-gradient-to-t from-black via-black/40 to-transparent">
          <div className="max-w-4xl space-y-3">
            {(collection.season || collection.year) && (
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white/50 bg-white/5 px-2.5 py-1 rounded">
                {collection.season} {collection.year}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-sm sm:text-base text-white/60 max-w-2xl font-light leading-relaxed">
                {collection.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Product Grid ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
          <p className="text-xs tracking-widest uppercase text-white/40 font-mono">
            Catalog / {collection.title || slug}
          </p>
          <p className="text-xs text-white/60 font-mono">
            [{products.length} {products.length === 1 ? "Item" : "Items"}]
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
            {products.map((product) => {
              const productUrl = `/product/${product.slug?.current || ""}`;
              const primaryImage = product.images?.[0]?.asset?.url;
              const statusLower = (product.status || "").toLowerCase();

              // Resolve which badge(s) to show — "new" flag takes precedence
              // over status to avoid showing "new" twice
              const showNewBadge = product.isNew || statusLower === "new";
              // Show a status badge only for meaningful statuses and only when
              // it isn't already covered by the isNew badge above
              const showStatusBadge =
                !showNewBadge &&
                BADGE_STATUSES.has(statusLower) &&
                statusLower !== "new";

              return (
                <article
                  key={product._id}
                  className="group relative flex flex-col justify-between"
                >
                  <div>
                    {/* Product image */}
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-neutral-900 relative border border-white/5">
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={
                            product.images?.[0]?.alt ||
                            product.name ||
                            "Product image"
                          }
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-white/20 text-xs">
                          [ NO IMAGE ]
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        {showNewBadge && (
                          <span className="bg-white text-black text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm">
                            New
                          </span>
                        )}
                        {showStatusBadge && (
                          <span
                            className={`text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm ${
                              statusLower === "sale"
                                ? "bg-red-600"
                                : statusLower === "sold-out"
                                ? "bg-neutral-600"
                                : statusLower === "coming-soon"
                                ? "bg-blue-700"
                                : "bg-neutral-700"
                            }`}
                          >
                            {statusLower === "coming-soon"
                              ? "Soon"
                              : product.status}
                          </span>
                        )}
                      </div>

                      {/* Quick view overlay */}
                      <Link
                        href={productUrl}
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                      >
                        <span className="w-full bg-white text-black text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                          Quick View
                        </span>
                      </Link>
                    </div>

                    {/* Name + SKU */}
                    <div className="mt-4 space-y-1">
                      <h3 className="text-sm font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors">
                        <Link href={productUrl}>{product.name}</Link>
                      </h3>
                      {product.sku && (
                        <p className="text-[11px] font-mono tracking-normal text-white/40">
                          {product.sku}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-2 pt-1 flex items-baseline gap-2 border-t border-dashed border-white/5">
                    <span className="text-sm font-mono font-bold text-white">
                      ₱{product.price?.toFixed(2)}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > (product.price || 0) && (
                        <span className="text-xs font-mono text-white/40 line-through">
                          ₱{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    {product.discount && product.discount > 0 && (
                      <span className="text-[10px] font-bold tracking-tight text-red-500 font-mono">
                        (-{product.discount}%)
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-32 border border-dashed border-white/10 rounded-sm bg-neutral-950/50 px-4">
            <svg
              className="w-8 h-8 text-white/20 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <p className="text-white/80 font-medium text-sm">
              No products in this collection
            </p>
            <p className="text-white/40 text-xs mt-1 max-w-xs font-light">
              Check back soon or explore our alternative design lines.
            </p>
            <Link
              href="/category/all"
              className="mt-6 border border-white/20 hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest px-5 py-2.5 font-bold rounded-sm"
            >
              Shop All Releases
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}