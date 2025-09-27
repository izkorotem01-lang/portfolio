# Firebase Storage Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `rotem-portfolio`
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Storage

1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode" (for now)
4. Select a location (choose closest to your users)
5. Done

## 3. Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon to add web app
4. Register app name: `rotem-portfolio-web`
5. Copy the config object

## 4. Update Configuration

Replace the placeholder values in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "rotem-portfolio.firebaseapp.com",
  projectId: "rotem-portfolio",
  storageBucket: "rotem-portfolio.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id",
};
```

## 5. Upload Videos

1. Go to Storage in Firebase Console
2. Create folder: `videos`
3. Upload your videos:
   - `showreel.mp4` (9:16 version)
   - `showreel-yt.mp4` (16:9 version)

## 6. Set Storage Rules (Security)

In Storage > Rules, update to:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // Allow public read access
      allow write: if false; // No write access from client
    }
  }
}
```

## 7. Test the Integration

1. Start your dev server: `npm run dev`
2. Check browser console for any errors
3. Videos should load from Firebase Storage

## 8. Performance Tips

- Compress videos before uploading
- Use H.264 codec
- Consider multiple resolutions (720p, 1080p)
- Monitor Firebase usage in console

## 9. Cost Monitoring

- Check Firebase Console > Usage for costs
- Set up billing alerts
- Monitor bandwidth usage

## 10. Future Enhancements

- Add video compression service
- Implement lazy loading
- Add video analytics
- Create admin panel for video management
