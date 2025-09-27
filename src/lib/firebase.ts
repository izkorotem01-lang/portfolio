import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Video URLs - these will be replaced with actual Firebase Storage URLs
export const videoUrls = {
  showreel:
    "https://firebasestorage.googleapis.com/v0/b/your-bucket/videos/showreel.mp4",
  showreelYT:
    "https://firebasestorage.googleapis.com/v0/b/your-bucket/videos/showreel-yt.mp4",
};

export default app;
