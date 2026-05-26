import { sanityFetch } from "../live";
import {
  ALL_PRODUCTS_QUERY,
  SINGLE_PRODUCT_QUERY,
} from "./query";

// ======================================================
// TYPE DEFINITIONS
// ======================================================

export interface Category {
  _id?: string;
  title?: string;
  slug?: string | { current: string };
}

export interface Audience {
  _id?: string;
  title?: string;
  slug?: string | { current: string };
}

export interface Collection {
  _id?: string;
  title?: string;
  slug?: string | { current: string };
  isSnkrs?: boolean;
}

export interface Brand {
  _id?: string;
  title?: string;
  slug?: string | { current: string };
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  sku?: string;
  stock?: number;
  status?: string;
  gender?: string;
  fit?: string;
  shortDescription?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isSnkrs?: boolean;
  isBestSeller?: boolean;
  publishedAt?: string;

  slug: {
    current: string;
  };

  images?: {
    asset?: {
      url: string;
    };
    alt?: string;
  }[];

  colorways?: {
    name: string;
    hex: string;
    isDefault: boolean;
  }[];

  sizes?: {
    size: string;
    stock: number;
  }[];

  brand?: Brand;
  audience?: Audience;
  categories?: Category[];
  collection?: Collection;
}

// ======================================================
// DATA FETCHING METHODS
// ======================================================

/**
 * Fetches a list of products with pagination limits.
 * Default range extracts index 0 through 24.
 */
const getProducts = async (start = 0, end = 24): Promise<Product[]> => {
  try {
    const { data } = await sanityFetch({
      query: ALL_PRODUCTS_QUERY,
      params: { start, end },
    });

    return data ?? [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

/**
 * Fetches details for a single product matching a specific slug string.
 */
const getSingleProduct = async (
  slug: string
): Promise<Product | null> => {
  try {
    const { data } = await sanityFetch({
      query: SINGLE_PRODUCT_QUERY,
      params: { slug },
    });

    return data ?? null;
  } catch (error) {
    console.error("Error fetching single product:", error);
    return null;
  }
};

export {
  getProducts,
  getSingleProduct,
};