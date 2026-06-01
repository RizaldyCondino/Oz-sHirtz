import { getOrders } from "@/lib/actions/order.actions";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import OrdersClient from "./OrdersClient";

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const orders = await getOrders();
  return <OrdersClient orders={orders} />;
}