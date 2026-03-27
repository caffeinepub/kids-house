# Kids House

## Current State
- Tabs: Home, Videos, Games, About, Contact
- Tab type: home|videos|games|about|contact
- VideosPage shows hardcoded DEMO_VIDEOS, no real data or uploader info
- UploadPage exists but not in navigation
- Profile is a modal from header button, not a page tab
- useAllVideos() returns VideoMeta[] with uploader (Principal), title, id
- useCallerProfile() returns UserProfile with username, email
- identity.getPrincipal().toString() is user ID

## Requested Changes (Diff)

### Add
- ProfilePage.tsx: full page with avatar (initial letter), username, user ID, My Videos section (filtered by principal). Logout button.
- AddVideo tab routing to existing UploadPage.tsx
- Navigation: Home, Videos, Add Video, Games, Profile

### Modify
- Tab type: home|videos|addvideo|games|profile
- App.tsx: new tabs, route addvideo to UploadPage, profile to ProfilePage, update sidebar
- BottomNav: 5 tabs with new layout
- VideosPage: use useAllVideos() real data, show uploader ID (first 10 chars + ...) per card. Keep Short Videos section.
- LanguageContext: add addvideo/profile nav keys

### Remove
- About and Contact from navigation tabs (pages stay)

## Implementation Plan
1. Update Tab type in App.tsx
2. Create ProfilePage.tsx
3. Update VideosPage.tsx with real data
4. Update App.tsx routes and sidebar
5. Update BottomNav.tsx
6. Update LanguageContext.tsx
