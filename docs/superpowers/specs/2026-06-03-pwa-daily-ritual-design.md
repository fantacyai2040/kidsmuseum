# PWA Daily Ritual Product Design

Date: 2026-06-03

## Goal

Turn Museum of Seeing from a static prototype into a real first-version product focused on one proof point: children want to return every day.

The product should feel like a small daily museum ritual for ages 7-9. A child opens the app, looks closely at one museum artwork, chooses three visual observations, makes a simple collage, completes the day, and later sees a history of past museum images.

## Product Position

Museum of Seeing is a 5-minute daily aesthetic learning app for children. It teaches looking, noticing, color sensitivity, and emotional response through open museum collections.

The first version is not a broad education platform. It is a focused mobile PWA that validates daily engagement before adding accounts, payments, dashboards, or native apps.

## First-Version Scope

Included:

- Home screen with today's museum mission, completion state, and streak/history summary.
- Daily mission with one real museum artwork and a simple observation task.
- Studio screen where the child creates a small collage from selected colors and shapes.
- Completion screen that confirms the day is finished and shows the artwork, date, and color discoveries.
- Seeing Diary that shows recent past museum images.
- PWA install support through a web app manifest.
- Basic offline support through a service worker caching the shell and latest daily mission.
- Local browser storage for check-ins, streak, locale, and completion state.
- English, Simplified Chinese, and French copy.
- Parent information page explaining educational intent, privacy, and content sources.

Excluded from version 1:

- Accounts and login.
- Cross-device sync.
- Payments or subscriptions.
- Parent analytics dashboard.
- Child profile data such as name, age, photos, or school.
- AI chat or open-ended generated dialogue.
- Native iOS or Android app packaging.

## User Experience Flow

1. The child opens the app from the phone home screen or browser.
2. The home screen shows today's mission and whether today is already complete.
3. The child starts the daily mission.
4. The mission screen shows one museum artwork, title, credit, and a short prompt.
5. The child chooses three observations, currently represented as colors.
6. The child enters the studio and places three collage pieces.
7. Saving the collage records today's check-in.
8. The app shows a completion screen with today's artwork, date, and selected colors.
9. The child can open the Seeing Diary to browse past museum days.
10. The next day, the daily content changes and the ritual repeats.

## Product Principles

- One clear mission per day. The app should not feel like homework or a content feed.
- Reward identity, not points. The child builds a "seeing diary", not a score.
- Use real artworks and transparent sources.
- Keep child privacy simple: no account, no personal data, no tracking in the first version.
- Make failure graceful. If daily content cannot load, the app must still work with curated built-in fallback missions.
- Keep language warm, short, and age-appropriate.

## Architecture

The first real product remains a static web app deployed on GitHub Pages, upgraded to a PWA.

Core files:

- `index.html`: app structure and screen containers.
- `styles.css`: responsive visual system and mobile UI.
- `main.js`: app state, rendering, interactions, local storage, and daily mission loading.
- `daily-missions.json`: generated daily content used by the app.
- `scripts/update-daily-missions.mjs`: content generation script.
- `.github/workflows/update-daily-missions.yml`: scheduled daily content update.
- `manifest.json`: PWA metadata for installability.
- `service-worker.js`: offline shell and latest-content caching.

The app has no backend in version 1. The browser stores child progress locally using `localStorage`.

## Data Model

Daily mission:

```json
{
  "updatedAt": "ISO timestamp",
  "source": "Museum API name",
  "query": "search term",
  "reviewStatus": "auto-generated candidate",
  "missions": {
    "color": {
      "world": { "en": "...", "zh": "...", "fr": "..." },
      "prompt": { "en": "...", "zh": "...", "fr": "..." },
      "guide": { "en": "...", "zh": "...", "fr": "..." },
      "artwork": {
        "title": "...",
        "titleZh": "...",
        "titleFr": "...",
        "credit": { "en": "...", "zh": "...", "fr": "..." },
        "url": "..."
      },
      "choices": []
    }
  }
}
```

Local check-in:

```json
{
  "date": "YYYY-MM-DD",
  "missionKey": "color",
  "title": "Artwork title",
  "imageUrl": "Artwork image URL",
  "colors": ["Color 1", "Color 2", "Color 3"]
}
```

Local app state:

- `museumSeeingCheckins`: recent check-ins, newest first, capped at 30.
- `museumSeeingLocale`: preferred language.
- Future local keys may store install prompt state or dismissed tips.

## Content Pipeline

The daily content workflow should continue using GitHub Actions.

The generator should:

- Query public-domain museum APIs.
- Require a usable image.
- Require a known artist or maker when available.
- Avoid ancient fragments, anatomy studies, war, death, violence, abduction, or other child-inappropriate subjects.
- Prefer paintings, drawings, watercolors, prints, textiles, design objects, and calm landscapes.
- Write one daily mission to `daily-missions.json`.
- Leave built-in app missions untouched as fallback.

Initial museum sources:

- The Metropolitan Museum of Art public API.
- Paris Musées open collections where stable image URLs are available.

Future museum sources can be added only if licensing and image URLs are stable enough for GitHub Pages.

## PWA Behavior

The app should be installable on mobile browsers.

Manifest requirements:

- App name and short name.
- Icons in at least 192x192 and 512x512 sizes.
- Theme color matching the current visual system.
- Start URL and scope set for GitHub Pages.
- Display mode set to `standalone`.

Service worker requirements:

- Cache the app shell: HTML, CSS, JS, manifest, icons.
- Try network first for `daily-missions.json`, then fall back to cached or built-in missions.
- Cache successful daily mission responses.
- Avoid caching museum images aggressively unless browser behavior makes it safe and simple.

## Error Handling

- If `daily-missions.json` fails to load, use built-in missions.
- If a museum image fails to load, the layout should remain stable and show title/credit.
- If `localStorage` is unavailable or corrupted, start with an empty check-in list.
- If the service worker fails to register, the app should still work online.
- If the daily generator fails in GitHub Actions, the previous `daily-missions.json` remains available.

## Privacy

Version 1 should not collect children's personal information.

No account is required. Check-ins stay on the user's device. The app stores only artwork title, image URL, date, selected colors, and mission key in local browser storage.

The Parents page should explain:

- What the app teaches.
- Where artwork content comes from.
- That no child account or personal data is required in version 1.
- That clearing browser storage removes the Seeing Diary.
- That cross-device sync is intentionally not included yet.

## Testing

Manual and automated checks should cover:

- Mobile viewport flow from Home to Mission to Studio to Complete to Diary.
- Daily mission loading from `daily-missions.json`.
- Fallback behavior when `daily-missions.json` is missing.
- Check-in persistence after refresh.
- Language switching across Home, Mission, Complete, and Diary.
- PWA manifest availability.
- Service worker registration and app shell loading.
- GitHub Pages deployment markers after push.

## Success Criteria

The first real product is successful when:

- A child can install or open the app on a phone.
- The daily mission flow is understandable without adult explanation.
- Completion feels like a clear end-of-day ritual.
- The Seeing Diary shows visible history after several days.
- The app still opens if daily content or network access fails.
- No child personal data is collected.

## Implementation Sequence

1. Add PWA assets: manifest, icons, service worker, registration.
2. Persist locale and improve local check-in state.
3. Refine Home into a product home screen with completion and streak summary.
4. Add Parents page content.
5. Harden daily mission generator and fallback behavior.
6. Add focused browser tests for the daily ritual flow and PWA files.
7. Push and verify GitHub Pages deployment.

