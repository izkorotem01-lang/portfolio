import {StarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {ReviewMediaPreview} from '../../components/ReviewMediaPreview'
import {isYouTubeUrl} from '../shared/youtubeValidation'

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  icon: StarIcon,
  validation: (rule) =>
    rule.custom((fields) => {
      const doc = fields as {
        text?: {en?: string; he?: string}
        screenshot?: {asset?: {_ref?: string}}
        videoFile?: {asset?: {_ref?: string}}
        youtubeUrl?: string
      }
      const hasText = Boolean(doc?.text?.en?.trim() || doc?.text?.he?.trim())
      const hasScreenshot = Boolean(doc?.screenshot?.asset?._ref)
      const hasVideo = Boolean(doc?.videoFile?.asset?._ref || doc?.youtubeUrl?.trim())
      if (!hasText && !hasScreenshot && !hasVideo) {
        return 'Add review text, a screenshot, or a video'
      }
      if (doc?.youtubeUrl?.trim() && !isYouTubeUrl(doc.youtubeUrl)) {
        return 'YouTube URL must be a valid YouTube link'
      }
      return true
    }),
  fields: [
    defineField({
      name: 'name',
      title: 'Client name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'company', title: 'Company', type: 'string'}),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'text',
      title: 'Review text',
      type: 'localeText',
      description: 'Written review quote (optional if using screenshot or video).',
    }),
    defineField({
      name: 'screenshot',
      title: 'Text screenshot',
      type: 'image',
      description: 'Optional image of the review (e.g. WhatsApp / DM screenshot).',
      options: {hotspot: true},
    }),
    defineField({
      name: 'videoFile',
      title: 'Video file',
      type: 'file',
      description: 'Optional uploaded video testimonial.',
      options: {accept: 'video/*'},
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL (optional)',
      type: 'url',
      description: 'Alternative to uploaded video.',
      validation: (rule) =>
        rule.custom((url) => {
          if (!url) return true
          return isYouTubeUrl(url) || 'Must be a YouTube URL'
        }),
    }),
    defineField({
      name: 'videoPreview',
      title: 'Video preview',
      type: 'string',
      readOnly: true,
      components: {input: ReviewMediaPreview},
      hidden: ({parent}) => !parent?.videoFile?.asset && !parent?.youtubeUrl,
    }),
    defineField({
      name: 'thumbnail',
      title: 'Video poster',
      type: 'image',
      description: 'Cover image for video reviews.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'showOnMainSection',
      title: 'Show on main intro section',
      type: 'boolean',
      description: 'Display in the left/right review rails on the homepage hero (desktop).',
      initialValue: false,
    }),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 0}),
  ],
  orderings: [{title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {
      title: 'name',
      subtitle: 'company',
      rating: 'rating',
      showOnMainSection: 'showOnMainSection',
      media: 'thumbnail',
    },
    prepare({title, subtitle, rating, showOnMainSection, media}) {
      return {
        title,
        subtitle: [
          subtitle,
          rating && `${rating}★`,
          showOnMainSection ? 'Main intro' : undefined,
        ]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
