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

export function renderPuzzle4(app) {
  resetHelpState("puzzle4");
  app.innerHTML = `
  <section class="page safe-house-in-page">
     <button id="back-btn" class="top-back-btn">${t("back")}</button>

    <!-- TIMER -->
    <div class="timer-container">
      <span id="timer">${formatTime(timerState.remaining)}</span>
      <button id="pause-btn" class="icon-btn"></button>
    </div>

    <!-- HELP + INFO -->
    <!-- HELP ICON (bottom left) -->
    <img src="${window.BASE_PATH}images/help-icon.png" id="help-btn" class="corner-btn bottom-left" alt="Help">

    <!-- INFO ICON (bottom right) -->
    <img src="${window.BASE_PATH}images/info-icon.png" id="info-btn" class="corner-btn bottom-right" alt="Info">


    <!-- STORY -->
    <div class="content-box1">  
      <!-- PAGES NEEDED COUNTER -->
      <div class="pages-needed-wrapper">
       <div class="pages-needed-counter">
         <span class="pages-needed-text">
          ${t("page_needed")} 9
         </span>
       </div>
      </div>
      <p>${t("puzzle4_story")}</p>
      <p>${t("puzzle4_story1")}</p>
      <div class="answer-input-wrapper">
       <span class="report-label">${t("lock")}:</span>

       <div class="input-wrapper">
        <span class="bracket">[</span>

        <input
         id="answer-input"
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
    puzzleId: "puzzle4",
    clues: [t("clue1"), t("clue2"), t("solution")],
    reveals: [t("reveal1.3"), t("reveal2.3"), t("reveal3.3")]
  });

  const info = createInfoOverlay(app, {
    t,
    title: t("info_title"),
    title2: t("info_title2"),
    leftText: t("info_text_left4"),
    rightText: t("info_text_right4")
  });

  // ---------------- TIMER ----------------
  function updateUI() {
    const timerEl = app.querySelector("#timer");

    if (timerEl) {
      timerEl.textContent = formatTime(getRemainingTime());
    }

    if (pauseBtn) {
      pauseBtn.innerHTML = timerState.paused
        ? '<img src="../images/play-btn.png" alt="Play" class="btn-icon">'
        : '<img src="../images/pause-btn.png" alt="Pause" class="btn-icon">';
    }

    const paused = timerState.paused;

    app.querySelectorAll("button, input").forEach(el => {
      if (el.id !== "pause-btn") el.disabled = paused;
    });

    // sync overlays with pause state
    help.update(paused);
    info.update(paused);
  }

  startTimer(updateUI);
  updateUI();

  pauseBtn.onclick = () => togglePause(updateUI);

  // ---------- OPEN OVERLAYS ----------
  app.querySelector("#help-btn").onclick = () => {
    info.close();
    help.open();
  };

  app.querySelector("#info-btn").onclick = () => {
    help.close();
    info.open();
  };

  // ---------- CONTINUE ----------
  app.querySelector("#continue-btn").onclick = () => {
    const answer = app.querySelector("#answer-input").value.trim();

    if (answer === "6186") {
      navigate("story2");
    } else {
      showPopup(t("wrong"));
    }
  };

  // ---------- BACK ----------
  app.querySelector("#back-btn").onclick = () => {
    goBack();
  };
}