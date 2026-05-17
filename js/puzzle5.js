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

export function renderPuzzle5(app) {
  resetHelpState("puzzle5");

  app.innerHTML = `
  <section class="page safe-house-in-page">
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
          ${t("page_needed")} 10
        </span>
      </div>
    </div>
      <p>${t("puzzle5_story")}</p>
      <p>${t("puzzle5_story1")}</p>

      <!-- INPUTS -->
      <div class="answer-input-single">

        <!-- EXISTING ENTRY -->
        <div class="report-entry-box">

          <span class="report-label">${t("missing")}:</span>

          <div class="answer-row">

            <!-- [N] -->
            <div class="bracket-input">
              <span class="bracket">[</span>

              <input
                id="number-input"
                type="number"
                placeholder="№"
                class="mini-input"
                autocomplete="off"
              />

              <span class="bracket">]</span>
            </div>

            <!-- [answer 1] -->
            <div class="bracket-input">
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

        <!-- NEW ENTRY -->
        <div class="report-entry-box">


          <div class="answer-row">

            <!-- [N] -->
            <div class="bracket-input">
              <span class="bracket">[</span>

              <input
                id="number-input-2"
                type="number"
                placeholder="№"
                class="mini-input"
                autocomplete="off"
              />

              <span class="bracket">]</span>
            </div>

            <!-- [answer 2] -->
            <div class="bracket-input">
              <span class="bracket">[</span>

              <input
                id="answer-input-2"
                placeholder="${t("answer_placeholder")}"
                autocomplete="off"
              />

              <span class="bracket">]</span>
            </div>

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
    puzzleId: "puzzle5",
    clues: [t("clue1"), t("clue2"), t("solution")],
    reveals: [t("reveal1.4"), t("reveal2.4"), t("reveal3.4")]
  });

  const info = createInfoOverlay(app, {
    t,
    title: t("info_title"),
    title2: t("info_title2"),
    leftText: t("info_text_left5"),
    rightText: t("info_text_right5")
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

    const numberInput1 = app.querySelector("#number-input");
    const answerInput1 = app.querySelector("#answer-input");
    const numberInput2 = app.querySelector("#number-input-2");
    const answerInput2 = app.querySelector("#answer-input-2");

    // safety guard (prevents crash)
    if (!numberInput1 || !answerInput1 || !numberInput2 || !answerInput2) {
      console.error("Missing input fields in DOM");
      showPopup(t("wrong"));
      return;
    }

    const num1 = numberInput1.value.trim();
    const ans1 = answerInput1.value.trim().toUpperCase();

    const num2 = numberInput2.value.trim();
    const ans2 = answerInput2.value.trim().toUpperCase();

    const validAnswers = ["POLITICAL PRISONERS", "SABOTEURS"];

    const isValidText1 = validAnswers.includes(ans1);
    const isValidText2 = validAnswers.includes(ans2);

    const correctNumbers = num1 === "3" && num2 === "3";

    // both fields must contain valid but NOT same answer
    const notSame = ans1 !== ans2;

    if (correctNumbers && isValidText1 && isValidText2 && notSame) {
      navigate("story3");
    } else {
      showPopup(t("wrong"));
    }
  };

  // ---------- BACK ----------
  app.querySelector("#back-btn").onclick = () => {
    goBack();
  };
}