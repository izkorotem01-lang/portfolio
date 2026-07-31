import {getFileAsset, getImageAsset} from '@sanity/asset-utils'
import {Box} from '@sanity/ui'
import {useDataset, useFormValue, useProjectId} from 'sanity'
import {getYouTubeThumbnail} from '../schemaTypes/shared/youtubeHelpers'
import {isYouTubeUrl} from '../schemaTypes/shared/youtubeValidation'
import './proofCardPreview.css'

type SanityAssetRef = {_ref?: string; url?: string}
type SanityImage = {_type?: string; asset?: SanityAssetRef}
type SanityFile = {_type?: string; asset?: SanityAssetRef}

type ProofCardMediaItem = {
  _key?: string
  alt?: string
  image?: SanityImage
  videoFile?: SanityFile
  youtubeUrl?: string
  poster?: SanityImage
  isMain?: boolean
  quote?: string
}

type TitleSegment = {_key: string; text?: string; accent?: boolean}

type ProofCardDocument = {
  cardNumber?: string
  clientName?: string
  clientRole?: string
  headerMedia?: ProofCardMediaItem
  titleSegments?: TitleSegment[]
  checkpoints?: string[]
  statistics?: Array<{_key: string; label?: string; value?: string}>
  bottomMedia?: ProofCardMediaItem[]
  order?: number
  titleAccent?: string
  titleRest?: string
  subtext?: string
  subSubtext?: string
  tag?: string
  mediaItems?: ProofCardMediaItem[]
}

type ResolvedMedia = {
  key: string
  alt?: string
  imageUrl?: string
  videoUrl?: string
  posterUrl?: string
  isMain?: boolean
  quote?: string
}

const resolveImageUrl = (
  image: SanityImage | undefined,
  projectId: string,
  dataset: string,
): string | undefined => {
  if (!image?.asset) return undefined
  if (image.asset.url) return image.asset.url
  if (!image.asset._ref) return undefined
  try {
    return getImageAsset(image, {projectId, dataset}).url
  } catch {
    return undefined
  }
}

const resolveFileUrl = (
  file: SanityFile | undefined,
  projectId: string,
  dataset: string,
): string | undefined => {
  if (!file?.asset) return undefined
  if (file.asset.url) return file.asset.url
  if (!file.asset._ref) return undefined
  try {
    return getFileAsset(file, {projectId, dataset}).url
  } catch {
    return undefined
  }
}

const resolveMediaItem = (
  item: ProofCardMediaItem | undefined,
  projectId: string,
  dataset: string,
  fallbackKey: string,
): ResolvedMedia | null => {
  if (!item) return null
  const imageUrl = resolveImageUrl(item.image, projectId, dataset)
  const uploadedVideoUrl = resolveFileUrl(item.videoFile, projectId, dataset)
  const youtubeUrl = item.youtubeUrl?.trim()
  const videoUrl = uploadedVideoUrl || youtubeUrl
  const posterUrl = resolveImageUrl(item.poster, projectId, dataset)
  const quote = item.quote?.trim()
  if (!imageUrl && !videoUrl && !quote) return null
  return {
    key: item._key || fallbackKey,
    alt: item.alt,
    imageUrl,
    videoUrl: videoUrl || undefined,
    posterUrl,
    isMain: Boolean(item.isMain),
    quote: quote || undefined,
  }
}

const mapTitleSegments = (document: ProofCardDocument): TitleSegment[] => {
  if (document.titleSegments?.length) return document.titleSegments
  const legacy: TitleSegment[] = []
  if (document.titleAccent?.trim()) {
    legacy.push({_key: 'legacy-accent', text: document.titleAccent.trim(), accent: true})
  }
  if (document.titleRest?.trim()) {
    legacy.push({_key: 'legacy-rest', text: document.titleRest.trim(), accent: false})
  }
  return legacy
}

