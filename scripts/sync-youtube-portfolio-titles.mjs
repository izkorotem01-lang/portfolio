import { createClient } from "@sanity/client";
import {
  fetchYouTubeTitle,
  isYouTubeUrl,
  toLocaleTitle,
} from "./youtube-title.mjs";

const projectId = process.env.VITE_SANITY_PROJECT_ID || "v9h3c4gc";
const dataset = process.env.VITE_SANITY_DATASET || "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const VIDEOS_QUERY = `*[_type == "portfolioVideo"] {
  _id,
  title,
  useCustomTitle,
  videoUrl
}`;

const ENTREPRENEUR_VIDEO_IDS = new Set([
  "portfolioVideo-cEE67rZIL68",
  "portfolioVideo-xk2PA5gnirk",
  "portfolioVideo-N8RBKt3oQmA",
  "portfolioVideo-_sdU28dBae4",
  "portfolioVideo-1m4BU98JBq8",
  "portfolioVideo-n5C8RpElSHg",
  "portfolioVideo-lPB_KyjWZko",
]);

const CUSTOM_TITLE_VIDEO_IDS = new Set([
  ...ENTREPRENEUR_VIDEO_IDS,
  "portfolioVideo-IwHQlF5KT50",
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  const videos = await client.fetch(VIDEOS_QUERY);
  const titleCache = new Map();
  const patches = [];

  for (const video of videos) {
    const youtubeUrl = video.videoUrl?.trim();
    if (!isYouTubeUrl(youtubeUrl)) continue;

    const useCustomTitle =
      video.useCustomTitle === true || CUSTOM_TITLE_VIDEO_IDS.has(video._id);

    if (useCustomTitle) {
      if (video.useCustomTitle !== true) {
        patches.push({
          id: video._id,
          patch: { set: { useCustomTitle: true } },
          reason: "mark custom title",
        });
      }
      continue;
    }

    let youtubeTitle = titleCache.get(youtubeUrl);
    if (!youtubeTitle) {
      youtubeTitle = await fetchYouTubeTitle(youtubeUrl);
      titleCache.set(youtubeUrl, youtubeTitle);
      await sleep(120);
    }

    if (!youtubeTitle) {
      console.warn(`Skipped ${video._id}: no YouTube title`);
      continue;
    }

    const currentTitle =
      video.title?.en?.trim() ||
      video.title?.hb?.trim() ||
      video.title?.he?.trim() ||
      "";

    if (currentTitle === youtubeTitle && video.useCustomTitle === false) {
      continue;
    }

    patches.push({
      id: video._id,
      patch: {
        set: {
          title: toLocaleTitle(youtubeTitle),
          useCustomTitle: false,
        },
      },
      reason: `sync YouTube title`,
      title: youtubeTitle,
    });
  }

  if (patches.length === 0) {
    console.log("No portfolio video title updates needed.");
    return;
  }

  if (!process.env.SANITY_API_TOKEN) {
    console.log("Dry run (set SANITY_API_TOKEN to write):");
    for (const item of patches) {
      console.log(`- ${item.id}: ${item.title ?? item.reason}`);
    }
    return;
  }

  let tx = client.transaction();
  for (const item of patches) {
    tx = tx.patch(item.id, item.patch);
  }
  await tx.commit();
  console.log(`Updated ${patches.length} portfolio video title(s).`);
  for (const item of patches) {
    if (item.title) console.log(`  ${item.id}: ${item.title}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
