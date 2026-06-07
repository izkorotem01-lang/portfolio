import {StarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const reviewsSection = defineType({
  name: 'reviewsSection',
  title: 'Reviews',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({name: 'title', title: 'Section title', type: 'localeString'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'localeText'}),
    defineField({name: 'ctaTitle', title: 'CTA title', type: 'localeString'}),
    defineField({name: 'ctaSubtitle', title: 'CTA subtitle', type: 'localeText'}),
    defineField({name: 'ctaContact', title: 'CTA contact button', type: 'localeString'}),
    defineField({name: 'ctaPortfolio', title: 'CTA portfolio button', type: 'localeString'}),
  ],
  preview: {
    prepare() {
      return {title: 'Reviews'}
    },
  },
})
