export const helpState = {};

// create state per puzzle
export function getHelpState(puzzleId) {
  if (!helpState[puzzleId]) {
    helpState[puzzleId] = {
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

  return helpState[puzzleId];
}

export function resetHelpState(puzzleId) {
  helpState[puzzleId] = {
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