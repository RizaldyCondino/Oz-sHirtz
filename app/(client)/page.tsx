import { client } from "@/sanity/lib/client";
import FeaturedProducts from "@/components/FeaturedProducts";
import HeroBanner from "@/components/HeroBanner";
import Divider from "@/components/Divider";
import BrandMarquee from "@/components/BrandMarquee";
import DriftClothingSection from "@/components/DriftClothingSection";
async function getFeaturedProducts() {
  try {
    const query = `*[_type == "product" && isFeatured == true] 
      | order(coalesce(publishedAt, _createdAt) desc)[0...2]{
      _id,
      name,
      slug,
      price,
      discount,
      brand->{
        title
      },
      "images": images[].asset->{url},
      colorways[] {
        name,
        hex,
        "images": images[].asset->{url}
      }
    }`;
    
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching featured products from Sanity:", error);
    return [];
  }
}

async function getFeaturedBrands() {
  try {
    const query = `*[_type == "brand"][0...4]{
      _id,
      title,
      slug,
      "logo": logo.asset->url,
      "productCount": count(*[_type == "product" && references(^._id)])
    }`;

    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching featured brands from Sanity:", error);
    return [];
  }
}

export default async function Home() {
  // Concurrently settle both promises securely
  const [products, brands] = await Promise.all([
    getFeaturedProducts(),
    getFeaturedBrands()
  ]);

  return (
    <div>
      <HeroBanner />


      <BrandMarquee title="Shop By Brand" brands={brands} />
      
      <FeaturedProducts title="Featured Products" products={products} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <Divider className="opacity-20" />
      </div>
      {/* <DriftClothingSection/> */}
    </div>
  );
}