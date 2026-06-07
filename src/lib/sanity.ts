import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const sanityProjectId =
  import.meta.env.VITE_SANITY_PROJECT_ID ?? "v9h3c4gc";
export const sanityDataset =
  import.meta.env.VITE_SANITY_DATASET ?? "production";

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: "2026-02-01",
  useCdn: true,
});

const imageBuilder = imageUrlBuilder(sanityClient);

export const urlForImage = (source: SanityImageSource) =>
  imageBuilder.image(source);
