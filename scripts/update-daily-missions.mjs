import { readFile, writeFile } from "node:fs/promises";

const TERMS = [
  "flowers",
  "garden",
  "landscape",
  "river",
  "trees",
  "vase",
  "birds",
  "moon",
  "water",
  "sun"
];

const MAX_OBJECTS_PER_TERM = 25;
const MAX_FAILED_OBJECTS_PER_TERM = 12;

const BLOCKED_TITLE_WORDS = [
  "death",
  "battle",
  "war",
  "execution",
  "martyr",
  "crucifixion",
  "rape",
  "abduction",
  "skull",
  "corpse"
];

const PALETTES = [
  [
    ["Sun Gold", "阳光金", "Or soleil", "#e4b34f"],
    ["River Blue", "河水蓝", "Bleu rivière", "#5c93b8"],
    ["Leaf Green", "叶片绿", "Vert feuille", "#40624f"],
    ["Soft Cloud", "柔云白", "Nuage doux", "#f1dfbf"]
  ],
  [
    ["Flower Pink", "花朵粉", "Rose fleur", "#dd8a80"],
    ["Deep Blue", "深蓝色", "Bleu profond", "#25537b"],
    ["Warm Brown", "暖棕色", "Brun chaud", "#8b5d35"],
    ["Quiet Gray", "安静灰", "Gris calme", "#9aa3a0"]
  ],
  [
    ["Moss Green", "苔藓绿", "Vert mousse", "#40624f"],
    ["Morning Blue", "清晨蓝", "Bleu matin", "#5c93b8"],
    ["Petal Pink", "花瓣粉", "Rose pétale", "#dd8a80"],
    ["Light Cream", "浅奶油", "Crème claire", "#f1dfbf"]
  ]
];

const today = process.env.DAILY_MISSION_DATE || new Date().toISOString().slice(0, 10);
const libraryDays = Number(process.env.MUSEUM_LIBRARY_DAYS || 10);
const candidatesByTerm = new Map();
const library = await buildMuseumLibrary(libraryDays);
const dailyMission = missionForDate(library, today) || await previousDailyMission();

await writeFile("daily-missions.json", `${JSON.stringify(dailyMission, null, 2)}\n`);
await writeFile("museum-library.json", `${JSON.stringify(library, null, 2)}\n`);

async function buildMuseumLibrary(days) {
  const entries = [];
  const usedTitles = new Set();

  for (let offset = 0; offset < days; offset += 1) {
    const date = dateOffset(today, offset);
    const result = await findDailyCandidate(date, usedTitles);
    if (!result) continue;

    const { term, object } = result;
    usedTitles.add(object.title.toLowerCase());
    const palette = PALETTES[dayIndex(PALETTES.length, date)];

    entries.push({
      date,
      query: term,
      mission: buildColorMission(object, palette)
    });
  }

  if (!entries.length) {
    return previousMuseumLibrary();
  }

  return {
    updatedAt: new Date().toISOString(),
    source: "The Metropolitan Museum of Art Collection API",
    reviewStatus: "auto-generated candidate",
    days: entries
  };
}

function selectCandidate(candidates, date, usedTitles, allowDuplicate = false) {
  const startIndex = dayIndex(candidates.length, date);

  for (let offset = 0; offset < candidates.length; offset += 1) {
    const candidate = candidates[(startIndex + offset) % candidates.length];
    if (allowDuplicate || !usedTitles.has(candidate.title.toLowerCase())) return candidate;
  }

  return null;
}

function missionForDate(library, date) {
  const entry = library.days.find((day) => day.date === date) || library.days[0];
  if (!entry) return null;

  return {
    updatedAt: library.updatedAt,
    source: library.source,
    query: entry.query,
    reviewStatus: library.reviewStatus,
    missions: {
      color: entry.mission
    }
  };
}

async function findDailyCandidate(date = today, usedTitles = new Set()) {
  const startIndex = dayIndex(TERMS.length, date);
  const termsToTry = [
    ...TERMS.slice(startIndex),
    ...TERMS.slice(0, startIndex)
  ];
  let duplicateFallback = null;

  for (const searchTerm of termsToTry) {
    const candidates = await candidatesForTerm(searchTerm);
    if (!candidates.length) continue;

    const uniqueObject = selectCandidate(candidates, date, usedTitles);
    if (uniqueObject) return { term: searchTerm, object: uniqueObject };

    duplicateFallback ||= {
      term: searchTerm,
      object: selectCandidate(candidates, date, usedTitles, true)
    };
  }

  if (duplicateFallback) return duplicateFallback;

  console.warn(`No usable Met objects found for ${date} from any term: ${TERMS.join(", ")}`);
  return null;
}

