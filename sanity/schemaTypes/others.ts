import { defineField, defineType } from "sanity";

// ─────────────────────────────────────────
// AUTHOR
// ─────────────────────────────────────────
export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "bio", title: "Bio", type: "text" }),
    defineField({ name: "role", title: "Role", type: "string" }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});

// ─────────────────────────────────────────
// BLOG CATEGORY
// ─────────────────────────────────────────
export const blogCategoryType = defineType({
  name: "blogCategory",
  title: "Blog Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
  ],
});

// ─────────────────────────────────────────
// ORDER
// ─────────────────────────────────────────
export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "customerName", title: "Customer Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
            },
            { name: "quantity", title: "Quantity", type: "number" },
            { name: "selectedSize", title: "Size", type: "string" },
            { name: "selectedColorway", title: "Color", type: "string" },
            { name: "priceAtPurchase", title: "Price at Purchase", type: "number" },
          ],
          preview: {
            select: {
              title: "product.name",
              subtitle: "selectedSize",
              qty: "quantity",
            },
            prepare({ title, subtitle, qty }) {
              return { title, subtitle: `Size: ${subtitle} | Qty: ${qty}` };
            },
          },
        },
      ],
    }),
    defineField({ name: "totalPrice", title: "Total Price", type: "number" }),
    defineField({ name: "currency", title: "Currency", type: "string", initialValue: "USD" }),
    defineField({ name: "orderDate", title: "Order Date", type: "datetime" }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        { name: "name", title: "Full Name", type: "string" },
        { name: "address", title: "Address", type: "string" },
        { name: "city", title: "City", type: "string" },
        { name: "state", title: "State", type: "string" },
        { name: "zip", title: "ZIP", type: "string" },
        { name: "country", title: "Country", type: "string" },
      ],
    }),
    defineField({ name: "trackingNumber", title: "Tracking Number", type: "string" }),
    defineField({ name: "notes", title: "Notes", type: "text" }),
    defineField({ name: "clerkUserId", title: "Clerk User ID", type: "string" }),
  ],
  preview: {
    select: {
      title: "orderNumber",
      subtitle: "customerName",
      status: "status",
    },
    prepare({ title, subtitle, status }) {
      return { title: `#${title}`, subtitle: `${subtitle} — ${status}` };
    },
  },
  orderings: [
    {
      title: "Newest First",
      name: "orderDateDesc",
      by: [{ field: "orderDate", direction: "desc" }],
    },
  ],
});

// ─────────────────────────────────────────
// ADDRESS
// ─────────────────────────────────────────
export const addressType = defineType({
  name: "address",
  title: "Address",
  type: "document",
  fields: [
    defineField({ name: "clerkUserId", title: "Clerk User ID", type: "string" }),
    defineField({ name: "name", title: "Full Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "address", title: "Street Address", type: "string" }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({ name: "state", title: "State / Province", type: "string" }),
    defineField({ name: "zip", title: "ZIP / Postal Code", type: "string" }),
    defineField({ name: "country", title: "Country", type: "string", initialValue: "US" }),
    defineField({
      name: "isDefault",
      title: "Default Address",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime" }),
  ],
  preview: {
    select: { title: "name", subtitle: "address" },
  },
});

// ─────────────────────────────────────────
// REVIEW
// ─────────────────────────────────────────
export const reviewType = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "clerkUserId", title: "Clerk User ID", type: "string" }),
    defineField({ name: "reviewerName", title: "Reviewer Name", type: "string" }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({ name: "title", title: "Review Title", type: "string" }),
    defineField({ name: "body", title: "Review Body", type: "text" }),
    defineField({
      name: "isVerifiedPurchase",
      title: "Verified Purchase",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isApproved",
      title: "Approved",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime" }),
    defineField({
      name: "fit",
      title: "Fit Feedback",
      type: "string",
      options: {
        list: [
          { title: "Runs Small", value: "runs-small" },
          { title: "True to Size", value: "true-to-size" },
          { title: "Runs Large", value: "runs-large" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: {
      title: "reviewerName",
      subtitle: "product.name",
      rating: "rating",
    },
    prepare({ title, subtitle, rating }) {
      return { title, subtitle: `${subtitle} — ${rating}★` };
    },
  },
});