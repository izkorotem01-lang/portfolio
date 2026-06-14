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
    defineField({
      name: 'maxVideosDisplayed',
      title: 'Max videos per category',
      type: 'number',
      description:
        'Maximum number of videos shown in each category tab, including All Videos.',
      initialValue: 8,
      validation: (Rule) => Rule.required().integer().min(1).max(100),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Our Work'}
    },
  },
})
