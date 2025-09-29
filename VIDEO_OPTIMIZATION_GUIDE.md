# 🎥 Video Optimization Guide

## Current Problem

Your videos are **19-20 MB each**, causing slow loading times.

## Recommended Video Specifications

### Portfolio Videos

- **File Size**: 2-5 MB maximum per video
- **Resolution**: 1280x720 (720p) or 1920x1080 (1080p)
- **Duration**: 10-30 seconds for portfolio previews
- **Bitrate**: 1-2 Mbps
- **Format**: MP4 with H.264 codec

### Thumbnails

- **File Size**: 50-200 KB per image
- **Resolution**: 400x225 or 640x360
- **Format**: WebP (best) or JPEG

## How to Optimize Your Videos

### Using FFmpeg (Recommended)

```bash
# For 720p video (2-3 MB)
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k output.mp4

# For 1080p video (3-5 MB)
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k output.mp4

# Create thumbnail
ffmpeg -i input.mp4 -ss 00:00:02 -vframes 1 -vf scale=640:360 thumbnail.jpg
```

### Using Online Tools

1. **HandBrake** (Free): https://handbrake.fr/
2. **CloudConvert** (Online): https://cloudconvert.com/
3. **Compressor.io** (Online): https://compressor.io/

### Settings for HandBrake

- **Preset**: Web
- **Resolution**: 1280x720 or 1920x1080
- **Quality**: RF 23-28
- **Audio**: AAC, 128 kbps

## Performance Impact

| Current | Optimized | Load Time (3G) |
| ------- | --------- | -------------- |
| 40 MB   | 10 MB     | 2-3 seconds    |
| 19 MB   | 3 MB      | 1-2 seconds    |

## Implementation Tips

1. **Use thumbnails** instead of autoplay videos
2. **Lazy load** videos only when needed
3. **Preload metadata** only, not full video
4. **Compress** all videos before uploading
5. **Use WebP** for thumbnails

## Quick Fix for Current Videos

1. Compress your current videos to 3-5 MB each
2. Create thumbnails for each video
3. Update the portfolio to use lazy loading
4. Consider using a CDN for video delivery

## Expected Results

- **90% faster loading**
- **Better mobile experience**
- **Lower bandwidth usage**
- **Improved SEO scores**
