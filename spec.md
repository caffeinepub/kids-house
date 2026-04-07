# Kids House

## Current State
Home page (`HomePage.tsx`) has a video grid with `VideoCard` components that show a play button inline — clicking play opens the video within the same card (no modal). `VideosPage.tsx` has a full `VideoPlayerModal` with:
- Large player area (demo or real)
- "Watch Video" / "Play" button
- More Videos horizontal strip below
- Smooth spring animation
- Escape key / backdrop close

Home page does NOT share this modal experience.

## Requested Changes (Diff)

### Add
- Extract/reuse the `VideoPlayerModal` component from VideosPage on HomePage
- When any video card on Home page is clicked, the same attractive full-screen modal opens with the big player, "Watch Video" / "Play" button, and "More Videos" strip below
- Home page video cards should have a clear click-to-open-modal interaction (hover overlay with play icon)

### Modify
- `HomePage.tsx`: Replace inline play behavior with modal-based approach matching VideosPage
- `VideoCard` on Home page should open modal on click (not inline play)
- Ensure all demo videos on Home page also use the attractive DemoPlayer inside modal

### Remove
- Inline `isPlaying` state from `VideoCard` on Home page (replaced by modal)

## Implementation Plan
1. Move shared types (`DemoVideo`, `DisplayVideo`, `VideoPlayerModal`, `DemoPlayer`, `RealPlayer`) into a shared component or duplicate them in `HomePage.tsx`
2. Update `VideoCard` in HomePage to accept `onClick` prop and trigger modal
3. Add `selectedVideo` / `selectedIndex` state to `HomePage`
4. Render `VideoPlayerModal` in `HomePage` with all videos list (for More Videos strip)
5. Ensure demo videos in Home page have the same gradient/emoji style as VideosPage demos for consistent modal rendering
