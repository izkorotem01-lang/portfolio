import {
  BlockElementIcon,
  CogIcon,
  CommentIcon,
  DocumentsIcon,
  ImageIcon,
  RocketIcon,
  StarIcon,
  ThListIcon,
  UsersIcon,
} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {socialLinksField} from '../shared/socialLink'

const LANDING_PAGE_GROUPS = [
  {name: 'nav', title: 'Navigation', icon: ThListIcon, default: true},
  {name: 'hero', title: 'Hero', icon: RocketIcon},
  {name: 'proof', title: 'Real Results', icon: DocumentsIcon},
  {name: 'process', title: 'How We Work', icon: BlockElementIcon},
  {name: 'portfolio', title: 'Our Work', icon: ImageIcon},
  {name: 'testimonials', title: 'Reviews', icon: StarIcon},
  {name: 'founders', title: 'About / Team', icon: UsersIcon},
  {name: 'cta', title: 'Book a Call', icon: CommentIcon},
  {name: 'footer', title: 'Footer', icon: ThListIcon},
  {name: 'seo', title: 'SEO', icon: CogIcon},
] as const

export const rizzPage = defineType({
  name: 'rizzPage',
  title: 'Rizz Landing Page',
  type: 'document',
  icon: RocketIcon,
  groups: [...LANDING_PAGE_GROUPS],
  fields: [
    defineField({
      name: 'nav',
      title: 'Navigation',
      group: 'nav',
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
      group: 'hero',
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
      group: 'proof',
      description: 'Section headings only — add result cards under Real Results in the sidebar.',
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
      group: 'process',
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
      group: 'portfolio',
      description: 'Section headings only — add videos under Our Work in the sidebar.',
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
      group: 'testimonials',
      description: 'Section headings only — add review quotes under Reviews in the sidebar.',
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
      title: 'Built by someone who filmed it…',
      group: 'founders',
      description:
        'The “BUILT BY SOMEONE WHO FILMED IT, EDITED IT, AND LIVED IT FIRST” section — edit the headline, intro, team cards, and photos here.',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'localeString'}),
        defineField({
          name: 'titleBefore',
          title: 'Headline — before accents',
          type: 'localeText',
          description: 'e.g. “BUILT BY SOMEONE WHO”',
        }),
        defineField({
          name: 'titleFilmed',
          title: 'Headline accent — filmed',
          type: 'localeString',
          description: 'Orange accent text, e.g. “FILMED IT”',
        }),
        defineField({
          name: 'titleEdited',
          title: 'Headline accent — edited',
          type: 'localeString',
          description: 'Orange accent text, e.g. “EDITED IT”',
        }),
        defineField({
          name: 'titleLived',
          title: 'Headline — lived',
          type: 'localeString',
          description: 'Plain text between accents, e.g. “AND LIVED IT”',
        }),
        defineField({
          name: 'titleAfter',
          title: 'Headline accent — ending',
          type: 'localeText',
          description: 'Orange accent text at the end, e.g. “FIRST.”',
        }),
        defineField({name: 'intro', title: 'Intro paragraph', type: 'localeText'}),
        defineField({name: 'values', title: 'Values line', type: 'localeString'}),
        defineField({name: 'showBio', title: 'Show bio label', type: 'localeString'}),
        defineField({name: 'hideBio', title: 'Hide bio label', type: 'localeString'}),
        defineField({
          name: 'ctaPortraitLeft',
          title: 'CTA portrait — left',
          type: 'image',
          description: 'Full-body portrait on the left of the final CTA section (above the footer).',
          options: {hotspot: true},
        }),
        defineField({
          name: 'ctaPortraitRight',
          title: 'CTA portrait — right',
          type: 'image',
          description: 'Full-body portrait on the right of the final CTA section (above the footer).',
          options: {hotspot: true},
        }),
        defineField({
          name: 'cards',
          title: 'Team cards',
          type: 'array',
          of: [
            defineField({
              name: 'founderCard',
              title: 'Team card',
              type: 'object',
              fields: [
                defineField({name: 'name', title: 'Name', type: 'localeString'}),
                defineField({name: 'role', title: 'Role', type: 'localeString'}),
                defineField({name: 'keywords', title: 'Keywords', type: 'localeString'}),
                defineField({name: 'bio', title: 'Bio', type: 'localeText'}),
                defineField({name: 'badge', title: 'Badge', type: 'localeString'}),
                defineField({
                  name: 'variant',
                  title: 'Card style',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Portrait (photo card)', value: 'portrait'},
                      {title: 'Team (abstract background)', value: 'team'},
                    ],
                    layout: 'radio',
                  },
                  initialValue: 'portrait',
                }),
                defineField({
                  name: 'image',
                  title: 'Card photo',
                  type: 'image',
                  description: 'Upload a portrait for portrait-style cards. Not used for team-style cards.',
                  options: {hotspot: true},
                  hidden: ({parent}) => parent?.variant === 'team',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Final CTA',
      group: 'cta',
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
      group: 'footer',
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
      group: 'seo',
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

