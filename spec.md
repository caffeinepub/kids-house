# Kids House

## Current State
Existing project with backend and frontend scaffolding. No meaningful app code yet.

## Requested Changes (Diff)

### Add
- Home screen with 5 large colorful buttons: Learning, Games, Drawing, Long Videos, Short Videos
- Each section opens as a full view with a back button
- Learning section: A-Z alphabet and 1-10 numbers displayed as colorful cards
- Games section: simple placeholder with links to 2-3 mini games (memory match, color match)
- Drawing section: HTML5 canvas with color palette, brush size, and clear button
- Long Videos section: horizontal scrollable layout with YouTube iframe embeds
- Short Videos section: vertical reels-style layout, one video per screen, scroll up/down, mobile-friendly
- Fully responsive (mobile + desktop)
- Colorful, kid-friendly UI with big rounded buttons

### Modify
- Replace existing frontend with new Kids House app

### Remove
- Previous app code (login, profile, subscription, etc.)

## Implementation Plan
1. Create App.tsx with section routing state (home | learning | games | drawing | longvideos | shortvideos)
2. Build HomeScreen with 5 colorful big buttons
3. Build LearningSection: A-Z cards + 1-10 number cards with colors and icons
4. Build GamesSection: simple card grid linking to mini-games (Memory Match, Color Match, Math Quiz)
5. Build DrawingSection: canvas with color picker, brush sizes, eraser, clear
6. Build LongVideosSection: horizontal scroll row of YouTube iframe embeds
7. Build ShortVideosSection: vertical full-screen snap scroll of YouTube Shorts embeds
8. BackButton component reused across all sections
9. Responsive CSS with mobile-first approach
