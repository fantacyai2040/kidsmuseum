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
const historyShelf = document.querySelector("#history-shelf");
const checkinCount = document.querySelector("#checkin-count");
const completeMessage = document.querySelector("#complete-message");
const completeArtworkImage = document.querySelector("#complete-artwork-image");
const completeArtworkTitle = document.querySelector("#complete-artwork-title");
const completeDate = document.querySelector("#complete-date");
const completePalette = document.querySelector("#complete-palette");
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
const MAX_STUDIO_PIECES = 5;

let missions = {
  color: {
    world: { en: "Color Harbor", zh: "色彩港湾", fr: "Port des couleurs" },
    prompt: {
      en: "Catch the colors that make the wind feel bright.",
      zh: "找出让风看起来明亮的颜色。",
      fr: "Attrape les couleurs qui rendent le vent lumineux."
    },
    guide: {
      en: "Monet made winter light glow over the Seine. Choose the colors that make the cold scene feel warm.",
      zh: "莫奈让冬天的光在塞纳河上发亮。选出让寒冷画面变温暖的颜色。",
      fr: "Monet fait briller la lumière d'hiver sur la Seine. Choisis les couleurs qui réchauffent la scène."
    },
    home: {
      en: "The winter river is glowing. Can you catch the colors that make it feel warm?",
      zh: "冬天的河面正在发光。你能找出让它变温暖的颜色吗？",
      fr: "La rivière d'hiver brille. Peux-tu trouver les couleurs qui la rendent chaude ?"
    },
    studio: { en: "Build your winter-river collage.", zh: "拼出你的冬日河面。", fr: "Compose ta rivière d'hiver." },
    creature: { en: "Lantern Sprout is awake.", zh: "灯芽醒来了。", fr: "La pousse-lanterne est réveillée." },
    artwork: {
      title: "Soleil couchant sur la Seine à Lavacourt, effet d'hiver",
      titleZh: "拉瓦库尔塞纳河日落，冬日效果",
      titleFr: "Soleil couchant sur la Seine à Lavacourt, effet d'hiver",
      credit: {
        en: "Claude Monet, 1880. Petit Palais, Paris Musees, public domain.",
        zh: "克劳德·莫奈，1880。巴黎小皇宫美术馆，Paris Musees，公有领域。",
        fr: "Claude Monet, 1880. Petit Palais, Paris Musées, domaine public."
      },
      url: "https://www.parismuseescollections.paris.fr/sites/default/files/styles/pm_diaporama_zoom/public/atoms/images/PPA/lpdp_143990-30.jpg?itok=_eLwIkOq"
    },
    choices: [
      [{ en: "Winter Gold", zh: "冬日金", fr: "Or d'hiver" }, "#e4b34f"],
      [{ en: "Seine Blue", zh: "塞纳蓝", fr: "Bleu de Seine" }, "#5c93b8"],
      [{ en: "Ice Pink", zh: "冰面粉", fr: "Rose glacé" }, "#dd8a80"],
      [{ en: "Fog White", zh: "雾白色", fr: "Blanc brume" }, "#f1dfbf"]
    ]
  },
  shape: {
    world: { en: "Shape Forest", zh: "形状森林", fr: "Forêt des formes" },
    prompt: {
      en: "Find the shapes that balance the flower room.",
      zh: "找出让花房变平衡的形状。",
      fr: "Trouve les formes qui équilibrent la chambre aux fleurs."
    },
    guide: {
      en: "Degas placed the woman, vase, table, and flowers like large shapes in a quiet puzzle.",
      zh: "德加把人物、花瓶、桌子和花朵摆成一个安静的形状谜题。",
      fr: "Degas place la femme, le vase, la table et les fleurs comme de grandes formes dans un puzzle calme."
    },
    home: {
      en: "The flower room is calm, but the shapes are doing a lot of work. Can you spot them?",
      zh: "这个花房很安静，但形状一直在工作。你能发现它们吗？",
      fr: "La chambre aux fleurs est calme, mais les formes travaillent beaucoup. Peux-tu les trouver ?"
    },
    studio: { en: "Build your balanced-room collage.", zh: "拼出你的平衡房间。", fr: "Compose ta chambre équilibrée." },
    creature: { en: "Pattern Scout is awake.", zh: "图案侦察员醒来了。", fr: "L'éclaireur des motifs est réveillé." },
    artwork: {
      title: "A Woman Seated beside a Vase of Flowers",
      titleZh: "坐在花瓶旁的女子",
      titleFr: "Femme assise près d'un vase de fleurs",
      credit: {
        en: "Edgar Degas, 1865. The Metropolitan Museum of Art, public domain.",
        zh: "埃德加·德加，1865。大都会艺术博物馆，公有领域。",
        fr: "Edgar Degas, 1865. The Metropolitan Museum of Art, domaine public."
      },
      url: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-25460-001.jpg"
    },
    choices: [
      [{ en: "Flower Circles", zh: "花朵圆形", fr: "Cercles de fleurs" }, "#dd8a80"],
      [{ en: "Table Rectangle", zh: "桌子长方形", fr: "Rectangle de table" }, "#8b5d35"],
      [{ en: "Quiet Wall", zh: "安静的墙", fr: "Mur calme" }, "#9aa3a0"],
      [{ en: "Dark Dress", zh: "深色裙子", fr: "Robe sombre" }, "#25537b"]
    ]
  },
  mood: {
    world: { en: "Mood Palace", zh: "情绪宫殿", fr: "Palais des humeurs" },
    prompt: {
      en: "Choose the colors that make the room feel like night.",
      zh: "选择让画面像夜晚一样安静的颜色。",
      fr: "Choisis les couleurs qui donnent à l'image une sensation de nuit."
    },
    guide: {
      en: "La Farge made a small, dark picture feel hushed. Look for the soft colors that lower the volume.",
      zh: "拉法奇让一张小小的暗色画面变得很安静。找出那些把声音放轻的柔和颜色。",
      fr: "La Farge rend une petite image sombre très silencieuse. Cherche les couleurs douces qui baissent le volume."
    },
    home: {
      en: "The night room is quiet. Can you find the colors that make it feel deep and still?",
      zh: "夜晚房间很安静。你能找到让它变得深、静的颜色吗？",
      fr: "La salle de nuit est silencieuse. Peux-tu trouver les couleurs qui la rendent profonde et calme ?"
    },
    studio: { en: "Build your quiet-night collage.", zh: "拼出你的安静夜晚。", fr: "Compose ta nuit silencieuse." },
    creature: { en: "Moon Listener is awake.", zh: "月光倾听者醒来了。", fr: "L'écouteur de lune est réveillé." },
    artwork: {
      title: "Nocturne",
      titleZh: "夜曲",
      titleFr: "Nocturne",
      credit: {
        en: "John La Farge, ca. 1885. The Metropolitan Museum of Art, public domain.",
        zh: "约翰·拉法奇，约1885。大都会艺术博物馆，公有领域。",
        fr: "John La Farge, vers 1885. The Metropolitan Museum of Art, domaine public."
      },
      url: "https://images.metmuseum.org/CRDImages/ad/web-large/DT256385.jpg"
    },
    choices: [
      [{ en: "Night Blue", zh: "夜晚蓝", fr: "Bleu nuit" }, "#25537b"],
      [{ en: "Deep Green", zh: "深绿色", fr: "Vert profond" }, "#40624f"],
      [{ en: "Soft Gray", zh: "柔灰色", fr: "Gris doux" }, "#9aa3a0"],
      [{ en: "Petal Pink", zh: "花瓣粉", fr: "Rose pétale" }, "#dd8a80"]
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
    dayCompleteLabel: "Day Complete",
    dayCompleteTitle: "Your museum day is complete.",
    viewDiary: "View seeing diary",
    backToMap: "Back to map",
    myCollection: "My Collection",
    collectionTitle: "Your cabinet of seeing",
    seeingDiary: "Seeing Diary",
    checkinHistory: "Past museum days",
    exploreAnother: "Explore another world",
    navMap: "Map",
    navStudio: "Studio",
    navCollection: "Collection",
    navParents: "Parents",
    parentsGuide: "Parents Guide",
    parentsTitle: "A tiny daily museum habit.",
    parentsLearningTitle: "What children practice",
    parentsLearningBody: "Looking slowly, naming colors, noticing mood, and turning observation into creation.",
    parentsPrivacyTitle: "Privacy",
    parentsPrivacyBody: "No account is required. The seeing diary is stored only in this browser.",
    parentsSourcesTitle: "Museum sources",
    parentsSourcesBody: "Daily artworks come from public museum collections and include source credits.",
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
    checkinSaved: "Today is recorded in your seeing diary.",
    completeMessage: "You noticed, created, and saved today's artwork. Come back tomorrow for a new museum image.",
    checkinDays: (count) => `${count} day${count === 1 ? "" : "s"}`,
    emptyHistory: "Finish today's artwork to start your image history.",
    collageSuffix: "collage",
    languageButton: "简",
    pieceLabels: { sun: "Sun", wave: "Wave", sail: "Sail", cloud: "Cloud", dot: "Dot", arch: "Arch" }
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
    dayCompleteLabel: "今日完成",
    dayCompleteTitle: "今天的博物馆日完成了。",
    viewDiary: "查看看见日记",
    backToMap: "回到地图",
    myCollection: "我的收藏",
    collectionTitle: "我的看见柜",
    seeingDiary: "看见日记",
    checkinHistory: "过去几天的博物馆",
    exploreAnother: "探索另一个世界",
    navMap: "地图",
    navStudio: "创作",
    navCollection: "收藏",
    navParents: "家长",
    parentsGuide: "家长指南",
    parentsTitle: "一个小小的每日博物馆习惯。",
    parentsLearningTitle: "孩子在练习什么",
    parentsLearningBody: "慢慢看、说出颜色、感受情绪，再把观察变成自己的创作。",
    parentsPrivacyTitle: "隐私",
    parentsPrivacyBody: "不需要账号。看见日记只保存在这个浏览器里。",
    parentsSourcesTitle: "博物馆素材来源",
    parentsSourcesBody: "每日作品来自开放博物馆收藏，并保留来源说明。",
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
    checkinSaved: "今天已经记录进你的看见日记。",
    completeMessage: "你观察了、创作了，也保存了今天的作品。明天再来看一张新的博物馆图片。",
    checkinDays: (count) => `${count} 天`,
    emptyHistory: "完成今天的作品，就会开始留下图片历史。",
    collageSuffix: "拼贴",
    languageButton: "FR",
    pieceLabels: { sun: "太阳", wave: "波浪", sail: "帆船", cloud: "云朵", dot: "圆点", arch: "拱门" }
  },
  fr: {
    appName: "Musée du regard",
    prototype: "Prototype",
    overviewLede:
      "Un prototype d'aventure esthétique pour les enfants de 7 à 9 ans. Cette version teste une boucle complète : explorer un monde, observer une oeuvre, créer quelque chose, puis l'ajouter à sa collection.",
    flowLabel: "Parcours",
    flowOne: "Choisir un monde sur la carte",
    flowTwo: "Jouer la mission Inspiration du jour",
    flowThree: "Créer avec des couleurs et des formes",
    flowFour: "Débloquer une nouvelle carte",
    lookForLabel: "À observer",
    lookForOne: "Est-ce que cela ressemble à un jeu plutôt qu'à un cours ?",
    lookForTwo: "La mission mène-t-elle naturellement à la création ?",
    lookForThree: "La récompense ressemble-t-elle à une identité, pas seulement à des points ?",
    sessionLabel: "Session",
    statusWorldLabel: "Monde",
    statusMissionLabel: "Mission",
    statusCreationLabel: "Création",
    explorer: "Explorateur",
    mapKicker: "Choisis un monde à explorer",
    dailySpark: "Inspiration du jour",
    todaysMission: "Mission du jour",
    todaysGuide: "Guide du jour",
    newCreature: "Nouveau compagnon",
    newCreatureCopy: "Termine une mission pour réveiller la pousse-lanterne.",
    enterStudio: "Créer avec ces couleurs",
    creativeStudio: "Atelier créatif",
    yourCanvas: "Ta toile",
    saveToCollection: "Ajouter a la collection",
    dayCompleteLabel: "Jour terminé",
    dayCompleteTitle: "Ta journée au musée est terminée.",
    viewDiary: "Voir le journal",
    backToMap: "Retour à la carte",
    myCollection: "Ma collection",
    collectionTitle: "Mon cabinet du regard",
    seeingDiary: "Journal du regard",
    checkinHistory: "Jours de musée passés",
    exploreAnother: "Explorer un autre monde",
    navMap: "Carte",
    navStudio: "Atelier",
    navCollection: "Collection",
    navParents: "Parents",
    parentsGuide: "Guide parents",
    parentsTitle: "Une petite habitude de musée.",
    parentsLearningTitle: "Ce que les enfants pratiquent",
    parentsLearningBody: "Regarder lentement, nommer les couleurs, sentir l'ambiance, puis transformer l'observation en création.",
    parentsPrivacyTitle: "Confidentialité",
    parentsPrivacyBody: "Aucun compte n'est nécessaire. Le journal du regard reste dans ce navigateur.",
    parentsSourcesTitle: "Sources des musées",
    parentsSourcesBody: "Les oeuvres du jour viennent de collections publiques de musées et gardent leurs crédits.",
    chooseMore: (count) => `Choisis encore ${count} couleur${count === 1 ? "" : "s"} pour ouvrir l'atelier.`,
    paletteFound: "Très beau. Tu as trouvé une palette dans l'oeuvre.",
    piecesMore: (count) => `Place encore ${count} élément${count === 1 ? "" : "s"} pour terminer ton image.`,
    creationReady: "Ton collage est prêt à être sauvegardé.",
    statusNotStarted: "Pas commencée",
    statusPaletteFound: "Palette trouvée",
    statusPieces: (count) => `${count} / 3 éléments placés`,
    creatureWaiting: "Un nouveau compagnon t'attend.",
    lockedCard: "Trouve plus de couleurs",
    emptyCreation: "Ton nouveau collage apparaîtra ici.",
    collectionComplete: "Tu as débloqué trois couleurs et sauvegardé ton premier collage.",
    collectionMissionDone: "Tes couleurs sont débloquées. Termine le collage pour le sauvegarder.",
    collectionLocked: "Termine la mission pour débloquer ta première palette.",
    checkinSaved: "Aujourd'hui est noté dans ton journal du regard.",
    completeMessage: "Tu as observé, créé et sauvegardé l'oeuvre du jour. Reviens demain pour une nouvelle image de musée.",
    checkinDays: (count) => `${count} jour${count === 1 ? "" : "s"}`,
    emptyHistory: "Termine l'oeuvre du jour pour commencer ton historique d'images.",
    collageSuffix: "collage",
    languageButton: "EN",
    pieceLabels: { sun: "Soleil", wave: "Vague", sail: "Voile", cloud: "Nuage", dot: "Point", arch: "Arche" }
  }
};

const state = {
  activeScreen: "map",
  missionKey: "color",
  locale: "en",
  selectedColors: [],
  placedPieces: [],
  checkins: loadCheckins()
};

function render() {
  const mission = missions[state.missionKey];
  const t = copy[state.locale];
  document.documentElement.lang = state.locale === "zh" ? "zh-CN" : state.locale;

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
  applySelectedPalette(canvasScene);

  canvasScene.innerHTML = "";
  state.placedPieces.forEach((placement, index) => {
    const piece = pieceName(placement);
    const colorName = pieceColorName(placement, index);
    const node = document.createElement("div");
    node.className = `canvas-piece ${piece}`;
    node.style.setProperty("--piece-color", colorForChoice(colorName));
    node.textContent = "";
    canvasScene.appendChild(node);
  });

  for (const button of pieceButtons) {
    button.textContent = t.pieceLabels[button.dataset.piece];
    button.classList.toggle("used", state.placedPieces.some((placement) => pieceName(placement) === button.dataset.piece));
    button.disabled = state.selectedColors.length === 0 || state.placedPieces.length >= MAX_STUDIO_PIECES;
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

  renderCompletion(t);
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

function applySelectedPalette(node) {
  const colors = state.selectedColors.map((colorName) => colorForChoice(colorName));
  node.style.setProperty("--creation-1", colors[0] ?? "#f2c89b");
  node.style.setProperty("--creation-2", colors[1] ?? "#d98068");
  node.style.setProperty("--creation-3", colors[2] ?? "#2f5a75");
}

function pieceName(placement) {
  return typeof placement === "string" ? placement : placement.piece;
}

function pieceColorName(placement, index) {
  if (typeof placement === "object" && placement.colorName) return placement.colorName;
  return state.selectedColors[index % state.selectedColors.length];
}

function textFor(value) {
  if (typeof value === "string") return value;
  return value[state.locale] ?? value.en;
}

function artworkName(artwork) {
  if (state.locale === "fr") return artwork.titleFr;
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
    applySelectedPalette(creation);
    creation.innerHTML = `
      <div class="saved-creation-preview"></div>
      <p>${textFor(mission.world)} ${t.collageSuffix}</p>
    `;
    creationShelf.appendChild(creation);
    collectionFeedback.textContent = hasTodayCheckin() ? t.checkinSaved : t.collectionComplete;
  } else {
    creationShelf.innerHTML = `
      <article class="saved-creation empty">
        <p>${t.emptyCreation}</p>
      </article>
    `;
    collectionFeedback.textContent = missionDone ? t.collectionMissionDone : t.collectionLocked;
  }

  renderHistory(t);
}

function renderHistory(t) {
  historyShelf.innerHTML = "";
  checkinCount.textContent = t.checkinDays(state.checkins.length);

  if (!state.checkins.length) {
    historyShelf.innerHTML = `
      <article class="history-empty">
        <p>${t.emptyHistory}</p>
      </article>
    `;
    return;
  }

  for (const checkin of state.checkins.slice(0, 7)) {
    const card = document.createElement("article");
    const image = document.createElement("img");
    const body = document.createElement("div");
    const date = document.createElement("strong");
    const title = document.createElement("p");

    card.className = "history-card";
    image.src = checkin.imageUrl;
    image.alt = checkin.title;
    date.textContent = formatCheckinDate(checkin.date);
    title.textContent = checkin.title;

    body.append(date, title);
    card.append(image, body);
    historyShelf.appendChild(card);
  }
}

function renderCompletion(t) {
  const mission = missions[state.missionKey];
  const latestCheckin = state.checkins.find((checkin) => checkin.date === todayKey()) ?? state.checkins[0];

  completeMessage.textContent = t.completeMessage;
  completeArtworkImage.src = latestCheckin?.imageUrl ?? mission.artwork.url;
  completeArtworkImage.alt = latestCheckin?.title ?? artworkName(mission.artwork);
  completeArtworkTitle.textContent = latestCheckin?.title ?? artworkName(mission.artwork);
  completeDate.textContent = formatCheckinDate(latestCheckin?.date ?? todayKey());
  completePalette.innerHTML = "";

  for (const colorName of state.selectedColors) {
    const swatch = document.createElement("span");
    swatch.style.background = colorForChoice(colorName);
    swatch.title = colorName;
    completePalette.appendChild(swatch);
  }
}

function recordTodayCheckin() {
  const mission = missions[state.missionKey];
  const date = todayKey();
  const nextCheckin = {
    date,
    missionKey: state.missionKey,
    title: artworkName(mission.artwork),
    imageUrl: mission.artwork.url,
    colors: state.selectedColors
  };

  state.checkins = [
    nextCheckin,
    ...state.checkins.filter((checkin) => checkin.date !== date)
  ].slice(0, 30);
  saveCheckins();
}

function hasTodayCheckin() {
  return state.checkins.some((checkin) => checkin.date === todayKey());
}

function loadCheckins() {
  try {
    const checkins = JSON.parse(localStorage.getItem("museumSeeingCheckins") || "[]");
    return Array.isArray(checkins) ? checkins : [];
  } catch {
    return [];
  }
}

function saveCheckins() {
  localStorage.setItem("museumSeeingCheckins", JSON.stringify(state.checkins));
}

function formatCheckinDate(date) {
  return new Intl.DateTimeFormat(state.locale === "zh" ? "zh-CN" : state.locale, {
    month: "short",
    day: "numeric"
  }).format(new Date(`${date}T12:00:00`));
}

function todayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

for (const button of screenButtons) {
  button.addEventListener("click", () => {
    const target = button.dataset.targetScreen;
    if (button.dataset.world) {
      state.missionKey = button.dataset.world;
      state.selectedColors = [];
      state.placedPieces = [];
    }
    if (button.id === "finish-creation" && state.placedPieces.length >= 3) {
      recordTodayCheckin();
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
    if (state.placedPieces.length >= MAX_STUDIO_PIECES) return;
    const colorName = state.selectedColors[state.placedPieces.length % state.selectedColors.length];
    state.placedPieces = [...state.placedPieces, { piece, colorName }];
    render();
  });
}

languageToggle.addEventListener("click", () => {
  const locales = ["en", "zh", "fr"];
  const currentIndex = locales.indexOf(state.locale);
  state.locale = locales[(currentIndex + 1) % locales.length];
  state.selectedColors = [];
  state.placedPieces = [];
  render();
});

async function initialize() {
  await loadDailyMissions();
  render();
}

async function loadDailyMissions() {
  if (window.location.protocol === "file:") return;

  try {
    const response = await fetch(`./daily-missions.json?updated=${Date.now()}`, {
      cache: "no-store"
    });
    if (!response.ok) return;

    const daily = await response.json();
    if (!daily?.missions) return;

    missions = {
      ...missions,
      ...daily.missions
    };
  } catch {
    // The static prototype still works with bundled missions when daily data is unavailable.
  }
}

initialize();
