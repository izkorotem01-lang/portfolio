import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getRemoteConfig } from "firebase/remote-config";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHT7o4_zP0RYQNI2eUjW7Rt-yXjjquShE",
  authDomain: "portfolio-74604.firebaseapp.com",
  projectId: "portfolio-74604",
  storageBucket: "portfolio-74604.firebasestorage.app",
  messagingSenderId: "566187319135",
  appId: "1:566187319135:web:9346b0180850582621e0ea",
  measurementId: "G-JN5KXF01QK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firebase Firestore
export const db = getFirestore(app);

// Initialize Firebase Remote Config
export const remoteConfig = getRemoteConfig(app);
remoteConfig.settings = {
  minimumFetchIntervalMillis: 3600000, // 1 hour
};

// Video URLs - these will be replaced with actual Firebase Storage URLs
export const videoUrls = {
  showreel:
    "https://firebasestorage.googleapis.com/v0/b/your-bucket/videos/showreel.mp4",
  showreelYT:
    "https://firebasestorage.googleapis.com/v0/b/your-bucket/videos/showreel-yt.mp4",
};

export default app;
