import {EnvelopeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {socialLinksField} from '../shared/socialLink'

export const contactSection = defineType({
  name: 'contactSection',
  title: 'Contact',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({name: 'title', title: 'Section title', type: 'localeString'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'localeString'}),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({name: 'contactPhone', title: 'Contact phone', type: 'string'}),
    defineField({name: 'whatsappLabel', title: 'WhatsApp label', type: 'localeString'}),
    defineField({name: 'whatsappUrl', title: 'WhatsApp URL', type: 'url'}),
    defineField({
      name: 'processSteps',
      title: 'How it works',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'localeString'}),
            defineField({name: 'description', title: 'Description', type: 'localeText'}),
          ],
          preview: {
            select: {title: 'title.en', subtitle: 'description.en'},
          },
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    socialLinksField,
  ],
  preview: {
    prepare() {
      return {title: 'Contact'}
    },
  },
})
