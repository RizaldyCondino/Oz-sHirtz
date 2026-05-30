import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PRODUCTS_BY_COLLECTION_QUERY,
  SINGLE_COLLECTION_QUERY,
} from "@/sanity/lib/queries/query";
import CollectionClient from "@/Collectionclient";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  if (!slug) return notFound();

  try {
    const [collectionResponse, productsResponse] = await Promise.all([
      sanityFetch({ query: SINGLE_COLLECTION_QUERY, params: { slug } }),
      sanityFetch({
        query: PRODUCTS_BY_COLLECTION_QUERY,
        params: { collectionSlug: slug },
      }),
    ]);

    const collection = collectionResponse?.data ?? null;
    const products = productsResponse?.data ?? [];

    if (!collection) return notFound();

    return <CollectionClient collection={collection} products={products} />;
  } catch (error) {
    console.error("[CollectionPage] Failed to fetch collection data:", error);
    return notFound();
  }
}