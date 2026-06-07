import {UsersIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutSection = defineType({
  name: 'aboutSection',
  title: 'Who Are We',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'localeString',
      description: 'Main statement (e.g. We help brands & creators look undeniable on video).',
    }),
    defineField({
      name: 'subline',
      title: 'Subline',
      type: 'localeString',
      description: 'Supporting line under the headline.',
    }),
    defineField({
      name: 'founders',
      title: 'Founders',
      type: 'array',
      of: [defineArrayMember({type: 'aboutFounder'})],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'audience',
      title: 'Target audience',
      type: 'localeText',
      description: 'Who the service is for.',
    }),
    defineField({
      name: 'capabilities',
      title: 'What we do',
      type: 'array',
      of: [defineArrayMember({type: 'aboutCapability'})],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Who Are We'}
    },
  },
})
