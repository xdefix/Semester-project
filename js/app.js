import { renderLanding } from "./landing.js";
import { renderDownload } from "./download.js";
import { renderIntro } from "./intro.js";
import { renderPuzzle1 } from "./puzzle1.js";
import { renderPuzzle2 } from "./puzzle2.js";
import { renderStoryPuzzle2 } from "./puzzle2extra.js";
import { renderPuzzle3 } from "./puzzle3.js";
import { renderStoryPuzzle3 } from "./puzzle3extra.js";
import { renderPuzzle4 } from "./puzzle4.js";
import { renderPuzzle5 } from "./puzzle5.js";
import { renderPuzzle6 } from "./puzzle6.js";
import { renderPuzzle7 } from "./puzzle7.js";
import { renderStory1 } from "./story1.js";
import { renderStory2 } from "./story2.js";
import { renderStory3 } from "./story3.js";
import { renderStory4 } from "./story4.js";
import { renderFinal } from "./final.js";
import { renderFinal2 } from "./final2.js";
import { renderRules } from "./rules.js";
import { showPopup, hidePopup, initPopup } from "./popup.js";
import { renderSettingsOverlay, initSettingsEvents } from "./settings.js";
import { initI18n, onLanguageChanged } from "./i18n.js";
import { clearAllHelpStates } from "./helpState.js";
import { resetTypewriterVisits } from "./typewriter.js";
import { playMusic, playButtonClick } from "./sound.js";

const app = document.getElementById("app");

// ---------------- STATE ----------------
let currentPage = "landing";
const historyStack = [];

// ---------------- RERENDER ----------------
let rerenderFn = null;

export function registerRerender(fn) {
    rerenderFn = fn;
}

export function rerender() {
    rerenderFn?.();
}

// ---------------- TIMER ----------------
const TIMER_KEY = "game_timer_start";

export const timerState = {
    totalTime: 60 * 60,
    startTimestamp: null,
    interval: null,
    paused: false,
    started: false
};

// ---------------- CORE TIME CALC ----------------
export function getRemainingTime() {
    if (!timerState.startTimestamp) return timerState.totalTime;

    const elapsed = Math.floor(
        (Date.now() - timerState.startTimestamp) / 1000
    );

    return timerState.totalTime - elapsed;
}

// ---------------- TIMER START ----------------
export function startTimer(updateUI) {
    if (timerState.started) return;
    timerState.started = true;

    const saved = sessionStorage.getItem(TIMER_KEY);

    if (saved) {
        timerState.startTimestamp = Number(saved);
    } else {
        timerState.startTimestamp = Date.now();
        sessionStorage.setItem(TIMER_KEY, timerState.startTimestamp);
    }

    timerState.interval = setInterval(() => {
        if (timerState.paused) return;

        updateUI?.();
        window.__helpSync?.();
    }, 1000);
}

// ---------------- TIMER UTILS ----------------
export function togglePause(updateUI) {
    timerState.paused = !timerState.paused;
    updateUI?.();
}

export function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "00:00";
    }

    const negative = seconds < 0;
    const absSeconds = Math.abs(seconds);

    const m = String(Math.floor(absSeconds / 60)).padStart(2, "0");
    const s = String(absSeconds % 60).padStart(2, "0");

    return negative
        ? `-${m}:${s}`
        : `${m}:${s}`;
}

export function formatElapsed(seconds) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
}

// ---------------- NAVIGATION STATE ----------------
export function getCurrentPage() {
    return currentPage;
}

export function resetNavigation() {
    historyStack.length = 0;
    currentPage = "landing";
}

// ---------------- TIMER ELAPSED ----------------
export function getElapsedTime() {
    if (!timerState.startTimestamp) return 0;

    return Math.floor(
        (Date.now() - timerState.startTimestamp) / 1000
    );
}

export function isOverTimeLimit() {
    return getElapsedTime() > timerState.totalTime;
}

