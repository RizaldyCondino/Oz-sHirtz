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
  image?: any; // Sanity image asset
  score?: number; // relevance score for ranking
};

// ─── Step 1: GROQ Keyword Search ─────────────────────────────────────────────
// Searches across name, brand title, category title, shortDescription, materials
// Uses Sanity's built-in match operator for full-text search

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
          categories[]->title match $query
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
        "image": images[0],
        "colorwayImage": colorways[0].images[0]
      }
    `;

    const results = await client.fetch(groqQuery, {
      query: `*${query}*`, // wildcard for partial match
    });

    return results.map((r: SearchResult) => ({ ...r, score: 1 }));
  } catch (err) {
    console.error("[GROQ Search Error]", err);
    return [];
  }
}

// ─── Step 2: OpenAI Vector / Semantic Search ──────────────────────────────────
// How it works:
// 1. Fetch all products with their stored embeddings from Sanity
// 2. Convert user query to an embedding using OpenAI
// 3. Calculate cosine similarity between query embedding and each product embedding
// 4. Return top matches sorted by similarity score
//
// NOTE: Products need embeddings stored in Sanity first.
// Run the generateEmbeddings() function below once to populate them.

async function vectorSearch(query: string): Promise<SearchResult[]> {
  try {
    // Convert query to embedding vector
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small", // cheapest model — $0.02 per 1M tokens
      input: query,
    });

    const queryVector = embeddingResponse.data[0].embedding;

    // Fetch all products that have stored embeddings
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
        "image": images[0],
        "colorwayImage": colorways[0].images[0]
        embedding
      }
    `);

    // Calculate cosine similarity for each product
    const scored = products
      .map((product: any) => {
        if (!product.embedding) return null;
        const score = cosineSimilarity(queryVector, product.embedding);
        return { ...product, score };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10); // top 10 matches

    // Only return results above similarity threshold (0.3 = relevant)
    return scored.filter((p: any) => p.score > 0.3);
  } catch (err) {
    console.error("[Vector Search Error]", err);
    return [];
  }
}

// ─── Step 3: Hybrid Search — merges both results ─────────────────────────────
// - Runs GROQ and vector search in parallel (faster)
// - Deduplicates by _id
// - Boosts products that appear in BOTH searches (high confidence)
// - Returns sorted by combined relevance

export async function hybridSearch(
  query: string,
  mode: "groq" | "vector" | "hybrid" = "hybrid"
): Promise<SearchResult[]> {
  try {
    if (mode === "groq") {
      return await groqSearch(query);
    }

    if (mode === "vector") {
      return await vectorSearch(query);
    }

    // Hybrid: run both in parallel
    const [groqResults, vectorResults] = await Promise.all([
      groqSearch(query),
      vectorSearch(query),
    ]);

    // Merge and deduplicate
    const seen = new Map<string, SearchResult>();

    // Add GROQ results with base score
    groqResults.forEach((p) => {
      seen.set(p._id, { ...p, score: 1.0 });
    });

    // Merge vector results — boost score if already in GROQ results
    vectorResults.forEach((p) => {
      if (seen.has(p._id)) {
        // Product found in both — high confidence, boost score
        const existing = seen.get(p._id)!;
        seen.set(p._id, {
          ...existing,
          score: (existing.score ?? 1) + (p.score ?? 0) + 0.5, // +0.5 boost for appearing in both
        });
      } else {
        seen.set(p._id, p);
      }
    });

    // Sort by final score descending
    return Array.from(seen.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  } catch (err) {
    console.error("[Hybrid Search Error]", err);
    throw new Error("Search failed");
  }
}

// ─── Cosine Similarity Helper ─────────────────────────────────────────────────
// Measures how similar two vectors are (1 = identical, 0 = unrelated)

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

// ─── ONE-TIME SETUP: Generate & Store Embeddings in Sanity ───────────────────
// Run this ONCE to populate embeddings for all your products.
// After that, new products need embeddings generated when added.
//
// HOW TO RUN:
// Create a file: scripts/generateEmbeddings.ts
// Add to package.json: "generate-embeddings": "tsx scripts/generateEmbeddings.ts"
// Run: npm run generate-embeddings
//
// COST ESTIMATE: 500 products ≈ $0.001 (less than 1 cent)

export async function generateEmbeddingsForAllProducts() {
  try {
    // Fetch all products without embeddings
    const products = await client.fetch(`
      *[_type == "product" && !defined(embedding)] {
        _id,
        name,
        "brand": brand->title,
        "categories": categories[]->title,
        shortDescription,
        materials,
        price,
        status
      }
    `);

    console.log(`Generating embeddings for ${products.length} products...`);

    for (const product of products) {
      // Build a rich text string describing the product for embedding
      // The richer this text, the better the semantic search quality
      const textToEmbed = [
        product.name,
        product.brand && `Brand: ${product.brand}`,
        product.categories?.length && `Category: ${product.categories.join(", ")}`,
        product.shortDescription,
        product.materials && `Materials: ${product.materials}`,
        product.status && `Status: ${product.status}`,
        product.price && `Price: ₱${product.price}`,
      ]
        .filter(Boolean)
        .join(". ");

      // Generate embedding via OpenAI
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: textToEmbed,
      });

      const embedding = response.data[0].embedding;

      // Store embedding back in Sanity on the product document
      await client.patch(product._id).set({ embedding }).commit();

      console.log(`✓ ${product.name}`);
    }

    console.log("All embeddings generated!");
  } catch (err) {
    console.error("[Generate Embeddings Error]", err);
    throw err;
  }
}