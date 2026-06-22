import {
  DocumentIcon,
  EyeOpenIcon,
  PlayIcon,
  RocketIcon,
  StarIcon,
  TagIcon,
  UsersIcon,
} from '@sanity/icons'
import type {ComponentType} from 'react'
import type {StructureResolver} from 'sanity/structure'
import {ProofCardSitePreviewView} from './components/ProofCardSitePreview'

export const SECTION_IDS = {
  rizzPage: 'rizzPage',
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
      singleton(S, 'rizzPage', SECTION_IDS.rizzPage, 'Rizz landing page', RocketIcon),

      S.divider(),

      S.listItem()
        .title('Real Results')
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('proofCard')
            .title('Proof / result cards')
            .defaultOrdering([{field: 'order', direction: 'asc'}])
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('proofCard')
                .views([
                  S.view.form(),
                  S.view.component(ProofCardSitePreviewView).title('Site preview').icon(EyeOpenIcon),
                ]),
            ),
        ),

      S.listItem()
        .title('Trusted By logos')
        .icon(UsersIcon)
        .child(
          S.documentTypeList('trustedByClient')
            .title('Trusted By clients')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),

      S.listItem()
        .title('Our Work')
        .icon(PlayIcon)
        .child(
          S.list()
            .title('Our Work')
            .items([
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
        .title('Reviews')
        .icon(StarIcon)
        .child(
          S.documentTypeList('review')
            .title('Reviews')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),
    ])
