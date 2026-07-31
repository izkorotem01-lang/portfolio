import {defineField, defineType} from 'sanity'

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text (long)',
  type: 'object',
  fields: [
    defineField({name: 'en', title: 'English', type: 'text', rows: 4}),
    defineField({name: 'hb', title: 'Hebrew', type: 'text', rows: 4}),
  ],
})
