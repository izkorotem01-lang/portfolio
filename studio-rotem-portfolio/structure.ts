import {
  BlockElementIcon,
  CogIcon,
  EnvelopeIcon,
  HomeIcon,
  PlayIcon,
  StarIcon,
  TagIcon,
  UsersIcon,
} from '@sanity/icons'
import type {ComponentType} from 'react'
import type {StructureResolver} from 'sanity/structure'

export const SECTION_IDS = {
  introductionSection: 'a1000001-0001-4001-8001-000000000001',
  highlightsSection: 'a1000002-0002-4002-8002-000000000002',
  aboutSection: 'a1000003-0003-4003-8003-000000000003',
  workSection: 'a1000004-0004-4004-8004-000000000004',
  servicesSection: 'a1000006-0006-4006-8006-000000000006',
  reviewsSection: 'a1000007-0007-4007-8007-000000000007',
  contactSection: 'a1000008-0008-4008-8008-000000000008',
  siteSettings: 'eb29c091-42d8-4d9a-9d71-59a7d91af234',
} as const

const singleton = (
  S: Parameters<StructureResolver>[0],
  type: string,
  documentId: string,
  title: string,
  icon?: ComponentType,
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(documentId))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('RIZ Productions')
    .items([
      S.listItem()
        .title('Introduction')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Introduction')
            .items([
              singleton(
                S,
                'introductionSection',
                SECTION_IDS.introductionSection,
                'Section content',
                HomeIcon,
              ),
              S.listItem()
                .title('Client logos')
                .icon(UsersIcon)
                .child(
                  S.documentTypeList('trustedByClient')
                    .title('Trusted By clients')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
            ]),
        ),

      S.listItem()
        .title('Highlights')
        .icon(PlayIcon)
        .child(
          S.list()
            .title('Highlights')
            .items([
              singleton(
                S,
                'highlightsSection',
                SECTION_IDS.highlightsSection,
                'Section content',
                PlayIcon,
              ),
              S.listItem()
                .title('Videos (3D cube)')
                .icon(PlayIcon)
                .child(
                  S.documentTypeList('highlightVideo')
                    .title('Highlight videos — upload up to 4')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
            ]),
        ),

      singleton(S, 'aboutSection', SECTION_IDS.aboutSection, 'Who Are We', UsersIcon),

      S.listItem()
        .title('Our Work')
        .icon(PlayIcon)
        .child(
          S.list()
            .title('Our Work')
            .items([
              singleton(S, 'workSection', SECTION_IDS.workSection, 'Section content', PlayIcon),
              S.listItem()
                .title('Categories')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('portfolioCategory').defaultOrdering([
                    {field: 'order', direction: 'asc'},
                  ]),
                ),
              S.listItem()
                .title('Videos')
                .icon(PlayIcon)
                .child(
                  S.documentTypeList('portfolioVideo').defaultOrdering([
                    {field: 'allWorkOrder', direction: 'asc'},
                    {field: 'order', direction: 'asc'},
                  ]),
                ),
            ]),
        ),

      S.listItem()
        .title('Services')
        .icon(BlockElementIcon)
        .child(
          S.list()
            .title('Services')
            .items([
              singleton(
                S,
                'servicesSection',
                SECTION_IDS.servicesSection,
                'Section content',
                BlockElementIcon,
              ),
              S.listItem()
                .title('Service cards')
                .icon(BlockElementIcon)
                .child(
                  S.documentTypeList('service')
                    .title('Services')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
            ]),
        ),

      S.listItem()
        .title('Reviews')
        .icon(StarIcon)
        .child(
          S.list()
            .title('Reviews')
            .items([
              singleton(
                S,
                'reviewsSection',
                SECTION_IDS.reviewsSection,
                'Section content',
                StarIcon,
              ),
              S.listItem()
                .title('Review cards')
                .icon(StarIcon)
                .child(
                  S.documentTypeList('review')
                    .title('Reviews')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
            ]),
        ),

      singleton(S, 'contactSection', SECTION_IDS.contactSection, 'Contact', EnvelopeIcon),

      S.divider(),

      singleton(S, 'siteSettings', SECTION_IDS.siteSettings, 'Footer & global', CogIcon),
    ])
