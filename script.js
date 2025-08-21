const compounds = [
  { name: "Water", formula: "H₂O" },
  { name: "Carbon Dioxide", formula: "CO₂" },
  { name: "Oxygen", formula: "O₂" },
  { name: "Ammonia", formula: "NH₃" },
  { name: "Methane", formula: "CH₄" },
  { name: "Sulfuric Acid", formula: "H₂SO₄" },
  { name: "Sodium Chloride", formula: "NaCl" },
  { name: "Glucose", formula: "C₆H₁₂O₆" },
  { name: "Calcium Carbonate", formula: "CaCO₃" },
  { name: "Nitric Acid", formula: "HNO₃" },
  { name: "Ethanol", formula: "C₂H₅OH" },
  { name: "Hydrochloric Acid", formula: "HCl" },
  { name: "Potassium Hydroxide", formula: "KOH" },
  { name: "Magnesium Sulfate", formula: "MgSO₄" },
  { name: "Acetic Acid", formula: "CH₃COOH" },
  { name: "Phosphoric Acid", formula: "H₃PO₄" },
  { name: "Ozone", formula: "O₃" },
  { name: "Calcium Hydroxide", formula: "Ca(OH)₂" },
  { name: "Sodium Bicarbonate", formula: "NaHCO₃" },
  { name: "Hydrogen Peroxide", formula: "H₂O₂" }
];

let board = document.getElementById("gameBoard");
let newGameBtn = document.getElementById("newGameBtn");
let gridSizeSel = document.getElementById("gridSize");
let elapsedSpan = document.getElementById("elapsed");
let movesSpan = document.getElementById("moves");
let missSpan = document.getElementById("miss");
let remainingSpan = document.getElementById("remaining");
let bestSpan = document.getElementById("best");

let gridSize = 4;
let timer = null;
let startTime = null;
let moves = 0, miss = 0, remaining = 0;
let selected = [];
let bestTimes = JSON.parse(localStorage.getItem("chemMatchBest") || "{}");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function newGame() {
  gridSize = parseInt(gridSizeSel.value);
  let neededPairs = (gridSize * gridSize) / 2;
  let chosen = shuffle(compounds).slice(0, neededPairs);
  let tiles = [];
  chosen.forEach(c => {
    tiles.push({ type: "name", text: c.name, pair: c.formula });
    tiles.push({ type: "formula", text: c.formula, pair: c.name });
  });
  tiles = shuffle(tiles);

  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  board.innerHTML = "";

  tiles.forEach((t, idx) => {
    let tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = t.text;
    tile.dataset.type = t.type;
    tile.dataset.pair = t.pair;
    tile.addEventListener("click", () => selectTile(tile));
    board.appendChild(tile);
  });

  moves = 0; miss = 0; selected = [];
  remaining = tiles.length / 2;
  updateStats();

  if (timer) clearInterval(timer);
  startTime = Date.now();
  timer = setInterval(updateStats, 100);
}

function updateStats() {
  let elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  elapsedSpan.textContent = `Time: ${elapsed}s`;
  movesSpan.textContent = `Moves: ${moves}`;
  missSpan.textContent = `Miss: ${miss}`;
  remainingSpan.textContent = `Remaining: ${remaining}`;
  let key = `${gridSize}x${gridSize}`;
  bestSpan.textContent = `Best: ${bestTimes[key] || "--"}`;
}

function selectTile(tile) {
  if (tile.classList.contains("removed") || tile.classList.contains("selected")) return;

  tile.classList.add("selected");
  selected.push(tile);

  if (selected.length === 2) {
    moves++;
    if (selected[0].dataset.pair === selected[1].textContent &&
        selected[1].dataset.pair === selected[0].textContent) {
      // match
      setTimeout(() => {
        selected.forEach(t => {
          t.classList.remove("selected");
          t.classList.add("removed");
        });
        remaining--;
        if (remaining === 0) finishGame();
        selected = [];
        updateStats();
      }, 300);
    } else {
      miss++;
      setTimeout(() => {
        selected.forEach(t => t.classList.remove("selected"));
        selected = [];
        updateStats();
      }, 600);
    }
  }
}

function finishGame() {
  clearInterval(timer);
  let elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  let key = `${gridSize}x${gridSize}`;
  if (!bestTimes[key] || parseFloat(elapsed) < parseFloat(bestTimes[key])) {
    bestTimes[key] = elapsed;
    localStorage.setItem("chemMatchBest", JSON.stringify(bestTimes));
  }
  updateStats();
  alert(`🎉 You cleared the ${gridSize}x${gridSize} board in ${elapsed}s!`);
}

newGameBtn.addEventListener("click", newGame);
window.addEventListener("load", newGame);
