import {defineArrayMember, defineField} from 'sanity'

export const socialLinkFields = [
  defineField({
    name: 'platform',
    title: 'Platform',
    type: 'string',
    options: {
      list: ['instagram', 'youtube', 'tiktok', 'facebook', 'linkedin'],
    },
  }),
  defineField({name: 'url', title: 'URL', type: 'url', validation: (rule) => rule.required()}),
  defineField({name: 'label', title: 'Label', type: 'localeString'}),
]

export const socialLinksField = defineField({
  name: 'socialLinks',
  title: 'Social links',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      name: 'socialLink',
      fields: socialLinkFields,
      preview: {
        select: {title: 'platform', subtitle: 'url'},
      },
    }),
  ],
})
