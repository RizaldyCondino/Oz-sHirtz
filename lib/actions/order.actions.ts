// actions/order.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────

export async function createOrder(data: {
  addressId: string;
  totalAmount: number;
  discountAmount?: number;
  paymentMethod: "ONLINE" | "COD" | "PAY_LATER";
  notes?: string;
  items: {
    productId: string;
    name: string;
    price: number;
    image?: string;
    colorway?: string;
    size?: string;
    quantity: number;
  }[];
  // For PAY_LATER only
  payLaterDueDate?: Date;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const order = await prisma.order.create({
    data: {
      clerkId: userId,
      addressId: data.addressId,
      totalAmount: data.totalAmount,
      discountAmount: data.discountAmount ?? 0,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "COD" ? "UNPAID" : "UNPAID",
      notes: data.notes,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          colorway: item.colorway ?? "",
          size: item.size ?? "",
          quantity: item.quantity,
        })),
      },
      // Create PayLater record if applicable
      ...(data.paymentMethod === "PAY_LATER" && data.payLaterDueDate
        ? {
            payLater: {
              create: {
                clerkId: userId,
                dueDate: data.payLaterDueDate,
                amountDue: data.totalAmount,
                amountPaid: 0,
                status: "PENDING",
              },
            },
          }
        : {}),
    },
    include: { items: true, payLater: true },
  });

  // Clear cart after order
  const cart = await prisma.cart.findUnique({ where: { clerkId: userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  revalidatePath("/orders");
  return order;
}

export async function getOrders() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.order.findMany({
    where: { clerkId: userId },
    include: { items: true, address: true, payLater: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(orderId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.order.findFirst({
    where: { id: orderId, clerkId: userId },
    include: { items: true, address: true, payLater: true },
  });
}

export async function cancelOrder(orderId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const order = await prisma.order.updateMany({
    where: { id: orderId, clerkId: userId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/orders");
  return order;
}

// ─────────────────────────────────────────────
// PAY LATER
// ─────────────────────────────────────────────

export async function getPayLaterOrders() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.payLater.findMany({
    where: { clerkId: userId },
    include: { order: { include: { items: true } } },
    orderBy: { dueDate: "asc" },
  });
}

export async function makePayLaterPayment(payLaterId: string, amount: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const payLater = await prisma.payLater.findFirst({
    where: { id: payLaterId, clerkId: userId },
  });

  if (!payLater) throw new Error("Pay Later record not found");

  const newAmountPaid = payLater.amountPaid + amount;
  const isPaid = newAmountPaid >= payLater.amountDue;

  const updated = await prisma.payLater.update({
    where: { id: payLaterId },
    data: {
      amountPaid: newAmountPaid,
      status: isPaid ? "PAID" : "PARTIAL",
    },
  });

  // Update order payment status if fully paid
  if (isPaid) {
    await prisma.order.update({
      where: { id: payLater.orderId },
      data: { paymentStatus: "PAID" },
    });
  }

  revalidatePath("/orders");
  return updated;
}