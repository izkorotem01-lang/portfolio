import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const portfolioCategory = defineType({
  name: 'portfolioCategory',
  title: 'Portfolio Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'showInFilters',
      title: 'Show in portfolio filters',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off for videos that should appear only under All Work.',
    }),
  ],
  orderings: [{title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {titleEn: 'name.en', titleHe: 'name.he', order: 'order'},
    prepare({titleEn, titleHe, order}) {
      return {title: titleEn || titleHe || 'Category', subtitle: `Order ${order ?? 0}`}
    },
  },
})
