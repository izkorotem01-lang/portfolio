import {CogIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'footerText',
      title: 'Footer copyright',
      type: 'localeString',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Footer & global'}
    },
  },
})
