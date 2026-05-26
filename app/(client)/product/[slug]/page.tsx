import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import ProductClient from "@/components/ProductClient";
import { SINGLE_PRODUCT_QUERY } from "@/sanity/lib/queries/query";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ======================================================
// NEXT.JS 15+ DYNAMIC METADATA GENERATOR ENGINE
// ======================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Fetch only the necessary fields for SEO to keep metadata generation fast
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

// ======================================================
// CORE SERVER RENDERING COMPONENT
// ======================================================
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch product data with revalidation
  // Revalidate every 60 seconds to ensure stock/price accuracy
  const product = await client.fetch(
    SINGLE_PRODUCT_QUERY, 
    { slug }, 
    { next: { revalidate: 60 } }
  );

  // If no product is found, trigger the standard Next.js 404 page
  if (!product) {
    notFound();
  }

  return (
    <main >
      <div >
        {/* className="bg-#FAF8F4" */}
        <ProductClient product={product} />
      </div>
      
    </main>
  );
}