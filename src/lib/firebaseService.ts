import { storage } from "./firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";

// Service for managing Firebase Storage videos
export class FirebaseVideoService {
  private static instance: FirebaseVideoService;
  private videoCache: Map<string, string> = new Map();

  static getInstance(): FirebaseVideoService {
    if (!FirebaseVideoService.instance) {
      FirebaseVideoService.instance = new FirebaseVideoService();
    }
    return FirebaseVideoService.instance;
  }

  // Get video URL from Firebase Storage
  async getVideoUrl(videoPath: string): Promise<string> {
    // Check cache first
    if (this.videoCache.has(videoPath)) {
      return this.videoCache.get(videoPath)!;
    }

    try {
      const videoRef = ref(storage, videoPath);
      const url = await getDownloadURL(videoRef);

      // Cache the URL
      this.videoCache.set(videoPath, url);

      return url;
    } catch (error) {
      console.error("Error getting video URL:", error);
      throw error;
    }
  }

  // Get all videos from a folder
  async getAllVideos(folderPath: string): Promise<string[]> {
    try {
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);

      const videoUrls = await Promise.all(
        result.items.map((item) => this.getVideoUrl(item.fullPath))
      );

      return videoUrls;
    } catch (error) {
      console.error("Error getting all videos:", error);
      throw error;
    }
  }

  // Clear cache (useful for development)
  clearCache(): void {
    this.videoCache.clear();
  }
}

// Export singleton instance
export const firebaseVideoService = FirebaseVideoService.getInstance();
