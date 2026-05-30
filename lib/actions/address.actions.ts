// actions/address.actions.ts
"use server";
 
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
 
export async function getAddresses() {
  const { userId } = await auth();
  if (!userId) return []; // ← return empty array instead of throwing
 
  return prisma.address.findMany({
    where: { clerkId: userId },
    orderBy: { createdAt: "desc" },
  });
}
 
export async function addAddress(data: {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  isDefault?: boolean;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
 
  // If new address is default, unset all others
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { clerkId: userId },
      data: { isDefault: false },
    });
  }
 
  const address = await prisma.address.create({
    data: { ...data, clerkId: userId },
  });
 
  revalidatePath("/cart");
  return address;
}
 
export async function updateAddress(
  id: string,
  data: Partial<{
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }>
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
 
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { clerkId: userId },
      data: { isDefault: false },
    });
  }
 
  const address = await prisma.address.update({
    where: { id, clerkId: userId },
    data,
  });
 
  revalidatePath("/cart");
  return address;
}
 
export async function deleteAddress(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Check if this address is used in any orders
  const orderCount = await prisma.order.count({
    where: { addressId: id, clerkId: userId },
  });

  if (orderCount > 0) {
    throw new Error(
      `This address can't be deleted because it's linked to ${orderCount} order${orderCount > 1 ? "s" : ""}.`
    );
  }

  await prisma.address.delete({
    where: { id, clerkId: userId },
  });
}