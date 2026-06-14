# Real App GitHub Pages PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Museum of Seeing into a real installable GitHub Pages PWA with a product-grade home screen, trustworthy parent information, stable daily museum content, and deploy verification.

**Architecture:** Keep the app as a static GitHub Pages product with no backend. Add PWA shell files and metadata, strengthen the existing vanilla JS state/rendering flow, and preserve the current `museum-library.json` -> `daily-missions.json` -> built-in fallback chain.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Web App Manifest, Service Worker, localStorage, GitHub Actions, Node.js, GitHub Pages.

---

## File Structure

- Modify `.gitignore`: ignore `.superpowers/` and `.DS_Store`.
- Modify `index.html`: replace prototype metadata with production metadata, add PWA links, SEO/social tags, and product-home markup hooks.
- Modify `styles.css`: restyle the outer product shell, real home dashboard, install/offline hints, and parent trust content.
- Modify `main.js`: register service worker, persist locale safely, render product home status, improve parent copy, and keep daily library loading stable.
- Create `manifest.webmanifest`: install metadata for GitHub Pages PWA.
- Create `service-worker.js`: cache app shell and network-first daily content.
- Create `assets/icons/icon.svg`: reusable SVG app icon.
- Modify `README.md`: document public launch URL, local run, daily update, and PWA behavior.

## Task 1: Add PWA Metadata and Shell Assets

**Files:**
- Modify: `.gitignore`
- Modify: `index.html`
- Create: `manifest.webmanifest`
- Create: `service-worker.js`
- Create: `assets/icons/icon.svg`

- [ ] **Step 1: Update ignore rules**

Edit `.gitignore` to contain:

```gitignore
.superpowers/
.DS_Store
**/.DS_Store
```

- [ ] **Step 2: Add production head metadata**

In `index.html`, replace the current `<title>` and simple stylesheet-only head with:

```html
<title>Museum of Seeing | Daily museum ritual for kids</title>
<meta
  name="description"
  content="A 5-minute daily museum ritual for children ages 7-9: look closely, collect colors, make a tiny artwork, and build a seeing diary."
>
<meta name="theme-color" content="#092634">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Museum of Seeing">
<meta property="og:title" content="Museum of Seeing">
<meta property="og:description" content="A daily museum ritual for curious kids.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://fantacyai2040.github.io/kidsmuseum/">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="https://fantacyai2040.github.io/kidsmuseum/">
<link rel="manifest" href="./manifest.webmanifest">
<link rel="icon" href="./assets/icons/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="./assets/icons/icon.svg">
<link rel="stylesheet" href="./styles.css">
```

- [ ] **Step 3: Create `manifest.webmanifest`**

Create `manifest.webmanifest`:

```json
{
  "name": "Museum of Seeing",
  "short_name": "Seeing",
  "description": "A 5-minute daily museum ritual for children ages 7-9.",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#092634",
  "theme_color": "#092634",
  "icons": [
    {
      "src": "./assets/icons/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 4: Create `assets/icons/icon.svg`**

Create `assets/icons/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title desc">
  <title id="title">Museum of Seeing</title>
  <desc id="desc">A warm museum face above a blue river shape.</desc>
  <rect width="512" height="512" rx="112" fill="#092634"/>
  <circle cx="256" cy="206" r="122" fill="#e4b34f"/>
  <path d="M106 346c63-58 128-64 194-18 48 34 88 37 146 4v96H106z" fill="#5c93b8"/>
  <circle cx="196" cy="195" r="24" fill="#092634"/>
  <circle cx="316" cy="195" r="24" fill="#092634"/>
  <path d="M196 274c40 35 100 35 140 0" fill="none" stroke="#092634" stroke-width="24" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 5: Create `service-worker.js`**

Create `service-worker.js`:

