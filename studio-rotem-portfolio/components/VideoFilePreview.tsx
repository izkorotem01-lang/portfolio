import {Card, Stack, Text} from '@sanity/ui'
import {getFileAsset} from '@sanity/asset-utils'
import {useFormValue, useDataset, useProjectId} from 'sanity'

type SanityFile = {
  asset?: {
    _ref?: string
  }
}

export function VideoFilePreview() {
  const videoFile = useFormValue(['videoFile']) as SanityFile | undefined
  const projectId = useProjectId()
  const dataset = useDataset()

  if (!videoFile?.asset?._ref) {
    return null
  }

  const {url} = getFileAsset(videoFile, {projectId, dataset})

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
            aspectRatio: '9 / 16',
            overflow: 'hidden',
            background: '#000',
          }}
        >
          <video
            src={url}
            controls
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Card>
      </Stack>
    </Card>
  )
}
