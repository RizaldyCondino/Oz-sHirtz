import { defineField, defineType } from "sanity";

export const collectionType = defineType({
  name: "collection",
  title: "Collection",
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "season",
      title: "Season",
      type: "string",
      options: {
        list: [
          { title: "Spring/Summer", value: "SS" },
          { title: "Fall/Winter", value: "FW" },
          { title: "All Season", value: "ALL" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),

    // ─── Hero Text Layout ──────────────────────────────────────────────────
    defineField({
      name: "textPosition",
      title: "Text Position",
      description: "Where should the title and description appear over the hero image?",
      type: "string",
      options: {
        list: [
          { title: "↖  Top Left",      value: "top-left" },
          { title: "↑  Top Center",    value: "top-center" },
          { title: "↗  Top Right",     value: "top-right" },
          { title: "←  Middle Left",   value: "middle-left" },
          { title: "✛  Middle Center", value: "middle-center" },
          { title: "→  Middle Right",  value: "middle-right" },
          { title: "↙  Bottom Left",   value: "bottom-left" },
          { title: "↓  Bottom Center", value: "bottom-center" },
          { title: "↘  Bottom Right",  value: "bottom-right" },
        ],
        layout: "radio",
      },
      initialValue: "bottom-left",
    }),
    defineField({
      name: "textAlign",
      title: "Text Alignment",
      description: "Horizontal alignment of the text block itself.",
      type: "string",
      options: {
        list: [
          { title: "Left",   value: "left" },
          { title: "Center", value: "center" },
          { title: "Right",  value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),

    // ─── Gallery ──────────────────────────────────────────────────────────
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      description: "3 images shown side-by-side below the hero. Each can have its own link.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
            defineField({
              name: "link",
              title: "Link URL",
              type: "string",
              description: "e.g. /collections/summer-25 or /product/air-max-1",
            }),
            defineField({
              name: "label",
              title: "Hover Label",
              type: "string",
              initialValue: "View Collection",
            }),
          ],
          preview: {
            select: { title: "alt", media: "image" },
            prepare({ title, media }) {
              return { title: title || "Gallery Image", media };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    defineField({
      name: "isFeatured",
      title: "Featured Collection",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "dropDate",
      title: "Drop Date",
      type: "datetime",
    }),
    defineField({
      name: "isSnkrs",
      title: "SNKRS Drop",
      description: "Is this a special SNKRS exclusive release?",
      type: "boolean",
      initialValue: false,
    }),
  ],
});