```js
const CACHE_NAME = "museum-seeing-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./main.js",
  "./manifest.webmanifest",
  "./assets/icons/icon.svg"
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
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isDailyData =
    url.pathname.endsWith("/museum-library.json") || url.pathname.endsWith("/daily-missions.json");

  if (isDailyData) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (url.origin === self.location.origin) {
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

- [ ] **Step 6: Verify shell files**

Run:

```bash
python3 -m http.server 4177
```

In another command:

```bash
curl -fsSL http://127.0.0.1:4177/manifest.webmanifest | node -e "JSON.parse(require('fs').readFileSync(0, 'utf8')); console.log('manifest ok')"
curl -fsSL http://127.0.0.1:4177/service-worker.js | rg "museum-library|CACHE_NAME|networkFirst"
```

Expected: `manifest ok` and service worker matches print.

## Task 2: Register PWA and Persist Local Preferences

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Add storage constants**

Near the top of `main.js`, after DOM constants:

```js
const CHECKINS_STORAGE_KEY = "museumSeeingCheckins";
const LOCALE_STORAGE_KEY = "museumSeeingLocale";
```

- [ ] **Step 2: Initialize locale from local storage**

Replace the state locale default:

```js
locale: "en",
```

with:

```js
locale: loadLocale(),
```

- [ ] **Step 3: Add safe locale helpers**

Add near existing storage helpers:

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
    // Language switching still works for this session if storage is blocked.
  }
}
```

- [ ] **Step 4: Replace hard-coded check-in storage key**

Replace every `"museumSeeingCheckins"` string in `main.js` with `CHECKINS_STORAGE_KEY`.

- [ ] **Step 5: Persist language changes**

In the language toggle listener, call:

```js
saveLocale();
```

immediately after `state.locale` changes.

- [ ] **Step 6: Register service worker**

After `initialize();`, add:

```js
if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {
    // The app still works online if service worker registration fails.
  });
}
```

- [ ] **Step 7: Verify no syntax errors**

Run:

```bash
node --check main.js
```

Expected: no output and exit code 0.

## Task 3: Convert Prototype Shell Into Product Home

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `main.js`

- [ ] **Step 1: Replace prototype copy keys**

In `main.js`, update English copy values:

```js
prototype: "Daily ritual",
overviewLede:
  "A 5-minute museum ritual for curious kids. Look closely, collect colors, make a tiny artwork, and build a seeing diary.",
flowLabel: "Today",
flowOne: "Look at one real museum artwork",
flowTwo: "Collect three colors you notice",
flowThree: "Make a small atelier collage",
flowFour: "Save the day to your seeing diary",
lookForLabel: "Why it matters",
lookForOne: "Looking slowly builds visual attention.",
lookForTwo: "Naming colors helps children form aesthetic language.",
lookForThree: "Making from observation turns seeing into memory.",
```

Apply equivalent simplified Chinese and French copy in their existing locale blocks.

- [ ] **Step 2: Add product status elements to home**

In the map screen `home-panels`, add a third panel:

```html
<article class="mini-panel daily-proof-panel">
  <p class="panel-title" data-i18n="dailyProof">Your ritual</p>
  <p id="daily-proof-copy">Open one artwork, make one small thing, keep one memory.</p>
</article>
```

- [ ] **Step 3: Add copy keys for daily proof**

Add locale strings:

```js
dailyProof: "Your ritual",
dailyProofCopy: "Open one artwork, make one small thing, keep one memory.",
```

Chinese:

```js
dailyProof: "你的每日仪式",
dailyProofCopy: "看一件作品，做一个小创作，留下一个记忆。",
```

French:

```js
dailyProof: "Ton rituel",
dailyProofCopy: "Ouvre une oeuvre, crée une petite chose, garde un souvenir.",
```

- [ ] **Step 4: Render daily proof copy**

Add a DOM constant:

```js
const dailyProofCopy = document.querySelector("#daily-proof-copy");
```

In `renderMission()`, set:

```js
dailyProofCopy.textContent = t.dailyProofCopy;
```

- [ ] **Step 5: Restyle outer shell as product**

In `styles.css`, update `.overview-panel` and prototype labels so the outer panel reads as product information, not test instructions. Use the existing dark museum palette and avoid changing screen structure. Add:

```css
.daily-proof-panel {
  border-color: rgba(228, 179, 79, 0.45);
}

.overview-panel .eyebrow {
  color: var(--accent);
}
```

