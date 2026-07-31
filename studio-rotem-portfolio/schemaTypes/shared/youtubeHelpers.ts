export const getYouTubeId = (url?: string) => {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#/]+)/i,
  )
  return match?.[1] ?? null
}

export const getYouTubeThumbnail = (url?: string) => {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined
}

export const getYouTubeEmbedUrl = (url?: string) => {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : undefined
}
