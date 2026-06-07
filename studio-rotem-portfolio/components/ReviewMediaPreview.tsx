import {PortfolioVideoPreview} from './PortfolioVideoPreview'
import {YouTubePreview} from './YouTubePreview'
import {useFormValue} from 'sanity'

type SanityFile = {
  asset?: {
    _ref?: string
  }
}

export function ReviewMediaPreview() {
  const videoFile = useFormValue(['videoFile']) as SanityFile | undefined
  const youtubeUrl = useFormValue(['youtubeUrl']) as string | undefined

  if (videoFile?.asset?._ref) {
    return <PortfolioVideoPreview />
  }

  if (youtubeUrl) {
    return <YouTubePreview />
  }

  return null
}
