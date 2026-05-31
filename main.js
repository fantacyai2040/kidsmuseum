const screens = [...document.querySelectorAll(".screen")];
const navTabs = [...document.querySelectorAll(".nav-tab")];
const screenButtons = [...document.querySelectorAll("[data-target-screen]")];
const choiceButtons = [...document.querySelectorAll(".choice-chip")];
const pieceButtons = [...document.querySelectorAll(".piece")];
const paletteRow = document.querySelector("#selected-palette");
const canvasScene = document.querySelector("#canvas-scene");
const enterStudioButton = document.querySelector("#enter-studio");
const finishCreationButton = document.querySelector("#finish-creation");
const missionFeedback = document.querySelector("#mission-feedback");
const studioFeedback = document.querySelector("#studio-feedback");
const collectionFeedback = document.querySelector("#collection-feedback");
const statusWorld = document.querySelector("#status-world");
const statusMission = document.querySelector("#status-mission");
const statusCreation = document.querySelector("#status-creation");
const cardShelf = document.querySelector("#card-shelf");
const creationShelf = document.querySelector("#creation-shelf");
const guideCopy = document.querySelector("#guide-copy");
const missionWorld = document.querySelector("#mission-world");
const missionTitle = document.querySelector("#mission-title");
const missionArtwork = document.querySelector("#mission-artwork");
const artworkTitle = document.querySelector("#artwork-title");
const artworkCredit = document.querySelector("#artwork-credit");
const missionGuide = document.querySelector("#mission-guide");
const studioTitle = document.querySelector("#studio-title");
const creatureCopy = document.querySelector("#creature-copy");
const newCreatureCopy = document.querySelector("#new-creature-copy");
const languageToggle = document.querySelector("#language-toggle");
const staticTextNodes = [...document.querySelectorAll("[data-i18n]")];
const worldLabelNodes = [...document.querySelectorAll("[data-world-label]")];
const collectionTitle = document.querySelector(".collection-header h2");
const overviewTitle = document.querySelector("#overview-title");

const missions = {
  color: {
    world: { en: "Color Harbor", zh: "色彩港湾" },
    prompt: {
      en: "Catch the colors that make the wind feel bright.",
      zh: "找出让风看起来明亮的颜色。"
    },
    guide: {
      en: "Van Gogh made the sky, wheat, and trees move with color. Choose the colors that feel most alive.",
      zh: "梵高用颜色让天空、麦田和树动起来。选出你觉得最有生命力的颜色。"
    },
    home: {
      en: "The windy field is glowing. Can you catch the colors that make it feel alive?",
      zh: "有风的麦田正在发光。你能找出让它充满生命力的颜色吗？"
    },
    studio: { en: "Build your windy-field collage.", zh: "拼出你的风中麦田。" },
    creature: { en: "Lantern Sprout is awake.", zh: "灯芽醒来了。" },
    artwork: {
      title: "Wheat Field with Cypresses",
      titleZh: "有柏树的麦田",
      credit: {
        en: "Vincent van Gogh, 1889. The Metropolitan Museum of Art, public domain.",
        zh: "文森特·梵高，1889。大都会艺术博物馆，公有领域。"
      },
      url: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg"
    },
    choices: [
      [{ en: "Wheat Gold", zh: "麦穗金" }, "#e4b34f"],
      [{ en: "Sky Blue", zh: "天空蓝" }, "#5c93b8"],
      [{ en: "Cypress Green", zh: "柏树绿" }, "#40624f"],
      [{ en: "Cloud White", zh: "云朵白" }, "#f1dfbf"]
    ]
  },
  shape: {
    world: { en: "Shape Forest", zh: "形状森林" },
    prompt: {
      en: "Find the shapes that balance the flower room.",
      zh: "找出让花房变平衡的形状。"
    },
    guide: {
      en: "Degas placed the woman, vase, table, and flowers like large shapes in a quiet puzzle.",
      zh: "德加把人物、花瓶、桌子和花朵摆成一个安静的形状谜题。"
    },
    home: {
      en: "The flower room is calm, but the shapes are doing a lot of work. Can you spot them?",
      zh: "这个花房很安静，但形状一直在工作。你能发现它们吗？"
    },
    studio: { en: "Build your balanced-room collage.", zh: "拼出你的平衡房间。" },
    creature: { en: "Pattern Scout is awake.", zh: "图案侦察员醒来了。" },
    artwork: {
      title: "A Woman Seated beside a Vase of Flowers",
      titleZh: "坐在花瓶旁的女子",
      credit: {
        en: "Edgar Degas, 1865. The Metropolitan Museum of Art, public domain.",
        zh: "埃德加·德加，1865。大都会艺术博物馆，公有领域。"
      },
      url: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-25460-001.jpg"
    },
    choices: [
      [{ en: "Flower Circles", zh: "花朵圆形" }, "#dd8a80"],
      [{ en: "Table Rectangle", zh: "桌子长方形" }, "#8b5d35"],
      [{ en: "Quiet Wall", zh: "安静的墙" }, "#9aa3a0"],
      [{ en: "Dark Dress", zh: "深色裙子" }, "#25537b"]
    ]
  },
  mood: {
    world: { en: "Mood Palace", zh: "情绪宫殿" },
    prompt: {
      en: "Choose the colors that make the room feel like night.",
      zh: "选择让画面像夜晚一样安静的颜色。"
    },
    guide: {
      en: "La Farge made a small, dark picture feel hushed. Look for the soft colors that lower the volume.",
      zh: "拉法奇让一张小小的暗色画面变得很安静。找出那些把声音放轻的柔和颜色。"
    },
    home: {
      en: "The night room is quiet. Can you find the colors that make it feel deep and still?",
      zh: "夜晚房间很安静。你能找到让它变得深、静的颜色吗？"
    },
    studio: { en: "Build your quiet-night collage.", zh: "拼出你的安静夜晚。" },
    creature: { en: "Moon Listener is awake.", zh: "月光倾听者醒来了。" },
    artwork: {
      title: "Nocturne",
      titleZh: "夜曲",
      credit: {
        en: "John La Farge, ca. 1885. The Metropolitan Museum of Art, public domain.",
        zh: "约翰·拉法奇，约1885。大都会艺术博物馆，公有领域。"
      },
      url: "https://images.metmuseum.org/CRDImages/ad/web-large/DT256385.jpg"
    },
    choices: [
      [{ en: "Night Blue", zh: "夜晚蓝" }, "#25537b"],
      [{ en: "Deep Green", zh: "深绿色" }, "#40624f"],
      [{ en: "Soft Gray", zh: "柔灰色" }, "#9aa3a0"],
      [{ en: "Petal Pink", zh: "花瓣粉" }, "#dd8a80"]
    ]
  }
};

