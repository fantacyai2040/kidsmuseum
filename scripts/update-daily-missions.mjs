import { writeFile } from "node:fs/promises";

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

const today = new Date().toISOString().slice(0, 10);
const term = TERMS[dayIndex(TERMS.length)];

const searchUrl = new URL("https://collectionapi.metmuseum.org/public/collection/v1/search");
searchUrl.searchParams.set("hasImages", "true");
searchUrl.searchParams.set("isPublicDomain", "true");
searchUrl.searchParams.set("q", term);

const search = await fetchJson(searchUrl);
const objectIDs = Array.isArray(search.objectIDs) ? search.objectIDs.slice(0, 40) : [];
const candidates = [];

for (const objectID of objectIDs) {
  const object = await fetchJson(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
  if (isUsableObject(object)) candidates.push(object);
  if (candidates.length >= 8) break;
}

if (!candidates.length) {
  throw new Error(`No usable Met objects found for term "${term}"`);
}

const object = candidates[dayIndex(candidates.length)];
const palette = PALETTES[dayIndex(PALETTES.length)];

const dailyMissions = {
  updatedAt: new Date().toISOString(),
  source: "The Metropolitan Museum of Art Collection API",
  query: term,
  reviewStatus: "auto-generated candidate",
  missions: {
    color: buildColorMission(object, palette)
  }
};

await writeFile("daily-missions.json", `${JSON.stringify(dailyMissions, null, 2)}\n`);

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

function dayIndex(length) {
  const dayNumber = Number(today.replaceAll("-", ""));
  return dayNumber % length;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText} ${url}`);
  }
  return response.json();
}
