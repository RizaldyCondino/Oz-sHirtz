import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCTS_BY_COLLECTION_QUERY } from "@/sanity/lib/queries/query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const collectionSlug = searchParams.get("collectionSlug") ?? "";
  const offset = Number(searchParams.get("offset") ?? 0);
  const limit = Number(searchParams.get("limit") ?? 12);

  const result = await sanityFetch({
    query: PRODUCTS_BY_COLLECTION_QUERY,
    params: { collectionSlug, offset, limit: offset + limit }, // GROQ [$offset...$limit] is exclusive end
  });

  return NextResponse.json({ products: result?.data ?? [] });
}