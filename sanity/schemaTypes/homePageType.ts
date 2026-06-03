import { defineType, defineField } from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'nikeHero',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})