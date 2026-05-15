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

export function renderPuzzle3(app) {
  resetHelpState("puzzle3");

  app.innerHTML = `
  <section class="page safe-house-out-page">
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
    <div class="content-box1">    <!-- PAGES NEEDED COUNTER -->
    <div class="pages-needed-wrapper">
      <div class="pages-needed-counter">
        <span class="pages-needed-text">
          ${t("page_needed")} 8
        </span>
      </div>
    </div>

      <p>${t("puzzle3_story")}</p>
      <p>${t("puzzle3_story1")}</p>
      <p>${t("puzzle3_story2")}</p>
      <p>${t("puzzle3_story3")}</p>
      <p>${t("puzzle3_story4")}</p>
      <p>${t("puzzle3_story5")}</p>
      <p>${t("puzzle3_story6")}</p>
      <p>${t("puzzle3_story7")}</p>
      <p>${t("puzzle3_story8")}</p>
      <p>${t("puzzle3_story9")}</p>
      <p>${t("puzzle3_story10")}</p>

      <!-- ANSWERS -->
      <div class="answers-row2">

        <!-- CODE TITLE -->
        <div class="answer-inline-group2">
          <span class="report-label2">${t("code_title")}:</span>

          <div class="input-wrapper2">
            <span class="bracket">[</span>

            <input
              id="answer-input-title"
              placeholder="${t("answer_placeholder")}"
              class="answer-input2"
              style="text-transform: uppercase;"
              autocomplete="off"
            />

            <span class="bracket">]</span>
          </div>
        </div>

        <!-- CODE COLOUR -->
        <div class="answer-inline-group2">
          <span class="report-label2">${t("code_colour")}:</span>

          <div class="input-wrapper2">
            <span class="bracket">[</span>

            <input
              id="answer-input-colour"
              placeholder="${t("answer_placeholder")}"
              class="answer-input2"
              style="text-transform: uppercase;"
              autocomplete="off"
            />

            <span class="bracket">]</span>
          </div>
        </div>

        <!-- CODE WORD -->
        <div class="answer-inline-group2">
          <span class="report-label2">${t("code_word")}:</span>

          <div class="input-wrapper2">
            <span class="bracket">[</span>

            <input
              id="answer-input-word"
              placeholder="${t("answer_placeholder")}"
              class="answer-input2"
              style="text-transform: uppercase;"
              autocomplete="off"
            />

            <span class="bracket">]</span>
          </div>
        </div>

      </div>
    </div>

    <div class="buttons">
      <button id="continue-btn" class="action-btn">
        ${t("continue")}
      </button>
    </div>

  </section>
  `;

  enableAutoUppercase(app);

  const pauseBtn = app.querySelector("#pause-btn");

  // ---------------- HELP + INFO MODULES ----------------
  const help = createHelpOverlay(app, {
    t,
    puzzleId: "puzzle3",
    clues: [t("clue1"), t("clue2"), t("solution")],
    reveals: [t("reveal1.2"), t("reveal2.2"), t("reveal3.2")]
  });

  const info = createInfoOverlay(app, {
    t,
    title: t("info_title"),
    title2: t("info_title2"),
    leftText: t("info_text_left3"),
    rightText: t("info_text_right3")
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
        ? `<img src="${BASE_PATH}/images/play-btn.png" alt="Play" class="btn-icon">`
        : `<img src="${BASE_PATH}/images/pause-btn.png" alt="Pause" class="btn-icon">`;
    }

    const paused = timerState.paused;

    app.querySelectorAll("button, input").forEach(el => {
      if (el.id !== "pause-btn") el.disabled = paused;
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

    const codeTitle = app.querySelector("#answer-input-title")
      .value
      .trim()
      .toUpperCase();

    const codeColour = app.querySelector("#answer-input-colour")
      .value
      .trim()
      .toUpperCase();

    const codeWord = app.querySelector("#answer-input-word")
      .value
      .trim()
      .toUpperCase();

    if (
      codeTitle === "BRITAIN 1945" &&
      codeColour === "55" &&
      codeWord === "VICTORY"
    ) {
      navigate("puzzle4");
    } else {
      showPopup(t("wrong"));
    }
  };

  // ---------- BACK ----------
  app.querySelector("#back-btn").onclick = () => {
    goBack();
  };
}