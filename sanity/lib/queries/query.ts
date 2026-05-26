import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

/* =============================================================
   PRODUCT TYPE
   ============================================================= */

export interface SanitySlug {
  _type?: string;
  current: string;
}

export interface SanityImageAsset {
  url: string;
}

export interface SanityImage {
  asset?: SanityImageAsset;
  alt?: string;
}

export interface SizeConfig {
  _key?: string;
  size: string;
  /** Schema uses `stock` only — quantity is NOT in the schema */
  stock: number;
  sku?: string;
  price?: number;
}

export interface Colorway {
  _key?: string;
  name: string;
  hex?: string;
  price?: number;
  discount?: number;
  images?: SanityImage[];
  sizes?: SizeConfig[];
}

export interface Brand {
  _id?: string;
  title?: string;
  slug?: SanitySlug;
}

export interface Audience {
  _id?: string;
  title?: string;
  slug?: SanitySlug;
}

export interface Category {
  _id?: string;
  title?: string;
  /** Sanity slug object — always { current: string } */
  slug?: SanitySlug;
}

export interface Collection {
  _id?: string;
  title?: string;
  slug?: SanitySlug;
  description?: string;
  season?: string;
  year?: number;
  isSnkrs?: boolean;
}

export interface Product {
  _id: string;
  name?: string;
  slug?: SanitySlug;
  sku?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  status?: string;
  gender?: string;
  fit?: string;
  shortDescription?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isSnkrs?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  publishedAt?: string;
  images?: SanityImage[];
  colorways?: Colorway[];
  sizes?: string[];
  brand?: Brand | string;
  audience?: Audience;
  categories?: Category[];
  collection?: Collection;
}

/* =============================================================
   FRAGMENTS
   ============================================================= */

export const PRODUCT_CARD_FIELDS = groq`
  _id,
  name,
  slug,
  sku,
  price,
  originalPrice,
  discount,
  status,
  gender,
  fit,
  shortDescription,
  isFeatured,
  isNew,
  isSnkrs,
  isBestSeller,
  isOnSale,
  publishedAt,
  images[]{ asset->{ url }, alt },
  colorways[]{
    _key, name, hex, price, discount,
    images[]{ asset->{ url }, alt },
    sizes[]{ _key, size, stock, sku, price }
  },
  sizes,
  brand->{ _id, title, slug },
  audience->{ _id, title, slug },
  categories[]->{ _id, title, slug },
  collection->{ _id, title, slug, isSnkrs }
`;

export const PRODUCT_FULL_FIELDS = groq`
  _id,
  name,
  slug,
  sku,
  price,
  originalPrice,
  discount,
  status,
  gender,
  fit,
  shortDescription,
  description,
  features,
  materials,
  careInstructions,
  countryOfOrigin,
  isFeatured,
  isNew,
  isSnkrs,
  isBestSeller,
  isOnSale,
  releaseDate,
  publishedAt,
  seo{ title, description },
  images[]{ asset->{ url }, alt },
  colorways[]{
    _key, name, hex, price, discount,
    images[]{ asset->{ url }, alt },
    sizes[]{ _key, size, stock, sku, price }
  },
  sizes,
  brand->{ _id, title, slug },
  audience->{ _id, title, slug },
  categories[]->{ _id, title, slug },
  collection->{ _id, title, slug, description, season, year, isSnkrs }
`;

/* =============================================================
   NAV
   ============================================================= */

export const NAV_QUERY = groq`
  {
    "audiences": *[_type == "audience"] | order(order asc) {
      _id, title, slug
    },
    "categories": *[_type == "category"] | order(order asc) {
      _id, title, slug,
      audience->{ slug }
    }
  }
`;

/* =============================================================
   PRODUCTS
   ============================================================= */

export const ALL_PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const PRODUCTS_COUNT_QUERY = groq`
  count(*[_type == "product"])
`;

export const SINGLE_PRODUCT_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${PRODUCT_FULL_FIELDS}
  }
