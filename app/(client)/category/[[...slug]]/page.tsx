import React from "react";
import Link from "next/link";
import { getProducts, type Product } from "@/sanity/lib/queries/query";
import FilterControl from "@/components/FilterControl";
import PaginationWrapper from "@/components/PaginationWrapper";
import ProductCard from "@/components/ProductCardProps";
import StickyNavBar from "@/components/StickyNavBar";
import { Badge } from "@/components/ui/badge";
import { menuCategories, saleSubCategories } from "@/constants/data";
import NoProductAvailable from "@/components/NoProductAvailable";

// ── Constants ──────────────────────────────────────────────
const PRODUCTS_PER_PAGE = 6;

// ── Types ──────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ── Helpers ────────────────────────────────────────────────
function toArray(param: string | string[] | undefined): string[] {
  if (!param) return [];
  return Array.isArray(param) ? param : [param];
}

/**
 * Normalize any slug value to a plain lowercase hyphenated string.
 * Handles: Sanity slug objects { current }, plain strings, titles with spaces.
 */
// ── Helpers ────────────────────────────────────────────────
function normalizeSlug(
  slug: { _type?: string; current: string } | string | undefined | null
): string {
  if (!slug) return "";
  const raw = typeof slug === "object" ? (slug.current ?? "") : slug;
  return raw.toLowerCase().trim().replaceAll(" ", "-").replaceAll("_", "-");
}



function getProductAudience(product: Product): string {
  // Prefer slug, fall back to title — both normalized
  const slug = product.audience?.slug;
  if (slug) return normalizeSlug(slug);
  // title fallback: "Men's" → "men-s", not ideal — better to fix Sanity data
  return (product.audience?.title || "").toLowerCase().trim().replaceAll(" ", "-").replaceAll("'", "").replaceAll("_", "-");
}

function getProductBrandTitle(product: Product): string {
  return typeof product.brand === "string"
    ? product.brand
    : product.brand?.title || "";
}

// Normalize brand the same way everywhere
function getProductBrandSlug(product: Product): string {
  if (typeof product.brand === "object" && product.brand?.slug) {
    return normalizeSlug(product.brand.slug);
  }
  return getProductBrandTitle(product).toLowerCase().trim().replaceAll(" ", "-");
}

function getProductCategories(product: Product): string[] {
  // categories[] resolves to { _id, title, slug } where slug is { _type, current }
  return (product.categories || []).map((cat) => {
    if (!cat?.slug) return "";
    // Handle both slug object { current } and plain string
    return normalizeSlug(
      typeof cat.slug === "object" ? cat.slug.current : cat.slug
    );
  }).filter(Boolean);
}

const CATEGORY_EQUIVALENTS: Record<string, string[]> = {
  pants: ["pants-and-tights"],
};

const AUDIENCE_CATEGORY_PREFIXES: Record<string, string[]> = {
  men: ["men", "mens"],
  women: ["women", "womens"],
  kids: ["kids"],
};

function getCategoryAliases(audience: string, category: string): Set<string> {
  const aliases = new Set<string>();
  const baseCategories = [
    category,
    ...(CATEGORY_EQUIVALENTS[category] || []),
  ].filter(Boolean);

  const prefixes = audience
    ? AUDIENCE_CATEGORY_PREFIXES[audience] || [audience]
    : Object.values(AUDIENCE_CATEGORY_PREFIXES).flat();

  baseCategories.forEach((baseCategory) => {
    aliases.add(baseCategory);
    prefixes.forEach((prefix) => aliases.add(`${prefix}-${baseCategory}`));
  });

  return aliases;
}

function hasCategoryMatch(
  productCategories: string[],
  categoryAliases: Set<string>
): boolean {
  return productCategories.some((category) => categoryAliases.has(category));
}

function getProductSizes(product: Product): Set<string> {
  const sizes = new Set<string>();
  (product.colorways || []).forEach((cw) =>
    (cw.sizes || []).forEach((s) => {
      // Schema only has `stock`, not `quantity` — fixed
      if (s?.size && s.stock > 0) {
        sizes.add(s.size.toLowerCase().trim());
      }
    })
  );
  return sizes;
}