const copy = {
  en: {
    appName: "Museum of Seeing",
    prototype: "Prototype",
    overviewLede:
      "A children's aesthetic adventure app prototype for ages 7-9. This mockup tests one complete loop: explore a world, notice a work, make something, and collect the result.",
    flowLabel: "Flow",
    flowOne: "Choose a world from the map",
    flowTwo: "Play the Daily Spark mission",
    flowThree: "Create with colors and shapes",
    flowFour: "Unlock a new collection card",
    lookForLabel: "What To Look For",
    lookForOne: "Does it feel playful instead of school-like?",
    lookForTwo: "Does the mission naturally lead into creation?",
    lookForThree: "Does the reward feel like identity, not points?",
    sessionLabel: "Session",
    statusWorldLabel: "World",
    statusMissionLabel: "Mission",
    statusCreationLabel: "Creation",
    explorer: "Explorer",
    mapKicker: "Choose a world to explore",
    dailySpark: "Daily Spark",
    todaysMission: "Today's mission",
    todaysGuide: "Today's Guide",
    newCreature: "New Creature",
    newCreatureCopy: "Complete one mission to wake the Lantern Sprout.",
    enterStudio: "Create with these colors",
    creativeStudio: "Creative Studio",
    yourCanvas: "Your canvas",
    saveToCollection: "Save to collection",
    myCollection: "My Collection",
    collectionTitle: "Your cabinet of seeing",
    exploreAnother: "Explore another world",
    navMap: "Map",
    navStudio: "Studio",
    navCollection: "Collection",
    navParents: "Parents",
    chooseMore: (count) => `Choose ${count} more color${count === 1 ? "" : "s"} to open the studio.`,
    paletteFound: "Beautiful. You found a palette from the artwork.",
    piecesMore: (count) => `Place ${count} more piece${count === 1 ? "" : "s"} to finish your artwork.`,
    creationReady: "Your collage is ready to save.",
    statusNotStarted: "Not started",
    statusPaletteFound: "Palette found",
    statusPieces: (count) => `${count} / 3 pieces placed`,
    creatureWaiting: "A new creature is waiting.",
    lockedCard: "Find more colors",
    emptyCreation: "Your new collage will appear here.",
    collectionComplete: "You unlocked three colors and saved your first collage.",
    collectionMissionDone: "Your colors are unlocked. Finish the collage to save it.",
    collectionLocked: "Finish the mission to unlock your first color set.",
    collageSuffix: "collage",
    languageButton: "简",
    pieceLabels: { sun: "Sun", wave: "Wave", sail: "Sail", cloud: "Cloud" }
  },
  zh: {
    appName: "看见博物馆",
    prototype: "原型",
    overviewLede:
      "给 7-9 岁孩子的美感冒险 app 原型。这个版本测试一条完整体验：探索世界、观察作品、动手创作、收进收藏。",
    flowLabel: "体验路径",
    flowOne: "从地图选择一个世界",
    flowTwo: "进入今日灵感任务",
    flowThree: "用颜色和形状创作",
    flowFour: "解锁新的收藏卡",
    lookForLabel: "重点观察",
    lookForOne: "它像游戏，而不是像上课吗？",
    lookForTwo: "观察任务会自然走向创作吗？",
    lookForThree: "奖励像身份成长，而不是单纯积分吗？",
    sessionLabel: "本次进度",
    statusWorldLabel: "世界",
    statusMissionLabel: "任务",
    statusCreationLabel: "创作",
    explorer: "小小探索者",
    mapKicker: "选择一个美感世界",
    dailySpark: "今日灵感",
    todaysMission: "今天的任务",
    todaysGuide: "今日导览",
    newCreature: "新伙伴",
    newCreatureCopy: "完成一个任务，唤醒灯芽。",
    enterStudio: "用这些颜色创作",
    creativeStudio: "创作工作室",
    yourCanvas: "你的画布",
    saveToCollection: "保存到收藏",
    myCollection: "我的收藏",
    collectionTitle: "我的看见柜",
    exploreAnother: "探索另一个世界",
    navMap: "地图",
    navStudio: "创作",
    navCollection: "收藏",
    navParents: "家长",
    chooseMore: (count) => `再选 ${count} 个颜色，就能进入工作室。`,
    paletteFound: "很好看。你从作品里找到了自己的配色。",
    piecesMore: (count) => `再放 ${count} 个拼贴元素，就能完成作品。`,
    creationReady: "你的拼贴已经可以保存了。",
    statusNotStarted: "还未开始",
    statusPaletteFound: "已找到配色",
    statusPieces: (count) => `${count} / 3 个元素已放入`,
    creatureWaiting: "一个新伙伴正在等待。",
    lockedCard: "发现更多颜色",
    emptyCreation: "你的新拼贴会出现在这里。",
    collectionComplete: "你解锁了三个颜色，并保存了第一张拼贴。",
    collectionMissionDone: "颜色已经解锁。完成拼贴后就能保存。",
    collectionLocked: "完成任务，解锁你的第一组颜色。",
    collageSuffix: "拼贴",
    languageButton: "EN",
    pieceLabels: { sun: "太阳", wave: "波浪", sail: "帆船", cloud: "云朵" }
  }
};

