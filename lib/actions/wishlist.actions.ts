// actions/wishlist.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getWishlist() {
  const { userId } = await auth();
  if (!userId) return null; // ← not throw
  
  return prisma.wishlist.findUnique({
    where: { clerkId: userId },
    include: { items: true },
  });
}

export async function addToWishlist(item: {
  productId: string;
  name: string;
  price: number;
  image?: string;
  slug?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let wishlist = await prisma.wishlist.findUnique({ where: { clerkId: userId } });
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({ data: { clerkId: userId } });
  }

  await prisma.wishlistItem.upsert({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId: item.productId,
      },
    },
    update: {}, // already exists, no update needed
    create: {
      wishlistId: wishlist.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug,
    },
  });

  revalidatePath("/wishlist");
}

export async function removeFromWishlist(productId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const wishlist = await prisma.wishlist.findUnique({ where: { clerkId: userId } });
  if (!wishlist) return;

  await prisma.wishlistItem.delete({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId,
      },
    },
  });

  revalidatePath("/wishlist");
}

export async function isInWishlist(productId: string): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const wishlist = await prisma.wishlist.findUnique({ where: { clerkId: userId } });
  if (!wishlist) return false;

  const item = await prisma.wishlistItem.findUnique({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId,
      },
    },
  });

  return !!item;
}