// ── Component ──────────────────────────────────────────────
export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug: slugParam } = await params;
  const resolvedSearch = (await searchParams) ?? {};

  const slugArray = Array.isArray(slugParam)
    ? slugParam
    : slugParam
    ? [slugParam]
    : [];

  const mainSlug = normalizeSlug(slugArray[0] || "all");
  const subSlug = normalizeSlug(slugArray[1] || "");
  const isSalePage = mainSlug === "sale";
  const isAllPage = mainSlug === "all";

  const activeSizes = toArray(resolvedSearch.size).map((s) =>
    s.toLowerCase().trim()
  );
  const activeGenders = toArray(resolvedSearch.gender).map((g) =>
    g.toLowerCase().trim()
  );
  const activeBrands = toArray(resolvedSearch.brand).map((b) =>
    b.toLowerCase().trim()
  );
  const activeTypes = toArray(resolvedSearch.type).map((t) =>
    t.toLowerCase().trim()
  );
  const sortBy =
    typeof resolvedSearch.sort === "string" ? resolvedSearch.sort : "";
  const currentPage = Number(resolvedSearch.page || 1);
  const minPrice = Number(resolvedSearch.minPrice || 0);
  const maxPrice = Number(resolvedSearch.maxPrice || 999999999);

  // Debug mode — visit any category URL with ?debug=1 to see raw Sanity data
  const isDebug = resolvedSearch.debug === "1";

  const products = (await getProducts()) ?? [];
  // ── Available Filters ─────────────────────────────────────
    const availableBrands = Array.from(
    new Set(
      products.map((p: Product) => getProductBrandSlug(p)).filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

  // Collect all sizes that have stock > 0 across all products
  const availableSizesWithStock = Array.from(
    new Set(
      products.flatMap((product: Product) =>
        (product.colorways || []).flatMap((cw) =>
          (cw.sizes || [])
            .filter((s) => s?.size && s.stock > 0)
            .map((s) => s.size.toUpperCase().trim())
        )
      )
    )
  ).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
  );

  // ── Core Filtering Logic ──────────────────────────────────
  const matchesSlug = (product: Product): boolean => {
    const audience = getProductAudience(product);
    const categories = getProductCategories(product);
    
    // 1. Handle "All" page
    if (isAllPage) return true;

    // 2. Handle "Sale" page
    if (isSalePage) {
      const status = (product.status || "").toLowerCase().trim();
      const discount = Number(product.discount || 0);
      const isOnSale = Boolean(product.isOnSale);
      const onSale = status === "sale" || discount > 0 || isOnSale;
      
      if (!onSale) return false;
      if (subSlug) {
        return hasCategoryMatch(categories, getCategoryAliases("", subSlug));
      }
      return true;
    }

    // 3. Handle specific Audience (e.g., /men or /women)
    // Check if the product audience matches the main URL segment
    const isCorrectAudience = audience === mainSlug;

    if (!isCorrectAudience) return false;

    // 4. If there's a subSlug (e.g., /men/pants-and-tights), 
    // strictly check if the product has that category.
    if (subSlug) {
      return hasCategoryMatch(categories, getCategoryAliases(mainSlug, subSlug));
    }

    // 5. If no subSlug (e.g., just /men), show all products for this audience
    return true;
  };

  let filteredProducts = products.filter(matchesSlug);

  // ── Additional Filters ────────────────────────────────────
  filteredProducts = filteredProducts.filter((product: Product) => {
    const audience = getProductAudience(product);
    const brand = getProductBrandSlug(product);
    if (activeBrands.length > 0 && !activeBrands.includes(brand))
      return false;
    const categories = getProductCategories(product);

    // Gender filter
    if (activeGenders.length > 0 && !activeGenders.includes(audience))
      return false;

    // Brand filter — compare normalized slugs
    if (activeBrands.length > 0 && !activeBrands.includes(brand))
      return false;

    // Type/category filter
    if (activeTypes.length > 0) {
      const activeTypeAliases = activeTypes.flatMap((type) =>
        Array.from(getCategoryAliases(audience, type))
      );

      if (!categories.some((c) => activeTypeAliases.includes(c))) return false;
    }

    // Size filter — activeSizes is already lowercased, getProductSizes returns lowercase
    if (activeSizes.length > 0) {
      const sizes = getProductSizes(product);
      if (!activeSizes.some((sz) => sizes.has(sz))) return false;
    }

    // Price filter
    const price = Number(product.price || 0);
    if (price < minPrice || price > maxPrice) return false;

    return true;
  });

  // ── Sort ───────────────────────────────────────────────────
  if (sortBy === "lowest") {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === "highest") {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  // ── Pagination ─────────────────────────────────────────────
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE
  );

  const activeBadge =
    "bg-[#111111] text-white hover:bg-[#231F20] cursor-default text-[7px] sm:text-[8px] tracking-[0.18em] rounded-md px-3 py-1";
  const inactiveBadge =
    "border-[#D8CFC2] text-[#7A6E61] hover:border-[#8C6227] hover:text-[#8C6227] cursor-pointer text-[7px] sm:text-[8px] tracking-[0.18em] rounded-md px-3 py-1 bg-transparent";

  return (
    <section className="bg-[#FAF8F4] min-h-screen">

      {/* ── Debug panel (dev only — visit ?debug=1) ────────── */}
      {isDebug && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-4 text-xs font-mono text-yellow-900 space-y-2">
          <p className="font-bold">
            DEBUG — mainSlug: <code>{mainSlug}</code> / subSlug:{" "}
            <code>{subSlug}</code> / total
            products: {products.length} / matched before extra filters:{" "}
            {products.filter(matchesSlug).length}
          </p>
          <details>
            <summary className="cursor-pointer font-semibold">
              Show raw category slugs for first 10 products
            </summary>
            <ul className="mt-2 space-y-1">
              {products.slice(0, 10).map((p: Product) => (
                <li key={p._id}>
                  <span className="font-semibold">{p.name}</span> — audience:{" "}
                  {getProductAudience(p)} — categories:{" "}
                  {JSON.stringify(getProductCategories(p))} — raw cats:{" "}
                  {JSON.stringify(
                    (p.categories || []).map((category) => category?.slug)
                  )}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}

      {/* ── Sale Nav ─────────────────────────────────────── */}
      {isSalePage && (
        <StickyNavBar>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.18em]">
              <Link
                href="/category/sale"
                className="font-semibold mr-2 text-[#8C6227]"
              >
                SALE
              </Link>
              <Link href="/category/sale">
                <Badge className={!subSlug ? activeBadge : inactiveBadge}>
                  ALL
                </Badge>
              </Link>
              {saleSubCategories.map((cat) => (
                <Link key={cat} href={`/category/sale/${cat}`}>
                  <Badge
                    className={subSlug === cat ? activeBadge : inactiveBadge}
                  >
                    {cat.replace("-", " ").toUpperCase()}
                  </Badge>
                </Link>
              ))}
            </div>
            <FilterControl
              availableBrands={availableBrands}
              availableSizes={availableSizesWithStock}
            />
          </div>
        </StickyNavBar>
      )}

      {/* ── Audience + Subcategory Nav ────────────────────── */}
      {!isSalePage &&
        !isAllPage &&
        menuCategories.map((group) => {
          if (mainSlug !== group.key) return null;

          return (
            <StickyNavBar key={group.key}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.18em]">
                  <Link href={`/category/${group.key}`}>
                    <span className="font-semibold mr-2 text-[#8C6227] hover:text-[#111111]">
                      {group.label}
                    </span>
                  </Link>

                  <Link href={`/category/${group.key}`}>
                    <Badge className={!subSlug ? activeBadge : inactiveBadge}>
                      ALL
                    </Badge>
                  </Link>

                  {group.items.map((item) => {
                    const itemSlug = normalizeSlug(item);
                    return (
                      <Link
                        key={item}
                        href={`/category/${group.key}/${itemSlug}`}
                      >
                        <Badge
                          className={
                            itemSlug === subSlug ? activeBadge : inactiveBadge
                          }
                        >
                          {item.toUpperCase()}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
                <FilterControl
                  availableBrands={availableBrands}
                  availableSizes={availableSizesWithStock}
                />
              </div>
            </StickyNavBar>
          );
        })}

      {/* ── All Products Nav ──────────────────────────────── */}
      {isAllPage && (
        <StickyNavBar>
          <div className="flex justify-end">
            <FilterControl
              availableBrands={availableBrands}
              availableSizes={availableSizesWithStock}
            />
          </div>
        </StickyNavBar>
      )}

      {/* ── Product Grid ──────────────────────────────────── */}
      <div className="w-full px-4 md:px-6 lg:px-8 pt-3 pb-10">
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 sm:gap-x-6 gap-y-10 sm:gap-y-14">
              {paginatedProducts.map((product: Product) => (
                <ProductCard
                isLoading={false}
                  key={product._id}
                  title={product.name || ""}
                  price={product.price || 0}
                  discount={product.discount}
                  image={product.images?.[0]?.asset?.url || "/placeholder.jpg"}
                  tag={product.status}
                  colorways={(product.colorways || []).map((colorway) => ({
                    ...colorway,
                    hex: colorway.hex || "",
                  }))}
                  sizes={(product.sizes || []).map((size) => ({ size }))}
                  href={`/product/${product.slug?.current || ""}`}
                  brands={getProductBrandTitle(product)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16">
                <PaginationWrapper
                  currentPage={safePage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </>
        ) : (

          <NoProductAvailable
    selectedTab={subSlug || mainSlug}
    subSlug={subSlug}
  />
          // <div className="border border-[#E7DED2] rounded-2xl bg-white px-6 py-14 text-center">
          //   <p className="text-sm tracking-wide text-[#7A6E61]">
          //     No products found for this selection.
          //   </p>
          //   {subSlug && process.env.NODE_ENV === "development" && (
          //     <p className="text-xs text-[#aaa] mt-2">
          //       Filtering by category slug <code>{subSlug}</code>. If this
          //       looks wrong, visit{" "}
          //       <a href="?debug=1" className="underline">
          //         ?debug=1
          //       </a>{" "}
          //       to inspect raw Sanity slugs.
          //     </p>
          //   )}
          // </div>
        )}
      </div>
    </section>
  );
}
