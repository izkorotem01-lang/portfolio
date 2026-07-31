/** Append asset id so browsers pick up replacements after CMS image swaps. */
export const cmsImageUrl = (url?: string | null, assetRef?: string | null) => {
  if (!url) return undefined;
  if (!assetRef) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(assetRef)}`;
};