// ---------------- RESET GAME (FULL CLEAN) ----------------
export function resetGame() {
    // timer reset
    timerState.startTimestamp = null;
    timerState.started = false;
    timerState.paused = false;

    if (timerState.interval) {
        clearInterval(timerState.interval);
        timerState.interval = null;
    }

    // storage cleanup
    sessionStorage.removeItem(TIMER_KEY);
    sessionStorage.removeItem("currentPage");

    // navigation cleanup
    resetNavigation();
}

// ---------------- NAVIGATION ----------------
export function navigate(page) {
    hidePopup();

    sessionStorage.setItem("currentPage", page);

    historyStack.push(currentPage);
    currentPage = page;

    render();
}

// ---------------- BACK ----------------
export function goBack() {
    hidePopup();

    const puzzleFlowPages = new Set([
        "puzzle1",
        "story1",
        "puzzle2extra",
        "puzzle2",
        "puzzle3extra",
        "puzzle3",
        "puzzle4",
        "story2",
        "puzzle5",
        "story3",
        "puzzle6",
        "puzzle7",
        "story4",
        "final",
        "final2"
    ]);

    const previousPage =
        historyStack[historyStack.length - 1];

    const leavingPuzzleFlow =
        puzzleFlowPages.has(currentPage) &&
        !puzzleFlowPages.has(previousPage);

    // Leaving puzzle chain → full reset
    if (leavingPuzzleFlow) {
        resetTimer();
        clearAllHelpStates();
        resetTypewriterVisits();
    }

    if (historyStack.length === 0) {
        currentPage = "landing";
        render();
        return;
    }

    currentPage = historyStack.pop();
    render();
}

export function resetTimer() {
    // stop active interval
    if (timerState.interval) {
        clearInterval(timerState.interval);
        timerState.interval = null;
    }

    // reset timer state
    timerState.startTimestamp = null;
    timerState.started = false;
    timerState.paused = false;

    // remove saved timer
    sessionStorage.removeItem(TIMER_KEY);
}

// ---------------- ROUTES ----------------
const routes = {
    landing: renderLanding,
    download: renderDownload,
    intro: renderIntro,
    puzzle1: renderPuzzle1,
    puzzle2: renderPuzzle2,
    puzzle2extra: renderStoryPuzzle2,
    puzzle3: renderPuzzle3,
    puzzle3extra: renderStoryPuzzle3,
    puzzle4: renderPuzzle4,
    puzzle5: renderPuzzle5,
    puzzle6: renderPuzzle6,
    puzzle7: renderPuzzle7,
    story1: renderStory1,
    story2: renderStory2,
    story3: renderStory3,
    story4: renderStory4,
    final: renderFinal,
    final2: renderFinal2,
    rules: renderRules
};

// pages where restart is allowed
export const restartAllowedPages = new Set([
    "puzzle1",
    "puzzle2",
    "puzzle2extra",
    "puzzle3",
    "puzzle3extra",
    "puzzle4",
    "puzzle5",
    "puzzle6",
    "puzzle7",
    "story1",
    "story2",
    "story3",
    "story4",
    "final"
]);

// ---------------- RENDER ----------------
function render() {
    const page = routes[currentPage];
    page?.(app);
    // initializePageCursor(app);
}

// START MUSIC AFTER FIRST USER INTERACTION
document.addEventListener(
    "pointerdown",
    () => {
        playMusic();
    },
    { once: true }
);

document.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    if (!button) return;

    if (button.hasAttribute("data-no-sound")) {
        return;
    }

    playButtonClick();
});

// ---------------- GLOBAL UI ----------------
function mountGlobalUI() {
    document.body.insertAdjacentHTML(
        "beforeend",
        renderSettingsOverlay()
    );
}

// ---------------- PAGE RESTORE ----------------
export function initPageRestore() {
    const saved = sessionStorage.getItem("currentPage");

    currentPage = saved && routes[saved] ? saved : "landing";

    render();
}

// ---------------- BOOTSTRAP ----------------
async function bootstrap() {
    mountGlobalUI();
    initSettingsEvents();

    await initI18n();

    registerRerender(render);

    initPageRestore();

    // restore timer state
    const savedTimer = sessionStorage.getItem(TIMER_KEY);

    if (savedTimer) {
        timerState.startTimestamp = Number(savedTimer);
    }
}

