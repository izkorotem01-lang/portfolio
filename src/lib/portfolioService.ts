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
    // Use allWorkOrder if both videos have it
    if (a.allWorkOrder !== undefined && b.allWorkOrder !== undefined) {
      return a.allWorkOrder - b.allWorkOrder;
    }
    // Use order field for consistent sorting
    return a.order - b.order;
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
