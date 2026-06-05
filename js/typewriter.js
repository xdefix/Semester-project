import { playTypewriter, stopTypewriter } from "./sound.js";

// ---------------- STORAGE ----------------
const VISITED_KEY = "visited_story_pages";

// ---------------- HELPERS ----------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitWhilePaused(pauseCheck) {
  while (pauseCheck?.()) {
    await sleep(100);
  }
}

// ---------------- VISITED ----------------
function getVisitedPages() {
  return JSON.parse(sessionStorage.getItem(VISITED_KEY) || "[]");
}

function markVisited(pageId) {
  const visited = getVisitedPages();

  if (!visited.includes(pageId)) {
    visited.push(pageId);
    sessionStorage.setItem(VISITED_KEY, JSON.stringify(visited));
  }
}

function hasVisited(pageId) {
  return getVisitedPages().includes(pageId);
}

// ---------------- MAIN ----------------
export async function typewriteParagraphs(
  container,
  {
    pageId = "default",
    speed = 20,
    paragraphDelay = 400,
    punctuationMultiplier = true,
    sound = false,
    pauseCheck = null
  } = {}
) {
  if (!container) return;

  const paragraphs = container.querySelectorAll(".story-text");

  // ---------------- REVISIT ----------------
  if (hasVisited(pageId)) {
    paragraphs.forEach(p => {
      p.style.visibility = "visible";
      p.textContent = p.dataset.text || p.textContent;
    });
    return;
  }

  // ---------------- INIT ----------------
  paragraphs.forEach(p => {
    p.dataset.text = p.dataset.text || p.textContent;
    p.textContent = "";
    p.style.visibility = "visible";
  });

  let skipAnimation = false;
  let startedSound = false;

  function skipHandler() {
    if (pauseCheck?.()) return;
    skipAnimation = true;
  }

  function keySkipHandler(event) {
    if (pauseCheck?.()) return;

    if ( event.code === "Space") {
      skipAnimation = true;
    }
  }

  document.addEventListener("pointerdown", skipHandler);
  document.addEventListener("keydown", keySkipHandler);

  // ---------------- TYPE LOOP ----------------
  for (const p of paragraphs) {
    const fullText = p.dataset.text;

    // START SOUND ONCE PER TYPE SESSION
    if (sound && !startedSound) {
      playTypewriter();
      startedSound = true;
    }

    if (skipAnimation) {
      p.textContent = fullText;
      continue;
    }

    for (let i = 0; i < fullText.length; i++) {
      await waitWhilePaused(pauseCheck);

      if (skipAnimation) {
        stopTypewriter();
        p.textContent = fullText;
        break;
      }

      const char = fullText[i];
      p.textContent += char;

      if (punctuationMultiplier) {
        if (char === "." || char === "!" || char === "?") {
          await sleep(speed * 10);
        } else if (char === "," || char === ";" || char === ":") {
          await sleep(speed * 5);
        } else {
          await sleep(speed);
        }
      } else {
        await sleep(speed);
      }
    }

    if (!skipAnimation) {
      await sleep(paragraphDelay);
    }
  }

  document.removeEventListener("pointerdown", skipHandler);
document.removeEventListener("keydown", keySkipHandler);

  stopTypewriter();
  markVisited(pageId);
}

// ---------------- RESET ----------------
export function resetTypewriterVisits() {
  sessionStorage.removeItem(VISITED_KEY);
}