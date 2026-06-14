import {defineField, defineType} from 'sanity'

export const proofCardTitleSegment = defineType({
  name: 'proofCardTitleSegment',
  title: 'Title segment',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'accent',
      title: 'Orange accent',
      type: 'boolean',
      description: 'Turn on for the orange highlighted part of the headline.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {text: 'text', accent: 'accent'},
    prepare({text, accent}) {
      return {title: text || 'Segment', subtitle: accent ? 'Orange' : 'White'}
    },
  },
})
