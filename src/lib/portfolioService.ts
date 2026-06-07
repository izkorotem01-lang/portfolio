import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  fetchCategoriesFromSanity,
  fetchVideosByCategoryFromSanity,
  fetchVideosFromSanity,
} from "./sanityPortfolio";

export interface PortfolioCategory {
  id: string;
  name: string;
  nameHe: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PortfolioVideo {
  id: string;
  categoryId: string;
  title: string;
  titleHe: string;
  subtitle: string;
  subtitleHe: string;
  videoUrl: string;
  thumbnailUrl?: string;
  autoplayInBackground?: boolean;
  order: number;
  allWorkOrder?: number;
  videoWidth?: number;
  videoHeight?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const isUploadedPortfolioVideo = (url: string): boolean =>
  !!url && !isYouTubeUrl(url);

export const isVerticalReelDimensions = (
  width: number,
  height: number
): boolean => height > width && width > 0;

export const isUploadedReelVideo = (
  video: Pick<PortfolioVideo, "videoUrl" | "videoWidth" | "videoHeight">
): boolean => {
  if (!isUploadedPortfolioVideo(video.videoUrl)) return false;
  if (video.videoWidth && video.videoHeight) {
    return isVerticalReelDimensions(video.videoWidth, video.videoHeight);
  }
  return false;
};

// Helper function to check if a URL is a YouTube URL
export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
};

// Helper function to extract YouTube video ID from URL
export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#/]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

export const getYouTubeThumbnail = (url: string): string | undefined => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined;
};

// Helper function to get YouTube embed URL
export const getYouTubeEmbedUrl = (
  url: string,
  autoplay: boolean = false,
  muted: boolean = false,
  controls: boolean = true
): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&controls=${controls ? 1 : 0}&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&enablejsapi=1`;
};

// Categories CRUD
export const createCategory = async (
  category: Omit<PortfolioCategory, "id" | "createdAt" | "updatedAt">
) => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, "categories"), {
    ...category,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

export const getCategories = async (): Promise<PortfolioCategory[]> => {
  return fetchCategoriesFromSanity();
};

export const updateCategory = async (
  id: string,
  updates: Partial<Omit<PortfolioCategory, "id" | "createdAt" | "updatedAt">>
) => {
  const categoryRef = doc(db, "categories", id);
  await updateDoc(categoryRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteCategory = async (id: string) => {
  const categoryRef = doc(db, "categories", id);
  await deleteDoc(categoryRef);
};

// Videos CRUD
export const createVideo = async (
  video: Omit<PortfolioVideo, "id" | "createdAt" | "updatedAt">
) => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, "videos"), {
    ...video,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

export const getVideos = async (
  _isMobile: boolean = false
): Promise<PortfolioVideo[]> => {
  return fetchVideosFromSanity();
};

export const getVideosByCategory = async (
  categoryId: string
): Promise<PortfolioVideo[]> => {
  return fetchVideosByCategoryFromSanity(categoryId);
};

export const updateVideo = async (
  id: string,
  updates: Partial<Omit<PortfolioVideo, "id" | "createdAt" | "updatedAt">>
) => {
  const videoRef = doc(db, "videos", id);
  await updateDoc(videoRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteVideo = async (id: string) => {
  const videoRef = doc(db, "videos", id);
  await deleteDoc(videoRef);
};
