"use server";
import { urlFor } from "@/sanity/lib/image";
import stripe from "../lib/stripe";
import { CartItem } from "./../store";
import type { Address } from "@prisma/client";
import Stripe from "stripe";

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



export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata,
) {
  try {
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
      line_items: items?.map((item) => ({
        price_data: {
          currency: "USD",
          unit_amount: Math.round(item?.product?.price! * 100),
          product_data: {
            name: item?.product?.name || "Unknown Product",
            description: [
              item?.product?.sku ? `SKU: ${item.product.sku}` : null,
              item?.selectedColorway ? `Color: ${item.selectedColorway}` : null,
              item?.selectedSize ? `Size: ${item.selectedSize}` : null,
              `Qty: ${item?.quantity}`,
            ]
              .filter(Boolean)
              .join(" · "),
            metadata: { id: item?.product?._id },
            images: item?.selectedImage
              ? [item.selectedImage]
              : item?.product?.images && item?.product?.images?.length > 0
                ? [urlFor(item.product.images[0]).url()]
                : undefined,
          },
        },
        quantity: item?.quantity,
      })),
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
