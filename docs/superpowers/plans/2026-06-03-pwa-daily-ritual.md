# PWA Daily Ritual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Museum of Seeing into a real mobile-first PWA daily ritual product that children can install, complete daily, and revisit through a seeing diary.

**Architecture:** Keep the app as a static GitHub Pages product with no backend. Add PWA install/offline support, strengthen local state, refine the home and parents experience, and harden the daily museum content pipeline while preserving built-in fallback missions.

**Tech Stack:** HTML, CSS, vanilla JavaScript modules, Web App Manifest, Service Worker, localStorage, GitHub Actions, Node.js script, Playwright smoke tests.

---

## File Structure

- Modify `index.html`: add PWA metadata links, product home elements, parents screen, and stable test hooks.
- Modify `styles.css`: add product-home, streak, parents, install/offline, and responsive polish.
- Modify `main.js`: register service worker, persist locale, calculate streaks, improve check-in state, render product home and parents screen.
- Create `manifest.json`: PWA install metadata.
- Create `service-worker.js`: app shell and daily mission cache.
- Create icons under `assets/icons/`: simple app icons for installability.
- Modify `scripts/update-daily-missions.mjs`: stricter child-safe filtering and stable mission metadata.
- Create `tests/smoke/pwa-daily-ritual.mjs`: Playwright smoke test for core flow and PWA files.
- Modify `README.md`: document product status, local run, PWA behavior, and content pipeline.

## Task 1: Add PWA Shell Files

**Files:**
- Create: `manifest.json`
- Create: `service-worker.js`
- Create: `assets/icons/icon-192.svg`
- Create: `assets/icons/icon-512.svg`
- Modify: `index.html`
- Modify: `main.js`

- [ ] **Step 1: Add manifest link and theme metadata**

Edit `index.html` inside `<head>`:

```html
<meta name="theme-color" content="#092634">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Museum of Seeing">
<link rel="manifest" href="./manifest.json">
<link rel="apple-touch-icon" href="./assets/icons/icon-192.svg">
```

- [ ] **Step 2: Create `manifest.json`**

```json
{
  "name": "Museum of Seeing",
  "short_name": "Seeing",
  "description": "A 5-minute daily museum ritual for children.",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#092634",
  "theme_color": "#092634",
  "icons": [
    {
      "src": "./assets/icons/icon-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "./assets/icons/icon-512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 3: Create SVG icons**

Use the same SVG structure for both icons, changing only `width`, `height`, and `viewBox` size if needed:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="42" fill="#092634"/>
  <circle cx="96" cy="78" r="46" fill="#e4b34f"/>
  <path d="M40 132c24-22 48-24 72-6 18 13 34 14 52 2v36H40z" fill="#5c93b8"/>
  <circle cx="73" cy="73" r="9" fill="#092634"/>
  <circle cx="116" cy="73" r="9" fill="#092634"/>
  <path d="M73 103c15 13 38 13 53 0" fill="none" stroke="#092634" stroke-width="8" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 4: Create `service-worker.js`**

```js
const CACHE_NAME = "museum-seeing-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./main.js",
  "./manifest.json",
  "./assets/icons/icon-192.svg",
  "./assets/icons/icon-512.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith("/daily-missions.json")) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (event.request.method === "GET" && url.origin === self.location.origin) {
    event.respondWith(cacheFirst(event.request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request);
  }
}
```

- [ ] **Step 5: Register the service worker in `main.js`**

Add after `initialize();`:

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {
    // The app still works online if service worker registration fails.
  });
}
```

- [ ] **Step 6: Verify PWA files locally**

Run:

```bash
python3 -m http.server 4177
```

In another terminal:

```bash
curl -fsSL http://127.0.0.1:4177/manifest.json
curl -fsSL http://127.0.0.1:4177/service-worker.js | rg "CACHE_NAME|daily-missions"
```

Expected: manifest JSON prints, and `rg` finds service worker cache and daily mission handling.

- [ ] **Step 7: Commit**

```bash
git add index.html main.js manifest.json service-worker.js assets/icons/icon-192.svg assets/icons/icon-512.svg
git commit -m "Add PWA install and offline shell"
```

## Task 2: Persist Locale and Improve Local Daily State

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Add storage key constants**

Near the top of `main.js`:

```js
const CHECKINS_STORAGE_KEY = "museumSeeingCheckins";
const LOCALE_STORAGE_KEY = "museumSeeingLocale";
```

