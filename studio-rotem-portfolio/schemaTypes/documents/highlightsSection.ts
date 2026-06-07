import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const highlightsSection = defineType({
  name: 'highlightsSection',
  title: 'Highlights',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'showcaseTitle',
      title: 'Section title',
      type: 'localeString',
      description: 'Title shown above the highlights grid (e.g. HIGHLIGHTS).',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Highlights'}
    },
  },
})