`;

/* =============================================================
   getProducts — used by CategoryPage
   ============================================================= */

export async function getProducts(): Promise<Product[]> {
  const result = await sanityFetch({ query: ALL_PRODUCTS_QUERY });
  return (result?.data ?? []) as Product[];
}

/* =============================================================
   SALE QUERIES
   ============================================================= */

export const SALE_PRODUCTS_QUERY = groq`
  *[
    _type == "product" &&
    (status == "sale" || discount > 0 || isOnSale == true)
  ] | order(discount desc, publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const SALE_BY_AUDIENCE_QUERY = groq`
  *[
    _type == "product" &&
    (status == "sale" || discount > 0 || isOnSale == true) &&
    audience->slug.current == $audience
  ] | order(discount desc, publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const SALE_BY_CATEGORY_QUERY = groq`
  *[
    _type == "product" &&
    (status == "sale" || discount > 0 || isOnSale == true) &&
    $categorySlug in categories[]->slug.current
  ] | order(discount desc, publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const SALE_BY_AUDIENCE_AND_CATEGORY_QUERY = groq`
  *[
    _type == "product" &&
    (status == "sale" || discount > 0 || isOnSale == true) &&
    audience->slug.current == $audience &&
    $categorySlug in categories[]->slug.current
  ] | order(discount desc, publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

/* =============================================================
   OTHER PRODUCT QUERIES
   ============================================================= */

export const FEATURED_PRODUCTS_QUERY = groq`
  *[_type == "product" && isFeatured == true] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const NEW_PRODUCTS_QUERY = groq`
  *[_type == "product" && (isNew == true || status == "new")] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const BEST_SELLERS_QUERY = groq`
  *[_type == "product" && isBestSeller == true] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const SNKRS_PRODUCTS_QUERY = groq`
  *[_type == "product" && (isSnkrs == true || status == "snkrs")] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const PRODUCTS_BY_AUDIENCE_QUERY = groq`
  *[
    _type == "product" &&
    audience->slug.current == $audience
  ] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const PRODUCTS_BY_CATEGORY_QUERY = groq`
  *[
    _type == "product" &&
    $categorySlug in categories[]->slug.current
  ] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const PRODUCTS_BY_COLLECTION_QUERY = groq`
  *[
    _type == "product" &&
    collection->slug.current == $collectionSlug
  ] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const PRODUCTS_BY_BRAND_QUERY = groq`
  *[
    _type == "product" &&
    brand->slug.current == $brandSlug
  ] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const PRODUCTS_BY_AUDIENCE_AND_CATEGORY_QUERY = groq`
  *[
    _type == "product" &&
    audience->slug.current == $audience &&
    $categorySlug in categories[]->slug.current
  ] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const PRODUCTS_BY_STATUS_QUERY = groq`
  *[_type == "product" && status == $status] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const RELATED_PRODUCTS_QUERY = groq`
  *[
    _type == "product" &&
    _id != $currentId &&
    $categorySlug in categories[]->slug.current
  ] | order(publishedAt desc) [0...4] {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const SEARCH_PRODUCTS_QUERY = groq`
  *[
    _type == "product" &&
    name match $query
  ] | order(publishedAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

/* =============================================================
   CATEGORIES, COLLECTIONS, BRANDS, AUDIENCES
   ============================================================= */

export const ALL_CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(order asc) {
    _id, title, slug, description, isFeatured,
    image{ asset->{ url } },
    audience->{ _id, title, slug }
  }
`;

export const CATEGORIES_BY_AUDIENCE_QUERY = groq`
  *[
    _type == "category" &&
    audience->slug.current == $audience
  ] | order(order asc) {
    _id, title, slug, description, isFeatured,
    image{ asset->{ url } },
    audience->{ _id, title, slug }
  }
`;

export const SINGLE_CATEGORY_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id, title, slug, description, isFeatured,
    image{ asset->{ url } },
    audience->{ _id, title, slug }
  }
`;

export const ALL_COLLECTIONS_QUERY = groq`
  *[_type == "collection"] | order(_createdAt desc) {
    _id, title, slug, description, season, year, isFeatured, isSnkrs,
    coverImage{ asset->{ url }, alt }
  }
`;

export const FEATURED_COLLECTIONS_QUERY = groq`
  *[_type == "collection" && isFeatured == true] | order(_createdAt desc) {
    _id, title, slug, description, season, year, isSnkrs,
    coverImage{ asset->{ url }, alt }
  }
`;

export const SINGLE_COLLECTION_QUERY = groq`
  *[_type == "collection" && slug.current == $slug][0] {
    _id, title, slug, description, season, year, isFeatured, isSnkrs,
    coverImage{ asset->{ url }, alt }
  }
`;

export const SNKRS_COLLECTIONS_QUERY = groq`
  *[_type == "collection" && isSnkrs == true] | order(_createdAt desc) {
    _id, title, slug, description, season, year,
    coverImage{ asset->{ url }, alt }
  }
`;

export const ALL_BRANDS_QUERY = groq`
  *[_type == "brand"] | order(title asc) {
    _id, title, slug, description, isFeatured,
    logo{ asset->{ url }, alt }
  }
`;

export const FEATURED_BRANDS_QUERY = groq`
  *[_type == "brand" && isFeatured == true] | order(title asc) {
    _id, title, slug, description,
    logo{ asset->{ url }, alt }
  }
`;

export const SINGLE_BRAND_QUERY = groq`
  *[_type == "brand" && slug.current == $slug][0] {
    _id, title, slug, description, isFeatured,
    logo{ asset->{ url }, alt }
  }
`;

export const ALL_AUDIENCES_QUERY = groq`
  *[_type == "audience"] | order(order asc) {
    _id, title, slug
  }
`;

/* =============================================================
   HOMEPAGE
   ============================================================= */

export const HOMEPAGE_QUERY = groq`
  {
    "featuredProducts": *[_type == "product" && isFeatured == true] | order(publishedAt desc) [0...8] {
      ${PRODUCT_CARD_FIELDS}
    },
    "newArrivals": *[_type == "product" && (isNew == true || status == "new")] | order(publishedAt desc) [0...8] {
      ${PRODUCT_CARD_FIELDS}
    },
    "saleProducts": *[
      _type == "product" && 
      (status == "sale" || discount > 0 || isOnSale == true)
    ] | order(discount desc) [0...8] {
      ${PRODUCT_CARD_FIELDS}
    },
    "snkrsDrops": *[_type == "product" && (isSnkrs == true || status == "snkrs")] | order(publishedAt desc) [0...4] {
      ${PRODUCT_CARD_FIELDS}
    },
    "featuredCollections": *[_type == "collection" && isFeatured == true] | order(_createdAt desc) [0...4] {
      _id, title, slug,
      coverImage{ asset->{ url }, alt }
    }
  }
`;