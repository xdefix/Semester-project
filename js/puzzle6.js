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

export function renderPuzzle6(app) {
  resetHelpState("puzzle6");
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
    <img src="../images/help-icon.png" id="help-btn" class="corner-btn bottom-left" alt="Help">

    <!-- INFO ICON (bottom right) -->
    <img src="../images/info-icon.png" id="info-btn" class="corner-btn bottom-right" alt="Info">

    <!-- STORY -->
    <div class="content-box1">
    <!-- PAGES NEEDED COUNTER -->
      <div class="pages-needed-wrapper">
       <div class="pages-needed-counter">
         <span class="pages-needed-text">
          ${t("pages_needed")} 11-13
         </span>
       </div>
      </div>

      <p>${t("puzzle6_story")}</p>
      <p>${t("puzzle6_story2")}</p>
      <p>${t("puzzle6_story3")}</p>
      <p>${t("puzzle6_story4")}</p>
      <p>${t("puzzle6_story5")}</p>
      <p>${t("puzzle6_story6")}</p>
      <p>${t("puzzle6_story7")}</p>
      <p>${t("puzzle6_story8")}</p>

<!-- INPUT GRID -->
<div class="puzzle6-grid">

  <!-- HEADERS -->
  <div class="grid-label">${t("roman_numbers")}:</div>
  <div class="grid-label">${t("letters")}:</div>
  <div class="grid-label">${t("numbers")}:</div>

  <!-- ROW 1 -->
  <div class="bracket-field">
    <span class="bracket">[</span>
    <input class="puzzle6-input roman" placeholder="${t("answer_placeholder")}" autocomplete="off" />
    <span class="bracket">]</span>
  </div>

  <div class="bracket-field">
    <span class="bracket">[</span>
    <input class="puzzle6-input letters" placeholder="${t("answer_placeholder")}" autocomplete="off" maxlength="3" />
    <span class="bracket">]</span>
  </div>

  <div class="bracket-field">
    <span class="bracket">[</span>
    <input class="puzzle6-input numbers" placeholder="${t("answer_placeholder")}" autocomplete="off" />
    <span class="bracket">]</span>
  </div>

  <!-- ROW 2 -->
  <div class="bracket-field">
    <span class="bracket">[</span>
    <input class="puzzle6-input roman" placeholder="${t("answer_placeholder")}" autocomplete="off" />
    <span class="bracket">]</span>
  </div>

  <div class="bracket-field">
    <span class="bracket">[</span>
    <input class="puzzle6-input letters" placeholder="${t("answer_placeholder")}" autocomplete="off" maxlength="3" />
    <span class="bracket">]</span>
  </div>

  <div class="bracket-field">
    <span class="bracket">[</span>
    <input class="puzzle6-input numbers" placeholder="${t("answer_placeholder")}" autocomplete="off" />
    <span class="bracket">]</span>
  </div>

  <!-- ROW 3 -->
  <div class="bracket-field">
    <span class="bracket">[</span>
    <input class="puzzle6-input roman" placeholder="${t("answer_placeholder")}" autocomplete="off" />
    <span class="bracket">]</span>
  </div>

  <div class="bracket-field">
    <span class="bracket">[</span>
    <input class="puzzle6-input letters" placeholder="${t("answer_placeholder")}" autocomplete="off" maxlength="3" />
    <span class="bracket">]</span>
  </div>

  <div class="bracket-field">
    <span class="bracket">[</span>
    <input class="puzzle6-input numbers" placeholder="${t("answer_placeholder")}" autocomplete="off" />
    <span class="bracket">]</span>
  </div>

</div>

    </div>

    <div class="buttons">
      <button id="continue-btn" class="action-btn" >${t("continue")}</button>
    </div>

  </section>
  `;


  enableAutoUppercase(app);

  const pauseBtn = app.querySelector("#pause-btn");

  // ---------------- HELP + INFO ----------------
  const help = createHelpOverlay(app, {
    t,
    puzzleId: "puzzle6",
    clues: [t("clue1"), t("clue2"), t("solution")],
    reveals: [t("reveal1.5"), t("reveal2.5"), t("reveal3.5")]
  });

  const info = createInfoOverlay(app, {
    t,
    title: t("info_title"),
    title2: t("info_title2"),
    leftText: t("info_text_left6"),
    rightText: t("info_text_right6")
  });

  // ---------------- INPUT ELEMENTS ----------------
  const romanInputs = app.querySelectorAll(".roman");
  const letterInputs = app.querySelectorAll(".letters");
  const numberInputs = app.querySelectorAll(".numbers");

  // ---------------- VALIDATION ----------------

  // Roman letters (flexible A-Z + roman chars)
  romanInputs.forEach(input => {
    input.addEventListener("input", () => {
      input.value = input.value
        .toUpperCase()
        .replace(/[^A-ZIVXLCDM]/g, "");
    });
  });

  // 3 letters, uppercase
  letterInputs.forEach(input => {
    input.addEventListener("input", () => {
      input.value = input.value
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 3)
        .toUpperCase();
    });
  });

  // numbers only
  numberInputs.forEach(input => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
    });
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

    help.update(paused);
    info.update(paused);
  }

  startTimer(updateUI);
  updateUI();

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

  // ---------------- CONTINUE ----------------
  app.querySelector("#continue-btn").onclick = () => {
    const roman = [...romanInputs].map(i => i.value.trim());
    const letters = [...letterInputs].map(i => i.value.trim());
    const numbers = [...numberInputs].map(i => i.value.trim());

    // example solution (change as needed)
    const correctRoman = "IIIIV";
    const correctLetters = "LPV";
    const correctNumbers = "151620";

    const answerRoman = roman.join("");
    const answerLetters = letters.join("");
    const answerNumbers = numbers.join("");

    if (
      answerRoman === correctRoman &&
      answerLetters === correctLetters &&
      answerNumbers === correctNumbers
    ) {
      navigate("puzzle7");
    } else {
      showPopup(t("wrong"));
    }
  };

  // ---------------- BACK ----------------
  app.querySelector("#back-btn").onclick = () => {
    goBack();
  };
}