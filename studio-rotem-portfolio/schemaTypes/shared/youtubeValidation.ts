const YOUTUBE_PATTERN = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i

export const isYouTubeUrl = (url?: string) => !!url && YOUTUBE_PATTERN.test(url)

export const youtubeUrlRule = (message = 'Must be a valid YouTube URL') =>
  (Rule: {required: () => {custom: (fn: (url: string | undefined) => true | string) => unknown}}) =>
    Rule.required().custom((url: string | undefined) => {
      if (!url) return 'Required'
      return isYouTubeUrl(url) || message
    })
