import {
  getElapsedTime,
  formatElapsed,
  resetGame,
  navigate,
  resetNavigation
} from "./app.js";
import { typewriteParagraphs } from "./typewriter.js";

import { t, tReplace } from "./i18n.js";

export function renderFinal(app) {
  const elapsed = getElapsedTime();
  const timeText = formatElapsed(elapsed);

  app.innerHTML = `
    <section class="page end-page">

      <div class="final-time">
        <h2>${tReplace("congrats", { time: timeText })}.</h2>
      </div>

      <div class="content-box1">
        <p class="story-text">${t("final_story")}</p>
        <p class="story-text">${t("final_story1")}</p>
        <p class="story-text">${t("final_story2")}</p>
        <p class="story-text">${t("final_story3")}</p>
        <p class="story-text">${t("final_story4")}</p>
        <p class="story-text">${t("final_story5")}</p>
        <p class="story-text">${t("final_story6")}</p>
        <p class="story-text">${t("final_story7")}</p>
        <p class="story-text">${t("final_story8")}</p>
        <p class="story-text">${t("final_story9")}</p>
      </div>

      <div class="buttons">
        <button id="restart-btn" class="action-btn">${t("play_again")}</button>
              
        <a href="files/game-files.odt" download  >
         <button class="action-btn"> ${t("download_diary")} </button>
        </a>
      </div>


    </section>
  `;

  const storyBox =
    app.querySelector(".content-box1");

  typewriteParagraphs(storyBox, {
    pageId: "final",
    pauseCheck: () => timerState.paused,
    sound: true
  });

  app.querySelector("#restart-btn").onclick = () => {
    resetGame();
    resetNavigation();
    navigate("landing");

    sessionStorage.removeItem("visited_story_pages");
  };
}