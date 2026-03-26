# Kids House - Full Feature Rebuild

## Current State
Basic Kids House app with:
- Login/signup (Internet Identity)
- Home page with video feed (real + demo videos)
- Video upload page
- App lock page (toggle locks for TikTok/Instagram/Facebook/YouTube)
- Settings page with PIN management
- Bottom nav with 4 tabs: Home, Upload, AppLock, Settings
- Backend: user profiles, video meta, app lock settings, authorization, blob storage

## Requested Changes (Diff)

### Add
- **Navigation**: 5-tab bottom nav (Home, Shorts, Games, Courses, Chat) + profile/notifications in header
- **Home Screen**: Category filter tabs (Education, Fun, Coding, Career, Games); YouTube-style video cards with like/comment counts
- **Shorts Section**: Full-screen vertical swipeable short video feed (like YouTube Shorts)
- **Games Section**: Three categories (Brain, Fun, Learning) with playable mini-games (memory match, math quiz, word puzzle, color game)
- **Courses Section**: Career paths (Coding, Doctor, Teacher, Police, Business) each with lesson videos and progress tracking
- **Chat System**: Group chat rooms with safe message sending, message list, basic moderation
- **Profile Page**: Name, photo upload, age display, creator badge, uploaded videos dashboard
- **Notifications**: In-app notification list (new videos, live alerts)
- **Live Streaming**: Demo live stream page with join/go-live UI
- **Parental Control**: PIN-protected parental settings, app lock toggles, wrong PIN redirect
- **Like/Comment System**: Like and comment on videos, stored in backend
- **Creator Dashboard**: Manage uploaded videos, view stats
- **Splash Screen**: Animated Kids House logo splash on first load
- **Hindi language labels** throughout the UI

### Modify
- App.tsx: expand routing to support all new tabs and pages
- HomePage: add category filter, like buttons, improved video cards
- SettingsPage: expand with parental controls, profile editing, language settings
- BottomNav: redesign with 5 tabs using colorful icons
- Backend: add likes, comments, chat messages, course progress, notifications

### Remove
- Standalone AppLock tab (move into Settings/Parental Controls)
- Standalone Upload tab (move into Profile/Creator dashboard)

## Implementation Plan
1. Extend backend Motoko with: likes, comments, chat messages, course progress, video categories
2. Rebuild frontend App.tsx with new routing structure
3. Build Shorts page with swipe-based full-screen video
4. Build Games page with 3+ mini-games
5. Build Courses page with career sections and lesson videos
6. Build Chat page with group messaging
7. Build Profile page with creator dashboard
8. Build Notifications page
9. Enhance HomePage with categories and like system
10. Redesign BottomNav with 5 colorful tabs
11. Add animated splash screen
12. Add Hindi labels throughout
