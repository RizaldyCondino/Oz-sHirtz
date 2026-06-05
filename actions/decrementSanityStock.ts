// actions/decrementSanityStock.ts


import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
});
interface StockItem {
  productId: string; // Sanity document _id
  colorway: string;
  size: string;
  quantity: number;
}

export async function decrementSanityStock(items: StockItem[]) {
  for (const item of items) {
    console.log("[Sanity] Decrementing:", items);
    // Fetch the product document
    const product = await sanityClient.fetch(
      `*[_type == "product" && _id == $id][0]{
        _id,
        colorways[]{
          name,
          _key,
          sizes[]{
            size,
            stock,
            _key
          }
        }
      }`,
      { id: item.productId }
    );

    if (!product) {
      console.warn(`[Sanity] Product not found: ${item.productId}`);
      continue;
    }

    const colorwayIndex = product.colorways?.findIndex(
      (c: { name: string }) =>
        c.name.toLowerCase() === item.colorway.toLowerCase()
    );

    if (colorwayIndex === -1 || colorwayIndex === undefined) {
      console.warn(`[Sanity] Colorway not found: ${item.colorway}`);
      continue;
    }

    const sizeIndex = product.colorways[colorwayIndex].sizes?.findIndex(
      (s: { size: string }) =>
        s.size.toLowerCase() === item.size.toLowerCase()
    );

    if (sizeIndex === -1 || sizeIndex === undefined) {
      console.warn(`[Sanity] Size not found: ${item.size}`);
      continue;
    }

    const currentStock =
      product.colorways[colorwayIndex].sizes[sizeIndex].stock ?? 0;
    const newStock = Math.max(0, currentStock - item.quantity);

    await sanityClient
      .patch(item.productId)
      .set({
        [`colorways[${colorwayIndex}].sizes[${sizeIndex}].stock`]: newStock,
      })
      .commit();

    console.log(
      `[Sanity] Stock updated: ${item.productId} | ${item.colorway} | ${item.size} | ${currentStock} → ${newStock}`
    );
  }
}