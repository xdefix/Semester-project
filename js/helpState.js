const STORAGE_KEY = "helpState";

// load saved state
export const helpState =
  JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};

// ---------------- SAVE ----------------
function save() {
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(helpState)
  );
}

export function saveHelpState() {
  save();
}

// ---------------- DEFAULT STATE ----------------
function createDefaultState() {
  return {
    clue1Time: null,
    clue2Time: null,

    unlocked: {
      0: true,
      1: false,
      2: false
    },

    revealed: {
      0: false,
      1: false,
      2: false
    }
  };
}

// ---------------- GET ----------------
export function getHelpState(puzzleId) {
  if (!helpState[puzzleId]) {
    helpState[puzzleId] = createDefaultState();
    save();
  }

  return helpState[puzzleId];
}

// ---------------- RESET ONE ----------------
export function resetHelpState(puzzleId) {
  helpState[puzzleId] = createDefaultState();
  save();
}

// ---------------- RESET ALL ----------------
export function clearAllHelpStates() {
  Object.keys(helpState).forEach(key => {
    delete helpState[key];
  });

  sessionStorage.removeItem(STORAGE_KEY);
}