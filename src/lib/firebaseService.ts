import { storage } from "./firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";

// Video quality types for mobile optimization
export type VideoQuality = "mobile" | "desktop" | "original";

// Service for managing Firebase Storage videos
export class FirebaseVideoService {
  private static instance: FirebaseVideoService;
  private videoCache: Map<string, string> = new Map();
  private qualityCache: Map<string, Map<VideoQuality, string>> = new Map();

  static getInstance(): FirebaseVideoService {
    if (!FirebaseVideoService.instance) {
      FirebaseVideoService.instance = new FirebaseVideoService();
    }
    return FirebaseVideoService.instance;
  }

  // Get video URL from Firebase Storage with quality optimization
  async getVideoUrl(
    videoPath: string,
    quality: VideoQuality = "original"
  ): Promise<string> {
    // Check quality cache first
    if (this.qualityCache.has(videoPath)) {
      const qualityMap = this.qualityCache.get(videoPath)!;
      if (qualityMap.has(quality)) {
        return qualityMap.get(quality)!;
      }
    }

    try {
      // Try to get the specific quality version first
      let finalPath = videoPath;
      if (quality !== "original") {
        const pathParts = videoPath.split(".");
        const extension = pathParts.pop();
        const basePath = pathParts.join(".");
        finalPath = `${basePath}_${quality}.${extension}`;
      }

      const videoRef = ref(storage, finalPath);
      const url = await getDownloadURL(videoRef);

      // Cache the URL by quality
      if (!this.qualityCache.has(videoPath)) {
        this.qualityCache.set(videoPath, new Map());
      }
      this.qualityCache.get(videoPath)!.set(quality, url);

      // Also cache in the original cache for backward compatibility
      if (quality === "original") {
        this.videoCache.set(videoPath, url);
      }

      return url;
    } catch (error) {
      // If quality-specific version doesn't exist, fall back to original
      if (quality !== "original") {
        console.warn(
          `Quality ${quality} not found for ${videoPath}, falling back to original`
        );
        return this.getVideoUrl(videoPath, "original");
      }

      console.error("Error getting video URL:", error);
      throw error;
    }
  }

  // Get optimized video URL based on device type
  async getOptimizedVideoUrl(
    videoPath: string,
    isMobile: boolean = false
  ): Promise<string> {
    // For now, always return original quality to avoid 404 errors
    // TODO: Implement proper video optimization with different quality variants
    return this.getVideoUrl(videoPath, "original");
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
