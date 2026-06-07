"use server";
import { urlFor } from "@/sanity/lib/image";
import stripe from "../lib/stripe";
import { CartItem } from "./../store";
import Stripe from "stripe";

type Address = {
  id: string;
  clerkId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: Address | null;
  
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
  selectedColorway?: string;
  selectedSize?: string;
  selectedImage?: string;
  sku?: string;
}

// ── Resolve colorway-aware discounted price ──────────────────────────────────
function resolveItemPrice(item: GroupedCartItems): number {
  const product = item.product as any;
  const activeColorway = product.colorways?.find(
    (c: any) => c.name === item.selectedColorway,
  );

  const price = activeColorway?.price ?? product.price ?? 0;
  const discountPercent = activeColorway?.discount ?? product.discount ?? 0;
  const discountedPrice =
    discountPercent > 0 ? price * (1 - discountPercent / 100) : price;

  return discountedPrice;
}
// ─────────────────────────────────────────────────────────────────────────────

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata,
) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured");
  }

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId = customers?.data?.length > 0 ? customers.data[0].id : "";

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId!,
        address: metadata.address ? JSON.stringify(metadata.address) : "",
      },
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      invoice_creation: {
        enabled: true,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      line_items: items?.map((item) => {
        const product = item.product as any;
        const unitPrice = resolveItemPrice(item);
        const originalPrice =
          (product.colorways?.find((c: any) => c.name === item.selectedColorway)
            ?.price ?? product.price ?? 0);
        const hasDiscount = unitPrice < originalPrice;

        return {
          price_data: {
            currency: "USD", // ← fixed from USD
            unit_amount: Math.round(unitPrice * 100), // ← uses discounted price
            product_data: {
              name: item?.product?.name || "Unknown Product",
              description: [
                item?.product?.sku ? `SKU: ${item.product.sku}` : null,
                item?.selectedColorway
                  ? `Color: ${item.selectedColorway}`
                  : null,
                item?.selectedSize ? `Size: ${item.selectedSize}` : null,
                hasDiscount
                  ? `Was ₱${originalPrice.toLocaleString()} · ${
                      product.colorways?.find(
                        (c: any) => c.name === item.selectedColorway,
                      )?.discount ?? product.discount
                    }% off`
                  : null,
                `Qty: ${item?.quantity}`,
              ]
                .filter(Boolean)
                .join(" · "),
              metadata: { id: item?.product?._id, originalPrice: originalPrice.toString(), },
              images: item?.selectedImage
                ? [item.selectedImage]
                : item?.product?.images && item?.product?.images?.length > 0
                  ? [urlFor(item.product.images[0]).url()]
                  : undefined,
            },
          },
          quantity: item?.quantity,
        };
      }),
    };

    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.error("Error creating CheckOut Session", error);
    throw error;
  }
}