const state = {
  activeScreen: "map",
  missionKey: "color",
  locale: "en",
  selectedColors: [],
  placedPieces: []
};

function render() {
  const mission = missions[state.missionKey];
  const t = copy[state.locale];
  document.documentElement.lang = state.locale === "zh" ? "zh-CN" : "en";

  for (const screen of screens) {
    screen.classList.toggle("active", screen.dataset.screen === state.activeScreen);
  }

  for (const tab of navTabs) {
    const target = tab.dataset.targetScreen;
    const active =
      (target === "map" && state.activeScreen === "mission" ? false : target === state.activeScreen);
    tab.classList.toggle("active", active);
  }

  for (const button of choiceButtons) {
    button.classList.toggle("selected", state.selectedColors.includes(button.dataset.choice));
  }

  paletteRow.innerHTML = "";
  for (const colorName of state.selectedColors) {
    const swatch = document.createElement("div");
    swatch.className = "palette-swatch";
    swatch.style.background = colorForChoice(colorName);
    swatch.title = colorName;
    paletteRow.appendChild(swatch);
  }

  canvasScene.innerHTML = "";
  for (const piece of state.placedPieces) {
    const node = document.createElement("div");
    node.className = `canvas-piece ${piece}`;
    node.textContent = "";
    canvasScene.appendChild(node);
  }

  for (const button of pieceButtons) {
    button.textContent = t.pieceLabels[button.dataset.piece];
    button.classList.toggle("used", state.placedPieces.includes(button.dataset.piece));
    button.disabled = state.placedPieces.includes(button.dataset.piece);
  }

  enterStudioButton.disabled = state.selectedColors.length !== 3;
  finishCreationButton.disabled = state.placedPieces.length < 3;

  const missionDone = state.selectedColors.length === 3;
  const creationDone = state.placedPieces.length >= 3;

  renderStaticCopy(t);
  renderChoices(mission);

  missionFeedback.textContent =
    missionDone ? t.paletteFound : t.chooseMore(3 - state.selectedColors.length);
  studioFeedback.textContent =
    creationDone ? t.creationReady : t.piecesMore(3 - state.placedPieces.length);

  guideCopy.textContent = textFor(mission.home);
  newCreatureCopy.textContent = t.newCreatureCopy;
  missionWorld.textContent = textFor(mission.world);
  missionTitle.textContent = textFor(mission.prompt);
  missionArtwork.src = mission.artwork.url;
  missionArtwork.alt = artworkName(mission.artwork);
  artworkTitle.textContent = artworkName(mission.artwork);
  artworkCredit.textContent = textFor(mission.artwork.credit);
  missionGuide.textContent = textFor(mission.guide);
  studioTitle.textContent = textFor(mission.studio);
  creatureCopy.textContent = missionDone ? textFor(mission.creature) : t.creatureWaiting;
  statusWorld.textContent = textFor(mission.world);
  statusMission.textContent = missionDone ? t.statusPaletteFound : t.statusNotStarted;
  statusCreation.textContent = t.statusPieces(state.placedPieces.length);

  renderCollection(missionDone, creationDone);
}