- [ ] **Step 2: Initialize locale from storage**

Replace `locale: "en"` in `state` with:

```js
locale: loadLocale(),
```

- [ ] **Step 3: Update check-in storage helpers**

Replace hard-coded check-in storage keys:

```js
localStorage.getItem(CHECKINS_STORAGE_KEY)
localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(state.checkins))
```

- [ ] **Step 4: Add locale helpers**

```js
function loadLocale() {
  try {
    const locale = localStorage.getItem(LOCALE_STORAGE_KEY);
    return ["en", "zh", "fr"].includes(locale) ? locale : "en";
  } catch {
    return "en";
  }
}

function saveLocale() {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, state.locale);
  } catch {
    // Language switching still works for the current session if storage fails.
  }
}
```

- [ ] **Step 5: Persist language toggle**

Inside `languageToggle.addEventListener`, after assigning `state.locale`:

```js
saveLocale();
```

- [ ] **Step 6: Add streak helper**

```js
function checkinStreak() {
  const dates = new Set(state.checkins.map((checkin) => checkin.date));
  let streak = 0;
  const cursor = new Date(`${todayKey()}T12:00:00`);

  while (dates.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
```

- [ ] **Step 7: Verify locale persistence**

Run the local server and use Playwright:

```bash
node --input-type=module <<'NODE'
import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:4177/', { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.click('#language-toggle');
await page.reload({ waitUntil: 'networkidle' });
console.log(await page.evaluate(() => localStorage.getItem('museumSeeingLocale')));
await browser.close();
NODE
```

Expected: `zh`.

- [ ] **Step 8: Commit**

```bash
git add main.js
git commit -m "Persist locale and daily streak state"
```

## Task 3: Refine Home Into Product Home

**Files:**
- Modify: `index.html`
- Modify: `main.js`
- Modify: `styles.css`

- [ ] **Step 1: Add home status markup**

Inside `.screen-map`, above `.map-card`, add:

```html
<section class="daily-status-card">
  <p class="micro-copy" data-i18n="todayRitual">Today's Ritual</p>
  <h2 id="home-ritual-title">One museum image is waiting.</h2>
  <div class="daily-stats">
    <span id="home-complete-pill">Not complete</span>
    <span id="home-streak-pill">0 day streak</span>
  </div>
</section>
```

- [ ] **Step 2: Add localized copy**

Add to each locale in `copy`:

```js
todayRitual: "Today's Ritual",
homeReady: "One museum image is waiting.",
homeDone: "Today's museum day is complete.",
notComplete: "Not complete",
completeToday: "Complete today",
streakLabel: (count) => `${count} day streak`,
```

Chinese:

```js
todayRitual: "今日仪式",
homeReady: "一张博物馆图片正在等你。",
homeDone: "今天的博物馆日已经完成。",
notComplete: "今日未完成",
completeToday: "今日已完成",
streakLabel: (count) => `${count} 天连续`,
```

French:

```js
todayRitual: "Rituel du jour",
homeReady: "Une image de musée t'attend.",
homeDone: "Ta journée au musée est terminée.",
notComplete: "Pas encore terminé",
completeToday: "Terminé aujourd'hui",
streakLabel: (count) => `${count} jour${count === 1 ? "" : "s"} de suite`,
```

- [ ] **Step 3: Query the new nodes**

Add near other DOM queries:

```js
const homeRitualTitle = document.querySelector("#home-ritual-title");
const homeCompletePill = document.querySelector("#home-complete-pill");
const homeStreakPill = document.querySelector("#home-streak-pill");
```

- [ ] **Step 4: Render home product state**

Add to `render()` after `renderStaticCopy(t);`:

```js
homeRitualTitle.textContent = hasTodayCheckin() ? t.homeDone : t.homeReady;
homeCompletePill.textContent = hasTodayCheckin() ? t.completeToday : t.notComplete;
homeCompletePill.classList.toggle("done", hasTodayCheckin());
homeStreakPill.textContent = t.streakLabel(checkinStreak());
```

- [ ] **Step 5: Add CSS**

