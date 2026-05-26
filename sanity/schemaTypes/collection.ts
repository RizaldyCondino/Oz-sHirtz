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