export function enableAutoUppercase(root = document) {
    root.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
    });
}



// /* =========================
//    CUSTOM CURSOR SYSTEM
//    app.js
//    ========================= */

// /* ===== CURSOR IMAGES ===== */

// /* Cursor image paths */
// const CURSOR_DEFAULT =
//     `${BASE_PATH}images/cursor/default.png`;

// const CURSOR_HOVER =
//     `${BASE_PATH}images/cursor/hover.png`;

// const CURSOR_HOLD =
//     `${BASE_PATH}images/cursor/hold.png`;

// /* ===== CURSOR ELEMENT ===== */

// const cursor = document.getElementById("game-cursor");

// /* ===== STATE ===== */

// let mouseX = 0;
// let mouseY = 0;

// let currentX = 0;
// let currentY = 0;

// let isHolding = false;
// let hoverActive = false;

// /* ===== INITIAL CURSOR ===== */

// cursor.style.backgroundImage = `url(${CURSOR_DEFAULT})`;

// /* =========================
//    MOUSE TRACKING
//    ========================= */

// window.addEventListener("mousemove", (e) => {
//     mouseX = e.clientX;
//     mouseY = e.clientY;
// });

// /* =========================
//    SMOOTH CURSOR LOOP
//    ========================= */

// function animateCursor() {
//     currentX += (mouseX - currentX) * 0.55;
//     currentY += (mouseY - currentY) * 0.55;

//     cursor.style.transform =
//         `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;

//     requestAnimationFrame(animateCursor);
// }

// animateCursor();

// /* =========================
//    CURSOR STATE HANDLING
//    ========================= */

// function updateCursorState() {
//     if (isHolding) {
//         cursor.style.backgroundImage = `url(${CURSOR_HOLD})`;
//         return;
//     }

//     if (hoverActive) {
//         cursor.style.backgroundImage = `url(${CURSOR_HOVER})`;
//         return;
//     }

//     cursor.style.backgroundImage = `url(${CURSOR_DEFAULT})`;
// }


// function bindCursorInteractions(root = document) {
//     const interactables =
//         root.querySelectorAll(".cursor-hover");

//     interactables.forEach((el) => {

//         /* Avoid duplicate listeners */
//         if (el.dataset.cursorBound) return;

//         el.dataset.cursorBound = "true";

//         /* Hover */
//         el.addEventListener("mouseenter", () => {
//             console.log("hover working");
//             hoverActive = true;
//             updateCursorState();
//         });

//         el.addEventListener("mouseleave", () => {
//             hoverActive = false;
//             updateCursorState();
//         });

//         /* Hold */
//         el.addEventListener("mousedown", () => {
//             isHolding = true;
//             updateCursorState();
//         });

//         el.addEventListener("mouseup", () => {
//             isHolding = false;
//             updateCursorState();
//         });

//         /* Safety */
//         el.addEventListener("mouseleave", () => {
//             isHolding = false;
//             updateCursorState();
//         });
//     });
// }

// /* =========================
//    INPUT FIELDS
//    ========================= */

// function bindInputCursorBehavior(root = document) {
//     const textInputs =
//         root.querySelectorAll(
//             "input, textarea, [contenteditable='true']"
//         );

//     textInputs.forEach((el) => {

//         if (el.dataset.cursorInputBound) return;

//         el.dataset.cursorInputBound = "true";

//         el.addEventListener("mouseenter", () => {
//             cursor.style.opacity = "0";
//             document.body.style.cursor = "text";
//         });

//         el.addEventListener("mouseleave", () => {
//             cursor.style.opacity = "1";
//             document.body.style.cursor = "none";
//         });
//     });
// }

// export function initializePageCursor(root = document) {
//     bindCursorInteractions(root);
//     bindInputCursorBehavior(root);
// }

// window.initializePageCursor = initializePageCursor;

// /* =========================
//    INITIAL LOAD
//    ========================= */

// initializePageCursor();

// ---------------- LANGUAGE ----------------
onLanguageChanged(() => rerender());

bootstrap();