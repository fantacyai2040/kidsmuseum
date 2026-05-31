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

const missions = {
  color: {
    world: "Color Harbor",
    prompt: "Catch the colors that make the wind feel bright.",
    guide:
      "Van Gogh made the sky, wheat, and trees move with color. Choose the colors that feel most alive.",
    home:
      "The windy field is glowing. Can you catch the colors that make it feel alive?",
    studio: "Build your windy-field collage.",
    creature: "Lantern Sprout is awake.",
    artwork: {
      title: "Wheat Field with Cypresses",
      credit: "Vincent van Gogh, 1889. The Metropolitan Museum of Art, public domain.",
      url: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg"
    },
    choices: [
      ["Wheat Gold", "#e4b34f"],
      ["Sky Blue", "#5c93b8"],
      ["Cypress Green", "#40624f"],
      ["Cloud White", "#f1dfbf"]
    ]
  },
  shape: {
    world: "Shape Forest",
    prompt: "Find the shapes that balance the flower room.",
    guide:
      "Degas placed the woman, vase, table, and flowers like large shapes in a quiet puzzle.",
    home:
      "The flower room is calm, but the shapes are doing a lot of work. Can you spot them?",
    studio: "Build your balanced-room collage.",
    creature: "Pattern Scout is awake.",
    artwork: {
      title: "A Woman Seated beside a Vase of Flowers",
      credit: "Edgar Degas, 1865. The Metropolitan Museum of Art, public domain.",
      url: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-25460-001.jpg"
    },
    choices: [
      ["Flower Circles", "#dd8a80"],
      ["Table Rectangle", "#8b5d35"],
      ["Quiet Wall", "#9aa3a0"],
      ["Dark Dress", "#25537b"]
    ]
  },
  mood: {
    world: "Mood Palace",
    prompt: "Choose the colors that make the room feel like night.",
    guide:
      "La Farge made a small, dark picture feel hushed. Look for the soft colors that lower the volume.",
    home:
      "The night room is quiet. Can you find the colors that make it feel deep and still?",
    studio: "Build your quiet-night collage.",
    creature: "Moon Listener is awake.",
    artwork: {
      title: "Nocturne",
      credit: "John La Farge, ca. 1885. The Metropolitan Museum of Art, public domain.",
      url: "https://images.metmuseum.org/CRDImages/ad/web-large/DT256385.jpg"
    },
    choices: [
      ["Night Blue", "#25537b"],
      ["Deep Green", "#40624f"],
      ["Soft Gray", "#9aa3a0"],
      ["Petal Pink", "#dd8a80"]
    ]
  }
};

const state = {
  activeScreen: "map",
  missionKey: "color",
  selectedColors: [],
  placedPieces: []
};

function render() {
  const mission = missions[state.missionKey];

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
    button.classList.toggle("used", state.placedPieces.includes(button.dataset.piece));
    button.disabled = state.placedPieces.includes(button.dataset.piece);
  }

  enterStudioButton.disabled = state.selectedColors.length !== 3;
  finishCreationButton.disabled = state.placedPieces.length < 3;

  missionFeedback.textContent =
    state.selectedColors.length === 3
      ? "Beautiful. You found a palette from the artwork."
      : `Choose ${3 - state.selectedColors.length} more color${state.selectedColors.length === 2 ? "" : "s"} to open the studio.`;

  studioFeedback.textContent =
    state.placedPieces.length >= 3
      ? "Your collage is ready to save."
      : `Place ${3 - state.placedPieces.length} more piece${state.placedPieces.length === 2 ? "" : "s"} to finish your artwork.`;

  const missionDone = state.selectedColors.length === 3;
  const creationDone = state.placedPieces.length >= 3;

  guideCopy.textContent = mission.home;
  missionWorld.textContent = mission.world;
  missionTitle.textContent = mission.prompt;
  missionArtwork.src = mission.artwork.url;
  missionArtwork.alt = mission.artwork.title;
  artworkTitle.textContent = mission.artwork.title;
  artworkCredit.textContent = mission.artwork.credit;
  missionGuide.textContent = mission.guide;
  studioTitle.textContent = mission.studio;
  creatureCopy.textContent = missionDone ? mission.creature : "A new creature is waiting.";
  statusWorld.textContent = mission.world;
  statusMission.textContent = missionDone ? "Palette found" : "Not started";
  statusCreation.textContent = `${state.placedPieces.length} / 3 pieces placed`;

  renderChoices(mission);
  renderCollection(missionDone, creationDone);
}

function renderChoices(mission) {
  choiceButtons.forEach((button, index) => {
    const choice = mission.choices[index];
    button.textContent = choice[0];
    button.dataset.choice = choice[0];
    button.style.setProperty("--choice-color", choice[1]);
  });
}

function colorForChoice(colorName) {
  const mission = missions[state.missionKey];
  return mission.choices.find(([name]) => name === colorName)?.[1] ?? "#e4b34f";
}

function renderCollection(missionDone, creationDone) {
  const mission = missions[state.missionKey];
  cardShelf.innerHTML = "";

  if (missionDone) {
    for (const colorName of state.selectedColors) {
      const card = document.createElement("article");
      const colorClass = colorName.toLowerCase().replace(/\s+/g, "-");
      card.className = "collect-card unlocked";
      card.innerHTML = `
        <div class="collect-dot ${colorClass}" style="background: ${colorForChoice(colorName)}"></div>
        <p>${colorName}</p>
      `;
      cardShelf.appendChild(card);
    }
  } else {
    cardShelf.innerHTML = `
      <article class="collect-card locked">
        <div class="collect-dot"></div>
        <p>Find more colors</p>
      </article>
    `;
  }

  creationShelf.innerHTML = "";

  if (creationDone) {
    const creation = document.createElement("article");
    creation.className = "saved-creation";
    creation.innerHTML = `
      <div class="saved-creation-preview"></div>
      <p>${mission.world} collage</p>
    `;
    creationShelf.appendChild(creation);
    collectionFeedback.textContent = "You unlocked three colors and saved your first collage.";
  } else {
    creationShelf.innerHTML = `
      <article class="saved-creation empty">
        <p>Your new collage will appear here.</p>
      </article>
    `;
    collectionFeedback.textContent = missionDone
      ? "Your colors are unlocked. Finish the collage to save it."
      : "Finish the mission to unlock your first color set.";
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

render();
