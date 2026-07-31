import {useFormValue} from 'sanity'
import {VideoFilePreview} from './VideoFilePreview'
import {YouTubePreview} from './YouTubePreview'

type SanityFile = {
  asset?: {
    _ref?: string
  }
}

export function PortfolioVideoPreview() {
  const videoFile = useFormValue(['videoFile']) as SanityFile | undefined
  const videoUrl = useFormValue(['videoUrl']) as string | undefined

  if (videoFile?.asset?._ref) {
    return <VideoFilePreview />
  }

  if (videoUrl) {
    return <YouTubePreview />
  }

  return null
}
