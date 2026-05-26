import HeaderClient from "@/app/(client)/header/HeaderClient";

import {
  getProducts,
  type Product,
} from "@/sanity/lib/queries";

export default async function Header() {
  const products: Product[] =
    (await getProducts()) ?? [];

  return (
    <HeaderClient
      products={products}
    />
  );
}