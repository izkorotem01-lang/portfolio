import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {ProofCardSitePreviewInput} from '../../components/ProofCardSitePreview'

export const proofCard = defineType({
  name: 'proofCard',
  title: 'Proof / Result Card',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'sitePreview',
      title: 'Site preview',
      type: 'string',
      readOnly: true,
      components: {input: ProofCardSitePreviewInput},
    }),
    defineField({
      name: 'cardNumber',
      title: 'Card number',
      type: 'string',
      description: 'Optional label shown on the header (e.g. 01, 02, 03).',
    }),
    defineField({
      name: 'clientName',
      title: 'Client name',
      type: 'string',
    }),
    defineField({
      name: 'clientRole',
      title: 'Client role / category',
      type: 'string',
      description: 'Shown in blue under the name (e.g. Content Creator).',
    }),
    defineField({
      name: 'headerMedia',
      title: 'Header media',
      type: 'proofCardMedia',
      description: 'Top image, uploaded video, or YouTube URL.',
    }),
    defineField({
      name: 'titleSegments',
      title: 'Headline',
      type: 'array',
      description:
        'Build the headline in order. Toggle “Orange accent” on the words that should be highlighted.',
      of: [defineArrayMember({type: 'proofCardTitleSegment'})],
    }),
    defineField({
      name: 'checkpoints',
      title: 'Checkpoints',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Bullet points with a checkmark (e.g. key results or context).',
    }),
    defineField({
      name: 'statistics',
      title: 'Statistics',
      type: 'array',
      description: 'Metric row above the bottom media (1–4).',
      of: [defineArrayMember({type: 'proofCardStatistic'})],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'bottomMedia',
      title: 'Bottom media',
      type: 'array',
      description:
        'Screenshots, charts, videos, or quotes below the stats. Add multiple images — mark one as “Main image” to show it larger beside the rest.',
      of: [defineArrayMember({type: 'proofCardMedia'})],
      validation: (rule) =>
        rule
          .max(12)
          .custom((items) => {
            if (!items?.length) return true
            const mainCount = items.filter(
              (item: {isMain?: boolean}) => item?.isMain,
            ).length
            if (mainCount > 1) {
              return 'Only one bottom media item can be marked as the main image'
            }
            return true
          }),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [{title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {
      clientName: 'clientName',
      order: 'order',
      media: 'headerMedia.image',
      title0: 'titleSegments.0.text',
    },
    prepare({clientName, order, media, title0}) {
      return {
        title: clientName || title0 || 'Proof card',
        subtitle: typeof order === 'number' ? `#${order}` : undefined,
        media,
      }
    },
  },
})
