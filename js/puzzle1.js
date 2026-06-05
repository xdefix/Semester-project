import {
  goBack,
  timerState,
  startTimer,
  togglePause,
  formatTime,
  getRemainingTime,
  navigate
} from "./app.js";

import { t } from "./i18n.js";

import { createHelpOverlay } from "./help.js";
import { resetHelpState, clearAllHelpStates, getHelpState } from "./helpState.js";
import { createInfoOverlay } from "./info.js";
import { showPopup } from "./popup.js";
import { typewriteParagraphs } from "./typewriter.js";

export function renderPuzzle1(app) {
  getHelpState("puzzle1");
  app.innerHTML = `
  <section class="page office-page">
     <button id="back-btn" class="top-back-btn">${t("back")}</button>

    <!-- TIMER -->
    <div class="timer-container">
      <span id="timer">${formatTime(timerState.remaining)}</span>
      <button id="pause-btn" class="icon-btn"></button>
    </div>

    <!-- HELP + INFO -->
    <img src="${window.BASE_PATH}images/help-icon.png" id="help-btn" class="corner-btn bottom-left" alt="Help">

    <img src="${window.BASE_PATH}images/info-icon.png" id="info-btn" class="corner-btn bottom-right" alt="Info">

    <!-- STORY -->
    <div class="content-box1">
        <!-- PAGES NEEDED COUNTER -->
      <div class="pages-needed-wrapper">
       <div class="pages-needed-counter">
         <span class="pages-needed-text">
          ${t("page_needed")} 1.1
         </span>
       </div>
      </div>
      <p class="story-text">${t("puzzle1_story")}</p>
      <p class="story-text">${t("puzzle1_story2")}</p>
      <p class="story-text">${t("puzzle1_story3")}</p>
      <p class="story-text">${t("puzzle1_story4")}</p>
      <p class="story-text">${t("puzzle1_story5")}</p>
      <p class="story-text">${t("puzzle1_story6")}</p>

      <!-- SINGLE INPUT -->
      <div class="date-input-single">
        <div class="report-entry-box">
          <span class="report-label">${t("report_entry")}</span>
          <div class="input-wrapper">
            <span class="bracket">[</span>

            <input
             id="date-input"
             type="text"
             maxlength="5"
             placeholder="dd/mm"
             inputmode="numeric"
             autocomplete="off"
           />

            <span class="bracket">]</span>
          </div>

        </div>
      </div>
    </div>

    <div class="buttons">
      <button id="continue-btn" class="action-btn">${t("continue")}</button>
    </div>

  </section>
  `;


  const pauseBtn = app.querySelector("#pause-btn");
  const dateInput = app.querySelector("#date-input");

  // ---------------- HELP + INFO ----------------
  const help = createHelpOverlay(app, {
    t,
    puzzleId: "puzzle1",
    clues: [t("clue1"), t("clue2"), t("solution")],
    reveals: [t("reveal1"), t("reveal2"), t("reveal3")]
  });

  const info = createInfoOverlay(app, {
    t,
    pages: [
      {
        title: t("info_title"),
        text: t("info_text_left"),

        title2: t("info_title2"),
        text2: t("info_text_right")
      },

      {
        title: t("info_title2"),
        text: t("info_text_left.2"),

        title2: t("info_title2"),
        text2: t("info_text_right.2")
      },

      {
        title: t("info_title2"),
        text: t("info_text_left.3")

      }
    ]
  });

  // ---------------- INPUT LOGIC ----------------

  let digits = "";

  // initial visible mask
  dateInput.value = "dd/mm";

  function renderMask() {
    const masked = ["d", "d", "/", "m", "m"];

    if (digits[0]) masked[0] = digits[0];
    if (digits[1]) masked[1] = digits[1];
    if (digits[2]) masked[3] = digits[2];
    if (digits[3]) masked[4] = digits[3];

    dateInput.value = masked.join("");

    // cursor positions
    const positions = [0, 1, 3, 4, 5];
    const pos = positions[digits.length];

    requestAnimationFrame(() => {
      dateInput.setSelectionRange(pos, pos);
    });
  }

  // focus starts at beginning
  dateInput.addEventListener("focus", () => {
    renderMask();
  });

  // prevent normal typing behavior
  dateInput.addEventListener("keydown", e => {
    // allow tab
    if (e.key === "Tab") return;

    e.preventDefault();

    // number input
    if (/^\d$/.test(e.key)) {
      if (digits.length < 4) {
        digits += e.key;
      }
    }

    // backspace
    if (e.key === "Backspace") {
      digits = digits.slice(0, -1);
    }

    renderMask();
  });

  function parseDate() {
    if (digits.length !== 4) return null;

    const day = parseInt(digits.slice(0, 2), 10);
    const month = parseInt(digits.slice(2, 4), 10);

    if (day < 1 || day > 31) return null;
    if (month < 1 || month > 12) return null;

    return {
      day: String(day).padStart(2, "0"),
      month: String(month).padStart(2, "0")
    };
  }

  // ---------------- TIMER ----------------
  function updateUI() {
    const timerEl = app.querySelector("#timer");
    const helpBtn = app.querySelector("#help-btn");
    const infoBtn = app.querySelector("#info-btn");

    if (timerEl) {
      timerEl.textContent = formatTime(getRemainingTime());
    }

    if (pauseBtn) {
      pauseBtn.innerHTML = timerState.paused
        ? `<img src="${BASE_PATH}images/play-btn.png" alt="Play" class="btn-icon">`
        : `<img src="${BASE_PATH}images/pause-btn.png" alt="Pause" class="btn-icon">`;
    }

    const paused = timerState.paused;

    app.querySelectorAll("button, input").forEach(el => {
      if (el.id !== "pause-btn") {
        el.disabled = paused;
        el.style.opacity = paused ? "0.5" : "1";
      }
    });

    // disable help/info while paused
    [helpBtn, infoBtn].forEach(el => {
      if (el) {
        el.style.pointerEvents = paused ? "none" : "auto";
        el.style.opacity = paused ? "0.5" : "1"; // optional visual feedback
      }
    });

    help.update(paused);
    info.update(paused);
  }

  startTimer(updateUI);
  updateUI();

  const storyBox =
    app.querySelector(".content-box1");

  typewriteParagraphs(storyBox, {
    pageId: "puzzle1",
    pauseCheck: () => timerState.paused,
    sound: true
  });

  pauseBtn.onclick = () => togglePause(updateUI);

  // ---------- OVERLAYS ----------
  app.querySelector("#help-btn").onclick = () => {
    info.close();
    help.open();
  };

  app.querySelector("#info-btn").onclick = () => {
    help.close();
    info.open();
  };

  // ---------- CONTINUE ----------
  function handleContinue() {
    const parsed = parseDate();

    if (!parsed) {
      showPopup(t("wrong"));
      return;
    }

    const answer = `${parsed.day}/${parsed.month}`;

    if (answer === "14/04") {
      navigate("story1");
    } else {
      showPopup(t("wrong"));
    }
  }

  // button click
  app.querySelector("#continue-btn").onclick = handleContinue;

  // ENTER key support
  dateInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    if (timerState.paused) return;

    handleContinue();
  });
  // ---------- BACK ----------
  app.querySelector("#back-btn").onclick = () => {
    goBack();
  };
}