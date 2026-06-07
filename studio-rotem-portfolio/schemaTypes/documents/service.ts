import {ComposeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'localeText'}),
    defineField({
      name: 'icon',
      title: 'Icon name',
      type: 'string',
      description: 'Lucide icon name (e.g. video, zap)',
    }),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 0}),
  ],
  orderings: [{title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title.en', subtitle: 'icon'},
  },
})