async function candidatesForTerm(searchTerm) {
  if (candidatesByTerm.has(searchTerm)) return candidatesByTerm.get(searchTerm);

  const searchUrl = new URL("https://collectionapi.metmuseum.org/public/collection/v1/search");
  searchUrl.searchParams.set("hasImages", "true");
  searchUrl.searchParams.set("isPublicDomain", "true");
  searchUrl.searchParams.set("q", searchTerm);

  let search;
  try {
    search = await fetchJson(searchUrl);
  } catch (error) {
    console.warn(`Skipping Met search term "${searchTerm}": ${error.message}`);
    candidatesByTerm.set(searchTerm, []);
    return [];
  }

  const objectIDs = Array.isArray(search.objectIDs) ? search.objectIDs.slice(0, MAX_OBJECTS_PER_TERM) : [];
  const candidates = [];
  let failedObjects = 0;

  for (const objectID of objectIDs) {
    try {
      const object = await fetchJson(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
      if (isUsableObject(object)) candidates.push(object);
    } catch (error) {
      failedObjects += 1;
      console.warn(`Skipping Met object ${objectID}: ${error.message}`);
      if (failedObjects >= MAX_FAILED_OBJECTS_PER_TERM) {
        console.warn(`Skipping Met search term "${searchTerm}" after ${failedObjects} object fetch failures`);
        break;
      }
    }
    if (candidates.length >= 8) break;
  }

  candidatesByTerm.set(searchTerm, candidates);
  return candidates;
}

async function previousDailyMission() {
  try {
    const previous = JSON.parse(await readFile("daily-missions.json", "utf8"));
    return {
      ...previous,
      updatedAt: new Date().toISOString(),
      reviewStatus: "fallback previous daily mission"
    };
  } catch {
    throw new Error("No usable Met objects found and no previous daily-missions.json fallback is available");
  }
}

async function previousMuseumLibrary() {
  try {
    const previous = JSON.parse(await readFile("museum-library.json", "utf8"));
    return {
      ...previous,
      updatedAt: new Date().toISOString(),
      reviewStatus: "fallback previous museum library"
    };
  } catch {
    const previousDaily = await previousDailyMission();
    return {
      updatedAt: previousDaily.updatedAt,
      source: previousDaily.source,
      reviewStatus: "fallback previous daily mission",
      days: [
        {
          date: today,
          query: previousDaily.query,
          mission: previousDaily.missions.color
        }
      ]
    };
  }
}

function buildColorMission(object, palette) {
  const artist = object.artistDisplayName || "Unknown artist";
  const date = object.objectDate || "date unknown";

  return {
    world: {
      en: "Color Harbor",
      zh: "色彩港湾",
      fr: "Port des couleurs"
    },
    prompt: {
      en: "Find three colors that make this artwork feel alive.",
      zh: "找出让这件作品有生命力的三个颜色。",
      fr: "Trouve trois couleurs qui rendent cette oeuvre vivante."
    },
    guide: {
      en: `Look at ${object.title}. Which colors arrive first, and which colors stay quietly behind?`,
      zh: `看看《${object.title}》。哪些颜色最先跳出来？哪些颜色安静地留在后面？`,
      fr: `Observe ${object.title}. Quelles couleurs arrivent en premier, et lesquelles restent discrètes ?`
    },
    home: {
      en: "A new museum artwork is waiting today. Can you collect its strongest colors?",
      zh: "今天有一件新的博物馆作品在等你。你能收集它最有力量的颜色吗？",
      fr: "Une nouvelle oeuvre de musée t'attend aujourd'hui. Peux-tu collectionner ses couleurs les plus fortes ?"
    },
    studio: {
      en: "Build your daily museum collage.",
      zh: "拼出你的今日博物馆作品。",
      fr: "Compose ton collage du musée du jour."
    },
    creature: {
      en: "Daily Color Finder is awake.",
      zh: "今日色彩发现者醒来了。",
      fr: "Le chercheur de couleurs du jour est réveillé."
    },
    artwork: {
      title: object.title,
      titleZh: object.title,
      titleFr: object.title,
      credit: {
        en: `${artist}, ${date}. The Metropolitan Museum of Art, public domain.`,
        zh: `${artist}，${date}。大都会艺术博物馆，公有领域。`,
        fr: `${artist}, ${date}. The Metropolitan Museum of Art, domaine public.`
      },
      url: object.primaryImageSmall || object.primaryImage
    },
    choices: palette.map(([en, zh, fr, color]) => [{ en, zh, fr }, color])
  };
}

function isUsableObject(object) {
  if (!object?.isPublicDomain) return false;
  if (!object.primaryImageSmall && !object.primaryImage) return false;
  if (!object.artistDisplayName) return false;
  if (/\bB\.?C\.?\b/i.test(object.objectDate || "")) return false;
  if (!/painting|watercolor|print|drawing|pastel/i.test(`${object.objectName} ${object.classification}`)) {
    return false;
  }
  if (!object.title || BLOCKED_TITLE_WORDS.some((word) => object.title.toLowerCase().includes(word))) {
    return false;
  }
  if (/model|fragment|study of anatomy/i.test(object.title)) return false;
  return true;
}

function dayIndex(length, date = today) {
  const dayNumber = Number(date.replaceAll("-", ""));
  return dayNumber % length;
}

function dateOffset(date, offset) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText} ${url}`);
  }
  return response.json();
}