const PreviewMedia = ({
  media,
  compact = false,
}: {
  media: ResolvedMedia
  compact?: boolean
}) => {
  if (media.quote) {
    return (
      <blockquote className="proof-card-preview-quote">
        <span className="proof-card-preview-quote-mark" aria-hidden>
          &ldquo;
        </span>
        <p>{media.quote}</p>
      </blockquote>
    )
  }
  if (media.imageUrl) {
    return <img src={media.imageUrl} alt={media.alt ?? ''} />
  }
  if (media.videoUrl && isYouTubeUrl(media.videoUrl)) {
    const thumbnail = getYouTubeThumbnail(media.videoUrl)
    if (thumbnail) {
      return (
        <>
          <img src={thumbnail} alt={media.alt ?? 'YouTube thumbnail'} />
          <span
            className={
              compact
                ? 'proof-card-preview-play proof-card-preview-play--compact'
                : 'proof-card-preview-play'
            }
            aria-hidden
          >
            ▶
          </span>
        </>
      )
    }
  }
  if (media.videoUrl) {
    return <video src={media.videoUrl} poster={media.posterUrl} controls playsInline />
  }
  return null
}

const isImageOnly = (item: ResolvedMedia) =>
  Boolean(item.imageUrl && !item.videoUrl && !item.quote)

