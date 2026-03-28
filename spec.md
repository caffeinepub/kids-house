# Kids House - App Lock System

## Current State
The app has a basic AppLockPage with toggle switches to lock/unlock apps (YouTube, Instagram, TikTok, Facebook), but:
- No demo interaction (clicking a locked app does nothing)
- No lock screen or PIN entry UI
- No timer logic
- AppLockPage is not included in navigation tabs

## Requested Changes (Diff)

### Add
- Full App List screen with 6+ popular apps: YouTube, Instagram, WhatsApp, Games, TikTok, Facebook — each with emoji icon, name, and lock toggle
- "Try Demo" / tap-to-simulate button on each locked app card to simulate launching a locked app
- Lock Screen overlay: full-screen modal with Kids House branding, 4-digit PIN display, big keypad (0-9 + backspace + confirm)
- Timer: 5-second countdown shown on lock screen; if no PIN entered in 5s → show "Time's Up! 🔒" and auto-dismiss/reset
- Access Granted screen: shown when correct PIN (default 1234) is entered — big checkmark, "Access Granted", simulates opening app for 2s then closes
- Access Denied feedback: wrong PIN shows shake animation + red error message
- Default PIN stored in localStorage, parents can change it in a PIN settings section at top of page
- AppLock tab added to navigation (sidebar on desktop, bottom nav on mobile)

### Modify
- AppLockPage.tsx: completely rebuilt with all new features above
- App.tsx: add AppLock tab to SIDEBAR_TABS, BottomNav, and Tab type
- BottomNav component: add applock tab

### Remove
- Old minimal AppLockPage UI (replaced by new implementation)

## Implementation Plan
1. Rebuild AppLockPage.tsx with:
   - App list section with lock toggles and "Tap to Try" demo buttons on locked apps
   - PIN settings card at top (show/change PIN)
   - LockScreen component (inline or separate): full-screen overlay, countdown timer, big keypad, PIN dots, access granted/denied states
2. Update App.tsx Tab type to include 'applock'
3. Add applock tab to sidebar and route to AppLockPage in main content
4. Update BottomNav to include applock (🔒) tab
