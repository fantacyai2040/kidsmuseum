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

const paletteMap = {
  "Sunset Orange": "#eb8129",
  "Blush Pink": "#dd8a80",
  "Deep Blue": "#25537b",
  "Forest Moss": "#40624f"
};

const state = {
  activeScreen: "map",
  world: "Color Harbor",
  selectedColors: [],
  placedPieces: []
};

function render() {
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
    button.classList.toggle("selected", state.selectedColors.includes(button.dataset.color));
  }

  paletteRow.innerHTML = "";
  for (const colorName of state.selectedColors) {
    const swatch = document.createElement("div");
    swatch.className = "palette-swatch";
    swatch.style.background = paletteMap[colorName];
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
      ? "Beautiful. You found a warm sunset palette."
      : `Choose ${3 - state.selectedColors.length} more color${state.selectedColors.length === 2 ? "" : "s"} to open the studio.`;

  studioFeedback.textContent =
    state.placedPieces.length >= 3
      ? "Your collage is ready to save."
      : `Place ${3 - state.placedPieces.length} more piece${state.placedPieces.length === 2 ? "" : "s"} to finish your artwork.`;

  const missionDone = state.selectedColors.length === 3;
  const creationDone = state.placedPieces.length >= 3;

  statusWorld.textContent = state.world;
  statusMission.textContent = missionDone ? "Palette found" : "Not started";
  statusCreation.textContent = `${state.placedPieces.length} / 3 pieces placed`;

  renderCollection(missionDone, creationDone);
}

function renderCollection(missionDone, creationDone) {
  cardShelf.innerHTML = "";

  if (missionDone) {
    for (const colorName of state.selectedColors) {
      const card = document.createElement("article");
      const colorClass = colorName.toLowerCase().replace(/\s+/g, "-");
      card.className = "collect-card unlocked";
      card.innerHTML = `
        <div class="collect-dot ${colorClass}"></div>
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
      <p>Sunset Sail</p>
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
    state.activeScreen = target;
    render();
  });
}

for (const button of choiceButtons) {
  button.addEventListener("click", () => {
    const { color } = button.dataset;
    const alreadySelected = state.selectedColors.includes(color);

    if (alreadySelected) {
      state.selectedColors = state.selectedColors.filter((item) => item !== color);
    } else if (state.selectedColors.length < 3) {
      state.selectedColors = [...state.selectedColors, color];
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
