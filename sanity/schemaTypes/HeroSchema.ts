import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Nike-style Hero Schema
 *
 * Designed around Nike's hero patterns:
 * - Full-bleed cinematic background (image or video)
 * - Bold, short headline (often ALL CAPS, single line)
 * - Optional product spotlight (foreground product image)
 * - Minimal body copy
 * - 1–2 strong CTAs (e.g. "Shop Now", "Find Out More")
 * - Collection/campaign label (eyebrow)
 * - Text position control (bottom-left, center, bottom-right)
 */

export const HeroSchema = defineType({
  name: 'nikeHero',
  title: 'Hero — Nike Style',
  type: 'object',

  fields: [
    // ─── Campaign Identity ───────────────────────────────────────────────────

    defineField({
      name: 'campaignLabel',
      title: 'Campaign / Collection Label',
      type: 'string',
      description: 'Eyebrow label shown above the headline (e.g. "Nike Air Max", "Just Dropped")',
    }),

    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Short, punchy headline. Nike style = 1–5 words, often all-caps (e.g. "JUST DO IT", "BORN TO RUN")',
      validation: (Rule) => Rule.required().max(60),
    }),

    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
      description: 'Optional supporting copy — keep it brief (1–2 sentences max)',
    }),

    // ─── CTAs ────────────────────────────────────────────────────────────────

    defineField({
      name: 'ctas',
      title: 'CTA Buttons',
      type: 'array',
      description: 'Nike typically uses 1 primary CTA + 1 secondary. Max 2.',
      of: [
        defineArrayMember({
          name: 'cta',
          title: 'Button',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. "Shop Now", "Explore", "Find Out More"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
            }),
            defineField({
              name: 'style',
              title: 'Button Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Filled Black (Primary)', value: 'filledBlack' },
                  { title: 'Filled White (on dark bg)', value: 'filledWhite' },
                  { title: 'Outline Black', value: 'outlineBlack' },
                  { title: 'Outline White (on dark bg)', value: 'outlineWhite' },
                  { title: 'Text Link with Arrow', value: 'textArrow' },
                ],
                layout: 'radio',
              },
              initialValue: 'filledBlack',
            }),
            defineField({
              name: 'openInNewTab',
              title: 'Open in New Tab',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'style' },
          },
        }),
      ],
      validation: (Rule) => Rule.max(2),
    }),

    // ─── Background Media ────────────────────────────────────────────────────

    defineField({
      name: 'backgroundType',
      title: 'Background Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video (autoplay)', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),

    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Full-bleed cinematic background. Recommend 1920×1080px minimum, 16:9 or wider.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'mobileImage',
          title: 'Mobile Override Image',
          type: 'image',
          description: 'Optional portrait-crop version for mobile (9:16). Falls back to main image if not set.',
          options: { hotspot: true },
        }),
      ],
      hidden: ({ parent }) => parent?.backgroundType === 'video',
    }),

    defineField({
      name: 'backgroundVideo',
      title: 'Background Video',
      type: 'object',
      description: 'Autoplay, muted, looping video background',
      fields: [
        defineField({
          name: 'videoFile',
          title: 'Video File',
          type: 'file',
          description: 'Upload an MP4 file',
          options: { accept: 'video/mp4' },
        }),
        defineField({
          name: 'posterImage',
          title: 'Poster / Fallback Image',
          type: 'image',
          description: 'Shown before video loads or on mobile',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
          ],
        }),
        defineField({
          name: 'disableOnMobile',
          title: 'Disable Video on Mobile',
          type: 'boolean',
          description: 'Show poster image instead of video on mobile (recommended for performance)',
          initialValue: true,
        }),
      ],
      hidden: ({ parent }) => parent?.backgroundType !== 'video',
    }),

    defineField({
      name: 'overlayOpacity',
      title: 'Background Overlay Opacity',
      type: 'number',
      description: 'Dark scrim over background to improve text legibility (0 = none, 100 = full black)',
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 20,
    }),

    // ─── Product Spotlight ───────────────────────────────────────────────────

    defineField({
      name: 'productImage',
      title: 'Product Spotlight Image',
      type: 'image',
      description: 'Foreground product image (e.g. a shoe cutout). Layered on top of the background. Use PNG with transparent background.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'position',
          title: 'Product Image Position',
          type: 'string',
          options: {
            list: [
              { title: 'Right', value: 'right' },
              { title: 'Left', value: 'left' },
              { title: 'Center (behind text)', value: 'center' },
            ],
            layout: 'radio',
          },
          initialValue: 'right',
        }),
      ],
    }),

    // ─── Layout & Theme ──────────────────────────────────────────────────────

    defineField({
      name: 'textPosition',
      title: 'Text Position',
      type: 'string',
      description: 'Where the headline/CTA block sits within the hero',
      options: {
        list: [
          { title: 'Bottom Left (Nike default)', value: 'bottomLeft' },
          { title: 'Bottom Center', value: 'bottomCenter' },
          { title: 'Bottom Right', value: 'bottomRight' },
          { title: 'Center Left', value: 'centerLeft' },
          { title: 'Center', value: 'center' },
        ],
        layout: 'radio',
      },
      initialValue: 'bottomLeft',
    }),

    defineField({
      name: 'textTheme',
      title: 'Text Color Theme',
      type: 'string',
      options: {
        list: [
          { title: 'White (for dark/photo backgrounds)', value: 'white' },
          { title: 'Black (for light backgrounds)', value: 'black' },
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),

    defineField({
      name: 'aspectRatio',
      title: 'Hero Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: 'Full Viewport Height (100vh)', value: 'fullVh' },
          { title: 'Cinematic (21:9)', value: '21/9' },
          { title: 'Widescreen (16:9)', value: '16/9' },
          { title: 'Square-ish (4:3)', value: '4/3' },
        ],
        layout: 'radio',
      },
      initialValue: 'fullVh',
    }),

    // ─── SEO / Accessibility ─────────────────────────────────────────────────

    defineField({
      name: 'ariaLabel',
      title: 'Section ARIA Label',
      type: 'string',
      description: 'Accessible label for the hero section (e.g. "Nike Air Max campaign hero")',
    }),
  ],

  preview: {
    select: {
      title: 'headline',
      subtitle: 'campaignLabel',
      media: 'backgroundImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Nike Hero',
        subtitle: subtitle || 'No campaign label',
        media,
      }
    },
  },
})