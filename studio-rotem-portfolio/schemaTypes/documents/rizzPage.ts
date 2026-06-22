import {RocketIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {socialLinksField} from '../shared/socialLink'

export const rizzPage = defineType({
  name: 'rizzPage',
  title: 'Rizz Landing Page',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'nav',
      title: 'Navigation',
      type: 'object',
      fields: [
        defineField({name: 'logoAlt', title: 'Logo alt', type: 'localeString'}),
        defineField({name: 'openMenu', title: 'Open menu label', type: 'localeString'}),
        defineField({name: 'bookCall', title: 'Book call CTA', type: 'localeString'}),
        defineField({name: 'viewWork', title: 'View work CTA', type: 'localeString'}),
        defineField({name: 'switchToEn', title: 'Switch to EN label', type: 'localeString'}),
        defineField({name: 'switchToHb', title: 'Switch to HB label', type: 'localeString'}),
        defineField({
          name: 'links',
          title: 'Nav links',
          type: 'array',
          of: [
            defineField({
              name: 'navLink',
              title: 'Nav link',
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'localeString'}),
                defineField({name: 'href', title: 'Href', type: 'string'}),
              ],
            }),
          ],
        }),
        defineField({
          name: 'footerLinks',
          title: 'Footer links',
          type: 'array',
          of: [
            defineField({
              name: 'footerLink',
              title: 'Footer link',
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'localeString'}),
                defineField({name: 'href', title: 'Href', type: 'string'}),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'localeString'}),
        defineField({name: 'titleLine1', title: 'Title line 1', type: 'localeString'}),
        defineField({name: 'titleLine2', title: 'Title line 2', type: 'localeString'}),
        defineField({name: 'titleAccent', title: 'Title accent', type: 'localeString'}),
        defineField({name: 'description', title: 'Description', type: 'localeText'}),
        defineField({name: 'tagline', title: 'Tagline', type: 'localeString'}),
        defineField({name: 'titleAfterAccent', title: 'Title after accent', type: 'localeString'}),
        defineField({
          name: 'heroImageLtr',
          title: 'Hero image — LTR (English)',
          type: 'image',
          description: 'Photo shown on the English (left-to-right) version of the site.',
          options: {hotspot: true},
        }),
        defineField({
          name: 'heroImageRtl',
          title: 'Hero image — RTL (Hebrew)',
          type: 'image',
          description: 'Photo shown on the Hebrew (right-to-left) version of the site.',
          options: {hotspot: true},
        }),
      ],
    }),
    defineField({
      name: 'proof',
      title: 'Proof',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'localeString'}),
        defineField({name: 'titlePrimary', title: 'Title primary', type: 'localeString'}),
        defineField({name: 'titleAccent', title: 'Title accent', type: 'localeString'}),
        defineField({name: 'subtitle', title: 'Subtitle', type: 'localeText'}),
      ],
    }),
    defineField({
      name: 'howWeGetYouThere',
      title: 'How we get you there',
      type: 'object',
      fields: [
        defineField({name: 'howWeWork', title: 'How we work label', type: 'localeString'}),
        defineField({
          name: 'process',
          title: 'Process steps',
          type: 'array',
          of: [
            defineField({
              name: 'processStep',
              title: 'Process step',
              type: 'object',
              fields: [
                defineField({name: 'step', title: 'Step number', type: 'string'}),
                defineField({name: 'title', title: 'Title', type: 'localeString'}),
                defineField({name: 'icon', title: 'Icon key', type: 'string'}),
                defineField({name: 'description', title: 'Description', type: 'localeText'}),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'portfolio',
      title: 'Portfolio',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'localeString'}),
        defineField({name: 'titlePrimary', title: 'Title primary', type: 'localeString'}),
        defineField({name: 'titleAccent', title: 'Title accent', type: 'localeString'}),
        defineField({name: 'allVideos', title: 'All videos label', type: 'localeString'}),
        defineField({name: 'categoriesAria', title: 'Categories aria', type: 'localeString'}),
        defineField({name: 'emptyState', title: 'Empty state', type: 'localeText'}),
        defineField({name: 'untitled', title: 'Untitled fallback', type: 'localeString'}),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'localeString'}),
        defineField({name: 'titleLine1', title: 'Title line 1', type: 'localeString'}),
        defineField({name: 'titleAccent', title: 'Title accent', type: 'localeString'}),
        defineField({name: 'starsAriaSuffix', title: 'Stars aria suffix', type: 'localeString'}),
      ],
    }),
    defineField({
      name: 'founders',
      title: 'Founders',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'localeString'}),
        defineField({name: 'titleBefore', title: 'Title before', type: 'localeText'}),
        defineField({name: 'titleFilmed', title: 'Title filmed', type: 'localeString'}),
        defineField({name: 'titleEdited', title: 'Title edited', type: 'localeString'}),
        defineField({name: 'titleLived', title: 'Title lived', type: 'localeString'}),
        defineField({name: 'titleAfter', title: 'Title after', type: 'localeText'}),
        defineField({name: 'intro', title: 'Intro', type: 'localeText'}),
        defineField({name: 'values', title: 'Values', type: 'localeString'}),
        defineField({name: 'showBio', title: 'Show bio label', type: 'localeString'}),
        defineField({name: 'hideBio', title: 'Hide bio label', type: 'localeString'}),
        defineField({
          name: 'cards',
          title: 'Founder cards',
          type: 'array',
          of: [
            defineField({
              name: 'founderCard',
              title: 'Founder card',
              type: 'object',
              fields: [
                defineField({name: 'name', title: 'Name', type: 'localeString'}),
                defineField({name: 'role', title: 'Role', type: 'localeString'}),
                defineField({name: 'keywords', title: 'Keywords', type: 'localeString'}),
                defineField({name: 'bio', title: 'Bio', type: 'localeText'}),
                defineField({name: 'badge', title: 'Badge', type: 'localeString'}),
                defineField({name: 'variant', title: 'Variant', type: 'string'}),
                defineField({name: 'imageKey', title: 'Image key', type: 'string'}),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Final CTA',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'localeString'}),
        defineField({name: 'titleLine1', title: 'Title line 1', type: 'localeString'}),
        defineField({name: 'titleAccent', title: 'Title accent', type: 'localeText'}),
        defineField({name: 'description', title: 'Description', type: 'localeText'}),
        defineField({name: 'tagline', title: 'Tagline', type: 'localeString'}),
        defineField({name: 'bookCall', title: 'Book call CTA', type: 'localeString'}),
        defineField({name: 'emailUs', title: 'Email us CTA', type: 'localeString'}),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({name: 'description', title: 'Description', type: 'localeText'}),
        defineField({name: 'navigation', title: 'Navigation label', type: 'localeString'}),
        defineField({name: 'getStarted', title: 'Get started label', type: 'localeString'}),
        defineField({name: 'getStartedDescription', title: 'Get started description', type: 'localeText'}),
        defineField({name: 'copyrightPrefix', title: 'Copyright prefix', type: 'localeString'}),
        defineField({name: 'copyrightSuffix', title: 'Copyright suffix', type: 'localeString'}),
        defineField({name: 'tagline', title: 'Tagline', type: 'localeString'}),
        socialLinksField,
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Document title', type: 'localeString'}),
        defineField({name: 'description', title: 'Meta description', type: 'localeText'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Rizz Landing Page'}
    },
  },
})

