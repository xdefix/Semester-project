import {
  goBack,
  timerState,
  startTimer,
  togglePause,
  formatTime,
  getRemainingTime,
  navigate,
  enableAutoUppercase
} from "./app.js";

import { t } from "./i18n.js";

import { createHelpOverlay } from "./help.js";
import { resetHelpState } from "./helpState.js";
import { createInfoOverlay } from "./info.js";
import { showPopup } from "./popup.js";

export function renderPuzzle7(app) {
  resetHelpState("puzzle7");
  app.innerHTML = `
  <section class="page safe-house-in-page">
     <button id="back-btn" class="top-back-btn">${t("back")}</button>

    <!-- TIMER -->
    <div class="timer-container">
      <span id="timer">${formatTime(timerState.remaining)}</span>
      <button id="pause-btn" class="icon-btn"></button>
    </div>

    <!-- HELP ICON (bottom left) -->
    <img src="${window.BASE_PATH}images/help-icon.png" id="help-btn" class="corner-btn bottom-left" alt="Help">


    <!-- STORY -->
    <div class="content-box1">
    <!-- PAGES NEEDED COUNTER -->
      <div class="pages-needed-wrapper">
       <div class="pages-needed-counter">
         <span class="pages-needed-text">
          ${t("page_needed")} 16
         </span>
       </div>
      </div>
      <p>${t("puzzle7_story")}</p>
      <img src="${window.BASE_PATH}images/letter-info.png" alt="Mauthausen" class="story-img"/>
      <div class="answer-input-wrapper">
       <span class="report-label">${t("final_loc")}:</span>

       <div class="input-wrapper">
        <span class="bracket">[</span>

        <input
         id="answer-input"
         text-transform: uppercase
         placeholder="${t("answer_placeholder")}"
         autocomplete="off"
        />

        <span class="bracket">]</span>
       </div>
      </div>
    </div>


    <div class="buttons">
      <button id="continue-btn" class="action-btn">${t("continue")}</button>
    </div>

  </section>
  `;

  enableAutoUppercase(app);

  const pauseBtn = app.querySelector("#pause-btn");

  // ---------------- HELP + INFO MODULES ----------------
  const help = createHelpOverlay(app, {
    t,
    puzzleId: "puzzle7",
    clues: [t("clue1"), t("clue2"), t("solution")],
    reveals: [t("reveal1.6"), t("reveal2.6"), t("reveal3.6")]
  });


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

    app.querySelectorAll("button").forEach(el => {
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

    // sync overlays with pause state
    help.update(paused);
  }

  startTimer(updateUI);
  updateUI();

  pauseBtn.onclick = () => togglePause(updateUI);

  // ---------- OPEN OVERLAYS ----------
  app.querySelector("#help-btn").onclick = () => {
    help.open();
  };


  // ---------- CONTINUE ----------
  app.querySelector("#continue-btn").onclick = () => {
    const answer = app.querySelector("#answer-input").value.trim();

    if (answer === "MAUTHAUSEN") {
      navigate("final");
    } else {
      showPopup(t("wrong"));
    }
  };

  // ---------- BACK ----------
  app.querySelector("#back-btn").onclick = () => {
    goBack();
  };
}