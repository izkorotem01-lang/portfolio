import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {PortfolioVideoPreview} from '../../components/PortfolioVideoPreview'
import {getYouTubeThumbnail} from '../shared/youtubeHelpers'
import {isYouTubeUrl} from '../shared/youtubeValidation'

export const portfolioVideo = defineType({
  name: 'portfolioVideo',
  title: 'Portfolio Video (Our Work)',
  type: 'document',
  icon: PlayIcon,
  description: 'Upload a video file or paste a YouTube URL for the Our Work section.',
  validation: (rule) =>
    rule.custom((fields) => {
      const doc = fields as {videoFile?: {asset?: {_ref?: string}}; videoUrl?: string}
      if (!doc?.videoFile?.asset?._ref && !doc?.videoUrl?.trim()) {
        return 'Upload a video file or add a YouTube URL'
      }
      if (doc?.videoUrl?.trim() && !isYouTubeUrl(doc.videoUrl)) {
        return 'YouTube URL must be a valid YouTube link'
      }
      return true
    }),
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'localeString'}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'portfolioCategory'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoFile',
      title: 'Video file',
      type: 'file',
      description: 'Upload MP4 or WebM. Use this for self-hosted portfolio videos.',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'videoUrl',
      title: 'YouTube URL (optional)',
      type: 'url',
      description: 'Alternative to upload — paste a YouTube link instead.',
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
      components: {input: PortfolioVideoPreview},
      hidden: ({parent}) => !parent?.videoFile?.asset && !parent?.videoUrl,
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom thumbnail',
      type: 'image',
      description: 'Optional poster image for the grid and lightbox.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'autoplayInBackground',
      title: 'Autoplay in grid',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Category order',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'allWorkOrder',
      title: 'All Work order',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
  ],
  orderings: [
    {
      title: 'All Work order',
      name: 'allWorkOrderAsc',
      by: [
        {field: 'allWorkOrder', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
    {title: 'Category order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {
      titleEn: 'title.en',
      categoryEn: 'category.name.en',
      media: 'thumbnail',
      videoUrl: 'videoUrl',
      hasFile: 'videoFile.asset',
      order: 'order',
    },
    prepare({titleEn, categoryEn, media, videoUrl, hasFile, order}) {
      return {
        title: titleEn || 'Video',
        subtitle: [
          categoryEn,
          hasFile ? 'Upload' : videoUrl ? 'YouTube' : 'No video',
          order != null && `#${order}`,
        ]
          .filter(Boolean)
          .join(' · '),
        media: media || getYouTubeThumbnail(videoUrl),
      }
    },
  },
})
