# Kids House

## Current State
- Videos tab (`activeTab === "videos"`) renders `ShortsPage` which shows emoji-based short video cards with swipe navigation
- `HomePage` shows a video feed with categories, search, and VideoCard components (play button, like button)
- No Video ID display on any video cards
- No dedicated Videos page separate from Shorts

## Requested Changes (Diff)

### Add
- New `VideosPage.tsx` replacing the current Videos tab content
- Video ID display on each video card (e.g., "Video ID: 001", "Video ID: 002")
- Like ❤️ count and view 👁️ count on each video card
- "Short Videos" section within VideosPage:
  - Vertical (reels style) full-screen-height cards
  - Scroll or swipe to go to next short video
  - Auto-play next short video when current ends (simulated with timer since demo)
  - Each short shows title, video ID, like count, view count

### Modify
- `App.tsx`: change `activeTab === "videos"` to render `VideosPage` instead of `ShortsPage`
- Video cards: add `Video ID: XXX` badge (zero-padded 3 digits)
- Video cards: add view count display alongside like count

### Remove
- Nothing removed; ShortsPage can remain but is no longer the videos tab target

## Implementation Plan
1. Create `src/frontend/src/pages/VideosPage.tsx`:
   - Top section: "Videos" heading with grid of video cards (1 col mobile, 2 col desktop)
   - Each VideoCard shows: video thumbnail/player, title, Video ID badge (e.g. "Video ID: 001"), ❤️ like count, 👁️ view count
   - Below: "Short Videos" section with vertical scroll snap container
   - Each short video item takes full viewport height, auto-advances to next after ~8s timer
   - Swipe (touch) or scroll to navigate between shorts
   - Short cards show: emoji/gradient background, title, Video ID, like & view counts
2. Update `App.tsx` to import and render `VideosPage` for the videos tab
3. Keep UI colorful, kid-friendly, large text, bright colors
4. Fully responsive (mobile-first, desktop adjustments)
