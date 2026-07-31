import {UsersIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const trustedByClient = defineType({
  name: 'trustedByClient',
  title: 'Trusted By Client',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Client name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Upload the client logo. Falls back to legacy icon if empty.',
    }),
    defineField({
      name: 'iconKey',
      title: 'Legacy icon key (deprecated)',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
    defineField({name: 'url', title: 'Website URL', type: 'url'}),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().min(0),
    }),
  ],
  orderings: [{title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', media: 'logo', order: 'order'},
    prepare({title, media, order}) {
      return {title, media, subtitle: typeof order === 'number' ? `#${order}` : undefined}
    },
  },
})