const BottomMediaPreview = ({items}: {items: ResolvedMedia[]}) => {
  const images = items.filter(isImageOnly)
  const others = items.filter((item) => !isImageOnly(item))

  if (images.length >= 2) {
    const main = images.find((item) => item.isMain) ?? images[0]
    const secondary = images.filter((item) => item.key !== main.key)

    return (
      <div className="proof-card-preview-bottom-gallery">
        <div className="proof-card-preview-bottom-gallery-row">
          <div className="proof-card-preview-media-item proof-card-preview-media-item--bottom proof-card-preview-media-item--main">
            <PreviewMedia media={main} compact />
          </div>
          {secondary.length > 0 && (
            <div className="proof-card-preview-bottom-gallery-stack">
              {secondary.map((item) => (
                <div
                  key={item.key}
                  className="proof-card-preview-media-item proof-card-preview-media-item--bottom proof-card-preview-media-item--secondary"
                >
                  <PreviewMedia media={item} compact />
                </div>
              ))}
            </div>
          )}
        </div>
        {others.map((item) => (
          <div
            key={item.key}
            className={
              item.quote
                ? 'proof-card-preview-bottom-quote-wrap'
                : 'proof-card-preview-media-item proof-card-preview-media-item--bottom'
            }
          >
            <PreviewMedia media={item} compact />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={
        items.length === 2
          ? 'proof-card-preview-bottom proof-card-preview-bottom--split'
          : 'proof-card-preview-bottom'
      }
    >
      {items.map((item) => (
        <div
          key={item.key}
          className={
            item.quote
              ? 'proof-card-preview-bottom-quote-wrap'
              : 'proof-card-preview-media-item proof-card-preview-media-item--bottom'
          }
        >
          <PreviewMedia media={item} compact />
        </div>
      ))}
    </div>
  )
}

export function ProofCardSitePreviewContent({document}: {document?: ProofCardDocument | null}) {
  const projectId = useProjectId()
  const dataset = useDataset()

  const legacyMedia = (document?.mediaItems ?? [])
    .map((item, index) => resolveMediaItem(item, projectId, dataset, `legacy-${index}`))
    .filter((item): item is ResolvedMedia => item !== null)

  const headerMedia =
    resolveMediaItem(document?.headerMedia, projectId, dataset, 'header') ?? legacyMedia[0]

  const bottomMedia =
    (document?.bottomMedia ?? [])
      .map((item, index) => resolveMediaItem(item, projectId, dataset, `bottom-${index}`))
      .filter((item): item is ResolvedMedia => item !== null).length > 0
      ? (document?.bottomMedia ?? [])
          .map((item, index) => resolveMediaItem(item, projectId, dataset, `bottom-${index}`))
          .filter((item): item is ResolvedMedia => item !== null)
      : legacyMedia.slice(1)

  const titleSegments = mapTitleSegments(document ?? {})
  const checkpoints = (document?.checkpoints ?? []).filter(Boolean)
  const statistics = (document?.statistics ?? []).filter(
    (stat) => stat.label?.trim() && stat.value?.trim(),
  )
  const hasContent = Boolean(
    document?.clientName ||
      document?.clientRole ||
      titleSegments.length ||
      checkpoints.length ||
      headerMedia ||
      bottomMedia.length ||
      statistics.length,
  )

  return (
    <Box padding={4} sizing="border">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
      />
      <div className="proof-card-preview-root">
        <p className="proof-card-preview-note">
          Live preview — updates as you edit. Matches the case study cards on the site.
        </p>

        {!hasContent ? (
          <p className="proof-card-preview-empty">
            Add client info, header media, headline segments, and stats to preview the card.
          </p>
        ) : (
          <div className="proof-card-preview-card proof-card-preview-card--wide">
            {headerMedia && (
              <div className="proof-card-preview-header">
                <div className="proof-card-preview-media-item proof-card-preview-media-item--header">
                  <PreviewMedia media={headerMedia} />
                  {(document?.clientName || document?.clientRole) && (
                    <div className="proof-card-preview-header-overlay">
                      <div className="proof-card-preview-header-vignette" aria-hidden />
                      <div className="proof-card-preview-header-labels">
                        {document?.clientName && (
                          <div className="proof-card-preview-client proof-card-preview-client--on-media">
                            {document.clientName}
                          </div>
                        )}
                        {document?.clientRole && (
                          <div className="proof-card-preview-role proof-card-preview-role--on-media">
                            {document.clientRole}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="proof-card-preview-body">
              {!headerMedia && (document?.clientName || document?.clientRole) && (
                <div>
                  {document?.clientName && (
                    <div className="proof-card-preview-client">{document.clientName}</div>
                  )}
                  {document?.clientRole && (
                    <div className="proof-card-preview-role">{document.clientRole}</div>
                  )}
                </div>
              )}

              {titleSegments.length > 0 && (
                <h3 className="proof-card-preview-headline">
                  {titleSegments.map((segment, index) =>
                    segment.text?.trim() ? (
                      <span
                        key={segment._key}
                        className={
                          segment.accent
                            ? 'proof-card-preview-title-accent-inline'
                            : undefined
                        }
                      >
                        {index > 0 && !segment.text.startsWith(' ') ? ' ' : ''}
                        {segment.text}
                      </span>
                    ) : null,
                  )}
                </h3>
              )}

              {checkpoints.length > 0 && (
                <ul className="proof-card-preview-checkpoints">
                  {checkpoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}

              {statistics.length > 0 && (
                <div
                  className="proof-card-preview-stats"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(statistics.length, 4)}, minmax(0, 1fr))`,
                  }}
                >
                  {statistics.map((stat) => (
                    <div key={stat._key} className="proof-card-preview-stat">
                      <div className="proof-card-preview-stat-value">{stat.value}</div>
                      <div className="proof-card-preview-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {bottomMedia.length > 0 && <BottomMediaPreview items={bottomMedia} />}
            </div>
          </div>
        )}
      </div>
    </Box>
  )
}

export function ProofCardSitePreviewInput() {
  const document = useFormValue([]) as ProofCardDocument | undefined
  return <ProofCardSitePreviewContent document={document} />
}

export function ProofCardSitePreviewView(props: {
  document: {
    displayed?: ProofCardDocument | null
    draft?: ProofCardDocument | null
    published?: ProofCardDocument | null
  }
}) {
  const document =
    props.document?.displayed ?? props.document?.draft ?? props.document?.published ?? null
  return <ProofCardSitePreviewContent document={document} />
}
