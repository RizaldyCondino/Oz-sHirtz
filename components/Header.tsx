import HeaderClient from "@/app/(client)/header/HeaderClient";


import { getCollectionsForNav, getNavCategories } from "@/sanity/lib/queries/query";

export default async function Header() {
  const [navCategories, collections] = await Promise.all([
    getNavCategories(),
    getCollectionsForNav(),
  ]);

  return (
    <HeaderClient
      navCategories={navCategories ?? []}
      collections={collections ?? []}
    />
  );
}