```css
.daily-status-card {
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 28px;
  border: 1px solid rgba(255, 220, 139, 0.26);
  background: linear-gradient(180deg, rgba(255, 213, 111, 0.16), rgba(241, 223, 191, 0.06));
}

.daily-status-card h2 {
  margin: 0;
  max-width: 10em;
  font-family: var(--display-font);
  color: #fff7df;
  font-size: 2.1rem;
  line-height: 0.96;
}

.daily-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.daily-stats span {
  padding: 8px 11px;
  border-radius: 999px;
  background: rgba(241, 223, 191, 0.12);
  color: #ffe3a2;
  font-size: 0.82rem;
  font-weight: 800;
}

.daily-stats span.done {
  background: rgba(64, 98, 79, 0.62);
  color: #f2ffe6;
}
```

- [ ] **Step 6: Verify home state before and after completion**

Run Playwright through completion and read `#home-complete-pill` after returning to map.

Expected before completion: `Not complete`.
Expected after completion: `Complete today`.

- [ ] **Step 7: Commit**

```bash
git add index.html main.js styles.css
git commit -m "Refine home daily ritual state"
```

## Task 4: Add Parents Screen

**Files:**
- Modify: `index.html`
- Modify: `main.js`
- Modify: `styles.css`

- [ ] **Step 1: Add parents screen markup**

Add before `.bottom-nav`:

```html
<section class="screen screen-parents" data-screen="parents">
  <div class="mission-header">
    <button class="back-link" type="button" data-target-screen="map" aria-label="Back">←</button>
    <div>
      <p class="micro-copy" data-i18n="parentsGuide">Parents Guide</p>
      <h2 data-i18n="parentsTitle">A tiny daily museum habit.</h2>
    </div>
  </div>

  <div class="parents-panel">
    <article>
      <h3 data-i18n="parentsLearningTitle">What children practice</h3>
      <p data-i18n="parentsLearningBody">Looking slowly, naming colors, noticing mood, and turning observation into creation.</p>
    </article>
    <article>
      <h3 data-i18n="parentsPrivacyTitle">Privacy</h3>
      <p data-i18n="parentsPrivacyBody">No account is required. The seeing diary is stored only in this browser.</p>
    </article>
    <article>
      <h3 data-i18n="parentsSourcesTitle">Museum sources</h3>
      <p data-i18n="parentsSourcesBody">Daily artworks come from public museum collections and include source credits.</p>
    </article>
  </div>
</section>
```

- [ ] **Step 2: Stop ignoring parents navigation**

Remove this line from the screen button handler:

```js
if (target === "parents") return;
```

- [ ] **Step 3: Add localized copy**

Add English, Chinese, and French values for `parentsGuide`, `parentsTitle`, `parentsLearningTitle`, `parentsLearningBody`, `parentsPrivacyTitle`, `parentsPrivacyBody`, `parentsSourcesTitle`, `parentsSourcesBody`.

- [ ] **Step 4: Add CSS**

```css
.parents-panel {
  display: grid;
  gap: 12px;
}

.parents-panel article {
  padding: 16px;
  border-radius: 24px;
  border: 1px solid rgba(241, 223, 191, 0.22);
  background: rgba(241, 223, 191, 0.08);
}

.parents-panel h3 {
  margin: 0 0 8px;
  color: #fff7e2;
}

.parents-panel p {
  margin: 0;
  color: rgba(255, 248, 232, 0.82);
  line-height: 1.5;
}
```

- [ ] **Step 5: Verify parents tab**

Run Playwright:

```js
await page.click('[data-target-screen="parents"]');
await page.waitForSelector('.screen-parents.active');
```

Expected: parents screen becomes active.

- [ ] **Step 6: Commit**

```bash
git add index.html main.js styles.css
git commit -m "Add parents guide screen"
```

## Task 5: Harden Daily Mission Generator

**Files:**
- Modify: `scripts/update-daily-missions.mjs`
- Modify: `daily-missions.json`

- [ ] **Step 1: Increase candidate search depth**

Change:

```js
const objectIDs = Array.isArray(search.objectIDs) ? search.objectIDs.slice(0, 40) : [];
```

to:

```js
const objectIDs = Array.isArray(search.objectIDs) ? search.objectIDs.slice(0, 120) : [];
```

- [ ] **Step 2: Add child-safe blocked terms**

Extend `BLOCKED_TITLE_WORDS`:

```js
"weapon",
"gun",
"rifle",
"pistol",
"sword",
"knife",
"blood",
"tomb",
"funeral",
"hell",
"devil",
"demon"
```

- [ ] **Step 3: Add allowed media helper**

```js
function hasChildFriendlyMedium(object) {
  return /painting|watercolor|print|drawing|pastel|textile|ceramic|design/i.test(
    `${object.objectName} ${object.classification} ${object.medium}`
  );
}
```

