import {defineField, defineType} from 'sanity'

export const proofCardStatistic = defineType({
  name: 'proofCardStatistic',
  title: 'Statistic',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. Leads, Views, Conversion rate',
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'e.g. 892, +340%, $2.13',
    }),
  ],
  preview: {
    select: {label: 'label', value: 'value'},
    prepare({label, value}) {
      return {title: [label, value].filter(Boolean).join(': ') || 'Statistic'}
    },
  },
})
