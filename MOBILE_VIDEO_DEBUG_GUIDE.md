# Mobile Video Debugging Guide

## Current Issue

Videos show as black screens on mobile devices but work fine on PC.

## Debugging Steps

### 1. Open Browser Console on Mobile

On your phone, you can debug by:

- **iOS Safari**: Settings → Safari → Advanced → Web Inspector (requires connecting to Mac)
- **Android Chrome**: chrome://inspect in Chrome on your PC while phone is connected via USB
- **Eruda** (add to site): Add `<script src="https://cdn.jsdelivr.net/npm/eruda"></script>` to enable mobile console

### 2. Check Console Logs

Look for these messages in the console:

- `"Video metadata loaded: [videoId]"` - Video is loading
- `"Video started playing: [videoId]"` - Video successfully playing
- `"Autoplay prevented (user interaction required)"` - Normal on mobile
- `"Video loading error"` - Video failed to load
- `"Play on tap failed"` - Tap to play didn't work

### 3. Common Mobile Video Issues

#### Black Screen Causes:

1. **Video codec not supported**: Mobile browsers require H.264 codec
2. **File too large**: Mobile browsers may refuse to load large videos
3. **CORS issues**: Videos must be from same domain or have CORS headers
4. **Autoplay blocked**: iOS Safari blocks autoplay even when muted (requires user interaction)
5. **Network timeout**: Slow mobile network causing videos to stall

#### Solutions Applied:

- ✅ Added `playsInline` attribute (required for iOS)
- ✅ Added `poster` attribute for fallback image
- ✅ Sequential loading to prevent network overload
- ✅ Tap-to-play functionality for when autoplay fails
- ✅ Loading indicators to show progress
- ✅ Background color to prevent pure black screens

### 4. Test Video Compatibility

Check if your videos meet mobile requirements:

- **Format**: MP4 container
- **Video Codec**: H.264 (AVC)
- **Audio Codec**: AAC
- **Resolution**: Max 1080p for mobile
- **File Size**: Preferably under 50MB for mobile networks

### 5. Firebase Storage CORS

If videos are from Firebase Storage, ensure CORS is configured:

```json
[
  {
    "origin": ["https://your-domain.com", "http://localhost:5173"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

Apply with:

```bash
gsutil cors set cors.json gs://your-bucket-name
```

### 6. Manual Testing Checklist

On your mobile device:

- [ ] Do you see loading indicators?
- [ ] Do videos appear after "Loading..."?
- [ ] Can you tap a video to make it play?
- [ ] Do you see any error messages in console?
- [ ] Does the first video load?
- [ ] Does the counter increment (e.g., "Waiting... (1/15)")?

### 7. Network Tab Check

In mobile browser dev tools, check Network tab:

- Are video files being requested?
- What HTTP status codes? (200 = OK, 403 = forbidden, 404 = not found)
- Are videos downloading?
- Are they completing download?

### 8. Temporary Test

To test if it's a loading sequence issue, you can temporarily modify the loader to allow all videos immediately:

In `src/hooks/use-sequential-video-loader.tsx`, change:

```typescript
const initialLoadCount = isMobile ? 2 : 4; // Load first N videos immediately
```

to:

```typescript
const initialLoadCount = isMobile ? 999 : 4; // Allow all videos on mobile (TEST ONLY)
```

If videos still show as black, it's not the sequential loader but rather video format/compatibility.

### 9. Video Element Inspector

On mobile, check the actual video element properties:

```javascript
// In browser console
document.querySelectorAll("video").forEach((v, i) => {
  console.log(`Video ${i}:`, {
    src: v.src,
    networkState: v.networkState, // 0=empty, 1=idle, 2=loading, 3=no source
    readyState: v.readyState, // 0=nothing, 1=metadata, 2=current data, 3=future data, 4=enough data
    paused: v.paused,
    muted: v.muted,
    error: v.error?.message,
  });
});
```

## Next Steps if Still Black

If videos are still showing as black screens:

1. Check video file format compatibility
2. Try with a small test video (< 5MB)
3. Verify Firebase Storage CORS settings
4. Check if videos work when opened directly in mobile browser
5. Test on different mobile browsers (Safari, Chrome, Firefox)
