const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#/]+)/i;

export const getYouTubeVideoId = (url) => {
  if (!url?.trim()) return null;
  const match = url.trim().match(YOUTUBE_ID_PATTERN);
  return match?.[1] ?? null;
};

export const isYouTubeUrl = (url) => Boolean(getYouTubeVideoId(url));

export const fetchYouTubeTitle = async (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${videoId}`,
  )}&format=json`;

  const response = await fetch(oembedUrl);
  if (!response.ok) {
    throw new Error(`oEmbed failed for ${videoId}: ${response.status}`);
  }

  const data = await response.json();
  const title = typeof data?.title === "string" ? data.title.trim() : "";
  return title || null;
};

export const toLocaleTitle = (title) => ({
  _type: "localeString",
  en: title,
  hb: title,
});