- [ ] **Step 6: Verify home copy**

Run a local server and inspect the first viewport:

```bash
python3 -m http.server 4177
```

Expected: no visible "Prototype" title in the product shell; the page describes a daily ritual.

## Task 4: Make Parents Page Trustworthy

**Files:**
- Modify: `index.html`
- Modify: `main.js`
- Modify: `styles.css`

- [ ] **Step 1: Inspect current parents screen**

Run:

```bash
rg -n "screen-parents|parents" index.html main.js styles.css
```

Expected: locate the existing parents screen and copy keys before editing.

- [ ] **Step 2: Expand parent content markup**

In `index.html`, inside `.screen-parents`, ensure there are four parent cards using existing text hooks:

```html
<article class="parent-note">
  <h3 data-i18n="parentsLearningTitle">What children practice</h3>
  <p data-i18n="parentsLearningBody">Looking slowly, naming colors, noticing mood, and turning observation into creation.</p>
</article>
<article class="parent-note">
  <h3 data-i18n="parentsSourcesTitle">Museum sources</h3>
  <p data-i18n="parentsSourcesBody">Daily artworks come from public museum collections and include source credits.</p>
</article>
<article class="parent-note">
  <h3 data-i18n="parentsPrivacyTitle">Privacy</h3>
  <p data-i18n="parentsPrivacyBody">No account is required. The seeing diary is stored only in this browser.</p>
</article>
<article class="parent-note">
  <h3 data-i18n="parentsRitualTitle">How to use it</h3>
  <p data-i18n="parentsRitualBody">Sit nearby, ask what your child notices, and avoid correcting their choices. The goal is attention, not right answers.</p>
</article>
```

- [ ] **Step 3: Add parent ritual copy**

Add locale strings:

```js
parentsRitualTitle: "How to use it",
parentsRitualBody:
  "Sit nearby, ask what your child notices, and avoid correcting their choices. The goal is attention, not right answers.",
```

Chinese:

```js
parentsRitualTitle: "怎样一起使用",
parentsRitualBody: "坐在孩子旁边，问他们看到了什么，不急着纠正答案。目标是注意力，不是标准答案。",
```

French:

```js
parentsRitualTitle: "Comment l'utiliser",
parentsRitualBody:
  "Restez près de l'enfant, demandez ce qu'il remarque, et évitez de corriger ses choix. Le but est l'attention, pas la bonne réponse.",
```

- [ ] **Step 4: Style parent cards**

In `styles.css`, ensure parent notes are readable on mobile:

```css
.parent-note {
  border: 1px solid rgba(241, 223, 191, 0.16);
  border-radius: 22px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.05);
}

.parent-note h3 {
  margin: 0 0 8px;
}

.parent-note p {
  margin: 0;
  color: var(--muted);
}
```

- [ ] **Step 5: Verify translation keys**

Run:

```bash
node --check main.js
rg -n "parentsRitualTitle|parentsRitualBody" main.js index.html
```

Expected: syntax passes and keys exist in all three locale blocks.

## Task 5: Update README and Validate Daily Data

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace README with product launch notes**

Write `README.md`:

```markdown
# Museum of Seeing

A 5-minute daily museum ritual for children ages 7-9.

Children look closely at one public-domain museum artwork, collect colors they notice, create a small atelier collage, and save the day to a local seeing diary.

## Live App

https://fantacyai2040.github.io/kidsmuseum/

## Local Run

```bash
python3 -m http.server 4177
```

Open http://127.0.0.1:4177/.

## Daily Content

Daily content is generated by:

```bash
node scripts/update-daily-missions.mjs
```

The script writes:

- `daily-missions.json`: today's mission.
- `museum-library.json`: a rolling 10-day museum material library.

GitHub Actions runs the update daily and commits both files.

## PWA

The app includes:

- `manifest.webmanifest` for install metadata.
- `service-worker.js` for app shell caching.
- `assets/icons/icon.svg` for browser and install icons.

The app has no account system. Seeing diary data is stored locally in the browser.
```

- [ ] **Step 2: Validate current library**

Run:

