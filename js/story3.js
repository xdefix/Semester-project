import {
  goBack,
  timerState,
  startTimer,
  togglePause,
  formatTime,
  getRemainingTime,
  navigate
} from "./app.js";
import { typewriteParagraphs } from "./typewriter.js";

import { t } from "./i18n.js";

export function renderStory3(app) {
  app.innerHTML = `
    <section class="page safe-house-in-page">
     <button id="back-btn" class="top-back-btn">${t("back")}</button>

      <div class="timer-container">
        <span id="timer">${formatTime(getRemainingTime())}</span>
        <button id="pause-btn" class="icon-btn"></button>
      </div>

      <div class="content-box1">
        <p class="story-text">${t("story3_text")}</p>
        <p class="story-text">${t("story3_text1")}</p>
        <p class="story-text">${t("story3_text2")}</p>
        <p class="story-text">${t("story3_text3")}</p>
        <p class="story-text">${t("story3_text4")}</p>
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
      ? `<img src="${BASE_PATH}images/play-btn.png" alt="Play" class="btn-icon">`
      : `<img src="${BASE_PATH}images/pause-btn.png" alt="Pause" class="btn-icon">`;

    app.querySelectorAll("button").forEach(b => {
      if (b.id !== "pause-btn") b.disabled = timerState.paused;
    });
  }

  startTimer(updateUI);
  updateUI();

  const storyBox =
    app.querySelector(".content-box1");

  typewriteParagraphs(storyBox, {
    pageId: "story3",
    pauseCheck: () => timerState.paused,
    sound: true
  });

  pauseBtn.onclick = () => togglePause(updateUI);

  app.querySelector("#continue-btn").onclick = () => {
    navigate("puzzle6");
  };
  app.querySelector("#back-btn").onclick = () => {
    goBack();
  };
}