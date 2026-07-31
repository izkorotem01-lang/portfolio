import {defineField, defineType} from 'sanity'
import {isYouTubeUrl} from '../shared/youtubeValidation'

export const proofCardMedia = defineType({
  name: 'proofCardMedia',
  title: 'Media item',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Upload an image for this block.',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video file',
      type: 'file',
      options: {accept: 'video/*'},
      description: 'Optional uploaded video.',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Alternative to uploaded video.',
      validation: (rule) =>
        rule.custom((url) => {
          if (!url) return true
          return isYouTubeUrl(url) || 'Must be a YouTube URL'
        }),
    }),
    defineField({
      name: 'poster',
      title: 'Video poster',
      type: 'image',
      description: 'Optional thumbnail shown before video plays.',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'localeText',
      description: 'Comment or testimonial text (shown in bottom media).',
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'localeString',
    }),
    defineField({
      name: 'isMain',
      title: 'Main image',
      type: 'boolean',
      description:
        'For bottom media galleries: show this image larger than the others. Only one item should be marked main.',
      initialValue: false,
      hidden: ({parent}) => !parent?.image,
    }),
  ],
  preview: {
    select: {
      image: 'image',
      videoFile: 'videoFile',
      youtubeUrl: 'youtubeUrl',
      alt: 'alt',
      isMain: 'isMain',
      quote: 'quote',
    },
    prepare({image, videoFile, youtubeUrl, alt, isMain, quote}) {
      const quoteText = quote?.en || quote?.hb
      if (quoteText?.trim()) {
        const trimmed = quoteText.trim()
        const snippet = trimmed.length > 56 ? `${trimmed.slice(0, 56)}…` : trimmed
        return {title: `Quote: “${snippet}”`, media: image}
      }
      const kind = image ? 'Image' : videoFile || youtubeUrl ? 'Video' : 'Empty'
      const altText = alt?.en || alt?.hb
      const title = [altText || kind, isMain ? '(Main)' : ''].filter(Boolean).join(' ')
      return {title, media: image}
    },
  },
  validation: (rule) =>
    rule.custom((fields) => {
      if (!fields) return true
      const hasContent =
        fields.image ||
        fields.videoFile ||
        fields.youtubeUrl ||
        (typeof fields.quote?.en === 'string' && fields.quote.en.trim()) ||
        (typeof fields.quote?.hb === 'string' && fields.quote.hb.trim())
      return hasContent ? true : 'Add an image, video, YouTube URL, or quote'
    }),
})
