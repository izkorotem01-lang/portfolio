import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getRemoteConfig } from "firebase/remote-config";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5LlMgoQ3gjyK6Ce11a7_orStYa5rClcI",
  authDomain: "rotem-portfolio-b7480.firebaseapp.com",
  projectId: "rotem-portfolio-b7480",
  storageBucket: "rotem-portfolio-b7480.firebasestorage.app",
  messagingSenderId: "145759423765",
  appId: "1:145759423765:web:9b1a5b17fa62482f502d1c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
