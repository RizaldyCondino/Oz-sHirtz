import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PRODUCTS_BY_COLLECTION_QUERY,
  SINGLE_COLLECTION_QUERY,
  PRODUCTS_COUNT_BY_COLLECTION_QUERY, // ✅ add this
} from "@/sanity/lib/queries/query";
import CollectionClient from "@/components/Collectionclient";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  if (!slug) return notFound();

  try {
    const [collectionResponse, productsResponse, countResponse] = await Promise.all([
  sanityFetch({ query: SINGLE_COLLECTION_QUERY, params: { slug } }),
  sanityFetch({
    query: PRODUCTS_BY_COLLECTION_QUERY,
    params: { collectionSlug: slug, offset: 0, limit: 12 }, // ✅ first page only
  }),
  sanityFetch({
    query: PRODUCTS_COUNT_BY_COLLECTION_QUERY,
    params: { collectionSlug: slug }, // ✅ total count
  }),
]);

const collection = collectionResponse?.data ?? null;
const products = productsResponse?.data ?? [];
const totalProducts = countResponse?.data ?? products.length; // ✅ real total

    if (!collection) return notFound();

    return (
      <CollectionClient
        collection={collection}
        products={products}
        totalProducts={totalProducts}
      />
    );
  } catch (error) {
    console.error("[CollectionPage] Failed to fetch collection data:", error);
    return notFound();
  }
}