function renderStaticCopy(t) {
  for (const node of staticTextNodes) {
    node.textContent = t[node.dataset.i18n];
  }

  for (const node of worldLabelNodes) {
    node.textContent = textFor(missions[node.dataset.worldLabel].world);
  }

  collectionTitle.textContent = t.collectionTitle;
  overviewTitle.textContent = t.appName;
  languageToggle.textContent = t.languageButton;
}

function renderChoices(mission) {
  choiceButtons.forEach((button, index) => {
    const choice = mission.choices[index];
    button.textContent = textFor(choice[0]);
    button.dataset.choice = textFor(choice[0]);
    button.style.setProperty("--choice-color", choice[1]);
  });
}

function colorForChoice(colorName) {
  const mission = missions[state.missionKey];
  return mission.choices.find(([name]) => textFor(name) === colorName)?.[1] ?? "#e4b34f";
}

function textFor(value) {
  if (typeof value === "string") return value;
  return value[state.locale] ?? value.en;
}

function artworkName(artwork) {
  return state.locale === "zh" ? artwork.titleZh : artwork.title;
}

function renderCollection(missionDone, creationDone) {
  const mission = missions[state.missionKey];
  const t = copy[state.locale];
  cardShelf.innerHTML = "";

  if (missionDone) {
    for (const colorName of state.selectedColors) {
      const card = document.createElement("article");
      card.className = "collect-card unlocked";
      card.innerHTML = `
        <div class="collect-dot" style="background: ${colorForChoice(colorName)}"></div>
        <p>${colorName}</p>
      `;
      cardShelf.appendChild(card);
    }
  } else {
    cardShelf.innerHTML = `
      <article class="collect-card locked">
        <div class="collect-dot"></div>
        <p>${t.lockedCard}</p>
      </article>
    `;
  }

  creationShelf.innerHTML = "";

  if (creationDone) {
    const creation = document.createElement("article");
    creation.className = "saved-creation";
    creation.innerHTML = `
      <div class="saved-creation-preview"></div>
      <p>${textFor(mission.world)} ${t.collageSuffix}</p>
    `;
    creationShelf.appendChild(creation);
    collectionFeedback.textContent = t.collectionComplete;
  } else {
    creationShelf.innerHTML = `
      <article class="saved-creation empty">
        <p>${t.emptyCreation}</p>
      </article>
    `;
    collectionFeedback.textContent = missionDone ? t.collectionMissionDone : t.collectionLocked;
  }
}

for (const button of screenButtons) {
  button.addEventListener("click", () => {
    const target = button.dataset.targetScreen;
    if (target === "parents") return;
    if (button.dataset.world) {
      state.missionKey = button.dataset.world;
      state.selectedColors = [];
      state.placedPieces = [];
    }
    state.activeScreen = target;
    render();
  });
}

for (const button of choiceButtons) {
  button.addEventListener("click", () => {
    const choice = button.dataset.choice;
    const alreadySelected = state.selectedColors.includes(choice);

    if (alreadySelected) {
      state.selectedColors = state.selectedColors.filter((item) => item !== choice);
    } else if (state.selectedColors.length < 3) {
      state.selectedColors = [...state.selectedColors, choice];
    }

    render();
  });
}

for (const button of pieceButtons) {
  button.addEventListener("click", () => {
    const { piece } = button.dataset;
    if (state.placedPieces.includes(piece)) return;
    state.placedPieces = [...state.placedPieces, piece];
    render();
  });
}

languageToggle.addEventListener("click", () => {
  state.locale = state.locale === "en" ? "zh" : "en";
  state.selectedColors = [];
  state.placedPieces = [];
  render();
});

render();
