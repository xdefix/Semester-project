const window.BASE_PATH = "/Semester-project/";
import { renderLanding } from "./landing.js";
import { renderDownload } from "./download.js";
import { renderIntro } from "./intro.js";
import { renderPuzzle1 } from "./puzzle1.js";
import { renderPuzzle2 } from "./puzzle2.js";
import { renderStoryPuzzle2 } from "./puzzle2extra.js";
import { renderPuzzle3 } from "./puzzle3.js";
import { renderPuzzle4 } from "./puzzle4.js";
import { renderPuzzle5 } from "./puzzle5.js";
import { renderPuzzle6 } from "./puzzle6.js";
import { renderPuzzle7 } from "./puzzle7.js";
import { renderStory1 } from "./story1.js";
import { renderStory2 } from "./story2.js";
import { renderStory3 } from "./story3.js";
import { renderFinal } from "./final.js";
import { renderRules } from "./rules.js";
import { showPopup, hidePopup, initPopup } from "./popup.js";

import { renderSettingsOverlay, initSettingsEvents } from "./settings.js";
import { initI18n, onLanguageChanged } from "./i18n.js";

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

    return Math.max(0, timerState.totalTime - elapsed);
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

        if (getRemainingTime() <= 0) {
            clearInterval(timerState.interval);
            timerState.interval = null;
            showPopup("Time's up!");
        }
    }, 1000);
}

// ---------------- TIMER UTILS ----------------
export function togglePause(updateUI) {
    timerState.paused = !timerState.paused;
    updateUI?.();
}

export function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "00:00";
    }

    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
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

    if (historyStack.length === 0) {
        currentPage = "landing";
        render();
        return;
    }

    currentPage = historyStack.pop();
    render();
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
    puzzle4: renderPuzzle4,
    puzzle5: renderPuzzle5,
    puzzle6: renderPuzzle6,
    puzzle7: renderPuzzle7,
    story1: renderStory1,
    story2: renderStory2,
    story3: renderStory3,
    final: renderFinal,
    rules: renderRules
};

// pages where restart is allowed
export const restartAllowedPages = new Set([
    "puzzle1",
    "puzzle2",
    "puzzle2extra",
    "puzzle3",
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
}

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

// ---------------- LANGUAGE ----------------
onLanguageChanged(() => rerender());

bootstrap();