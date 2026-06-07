import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const introductionSection = defineType({
  name: 'introductionSection',
  title: 'Introduction',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({
          name: 'wordmarkImage',
          title: 'Title image',
          type: 'image',
          description: 'Main hero wordmark / title graphic',
          options: {hotspot: true},
        }),
        defineField({name: 'wordmarkAlt', title: 'Title image alt', type: 'localeString'}),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'localeString',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'cta',
          title: 'Primary button',
          type: 'localeString',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'trustedBy',
      title: 'Trusted By',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'localeString'}),
        defineField({name: 'subtitle', title: 'Subtitle', type: 'localeString'}),
        defineField({name: 'visitLabel', title: 'Visit link label', type: 'localeString'}),
        defineField({name: 'clientLabel', title: 'Client label', type: 'localeString'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Introduction'}
    },
  },
})
