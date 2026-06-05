// actions/getOrderByNumber.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findFirst({
    where: { notes: orderNumber },
    include: { items: true },
  });
}