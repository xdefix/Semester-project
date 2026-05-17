import { navigate, goBack } from "./app.js";
import { t } from "./i18n.js";
import { typewriteParagraphs } from "./typewriter.js";

export function renderIntro(app) {
  app.innerHTML = `
    <section class="page office-page">
     <button id="back-btn" class="top-back-btn">${t("back")}</button>
      <div class="content-box1">
        <p class="story-text">${t("intro_text")}</p>
        <p class="story-text">${t("intro_text2")}</p>
        <p class="story-text">${t("intro_text3")}</p>
        <p class="story-text">${t("intro_text4")}</p>
        <p class="story-text">${t("intro_text5")}</p>
        <p class="story-text">${t("intro_text6")}</p>
        <p class="story-text">${t("intro_text7")}</p>
      </div>

      <div class="buttons">
        <button id="continue-btn" class="action-btn">${t("start")}</button>
      </div>
    </section>
  `;

  const continueBtn = app.querySelector("#continue-btn");
  const backBtn = app.querySelector("#back-btn");


  const storyBox =
    app.querySelector(".content-box1");

  typewriteParagraphs(storyBox, {
    pageId: "intro",
    sound: true
  });

  continueBtn.onclick = () => navigate("puzzle1");
  backBtn.onclick = () => goBack();
}