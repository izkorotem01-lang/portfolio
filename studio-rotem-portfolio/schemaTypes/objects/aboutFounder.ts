import {defineField, defineType} from 'sanity'

export const aboutFounder = defineType({
  name: 'aboutFounder',
  title: 'Founder profile',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'localeText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'photoAlt', title: 'Photo alt text', type: 'localeString'}),
    defineField({
      name: 'glowColor',
      title: 'Portrait glow',
      type: 'string',
      options: {
        list: [
          {title: 'Cyan', value: 'cyan'},
          {title: 'Orange', value: 'orange'},
        ],
        layout: 'radio',
      },
      initialValue: 'cyan',
    }),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 0}),
  ],
  preview: {
    select: {title: 'name.en', media: 'photo'},
    prepare({title, media}) {
      return {title: title || 'Founder', media}
    },
  },
})
