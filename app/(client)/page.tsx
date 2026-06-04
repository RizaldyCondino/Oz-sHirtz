import { client } from "@/sanity/lib/client";
import FeaturedProducts from "@/components/FeaturedProducts";
import HeroBanner from "@/components/HeroBanner";
import Divider from "@/components/Divider";
import BrandMarquee from "@/components/BrandMarquee";
import DriftClothingSection from "@/components/DriftClothingSection";
import ProductCard from "@/components/ProductCardProps";

async function getFeaturedProducts() {
  try {
    const query = `*[_type == "product" && isFeatured == true] 
      | order(coalesce(publishedAt, _createdAt) desc)[0...3]{
      _id,
      name,
      slug,
      price,
      discount,
      brand->{ title },
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
    const query = `*[_type == "brand"][0...3]{
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

async function getHomePage() {       // 👈 add this
  try {
    return await client.fetch(`
      *[_type == "homePage" && _id == "homePage"][0] {
        hero {
          campaignLabel,
          headline,
          subheadline,
          ctas[] { _key, label, url, style, openInNewTab },
          backgroundType,
          backgroundImage { asset, alt, hotspot, mobileImage { asset, hotspot } },
          backgroundVideo {
            videoFile { asset->{ url } },
            posterImage { asset, alt, hotspot },
            disableOnMobile
          },
          overlayOpacity,
          productImage { asset, alt, hotspot, position },
          textPosition,
          textTheme,
          aspectRatio,
          ariaLabel
        }
      }
    `);
  } catch (error) {
    console.error("Error fetching home page from Sanity:", error);
    return null;
  }
}

export default async function Home() {
  const [products, brands, homePage] = await Promise.all([  // 👈 add homePage
    getFeaturedProducts(),
    getFeaturedBrands(),
    getHomePage(),
  ]);

  return (
    <div>
      {homePage?.hero && <HeroBanner data={homePage.hero} />}  {/* 👈 safe check */}

      <BrandMarquee title="Shop By Brand" brands={brands} />

      <FeaturedProducts title="Featured Products" products={products} />

      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <Divider className="opacity-20" />
      </div>
      
      <DriftClothingSection/>
      
    </div>
  );
}