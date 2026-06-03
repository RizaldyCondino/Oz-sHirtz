// scripts/generateEmbeddings.ts
import OpenAI from "openai";
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sanity = createClient({
  projectId: "gt2f8579",
  dataset: "production",
  apiVersion: "2026-05-19",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function run() {
  const products = await sanity.fetch(`
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
    const text = [
      product.name,
      product.brand && `Brand: ${product.brand}`,
      product.categories?.length && `Category: ${product.categories.join(", ")}`,
      product.audience && `Audience: ${product.audience}`,
      product.shortDescription,
      product.materials && `Materials: ${product.materials}`,
      product.price && `Price: ₱${product.price}`,
    ].filter(Boolean).join(". ");

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    const embedding = response.data[0].embedding;
    await sanity.patch(product._id).set({ embedding }).commit();
    console.log(`✓ ${product.name}`);
  }

  console.log("Done!");
}

run().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});