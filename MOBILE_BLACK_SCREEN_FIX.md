# Mobile Black Screen Fix

## Issue

Videos were showing as black screens on mobile devices (phones) but working fine on PC.

## Root Causes Identified

1. **Missing poster attribute**: Videos without a poster showed black until first frame loaded
2. **Conditional source loading**: Using `<source>` tag conditionally prevented proper loading
3. **No visual feedback**: Users couldn't tell if video was loading or broken
4. **Autoplay restrictions**: Mobile browsers block autoplay even when muted
5. **No tap-to-play fallback**: When autoplay failed, no way to manually start video

## Fixes Applied

### 1. Video Element Improvements

```typescript
<video
  src={video.videoUrl}
  poster={video.thumbnailUrl || undefined} // ✅ Shows thumbnail while loading
  className="... bg-gray-900" // ✅ Background color instead of black
  playsInline // ✅ Required for iOS
  muted // ✅ Required for autoplay
  loop // ✅ Continuous playback
  preload="none" // ✅ Controlled loading
  style={{ backgroundColor: "#1a1a1a" }} // ✅ Fallback background
/>
```

### 2. Tap-to-Play Functionality

```typescript
onClick={(e) => {
  const videoEl = e.currentTarget;
  if (isVideoLoaded && videoEl.paused) {
    videoEl.muted = true;
    videoEl.play().catch((err) => {
      console.log("Play on tap failed:", err);
    });
  }
  onVideoClick();
}}
```

### 3. Better Loading Indicators

- Shows "Loading..." overlay while video is loading
- Shows "Waiting... (X/Y)" for videos in queue
- Video ID display on mobile for debugging
- Opacity transition when video becomes ready

### 4. Debug Logging

Added console logs for:

- `"Video metadata loaded: [id]"` - Metadata ready
- `"Video started playing: [id]"` - Playback started
- `"Video paused: [id]"` - Playback paused
- `"Autoplay prevented"` - Normal mobile behavior
- `"Play on tap failed"` - Tap didn't work
- `"Video loading error"` - Failed to load

### 5. Sequential Loading Maintained

- Mobile: Loads 2 videos initially, then 1 at a time
- Desktop: Loads 4 videos initially, then 2 at a time
- Each video shown as soon as ready
- Queue system prevents network overload

## Testing Instructions

### 1. Deploy and Test on Real Mobile Device

```bash
npm run build
# Deploy to your hosting
```

### 2. On Mobile Device:

1. **Open the portfolio section**
2. **Look for loading indicators** - Should see "Loading..." or "Waiting..."
3. **Wait for first videos to load** - Should see them appear one by one
4. **Tap on a video** - Should start playing if autoplay was blocked
5. **Check browser console** - Should see debug logs

### 3. If Still Seeing Black Screens:

#### Check Video Format Compatibility

Your videos MUST be:

- **Container**: MP4
- **Video Codec**: H.264 (not H.265/HEVC)
- **Audio Codec**: AAC
- **Profile**: Baseline or Main (not High)

To check your videos:

```bash
ffprobe your-video.mp4
```

To convert if needed:

```bash
ffmpeg -i input.mp4 -c:v libx264 -profile:v baseline -level 3.0 -c:a aac -b:a 128k output.mp4
```

#### Check Firebase Storage CORS

If videos are from Firebase Storage, ensure CORS is configured:

Create `cors.json`:

```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

Apply:

```bash
gsutil cors set cors.json gs://your-bucket-name.appspot.com
```

#### Check Video File Size

Large videos may timeout on mobile:

- Recommended: < 20MB per video for mobile
- Maximum: < 50MB per video

To reduce size:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k output.mp4
```

### 4. Mobile Browser Testing Checklist

Test on these mobile browsers:

- [ ] iOS Safari (most restrictive)
- [ ] iOS Chrome (uses Safari engine)
- [ ] Android Chrome
- [ ] Android Firefox
- [ ] Samsung Internet

### 5. Network Testing

Test on different network conditions:

- [ ] WiFi
- [ ] 4G/LTE
- [ ] 3G (use Chrome DevTools throttling)

## Debug Mode

To enable more aggressive debugging on mobile:

1. Open browser DevTools on mobile (see MOBILE_VIDEO_DEBUG_GUIDE.md)
2. Check console for all the debug logs
3. Check Network tab to see if videos are downloading
4. Inspect video element properties

## Expected Behavior

### What You Should See:

1. **Initially**: Loading placeholders with animated play icons
2. **First 2 videos** (mobile): Start loading immediately
3. **As each loads**: Replaces placeholder with video
4. **Remaining videos**: Load one at a time, showing progress
5. **After loading**: Videos play automatically (or show tap hint)

### What You Should NOT See:

- ❌ Pure black screens with no indicators
- ❌ All videos trying to load at once
- ❌ Videos staying stuck at "Loading..."
- ❌ Error messages in console (unless video file is bad)

## Still Having Issues?

If black screens persist after these fixes:

1. **Test with a known-good video file**:

   - Use a small (< 5MB) H.264 MP4 video
   - Test if that specific video works

2. **Check video URLs**:

   - Open video URL directly in mobile browser
   - If it doesn't play there, the video format is incompatible

3. **Test with autoplay disabled**:

   - Set all videos to require tap-to-play
   - If they work then, it's an autoplay policy issue

4. **Check Firebase quotas**:
   - Ensure you haven't hit bandwidth limits
   - Check Firebase Console for errors

## Files Modified

- ✅ `src/components/sections/PortfolioSection.tsx` - Main video loading logic
- ✅ `src/hooks/use-sequential-video-loader.tsx` - Sequential loading hook
- 📄 `MOBILE_VIDEO_DEBUG_GUIDE.md` - Debugging instructions
- 📄 `MOBILE_BLACK_SCREEN_FIX.md` - This file
- 📄 `VIDEO_LOADING_FIX.md` - Original sequential loading documentation

## Summary

The black screen issue should now be resolved with:

1. Proper poster/thumbnail display
2. Background colors preventing pure black
3. Better loading indicators
4. Tap-to-play fallback for mobile
5. Debug logging for troubleshooting
6. Sequential loading to prevent overload

If issues persist, it's likely a video format compatibility issue - follow the video format section above to ensure your videos are mobile-compatible.
