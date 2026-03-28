# Kids House

## Current State
- Full React/TypeScript app with 5 tabs: Home, Videos, Add Video, Games, Profile
- AppLockPage.tsx exists with PIN system and 'Try Demo' button but is NOT in navigation
- ShortsPage.tsx exists with reels-style vertical short videos but is NOT in navigation
- Wrong PIN currently shakes and lets user retry; timeout closes the lock screen

## Requested Changes (Diff)

### Add
- App Lock tab in navigation (both mobile bottom nav and desktop sidebar)
- Shorts tab in navigation (both mobile bottom nav and desktop sidebar)

### Modify
- App Lock wrong PIN behavior: after wrong PIN, show 'Kids House Opening...' message and close the lock screen (redirect to Kids House home) instead of letting user retry
- App Lock timeout behavior: same — show 'Kids House Opening...' and close
- Navigation: expand from 5 tabs to 7 tabs (Home, Videos, Upload, Games, Shorts, AppLock, Profile)

### Remove
- Nothing removed

## Implementation Plan
1. In App.tsx: add 'shorts' and 'applock' as Tab types, add NAV_ITEMS entries for them, add colors, add import for ShortsPage and AppLockPage, add cases in renderPage()
2. In AppLockPage.tsx LockScreen component: change 'denied' and 'timeout' status handling — instead of retry, show 'Kids House Opening...' message and call onClose after 1.5s
3. Ensure navigation fits 7 items on mobile bottom bar (reduce text or use smaller icons)
