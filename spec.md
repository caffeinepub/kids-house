# Kids House — Hindi/English Language Toggle

## Current State
The app is a full-featured kids app with 5 tabs: Home, Shorts, Games, Courses, Chat. It has partial Hindi labels in the sidebar but no real language switching system. No localStorage language persistence exists.

## Requested Changes (Diff)

### Add
- `LanguageContext` (React context + hook) that holds `lang: 'en' | 'hi'` and a `toggleLang()` function, persisted to `localStorage` under key `kids-lang`
- A language toggle button in the top header (shows "हिंदी" when English is active, shows "English" when Hindi is active) — colorful pill button
- Full translations object covering all UI text for both `en` and `hi` for: navigation labels, page headings, buttons, section titles, placeholder text across all pages and components
- `AboutPage` — simple page with app description, team, mission in both languages
- `ContactPage` — simple contact form (name, email, message) with labels in both languages, plus social/contact info
- Navigation tabs updated to: Home, Videos (currently Shorts), Games, About, Contact

### Modify
- `App.tsx`: wrap in `LanguageProvider`, add language toggle button to header, update tab list to include About and Contact, replace Shorts with Videos label
- All page components (`HomePage`, `ShortsPage`/`VideosPage`, `GamesPage`, `CoursesPage` or replaced): consume `useLanguage()` and render translated strings
- `BottomNav.tsx` and sidebar tabs: use translated labels from context
- `LoginPage.tsx`: apply translations

### Remove
- Hard-coded Hindi strings scattered in components (replace with translation lookup)

## Implementation Plan
1. Create `src/frontend/src/contexts/LanguageContext.tsx` with context, provider, hook, and full `translations` object (en + hi) covering all UI text
2. Wrap `App` in `<LanguageProvider>`; add language toggle button in header
3. Update tab list in App.tsx: Home, Videos, Games, About, Contact (5 tabs)
4. Create `AboutPage.tsx` and `ContactPage.tsx` with translated content
5. Update all existing pages and components to use `useLanguage()` translations
6. Update `BottomNav.tsx` to use translated labels
