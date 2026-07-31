import {StarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Client name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'company', title: 'Company', type: 'string'}),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'text',
      title: 'Review text',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 0}),
  ],
  orderings: [{title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {
      title: 'name',
      subtitle: 'company',
      rating: 'rating',
    },
    prepare({title, subtitle, rating}) {
      return {
        title,
        subtitle: [subtitle, rating && `${rating}★`].filter(Boolean).join(' · '),
      }
    },
  },
})