Use it inside `isUsableObject`:

```js
if (!hasChildFriendlyMedium(object)) return false;
```

- [ ] **Step 4: Add stable title check**

Inside `isUsableObject`:

```js
if (object.title.length > 90) return false;
if (/untitled|unknown/i.test(object.title)) return false;
```

- [ ] **Step 5: Run generator**

```bash
node scripts/update-daily-missions.mjs
```

Expected: exits successfully and writes `daily-missions.json`.

- [ ] **Step 6: Inspect generated JSON**

```bash
sed -n '1,140p' daily-missions.json
```

Expected: artwork has title, credit, image URL, and `reviewStatus: "auto-generated candidate"`.

- [ ] **Step 7: Commit**

```bash
git add scripts/update-daily-missions.mjs daily-missions.json
git commit -m "Harden daily museum content filtering"
```

## Task 6: Add Smoke Test Script

**Files:**
- Create: `tests/smoke/pwa-daily-ritual.mjs`
- Modify: `README.md`

- [ ] **Step 1: Create smoke test**

```js
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4177/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });

const manifestStatus = await page.evaluate(async () => {
  const response = await fetch("./manifest.json");
  return response.ok;
});

await page.click(".spark-button");
for (const selector of [".choice-chip:nth-of-type(1)", ".choice-chip:nth-of-type(2)", ".choice-chip:nth-of-type(3)"]) {
  await page.click(selector);
}
await page.click("#enter-studio");
for (const selector of [".piece:nth-of-type(1)", ".piece:nth-of-type(2)", ".piece:nth-of-type(3)"]) {
  await page.click(selector);
}
await page.click("#finish-creation");
await page.waitForSelector(".screen-complete.active");

const result = await page.evaluate((manifestOk) => ({
  manifestStatus: manifestOk,
  completionTitle: document.querySelector(".screen-complete.active h2")?.textContent,
  completeImageWidth: document.querySelector("#complete-artwork-image")?.naturalWidth,
  checkins: JSON.parse(localStorage.getItem("museumSeeingCheckins") || "[]").length
}), manifestStatus);

await browser.close();

if (!result.manifestStatus || result.completeImageWidth < 1 || result.checkins < 1) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
```

- [ ] **Step 2: Document local test command in README**

Add:

```md
## Local smoke test

Run the static server:

```bash
python3 -m http.server 4177
```

Then run:

```bash
node tests/smoke/pwa-daily-ritual.mjs http://127.0.0.1:4177/
```
```

- [ ] **Step 3: Run smoke test**

```bash
python3 -m http.server 4177
node tests/smoke/pwa-daily-ritual.mjs http://127.0.0.1:4177/
```

Expected: JSON output with `manifestStatus: true`, `completeImageWidth` greater than 0, and `checkins: 1`.

- [ ] **Step 4: Commit**

```bash
git add tests/smoke/pwa-daily-ritual.mjs README.md
git commit -m "Add PWA daily ritual smoke test"
```

## Task 7: Final Verification and Deploy

**Files:**
- No code changes unless verification finds a bug.

- [ ] **Step 1: Check status**

```bash
git status --short
```

Expected: clean.

- [ ] **Step 2: Push**

```bash
git push origin main
```

If rejected because the scheduled daily mission workflow updated `daily-missions.json`, run:

```bash
git fetch origin main
git rebase origin/main
git push origin main
```

- [ ] **Step 3: Wait for GitHub Pages**

```bash
sleep 20
gh api repos/fantacyai2040/kidsmuseum/pages/builds/latest
```

Expected: latest build references the pushed commit and eventually reports `"status":"built"`.

- [ ] **Step 4: Verify online markers**

```bash
curl -fsSL https://fantacyai2040.github.io/kidsmuseum/manifest.json | rg "Museum of Seeing|standalone"
curl -fsSL https://fantacyai2040.github.io/kidsmuseum/service-worker.js | rg "CACHE_NAME|daily-missions"
curl -fsSL https://fantacyai2040.github.io/kidsmuseum/main.js | rg "serviceWorker|museumSeeingLocale|checkinStreak"
```

Expected: all commands find the markers.

- [ ] **Step 5: Run online smoke test**

```bash
node tests/smoke/pwa-daily-ritual.mjs https://fantacyai2040.github.io/kidsmuseum/
```

Expected: JSON output with `manifestStatus: true`, image width greater than 0, and one check-in.
