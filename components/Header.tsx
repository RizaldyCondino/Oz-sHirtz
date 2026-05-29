import HeaderClient from "@/app/(client)/header/HeaderClient";

import {
  getProducts,
  type Product,
} from "@/sanity/lib/queries";
import { getNavCategories } from "@/sanity/lib/queries/query";

export default async function Header() {
  const navCategories = (await getNavCategories()) ?? [];
  return <HeaderClient navCategories={navCategories} />;
}