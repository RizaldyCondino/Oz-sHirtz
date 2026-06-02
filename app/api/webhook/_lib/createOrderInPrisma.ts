import { prisma } from "@/lib/prisma";
import { Metadata } from "@/actions/createCheckoutSession";
import { parseLineItems } from "./parseLineItems";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import type { Address } from "@prisma/client";

export async function createOrderInPrisma(session: Stripe.Checkout.Session) {
  const { id, amount_total, metadata, total_details } = session;

  const { orderNumber, customerName, customerEmail, clerkUserId, address } =
    metadata as unknown as Metadata & { address: string };

  const parsedAddress: Address | null = address ? JSON.parse(address) : null;

  if (!parsedAddress?.id) {
    throw new Error("No address found in session metadata");
  }

  const addressExists = await prisma.address.findUnique({
    where: { id: parsedAddress.id },
  });

  if (!addressExists) {
    throw new Error(`Address ${parsedAddress.id} not found in database`);
  }

  // Expand payment_intent to get the charge and receipt URL
  const expandedSession = await stripe.checkout.sessions.retrieve(id, {
    expand: ["payment_intent.latest_charge"],
  });
  const charge = (expandedSession.payment_intent as Stripe.PaymentIntent)
    ?.latest_charge as Stripe.Charge | null;
  const stripeReceiptUrl = charge?.receipt_url ?? null;

  const orderItems = await parseLineItems(id);

  const discountAmount = total_details?.amount_discount
    ? total_details.amount_discount / 100
    : 0;
  const totalAmount = amount_total ? amount_total / 100 : 0;

  await prisma.account.upsert({
    where: { clerkId: clerkUserId! },
    update: { email: customerEmail, name: customerName },
    create: {
      clerkId: clerkUserId!,
      email: customerEmail,
      name: customerName,
    },
  });

  const order = await prisma.order.create({
    data: {
      clerkId: clerkUserId!,
      addressId: parsedAddress.id,
      totalAmount,
      discountAmount,
      paymentMethod: "ONLINE",
      paymentStatus: "PAID",
      status: "CONFIRMED",
      notes: orderNumber,
      stripeReceiptUrl, 
      items: {
        create: orderItems,
      },
    },
    include: { items: true },
  });

  return order;
}