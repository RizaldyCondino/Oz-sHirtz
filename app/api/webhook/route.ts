import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { createOrderInPrisma } from "./_lib/createOrderInPrisma";
import { parseLineItems } from "./_lib/parseLineItems";
import { decrementSanityStock } from "@/actions/decrementSanityStock";

export async function POST(req: NextRequest) {
  console.log("Webhook received");
  const body = await req.text();
  const headerlist = await headers();
  const sig = headerlist.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No Signature found for stripe" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook secret is not set" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: `Webhook Error: ${error}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await createOrderInPrisma(session);

      // ← decrement stock after order is created
      const lineItems = await parseLineItems(session.id);
      await decrementSanityStock(
        lineItems.map((item) => ({
          productId: item.productId,
          colorway: item.colorway,
          size: item.size,
          quantity: item.quantity,
        }))
      );
    } catch (error) {
  console.error("Error processing order:", JSON.stringify(error, null, 2));
  return NextResponse.json({ error: `Error processing order: ${error}` }, { status: 400 });
}
  }

  return NextResponse.json({ received: true });
}