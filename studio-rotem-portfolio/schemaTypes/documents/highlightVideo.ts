import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {VideoFilePreview} from '../../components/VideoFilePreview'

export const highlightVideo = defineType({
  name: 'highlightVideo',
  title: 'Highlight Video (3D Cube)',
  type: 'document',
  icon: PlayIcon,
  description: 'Upload short vertical videos for the hero 3D cube. Add up to 4.',
  fields: [
    defineField({
      name: 'videoFile',
      title: 'Video file',
      type: 'file',
      description: 'Upload an MP4 or WebM file (9:16 works best).',
      options: {
        accept: 'video/*',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoPreview',
      title: 'Video preview',
      type: 'string',
      readOnly: true,
      components: {input: VideoFilePreview},
      hidden: ({parent}) => !parent?.videoFile?.asset,
    }),
    defineField({
      name: 'title',
      title: 'Title (optional)',
      type: 'string',
      description: 'Optional label shown under the video in the grid view.',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Poster image (optional)',
      type: 'image',
      description: 'Optional cover shown before the video loads.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'order',
      title: 'Order (0–3)',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().min(0).max(3),
    }),
    defineField({
      name: 'active',
      title: 'Show in 3D cube',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [{title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
    },
    prepare({title, media}) {
      return {
        title: title || 'Highlight video',
        subtitle: 'Uploaded video',
        media: media ?? PlayIcon,
      }
    },
  },
})
