"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export async function getWishlist() {
  noStore(); // Prevents caching of the initial empty result
  const { userId } = await auth();
  
  if (!userId) return [];

  const wishlist = await prisma.wishlist.findUnique({
    where: { clerkId: userId },
    include: { items: true },
  });

  return wishlist?.items ?? [];
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

  const cleanImage = item.image && typeof item.image === 'string' && item.image.trim() !== ''
    && item.image.trim() !== 'null' && item.image.trim() !== 'undefined'
    ? item.image.trim()
    : null;

  await prisma.wishlistItem.upsert({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId: item.productId,
      },
    },
    update: {
      name: item.name,
      price: item.price,
      image: cleanImage,
      slug: item.slug,
    },
    create: {
      wishlistId: wishlist.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: cleanImage,
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
  noStore();
  const { userId } = await auth();
  if (!userId) return false;

  const item = await prisma.wishlistItem.findFirst({
    where: {
      wishlist: { clerkId: userId },
      productId,
    },
  });

  return !!item;
}

export async function getWishlistCount(): Promise<number> {
  noStore();
  const { userId } = await auth();
  if (!userId) return 0;

  const wishlist = await prisma.wishlist.findUnique({
    where: { clerkId: userId },
    select: {
      _count: { select: { items: true } },
    },
  });

  return wishlist?._count.items ?? 0;
}