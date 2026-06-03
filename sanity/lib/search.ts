"use server";
// lib/search.ts

// Hybrid search: GROQ (keyword) + OpenAI (vector/semantic)

import { client } from "@/sanity/lib/client";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type SearchResult = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  status?: string;
  isOnSale?: boolean;
  isNew?: boolean;
  brand?: string;
  category?: string;
  audience?: string; // ← added
  image?: any;
  score?: number;
};

// ─── Step 1: GROQ Keyword Search ─────────────────────────────────────────────

async function groqSearch(query: string): Promise<SearchResult[]> {
  try {
    const groqQuery = `
      *[
        _type == "product" &&
        status != "sold-out" &&
        (
          name match $query ||
          shortDescription match $query ||
          materials match $query ||
          brand->title match $query ||
          categories[]->title match $query ||
          audience->title match $query
        )
      ] | order(_score desc) [0...10] {
        _id,
        "name": name,
        "slug": slug.current,
        price,
        originalPrice,
        discount,
        status,
        isOnSale,
        isNew,
        "brand": brand->title,
        "category": categories[0]->title,
        "audience": audience->title,
        "image": images[0],
        "colorwayImage": colorways[0].images[0]
      }
    `;

    const results = await client.fetch(groqQuery, {
      query: `*${query}*`,
    });

    return results.map((r: SearchResult) => ({ ...r, score: 1 }));
  } catch (err) {
    console.error("[GROQ Search Error]", err);
    return [];
  }
}

// ─── Step 2: OpenAI Vector / Semantic Search ──────────────────────────────────

async function vectorSearch(query: string): Promise<SearchResult[]> {
  try {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const queryVector = embeddingResponse.data[0].embedding;

    const products = await client.fetch(`
      *[_type == "product" && defined(embedding) && status != "sold-out"] {
        _id,
        "name": name,
        "slug": slug.current,
        price,
        originalPrice,
        discount,
        status,
        isOnSale,
        isNew,
        "brand": brand->title,
        "category": categories[0]->title,
        "audience": audience->title,
        "image": images[0],
        "colorwayImage": colorways[0].images[0],
        embedding
      }
    `);

    const scored = products
      .map((product: any) => {
        if (!product.embedding) return null;
        const score = cosineSimilarity(queryVector, product.embedding);
        return { ...product, score };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10);

    return scored.filter((p: any) => p.score > 0.3);
  } catch (err) {
    console.error("[Vector Search Error]", err);
    return [];
  }
}

// ─── Step 3: Hybrid Search ────────────────────────────────────────────────────

export async function hybridSearch(
  query: string,
  mode: "groq" | "vector" | "hybrid" = "hybrid"
): Promise<SearchResult[]> {
  try {
    if (mode === "groq") return await groqSearch(query);
    if (mode === "vector") return await vectorSearch(query);

    const [groqResults, vectorResults] = await Promise.all([
      groqSearch(query),
      vectorSearch(query),
    ]);

    const seen = new Map<string, SearchResult>();

    groqResults.forEach((p) => {
      seen.set(p._id, { ...p, score: 1.0 });
    });

    vectorResults.forEach((p) => {
      if (seen.has(p._id)) {
        const existing = seen.get(p._id)!;
        seen.set(p._id, {
          ...existing,
          score: (existing.score ?? 1) + (p.score ?? 0) + 0.5,
        });
      } else {
        seen.set(p._id, p);
      }
    });

    return Array.from(seen.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  } catch (err) {
    console.error("[Hybrid Search Error]", err);
    throw new Error("Search failed");
  }
}

// ─── Cosine Similarity Helper ─────────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

// ─── ONE-TIME SETUP: Generate & Store Embeddings ──────────────────────────────

export async function generateEmbeddingsForAllProducts() {
  try {
    const products = await client.fetch(`
      *[_type == "product" && !defined(embedding)] {
        _id,
        name,
        "brand": brand->title,
        "categories": categories[]->title,
        "audience": audience->title,
        shortDescription,
        materials,
        price,
        status
      }
    `);

    console.log(`Generating embeddings for ${products.length} products...`);

    for (const product of products) {
      const textToEmbed = [
        product.name,
        product.brand && `Brand: ${product.brand}`,
        product.categories?.length && `Category: ${product.categories.join(", ")}`,
        product.audience && `Audience: ${product.audience}`,
        product.shortDescription,
        product.materials && `Materials: ${product.materials}`,
        product.status && `Status: ${product.status}`,
        product.price && `Price: ₱${product.price}`,
      ]
        .filter(Boolean)
        .join(". ");

      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: textToEmbed,
      });

      const embedding = response.data[0].embedding;
      await client.patch(product._id).set({ embedding }).commit();
      console.log(`✓ ${product.name}`);
    }

    console.log("All embeddings generated!");
  } catch (err) {
    console.error("[Generate Embeddings Error]", err);
    throw err;
  }
}