import { navigate, goBack } from "./app.js";
import { t } from "./i18n.js";

export function renderIntro(app) {
  app.innerHTML = `
    <section class="page office-page">
     <button id="back-btn" class="top-back-btn">${t("back")}</button>
      <div class="content-box1">
        <p>${t("intro_text")}</p>
        <p>${t("intro_text2")}</p>
        <p>${t("intro_text3")}</p>
        <p>${t("intro_text4")}</p>
        <p>${t("intro_text5")}</p>
        <p>${t("intro_text6")}</p>
        <p>${t("intro_text7")}</p>
      </div>

      <div class="buttons">
        <button id="continue-btn" class="action-btn">${t("start")}</button>
      </div>
    </section>
  `;

  const continueBtn = app.querySelector("#continue-btn");
  const backBtn = app.querySelector("#back-btn");

  continueBtn.onclick = () => navigate("puzzle1");
  backBtn.onclick = () => goBack();
}