```bash
node - <<'NODE'
const fs = require('fs');
const library = JSON.parse(fs.readFileSync('museum-library.json', 'utf8'));
const daily = JSON.parse(fs.readFileSync('daily-missions.json', 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const todayEntry = library.days.find((entry) => entry.date === today) || library.days[0];
const titles = library.days.map((entry) => entry.mission.artwork.title);
const result = {
  days: library.days.length,
  firstDate: library.days[0]?.date,
  uniqueTitles: new Set(titles).size,
  dailyMatchesLibrary: daily.missions.color.artwork.title === todayEntry?.mission.artwork.title,
  allHaveImageUrls: library.days.every((entry) => Boolean(entry.mission.artwork.url)),
  allHaveChoices: library.days.every((entry) => Array.isArray(entry.mission.choices) && entry.mission.choices.length >= 3)
};
console.log(JSON.stringify(result, null, 2));
if (result.days !== 10 || !result.dailyMatchesLibrary || !result.allHaveImageUrls || !result.allHaveChoices) process.exit(1);
NODE
```

Expected: command exits 0.

## Task 6: End-to-End Local and GitHub Pages Verification

**Files:**
- No source edits unless verification finds a bug.

- [ ] **Step 1: Run syntax checks**

Run:

```bash
node --check main.js
node --check scripts/update-daily-missions.mjs
```

Expected: both pass.

- [ ] **Step 2: Start local server**

Run:

```bash
python3 -m http.server 4177
```

- [ ] **Step 3: Check production files over HTTP**

Run:

```bash
curl -fsSL http://127.0.0.1:4177/ | rg "manifest.webmanifest|Museum of Seeing"
curl -fsSL http://127.0.0.1:4177/manifest.webmanifest | node -e "JSON.parse(require('fs').readFileSync(0, 'utf8')); console.log('manifest ok')"
curl -fsSL http://127.0.0.1:4177/service-worker.js | rg "museum-library|daily-missions"
curl -fsSL http://127.0.0.1:4177/museum-library.json | node -e "const data=JSON.parse(require('fs').readFileSync(0, 'utf8')); console.log(data.days.length)"
```

Expected: metadata present, manifest ok, service worker handles both daily files, and library prints `10`.

- [ ] **Step 4: Capture mobile screenshot**

Run:

```bash
npx -y playwright screenshot --viewport-size=390,844 http://127.0.0.1:4177/ /tmp/kidsmuseum-pwa-home.png
```

Expected: screenshot command succeeds.

- [ ] **Step 5: Inspect screenshot**

Open `/tmp/kidsmuseum-pwa-home.png` with `view_image`.

Expected: first viewport reads like a real daily app, not a prototype instruction sheet.

- [ ] **Step 6: Commit implementation**

Run:

```bash
git add .gitignore README.md index.html styles.css main.js manifest.webmanifest service-worker.js assets/icons/icon.svg
git commit -m "Launch Museum of Seeing as PWA"
```

- [ ] **Step 7: Rebase if remote moved and push**

Run:

```bash
git fetch origin main
git rebase origin/main
git push origin main
```

If `daily-missions.json` or `museum-library.json` conflicts because the scheduled workflow ran, regenerate the data with:

```bash
node scripts/update-daily-missions.mjs
git add daily-missions.json museum-library.json
GIT_EDITOR=true git rebase --continue
git push origin main
```

- [ ] **Step 8: Verify GitHub Pages**

Run:

```bash
gh run list --repo fantacyai2040/kidsmuseum --limit 3
curl -fsSL https://fantacyai2040.github.io/kidsmuseum/ | rg "manifest.webmanifest|Museum of Seeing"
curl -fsSL https://fantacyai2040.github.io/kidsmuseum/manifest.webmanifest | node -e "JSON.parse(require('fs').readFileSync(0, 'utf8')); console.log('manifest ok')"
curl -fsSL https://fantacyai2040.github.io/kidsmuseum/museum-library.json | node -e "const data=JSON.parse(require('fs').readFileSync(0, 'utf8')); console.log(data.days.length)"
```

Expected: Pages build succeeds, manifest is valid, and online library prints `10`.

