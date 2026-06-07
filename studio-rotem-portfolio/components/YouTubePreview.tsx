import {Card, Stack, Text} from '@sanity/ui'
import {useFormValue} from 'sanity'
import {getYouTubeId} from '../schemaTypes/shared/youtubeHelpers'

export function YouTubePreview() {
  const youtubeUrl =
    (useFormValue(['youtubeUrl']) as string | undefined) ||
    (useFormValue(['videoUrl']) as string | undefined)
  const videoId = getYouTubeId(youtubeUrl)

  if (!videoId) {
    return null
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  return (
    <Card padding={3} radius={2} shadow={1} tone="transparent">
      <Stack space={3}>
        <Text size={1} weight="semibold">
          Preview
        </Text>
        <Card
          style={{
            width: '100%',
            maxWidth: 360,
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            background: '#000',
          }}
        >
          <img
            src={thumbnailUrl}
            alt="YouTube thumbnail"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Card>
        <Text size={1} muted>
          {youtubeUrl}
        </Text>
      </Stack>
    </Card>
  )
}
