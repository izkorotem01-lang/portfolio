import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

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
  order: number;
  allWorkOrder?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

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
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Helper function to get YouTube embed URL
export const getYouTubeEmbedUrl = (url: string, autoplay: boolean = false, muted: boolean = true): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0&enablejsapi=1`;
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
  const q = query(collection(db, "categories"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as PortfolioCategory)
  );
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
  isMobile: boolean = false
): Promise<PortfolioVideo[]> => {
  // Get videos and sort by allWorkOrder first, then by order as fallback
  const q = query(collection(db, "videos"));
  const querySnapshot = await getDocs(q);

  const videos = querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as PortfolioVideo)
  );

  // Sort by allWorkOrder if it exists, otherwise by order
  const sortedVideos = videos.sort((a, b) => {
    // Use allWorkOrder if it exists (even if only one has it)
    const aOrder = (a as any).allWorkOrder !== undefined ? (a as any).allWorkOrder : a.order;
    const bOrder = (b as any).allWorkOrder !== undefined ? (b as any).allWorkOrder : b.order;
    return aOrder - bOrder;
  });

  return sortedVideos;
};

export const getVideosByCategory = async (
  categoryId: string
): Promise<PortfolioVideo[]> => {
  const q = query(
    collection(db, "videos"),
    orderBy("categoryId", "==", categoryId),
    orderBy("order", "asc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as PortfolioVideo)
  );
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
