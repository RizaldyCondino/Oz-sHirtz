import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import ProductClient from "@/components/ProductClient";
import YouMightLike from "@/components/YouMightLike";
import { SINGLE_PRODUCT_QUERY, RELATED_PRODUCTS_QUERY, Product } from "@/sanity/lib/queries/query";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await client.fetch(SINGLE_PRODUCT_QUERY, { slug });

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.seo?.title || `${product.name} | Official Catalog`,
    description: product.seo?.description || `Shop ${product.name}. Featuring premium quality materials and craftsmanship.`,
    openGraph: {
      images: product.images?.[0]?.asset?.url ? [product.images[0].asset.url] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await client.fetch(
    SINGLE_PRODUCT_QUERY,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!product) {
    notFound();
  }

  // Fetch related products server-side
  const categorySlug =
    (product.categories?.[0]?.slug as any)?.current ??
    product.categories?.[0]?.slug ??
    "";

  const relatedProducts = categorySlug
    ? await client.fetch(
        RELATED_PRODUCTS_QUERY,
        { currentId: product._id, categorySlug },
        { next: { revalidate: 60 } }
      ) as Product[]
    : [];

  return (
    <main>
       <ProductClient product={product}>
      <YouMightLike products={relatedProducts} />
    </ProductClient>
    </main>
  );
}