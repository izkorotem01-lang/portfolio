import {defineField, defineType} from 'sanity'

export const aboutCapability = defineType({
  name: 'aboutCapability',
  title: 'Capability',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Video editing', value: 'video'},
          {title: 'Motion graphics', value: 'sparkles'},
          {title: 'Content strategy', value: 'target'},
          {title: 'Social media', value: 'share'},
        ],
      },
      initialValue: 'video',
    }),
  ],
  preview: {
    select: {title: 'title.en', icon: 'icon'},
    prepare({title, icon}) {
      return {title: title || 'Capability', subtitle: icon}
    },
  },
})
