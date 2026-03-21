# Kids House

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Login and signup screens (username + password)
- Settings screen with PIN/password protection
- App Lock demo screen showing list of apps (Instagram, YouTube, etc.) that can be toggled locked
- Video feed screen scrollable like YouTube with video cards
- Video upload screen (title + video file)
- Uploaded and demo videos appear in main feed

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: User auth (signup/login), PIN/password settings, video metadata storage (title, blob ref), app lock state per user
2. Frontend: Mobile-style layout, 5 screens via bottom nav (Home/Videos, Upload, App Lock, Settings, Profile)
3. Video section: scrollable card feed with play button, demo videos seeded
4. App Lock: list of demo apps with lock/unlock toggle, PIN prompt to access settings
5. Upload: form with title input and video file picker, stores via blob-storage
6. Settings: change PIN/password, guarded by current PIN
