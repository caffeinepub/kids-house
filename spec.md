# Kids House

## Current State
App has user profiles, video upload/viewing, games, and navigation (Home, Videos, Add Video, Games, Profile). Backend stores users and videos. No subscription/follow system exists.

## Requested Changes (Diff)

### Add
- `subscribe(creator: Principal)` backend function — logged-in user subscribes to a creator
- `unsubscribe(creator: Principal)` backend function
- `getMySubscriptions()` — returns list of principals the caller follows
- `getSubscriberCount(creator: Principal)` — returns how many subscribers a creator has
- `getCreatorInfo(creator: Principal)` — returns username + subscriber count for a creator
- Subscribe button on each video card (showing uploader's subscriber count)
- Subscribe button on Profile page hero card (when viewing)
- "Subscribed Channels" section on Profile page listing all channels the user subscribes to
- Notification badge/alert when a newly uploaded video is from a subscribed creator (frontend localStorage-based: store last-seen timestamp per creator, detect new videos on load)

### Modify
- Profile page: add "Subscribed Channels" tab/section below "My Videos"
- Videos page: add Subscribe button per video card next to uploader info
- NotificationsPanel: show alerts for new videos from subscribed creators

### Remove
- Nothing removed

## Implementation Plan
1. Add subscription store and methods to main.mo (subscribe, unsubscribe, getMySubscriptions, getSubscriberCount)
2. Regenerate backend bindings
3. Add SubscribedChannels section to ProfilePage showing each subscribed creator's username + video count
4. Add Subscribe/Unsubscribe button to RealVideoCard in VideosPage
5. Wire notification logic: on app load, compare video timestamps to last-visit, flag videos from subscribed creators as new
