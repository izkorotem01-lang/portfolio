import {BlockElementIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const servicesSection = defineType({
  name: 'servicesSection',
  title: 'Services',
  type: 'document',
  icon: BlockElementIcon,
  fields: [
    defineField({name: 'title', title: 'Section title', type: 'localeString'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'localeText'}),
  ],
  preview: {
    prepare() {
      return {title: 'Services'}
    },
  },
})
