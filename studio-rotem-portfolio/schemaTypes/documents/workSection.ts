import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const workSection = defineType({
  name: 'workSection',
  title: 'Our Work',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({name: 'title', title: 'Section title', type: 'localeString'}),
    defineField({name: 'allWorkLabel', title: 'All Work tab', type: 'localeString'}),
    defineField({name: 'expandVideoLabel', title: 'Expand video label', type: 'localeString'}),
  ],
  preview: {
    prepare() {
      return {title: 'Our Work'}
    },
  },
})
