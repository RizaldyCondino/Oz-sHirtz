import stripe from "@/lib/stripe";
import Stripe from "stripe";

export interface ParsedLineItem {
  productId: string;
  name: string;
  price: number;
    originalPrice: number | null;  // ← add
  image: string | null;
  colorway: string;
  size: string;
  quantity: number;
}

export async function parseLineItems(
  sessionId: string,
): Promise<ParsedLineItem[]> {
  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    sessionId,
    { expand: ["data.price.product"] },
  );

  return lineItemsWithProduct.data
    .map((item) => {
      const stripeProduct = item.price?.product as Stripe.Product;
      const productId = stripeProduct?.metadata?.id;
      const quantity = item?.quantity || 0;
      const description = stripeProduct?.description ?? "";

      const color = description.match(/Color:\s*([^·]+)/)?.[1]?.trim() ?? "";
      const size = description.match(/Size:\s*([^·]+)/)?.[1]?.trim() ?? "";
      const price = (item.price?.unit_amount ?? 0) / 100;

      const originalPrice = stripeProduct?.metadata?.originalPrice
        ? parseFloat(stripeProduct.metadata.originalPrice)
        : null; // ← add

      const name = stripeProduct?.name ?? "Unknown Product";
      const image = stripeProduct?.images?.[0] ?? null;

      if (!productId) return null;

      return { productId, name, price, originalPrice, image, colorway: color, size, quantity };
    })
    .filter(Boolean) as ParsedLineItem[];
}