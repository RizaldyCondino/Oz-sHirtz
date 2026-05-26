import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    // ── CORE ──────────────────────────────────────────
    defineField({ name: "name", title: "Product Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "sku", title: "Base SKU", type: "string" }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["active", "sale", "new", "featured", "snkrs", "sold-out", "coming-soon"],
        layout: "radio",
      },
      initialValue: "active",
      validation: (Rule) => Rule.required(),
    }),

    // ── PRICING ───────────────────────────────────────
    defineField({ 
      name: "price", 
      title: "Current Price", 
      type: "number", 
      validation: (Rule) => Rule.required().min(0) 
    }),
    
    defineField({ 
      name: "originalPrice", 
      title: "Original Price (Before Discount)", 
      type: "number",
      description: "Leave empty if no discount"
    }),

    defineField({ 
      name: "discount", 
      title: "Discount (%)", 
      type: "number", 
      validation: (Rule) => Rule.min(0).max(100),
      description: "Will be used to calculate sale price"
    }),

    // ── SALE CONTROL ──────────────────────────────────
    defineField({
      name: "isOnSale",
      title: "Force Show in Sale Section",
      type: "boolean",
      initialValue: false,
      description: "Manually include this product in Sale even if discount is 0",
    }),

    // ── VARIANTS ──────────────────────────────────────
    defineField({
      name: "colorways",
      title: "Colorways",
      type: "array",
      of: [
        {
          type: "object",
          name: "colorway",
          fields: [
            defineField({ name: "name", title: "Color Name", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "hex", title: "Hex Code", type: "string" }),
            defineField({ name: "price", title: "Colorway Price (Optional)", type: "number" }),
            defineField({ 
              name: "discount", 
              title: "Colorway Discount (%)", 
              type: "number", 
              validation: (Rule) => Rule.min(0).max(100) 
            }),
            defineField({
              name: "sizes",
              title: "Sizes & Stock",
              type: "array",
              of: [{
                type: "object",
                name: "sizeConfiguration",
                fields: [
                  defineField({ name: "size", title: "Size", type: "string", validation: (Rule) => Rule.required() }),
                  defineField({ name: "stock", title: "Stock Quantity", type: "number", initialValue: 0, validation: (Rule) => Rule.required().min(0) }),
                  defineField({ name: "sku", title: "Variant SKU", type: "string", validation: (Rule) => Rule.required() }),
                  defineField({ name: "price", title: "Size Specific Price", type: "number" }),
                ],
              }],
            }),
            defineField({ name: "images", title: "Color Variant Images", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
          ],
        },
      ],
    }),

    // ── LEGACY SIZES FALLBACK ─────────────────────────
    defineField({
      name: "sizes",
      title: "Sizes (Fallback)",
      type: "array",
      of: [{ type: "string" }],
      description: "Only used as fallback if no colorways are defined",
    }),

    // ── RELATIONS ─────────────────────────────────────
    defineField({ name: "audience", title: "Audience", type: "reference", to: [{ type: "audience" }], validation: (Rule) => Rule.required() }),
    defineField({ name: "categories", title: "Categories", type: "array", of: [{ type: "reference", to: [{ type: "category" }] }], validation: (Rule) => Rule.required().min(1) }),
    defineField({ name: "brand", title: "Brand", type: "reference", to: [{ type: "brand" }] }),
    defineField({ name: "collection", title: "Collection", type: "reference", to: [{ type: "collection" }] }),

    // ── PRODUCT ATTRIBUTES ─────────────────────────────
    defineField({ name: "description", title: "Detailed Description", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "shortDescription", title: "Short Description", type: "text", rows: 3 }),
    defineField({ name: "features", title: "Key Features", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "materials", title: "Materials", type: "string" }),
    defineField({ name: "careInstructions", title: "Care Instructions", type: "string" }),
    defineField({ name: "countryOfOrigin", title: "Country of Origin", type: "string" }),
    defineField({
      name: "fit",
      title: "Fit",
      type: "string",
      options: { list: ["slim", "regular", "relaxed", "oversized", "compression"] },
    }),

    // ── FLAGS ──────────────────────────────────────────
    defineField({ name: "isFeatured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "isNew", title: "New Arrival", type: "boolean", initialValue: false }),
    defineField({ name: "isBestSeller", title: "Best Seller", type: "boolean", initialValue: false }),
    defineField({ name: "isSnkrs", title: "SNKRS Drop", type: "boolean", initialValue: false }),

    // ── DATES ─────────────────────────────────────────
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "releaseDate", title: "Release Date", type: "datetime" }),

    // ── SEO ───────────────────────────────────────────
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text", rows: 2 }),
      ],
    }),

    // ── IMAGES ────────────────────────────────────────
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "status",
      audience: "audience.title",
      price: "price",
      discount: "discount",
      isOnSale: "isOnSale",
    },
    prepare({ title, subtitle, audience, price, discount, isOnSale }) {
      const saleTag = (isOnSale || (discount && discount > 0)) ? "🔥 SALE" : "";
      return {
        title,
        subtitle: `${subtitle?.toUpperCase()} • ${audience || ""} • ₱${price} ${saleTag}`,
      };
    },
  },
});