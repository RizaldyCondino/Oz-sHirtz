// actions/cart.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCart() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.cart.findUnique({
    where: { clerkId: userId },
    include: { items: true },
  });
}

export async function addToCart(item: {
  productId: string;
  name: string;
  price: number;
  image?: string;
  colorway?: string;
  size?: string;
  quantity?: number;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get or create cart
  let cart = await prisma.cart.findUnique({ where: { clerkId: userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { clerkId: userId } });
  }

  // Upsert cart item
  await prisma.cartItem.upsert({
    where: {
      cartId_productId_colorway_size: {
        cartId: cart.id,
        productId: item.productId,
        colorway: item.colorway ?? "",
        size: item.size ?? "",
      },
    },
    update: { quantity: { increment: item.quantity ?? 1 } },
    create: {
      cartId: cart.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      colorway: item.colorway ?? "",
      size: item.size ?? "",
      quantity: item.quantity ?? 1,
    },
  });

  revalidatePath("/cart");
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
}

export async function removeFromCart(itemId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/cart");
}

export async function clearCart() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const cart = await prisma.cart.findUnique({ where: { clerkId: userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  revalidatePath("/cart");
}