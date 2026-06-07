export type ReviewItem = {
  id?: string;
  name: string;
  company: string;
  rating: number;
  text: string;
  video?: string;
  thumbnail?: string;
  screenshot?: string;
  isYouTube?: boolean;
};
