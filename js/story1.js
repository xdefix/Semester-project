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

export function renderStory1(app) {
  app.innerHTML = `
    <section class="page office-page">
     <button id="back-btn" class="top-back-btn">${t("back")}</button>

      <div class="timer-container">
        <span id="timer">${formatTime(getRemainingTime())}</span>
        <button id="pause-btn" class="icon-btn"></button>
      </div>

      <div class="content-box1">
        <p>${t("story1_text")}</p>
        <p>${t("story1_text2")}</p>
        <p>${t("story1_text3")}</p>
        <p>${t("story1_text4")}</p>
        <p>${t("story1_text5")}</p>
        <p>${t("story1_text6")}</p>
        <p>${t("story1_text7")}</p>
        <p>${t("story1_text8")}</p>
      </div>

      <div class="buttons">
        <button id="continue-btn" class="action-btn">${t("continue")}</button>
      </div>

    </section>
  `;

  const pauseBtn = app.querySelector("#pause-btn");

  function updateUI() {
    app.querySelector("#timer").textContent =
      formatTime(getRemainingTime());

      pauseBtn.innerHTML = timerState.paused
        ? '<img src="${window.BASE_PATH}images/play-btn.png" alt="Play" class="btn-icon">'
        : '<img src="${window.BASE_PATH}images/pause-btn.png" alt="Pause" class="btn-icon">';

    app.querySelectorAll("button").forEach(b => {
      if (b.id !== "pause-btn") b.disabled = timerState.paused;
    });
  }

  startTimer(updateUI);
  updateUI();

  pauseBtn.onclick = () => togglePause(updateUI);

  app.querySelector("#continue-btn").onclick = () => {
    navigate("puzzle2extra");
  };
  app.querySelector("#back-btn").onclick = () => {
    goBack();
  };
}